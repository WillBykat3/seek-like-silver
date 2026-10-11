-- Seek Like Silver: group "question of the week", "Suggest a question", and a tiny
-- keep-awake function. Run once in Supabase: SQL Editor → New query → paste → Run.
-- Safe to run again.

-- ─────────────────────────────────────────────
-- 1. Keep-awake ping (called every 2 days by .github/workflows/keep-awake.yml)
-- ─────────────────────────────────────────────
create or replace function public.sls_ping()
returns boolean language sql stable security definer set search_path = '' as $$
  select true;
$$;
revoke all on function public.sls_ping() from public;
grant execute on function public.sls_ping() to anon, authenticated;

-- ─────────────────────────────────────────────
-- 2. Group question of the week (the group leader picks it; members see it)
-- ─────────────────────────────────────────────
alter table public.study_groups add column if not exists weekly_question text
  check (weekly_question is null or weekly_question ~ '^[a-z][0-9]{1,3}$');
alter table public.study_groups add column if not exists weekly_due date;
alter table public.study_groups add column if not exists weekly_note text
  check (weekly_note is null or char_length(weekly_note) <= 200);
alter table public.study_groups add column if not exists weekly_set_at timestamptz;

-- Set (or clear, with p_question = null) the group's question. Leader only.
create or replace function public.sls_set_group_question(p_group uuid, p_question text, p_due date, p_note text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.sls_aal_ok() or not public.sls_is_group_owner(p_group) then raise exception 'not_allowed'; end if;
  if p_question is not null and p_question !~ '^[a-z][0-9]{1,3}$' then raise exception 'bad_question'; end if;
  if p_due is not null and (p_due < current_date - 1 or p_due > current_date + 366) then raise exception 'bad_date'; end if;
  update public.study_groups set
    weekly_question = p_question,
    weekly_due      = case when p_question is null then null else p_due end,
    weekly_note     = case when p_question is null then null else nullif(btrim(left(coalesce(p_note, ''), 200)), '') end,
    weekly_set_at   = case when p_question is null then null else now() end
  where id = p_group;
end;
$$;
revoke all on function public.sls_set_group_question(uuid, text, date, text) from public, anon;
grant execute on function public.sls_set_group_question(uuid, text, date, text) to authenticated;

-- ─────────────────────────────────────────────
-- 3. Suggest a question (only the site owner sees suggestions)
-- ─────────────────────────────────────────────
create table if not exists public.question_suggestions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  suggestion  text not null check (char_length(btrim(suggestion)) between 10 and 1000),
  level       text check (level is null or level in ('beginner', 'moderate', 'philosopher')),
  note        text check (note is null or char_length(note) <= 500),
  status      text not null default 'new' check (status in ('new', 'used', 'dismissed')),
  created_at  timestamptz not null default now()
);
create index if not exists question_suggestions_user_idx on public.question_suggestions (user_id, created_at);
alter table public.question_suggestions enable row level security;
revoke all on public.question_suggestions from anon, authenticated;
grant select on public.question_suggestions to authenticated;          -- your own (see policy)
grant all on public.question_suggestions to service_role;

drop policy if exists "suggestions: read own" on public.question_suggestions;
create policy "suggestions: read own" on public.question_suggestions for select to authenticated
  using ((select auth.uid()) = user_id);

-- Send a suggestion (signed in; at most 5 a day).
create or replace function public.sls_suggest_question(p_suggestion text, p_level text, p_note text)
returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
begin
  if auth.uid() is null or not public.sls_aal_ok() then raise exception 'not_allowed'; end if;
  if char_length(btrim(coalesce(p_suggestion, ''))) not between 10 and 1000 then raise exception 'bad_length'; end if;
  if (select count(*) from public.question_suggestions s
      where s.user_id = auth.uid() and s.created_at > now() - interval '1 day') >= 5 then
    raise exception 'too_many';
  end if;
  insert into public.question_suggestions (user_id, suggestion, level, note)
  values (auth.uid(), btrim(p_suggestion),
          case when p_level in ('beginner', 'moderate', 'philosopher') then p_level end,
          nullif(btrim(left(coalesce(p_note, ''), 500)), ''))
  returning id into v_id;
  return v_id;
end;
$$;

-- Site owner: read every suggestion (with the sender's display name, never their email).
create or replace function public.sls_suggestions()
returns table (id uuid, suggestion text, level text, note text, status text, created_at timestamptz, display_name text)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.sls_is_admin() or not public.sls_aal_ok() then raise exception 'not_allowed'; end if;
  return query
    select s.id, s.suggestion, s.level, s.note, s.status, s.created_at, p.display_name
    from public.question_suggestions s
    left join public.profiles p on p.id = s.user_id
    order by (s.status = 'new') desc, s.created_at desc
    limit 300;
end;
$$;

-- Site owner: mark a suggestion used / dismissed / new, or delete it (p_status = 'delete').
create or replace function public.sls_suggestion_status(p_id uuid, p_status text)
returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not public.sls_is_admin() or not public.sls_aal_ok() then raise exception 'not_allowed'; end if;
  if p_status = 'delete' then
    delete from public.question_suggestions where id = p_id;
  elsif p_status in ('new', 'used', 'dismissed') then
    update public.question_suggestions set status = p_status where id = p_id;
  else
    raise exception 'bad_status';
  end if;
end;
$$;

revoke all on function public.sls_suggest_question(text, text, text) from public, anon;
revoke all on function public.sls_suggestions() from public, anon;
revoke all on function public.sls_suggestion_status(uuid, text) from public, anon;
grant execute on function public.sls_suggest_question(text, text, text) to authenticated;
grant execute on function public.sls_suggestions() to authenticated;
grant execute on function public.sls_suggestion_status(uuid, text) to authenticated;
