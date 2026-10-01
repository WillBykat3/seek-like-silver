-- Seek Like Silver — database setup
-- Paste this whole file into Supabase: SQL Editor → New query → Run.
-- Safe to run more than once.
--
-- Your project has "Automatically expose new tables" OFF and "automatic RLS" ON,
-- so every table starts locked. This script grants exactly what the site needs,
-- and Row Level Security makes sure each person can only see their own data.

-- ─────────────────────────────────────────────
-- 1. Profiles: one row per signed-in person
-- ─────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text check (char_length(display_name) <= 60),
  denomination text not null default 'general' check (denomination in (
    'general', 'catholic', 'orthodox', 'anglican', 'lutheran',
    'reformed', 'methodist', 'baptist', 'pentecostal'
  )),
  translation  text not null default 'NIV' check (translation in (
    'ESV', 'NIV', 'NLT', 'KJV', 'NKJV', 'CSB', 'NASB', 'NASB1995', 'LSB', 'AMP',
    'NET', 'NRSVUE', 'RSV', 'NABRE', 'CEB', 'MSG', 'NIRV', 'ASV'
  )),
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────────
-- 2. Answers: one saved answer per person per question
-- ─────────────────────────────────────────────
create table if not exists public.answers (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  question_id text not null check (char_length(question_id) <= 20),
  level       text not null check (level in ('beginner', 'moderate', 'philosopher')),
  answer      text not null check (char_length(answer) between 1 and 20000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, question_id)
);

create index if not exists answers_user_id_idx on public.answers (user_id);

-- ─────────────────────────────────────────────
-- 3. Row Level Security (on, even if already on)
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.answers  enable row level security;

-- ─────────────────────────────────────────────
-- 4. Grants: only signed-in users can touch these tables.
--    Signed-out visitors ("anon") get nothing.
-- ─────────────────────────────────────────────
revoke all on public.profiles from anon;
revoke all on public.answers  from anon;
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.answers  to authenticated;

-- ─────────────────────────────────────────────
-- 5. Policies: you can only read and change your own rows
-- ─────────────────────────────────────────────
drop policy if exists "profiles: read own"   on public.profiles;
drop policy if exists "profiles: create own" on public.profiles;
drop policy if exists "profiles: update own" on public.profiles;
drop policy if exists "profiles: delete own" on public.profiles;

create policy "profiles: read own"   on public.profiles for select to authenticated
  using ((select auth.uid()) = id);
create policy "profiles: create own" on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);
create policy "profiles: update own" on public.profiles for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "profiles: delete own" on public.profiles for delete to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "answers: read own"   on public.answers;
drop policy if exists "answers: create own" on public.answers;
drop policy if exists "answers: update own" on public.answers;
drop policy if exists "answers: delete own" on public.answers;

create policy "answers: read own"   on public.answers for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "answers: create own" on public.answers for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "answers: update own" on public.answers for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "answers: delete own" on public.answers for delete to authenticated
  using ((select auth.uid()) = user_id);
