-- Seek Like Silver: account linking (YouVersion) and authenticator-app protection.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.

-- ─────────────────────────────────────────────
-- 1. Which YouVersion account belongs to which site account.
--    Only the youversion-signin server function writes here.
-- ─────────────────────────────────────────────
create table if not exists public.youversion_links (
  yvp_id    text primary key check (char_length(yvp_id) between 1 and 200),
  user_id   uuid not null unique references auth.users (id) on delete cascade,
  linked_at timestamptz not null default now()
);

alter table public.youversion_links enable row level security;

revoke all on public.youversion_links from anon, authenticated;
grant select on public.youversion_links to authenticated;      -- people can see their own link
grant all on public.youversion_links to service_role;          -- the server function manages links

drop policy if exists "youversion_links: read own" on public.youversion_links;
create policy "youversion_links: read own" on public.youversion_links for select to authenticated
  using ((select auth.uid()) = user_id);

-- ─────────────────────────────────────────────
-- 2. Helpers for the server function only (not callable from the website).
-- ─────────────────────────────────────────────

-- Find an account by its email (used to find older YouVersion-only accounts).
create or replace function public.sls_user_id_by_email(p_email text)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select id from auth.users where lower(email) = lower(p_email) limit 1;
$$;

-- Move saved answers from one account to another. If both answered the same
-- question, the more recently updated answer wins.
create or replace function public.sls_merge_answers(p_from uuid, p_to uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_from = p_to then return; end if;
  insert into public.answers (user_id, question_id, level, answer, created_at, updated_at)
    select p_to, question_id, level, answer, created_at, updated_at
    from public.answers where user_id = p_from
  on conflict (user_id, question_id) do update
    set answer = excluded.answer, level = excluded.level, updated_at = excluded.updated_at
    where excluded.updated_at > public.answers.updated_at;
  delete from public.answers where user_id = p_from;
end;
$$;

revoke all on function public.sls_user_id_by_email(text) from public, anon, authenticated;
revoke all on function public.sls_merge_answers(uuid, uuid) from public, anon, authenticated;
grant execute on function public.sls_user_id_by_email(text) to service_role;
grant execute on function public.sls_merge_answers(uuid, uuid) to service_role;

-- ─────────────────────────────────────────────
-- 3. Authenticator app: once someone turns it on, their data is only
--    readable after they enter an authenticator code (Supabase's "aal2").
--    People without an authenticator are unaffected.
--    Supabase doesn't let signed-in users read auth.mfa_factors directly,
--    so this helper (which only answers for the person asking) does the check.
-- ─────────────────────────────────────────────
create or replace function public.sls_has_verified_factor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.mfa_factors
    where user_id = (select auth.uid()) and status = 'verified'
  );
$$;

revoke all on function public.sls_has_verified_factor() from public, anon;
grant execute on function public.sls_has_verified_factor() to authenticated, service_role;

drop policy if exists "require authenticator if enabled" on public.profiles;
create policy "require authenticator if enabled" on public.profiles
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2' or not (select public.sls_has_verified_factor()));

drop policy if exists "require authenticator if enabled" on public.answers;
create policy "require authenticator if enabled" on public.answers
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2' or not (select public.sls_has_verified_factor()));

drop policy if exists "require authenticator if enabled" on public.youversion_links;
create policy "require authenticator if enabled" on public.youversion_links
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2' or not (select public.sls_has_verified_factor()));
