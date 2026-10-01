-- Seek Like Silver: more than one answer per question, and private study groups.
-- Run once in Supabase: SQL Editor → New query → paste → Run. Safe to run again.

-- ─────────────────────────────────────────────
-- 1. Answers: allow several answers to the same question, and let people
--    choose to share an answer with their groups (off by default).
-- ─────────────────────────────────────────────
alter table public.answers drop constraint if exists answers_user_id_question_id_key;
create index if not exists answers_user_question_idx on public.answers (user_id, question_id);
alter table public.answers add column if not exists shared boolean not null default false;

-- Moving answers when two accounts are merged: with several answers allowed,
-- simply move every answer over.
create or replace function public.sls_merge_answers(p_from uuid, p_to uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_from = p_to then return; end if;
  update public.answers set user_id = p_to where user_id = p_from;
end;
$$;
revoke all on function public.sls_merge_answers(uuid, uuid) from public, anon, authenticated;
grant execute on function public.sls_merge_answers(uuid, uuid) to service_role;

-- ─────────────────────────────────────────────
-- 2. Groups and members
-- ─────────────────────────────────────────────
create table if not exists public.study_groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(btrim(name)) between 1 and 60),
  owner_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  invite_code text not null unique check (invite_code ~ '^[A-F0-9]{10}$'),
  created_at  timestamptz not null default now()
);

