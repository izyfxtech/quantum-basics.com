-- Domain-gate staff eligibility: accounts signing up with an
-- @quantum-basics.com email are flagged eligible for course staffing.
-- This is advisory, not a grant: eligibility just controls what the admin
-- panel surfaces when picking who to staff onto a course. Actual staffing
-- power still only comes from public.course_staff rows (see
-- 20260820090000_rbac_permissions.sql) — a super_admin can still staff a
-- non-eligible account by hand if they really want to; this just makes the
-- common case (staff at the org) easy to find.
-- Idempotent: safe to re-run against a database where this has already applied.

alter table public.profiles add column if not exists staff_eligible boolean not null default false;

create or replace function public.is_staff_eligible_email(_email text)
returns boolean
language sql
immutable
as $$
  select _email is not null and lower(_email) like '%@quantum-basics.com';
$$;

-- Re-derive staff_eligible on every insert/update of handle_new_user /
-- handle_user_email_update rather than hardcoding it in two places.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, organisation, preferred_track, email, staff_eligible)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'organisation',
    new.raw_user_meta_data ->> 'preferred_track',
    new.email,
    public.is_staff_eligible_email(new.email)
  )
  on conflict (id) do update set email = excluded.email, staff_eligible = excluded.staff_eligible;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles
    set email = new.email, staff_eligible = public.is_staff_eligible_email(new.email)
    where id = new.id;
  end if;
  return new;
end;
$$;

-- Backfill existing accounts in case this migration runs after sign-ups.
update public.profiles p
set staff_eligible = public.is_staff_eligible_email(p.email)
where p.staff_eligible is distinct from public.is_staff_eligible_email(p.email);

-- profiles already has a "Users can view their own profile" / super-admin /
-- course-staff-views-their-students policies from earlier migrations; those
-- already cover staff_eligible since it's just a new column on the same
-- row, no new policy needed. searchProfiles() (admin.ts) already selects
-- through those policies as super_admin, so it'll pick up the column once
-- the app queries for it.
