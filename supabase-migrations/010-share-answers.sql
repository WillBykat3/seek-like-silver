-- Seek Like Silver: share an answer with anyone by link (seeklikesilver.com/#share=...).
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.
--
-- A share link holds a long random code. Anyone with the link can read that ONE answer
-- (with its question and your display name); nothing else about you is visible.
-- "Stop sharing" deletes the link, and deleting the answer deletes its link too.

create table if not exists public.answer_shares (
  token      text primary key check (token ~ '^[a-f0-9]{24}$'),
  answer_id  uuid not null unique references public.answers (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.answer_shares enable row level security;
revoke all on public.answer_shares from anon, authenticated;
grant select on public.answer_shares to authenticated;          -- see your own links
grant all on public.answer_shares to service_role;

drop policy if exists "shares: read own" on public.answer_shares;
create policy "shares: read own" on public.answer_shares for select to authenticated
  using ((select auth.uid()) = user_id);

-- Make (or reuse) a link for one of your own answers.
create or replace function public.sls_share_answer(p_answer uuid)
returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_token text;
begin
  if auth.uid() is null then raise exception 'not_allowed'; end if;
  if not exists (select 1 from public.answers where id = p_answer and user_id = auth.uid()) then
    raise exception 'not_allowed';
  end if;
  select token into v_token from public.answer_shares where answer_id = p_answer;
  if v_token is null then
    v_token := substr(replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''), 1, 24);
    insert into public.answer_shares (token, answer_id, user_id) values (v_token, p_answer, auth.uid());
  end if;
  return v_token;
end;
$$;

-- Stop sharing one of your answers (the old link stops working).
create or replace function public.sls_unshare_answer(p_answer uuid)
returns void
language sql security definer set search_path = '' as $$
  delete from public.answer_shares where answer_id = p_answer and user_id = (select auth.uid());
$$;

-- What a shared link shows: that one answer, its question, and the sharer's display name.
create or replace function public.sls_shared_answer(p_token text)
returns table (question_id text, level text, answer text, created_at timestamptz, updated_at timestamptz, display_name text)
language sql stable security definer set search_path = '' as $$
  select a.question_id, a.level, a.answer, a.created_at, a.updated_at, p.display_name
  from public.answer_shares s
  join public.answers a on a.id = s.answer_id
  left join public.profiles p on p.id = a.user_id
  where s.token = lower(p_token);
$$;

revoke all on function public.sls_share_answer(uuid) from public, anon;
revoke all on function public.sls_unshare_answer(uuid) from public, anon;
revoke all on function public.sls_shared_answer(text) from public;
grant execute on function public.sls_share_answer(uuid) to authenticated;
grant execute on function public.sls_unshare_answer(uuid) to authenticated;
grant execute on function public.sls_shared_answer(text) to anon, authenticated;