create table if not exists public.study_group_members (
  group_id  uuid not null references public.study_groups (id) on delete cascade,
  user_id   uuid not null references auth.users (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index if not exists study_group_members_user_idx on public.study_group_members (user_id);

alter table public.study_groups enable row level security;
alter table public.study_group_members enable row level security;

revoke all on public.study_groups from anon, authenticated;
revoke all on public.study_group_members from anon, authenticated;
grant select, delete on public.study_groups to authenticated;   -- creating goes through sls_create_group
grant update (name) on public.study_groups to authenticated;        -- owners can rename (nothing else)
grant select, delete on public.study_group_members to authenticated;     -- joining goes through sls_join_group
grant all on public.study_groups, public.study_group_members to service_role;

-- Helpers (security definer so policies don't loop through each other).
create or replace function public.sls_is_group_member(p_group uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.study_group_members
                 where group_id = p_group and user_id = (select auth.uid()));
$$;

create or replace function public.sls_is_group_owner(p_group uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.study_groups
                 where id = p_group and owner_id = (select auth.uid()));
$$;

create or replace function public.sls_shares_group_with(p_other uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.study_group_members me
                 join public.study_group_members them on them.group_id = me.group_id
                 where me.user_id = (select auth.uid()) and them.user_id = p_other);
$$;

revoke all on function public.sls_is_group_member(uuid) from public, anon;
revoke all on function public.sls_is_group_owner(uuid) from public, anon;
revoke all on function public.sls_shares_group_with(uuid) from public, anon;
grant execute on function public.sls_is_group_member(uuid) to authenticated;
grant execute on function public.sls_is_group_owner(uuid) to authenticated;
grant execute on function public.sls_shares_group_with(uuid) to authenticated;

-- Policies
drop policy if exists "groups: members read" on public.study_groups;
drop policy if exists "groups: owner renames" on public.study_groups;
drop policy if exists "groups: owner deletes" on public.study_groups;
create policy "groups: members read" on public.study_groups for select to authenticated
  using ((select public.sls_is_group_member(id)));
create policy "groups: owner renames" on public.study_groups for update to authenticated
  using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "groups: owner deletes" on public.study_groups for delete to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "members: members read" on public.study_group_members;
drop policy if exists "members: leave or remove" on public.study_group_members;
create policy "members: members read" on public.study_group_members for select to authenticated
  using ((select public.sls_is_group_member(group_id)));
-- You can leave a group (but the owner deletes the group instead), and the owner can remove people.
create policy "members: leave or remove" on public.study_group_members for delete to authenticated
  using (
    ((select auth.uid()) = user_id and not (select public.sls_is_group_owner(group_id)))
    or ((select public.sls_is_group_owner(group_id)) and user_id <> (select auth.uid()))
  );

-- Answers you chose to share are readable by people in a group with you.
drop policy if exists "answers: read shared by group" on public.answers;
create policy "answers: read shared by group" on public.answers for select to authenticated
  using (shared and (select public.sls_shares_group_with(user_id)));

-- Authenticator protection (same rule as everything else).
drop policy if exists "require authenticator if enabled" on public.study_groups;
create policy "require authenticator if enabled" on public.study_groups
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2' or not (select public.sls_has_verified_factor()));
drop policy if exists "require authenticator if enabled" on public.study_group_members;
create policy "require authenticator if enabled" on public.study_group_members
  as restrictive for all to authenticated
  using ((select auth.jwt()->>'aal') = 'aal2' or not (select public.sls_has_verified_factor()));

-- ─────────────────────────────────────────────
-- 3. Group actions the website calls
-- ─────────────────────────────────────────────
create or replace function public.sls_aal_ok()
returns boolean language sql stable security definer set search_path = '' as $$
  select (select auth.jwt()->>'aal') = 'aal2' or not public.sls_has_verified_factor();
$$;
revoke all on function public.sls_aal_ok() from public, anon;
grant execute on function public.sls_aal_ok() to authenticated;

create or replace function public.sls_new_code()
returns text language sql volatile security definer set search_path = '' as $$
  select upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));
$$;
revoke all on function public.sls_new_code() from public, anon, authenticated;

-- Create a group; you become its owner and first member.
create or replace function public.sls_create_group(p_name text)
returns table (id uuid, name text, invite_code text)
language plpgsql security definer set search_path = '' as $$
declare
  v_id uuid;
  v_code text;
begin
  if auth.uid() is null or not public.sls_aal_ok() then raise exception 'not_allowed'; end if;
  if char_length(btrim(coalesce(p_name, ''))) not between 1 and 60 then raise exception 'bad_name'; end if;
  if (select count(*) from public.study_groups g where g.owner_id = auth.uid()) >= 10 then raise exception 'too_many_groups'; end if;
  loop
    v_code := public.sls_new_code();
    exit when not exists (select 1 from public.study_groups g where g.invite_code = v_code);
  end loop;
  insert into public.study_groups (name, owner_id, invite_code) values (btrim(p_name), auth.uid(), v_code)
    returning study_groups.id into v_id;
  insert into public.study_group_members (group_id, user_id) values (v_id, auth.uid());
  return query select v_id, btrim(p_name), v_code;
end;
$$;

-- Join with an invite code.
create or replace function public.sls_join_group(p_code text)
returns table (id uuid, name text)
language plpgsql security definer set search_path = '' as $$
declare
  v_group public.study_groups;
begin
  if auth.uid() is null or not public.sls_aal_ok() then raise exception 'not_allowed'; end if;
  select * into v_group from public.study_groups g where g.invite_code = upper(btrim(coalesce(p_code, '')));
  if v_group.id is null then raise exception 'bad_code'; end if;
  if (select count(*) from public.study_group_members m where m.group_id = v_group.id) >= 50 then raise exception 'group_full'; end if;
  insert into public.study_group_members (group_id, user_id) values (v_group.id, auth.uid())
    on conflict do nothing;
  return query select v_group.id, v_group.name;
end;
$$;

-- Owner: make a new invite code (the old one stops working).
create or replace function public.sls_new_invite_code(p_group uuid)
returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_code text;
begin
  if not public.sls_aal_ok() or not public.sls_is_group_owner(p_group) then raise exception 'not_allowed'; end if;
  loop
    v_code := public.sls_new_code();
    exit when not exists (select 1 from public.study_groups g where g.invite_code = v_code);
  end loop;
  update public.study_groups set invite_code = v_code where id = p_group;
  return v_code;
end;
$$;

-- Members of a group with their display names (only for people in that group).
create or replace function public.sls_group_members(p_group uuid)
returns table (user_id uuid, display_name text, is_owner boolean, joined_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select m.user_id, p.display_name, (m.user_id = g.owner_id), m.joined_at
  from public.study_group_members m
  join public.study_groups g on g.id = m.group_id
  left join public.profiles p on p.id = m.user_id
  where m.group_id = p_group and public.sls_is_group_member(p_group) and public.sls_aal_ok()
  order by (m.user_id = g.owner_id) desc, m.joined_at;
$$;

revoke all on function public.sls_create_group(text) from public, anon;
revoke all on function public.sls_join_group(text) from public, anon;
revoke all on function public.sls_new_invite_code(uuid) from public, anon;
revoke all on function public.sls_group_members(uuid) from public, anon;
grant execute on function public.sls_create_group(text) to authenticated;
grant execute on function public.sls_join_group(text) to authenticated;
grant execute on function public.sls_new_invite_code(uuid) to authenticated;
grant execute on function public.sls_group_members(uuid) to authenticated;
