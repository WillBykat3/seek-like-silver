-- Seek Like Silver: remove the authenticator sign-in experiment (only if you ran 008).
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again,
-- and harmless if 008 was never run. Afterward you can delete the "authenticator"
-- Edge Function in the Supabase dashboard (Edge Functions → authenticator → Delete).
drop function if exists public.sls_my_authenticator();
drop table if exists public.sls_authenticators;
drop table if exists public.sls_signin_attempts;
