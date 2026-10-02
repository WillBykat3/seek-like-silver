-- Seek Like Silver: sign in with EITHER an emailed code OR an authenticator-app code.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.
-- Works with the "authenticator" Edge Function (supabase/functions/authenticator).
--
-- Only that server function can read or change these tables. Authenticator secrets are
-- stored encrypted (AES-GCM) with a key derived from the project's secret key, which
-- never leaves the server.

create table if not exists public.sls_authenticators (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  secret_enc   text not null,                 -- encrypted; only the server function can decrypt
  confirmed    boolean not null default false, -- true once a code from the app was entered
  last_step    bigint not null default 0,      -- last 30-second step used (stops a code being reused)
  failures     int not null default 0,         -- wrong codes in a row
  locked_until timestamptz,                    -- set after too many wrong codes
  created_at   timestamptz not null default now(),
  confirmed_at timestamptz
);

create table if not exists public.sls_signin_attempts (
  id   bigint generated always as identity primary key,
  key  text not null,                          -- hashed IP address
  at   timestamptz not null default now()
);
create index if not exists sls_signin_attempts_key_at on public.sls_signin_attempts (key, at);

alter table public.sls_authenticators enable row level security;
alter table public.sls_signin_attempts enable row level security;
revoke all on public.sls_authenticators, public.sls_signin_attempts from anon, authenticated;
grant all on public.sls_authenticators, public.sls_signin_attempts to service_role;

-- Settings can ask "is authenticator sign-in on for me?" without seeing anything else.
create or replace function public.sls_my_authenticator()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.sls_authenticators where user_id = (select auth.uid()) and confirmed);
$$;
revoke all on function public.sls_my_authenticator() from public, anon;
grant execute on function public.sls_my_authenticator() to authenticated;
