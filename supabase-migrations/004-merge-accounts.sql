-- Seek Like Silver: lets the merge-accounts server function find which
-- account owns a sign-in (e.g. a Google login). Not callable from the website.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.

create or replace function public.sls_user_id_by_identity(p_provider text, p_provider_id text)
returns uuid
language sql
security definer
set search_path = ''
as $$
  select user_id from auth.identities
  where provider = p_provider and provider_id = p_provider_id
  limit 1;
$$;

revoke all on function public.sls_user_id_by_identity(text, text) from public, anon, authenticated;
grant execute on function public.sls_user_id_by_identity(text, text) to service_role;
