-- Seek Like Silver: an owner-only stats page (counts only, never anyone's email or answers).
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.
--
-- Then make yourself an admin with ONE more line in the SQL Editor, using the
-- email you sign in with (don't commit your email to GitHub):
--   insert into public.site_admins (user_id)
--   select id from auth.users where lower(email) = lower('you@example.com')
--   on conflict do nothing;

create table if not exists public.site_admins (
  user_id  uuid primary key references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;   -- only changed in the SQL Editor
grant all on public.site_admins to service_role;

-- Is the signed-in person an admin? (Used to show the Stats link.)
create or replace function public.sls_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.site_admins where user_id = (select auth.uid()));
$$;

-- Site numbers, for admins only (with their authenticator code if they use one).
create or replace function public.sls_site_stats()
returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  result jsonb;
begin
  if not public.sls_is_admin() or not public.sls_aal_ok() then
    raise exception 'not_allowed';
  end if;

  select jsonb_build_object(
    'generated_at',        now(),
    'users',               (select count(*) from auth.users),
    'new_7_days',          (select count(*) from auth.users where created_at > now() - interval '7 days'),
    'new_30_days',         (select count(*) from auth.users where created_at > now() - interval '30 days'),
    'active_7_days',       (select count(*) from auth.users where last_sign_in_at > now() - interval '7 days'),
    'active_30_days',      (select count(*) from auth.users where last_sign_in_at > now() - interval '30 days'),
    'with_google',         (select count(distinct user_id) from auth.identities where provider = 'google'),
    'with_email',          (select count(distinct user_id) from auth.identities where provider = 'email'),
    'with_youversion',     (select count(*) from public.youversion_links),
    'with_authenticator',  (select count(distinct user_id) from auth.mfa_factors where status = 'verified'),
    'answers',             (select count(*) from public.answers),
    'answers_7_days',      (select count(*) from public.answers where created_at > now() - interval '7 days'),
    'people_who_answered', (select count(distinct user_id) from public.answers),
    'shared_answers',      (select count(*) from public.answers where shared),
    'groups',              (select count(*) from public.study_groups),
    'group_members',       (select count(*) from public.study_group_members),
    'answers_by_level',    (select coalesce(jsonb_object_agg(level, n), '{}'::jsonb)
                              from (select level, count(*) n from public.answers group by level) t),
    'top_questions',       (select coalesce(jsonb_agg(jsonb_build_object('question_id', question_id, 'answers', n) order by n desc, question_id), '[]'::jsonb)
                              from (select question_id, count(*) n from public.answers
                                    group by question_id order by n desc, question_id limit 5) t),
    'signups_by_week',     (select jsonb_agg(jsonb_build_object('week', to_char(w, 'YYYY-MM-DD'), 'users', coalesce(n, 0)) order by w)
                              from generate_series(date_trunc('week', now()) - interval '11 weeks', date_trunc('week', now()), interval '1 week') w
                              left join (select date_trunc('week', created_at) wk, count(*) n from auth.users group by 1) c on c.wk = w)
  ) into result;
  return result;
end;
$$;

revoke all on function public.sls_is_admin() from public, anon;
revoke all on function public.sls_site_stats() from public, anon;
grant execute on function public.sls_is_admin() to authenticated;
grant execute on function public.sls_site_stats() to authenticated;
