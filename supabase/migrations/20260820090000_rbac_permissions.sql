-- Role-Based Access Control for the Academy LMS.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- Two-tier model:
--   1. Platform roles (public.user_roles) — super_admin, auditor, student.
--      A user can hold several at once (e.g. instructor + auditor).
--      'student' is granted automatically to every new sign-up.
--   2. Course staffing (public.course_staff) — instructor, teaching_assistant.
--      Scoped to a single course, not platform-wide.
--
-- Permission summary:
--   super_admin          full read/write on every table; only role that can
--                         create courses, delete courses, or assign other
--                         super_admins/instructors.
--   instructor           read/write lessons and course details for courses
--                         they are staffed on; can view roster + progress for
--                         those courses; can add/remove teaching_assistants
--                         (not other instructors) on their own course.
--   teaching_assistant   read-only on roster + progress for their assigned
--                         course; cannot edit course/lesson content.
--   student (default)    manage their own enrollments and lesson progress
--                         and profile only.
--   auditor              platform-wide read-only on courses, lessons,
--                         enrollments and lesson_progress for oversight and
--                         reporting — deliberately excluded from profiles
--                         (names/phone/organisation) to limit PII exposure.

-- ---------- Role enum ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'app_role') then
    create type public.app_role as enum (
      'super_admin',
      'instructor',
      'teaching_assistant',
      'student',
      'auditor'
    );
  end if;
end $$;

-- ---------- Supporting columns on existing tables ----------
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists onboarding_completed_at timestamptz;
alter table public.courses add column if not exists created_by uuid references public.profiles(id) on delete set null;

-- ---------- Platform-wide role grants ----------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role),
  constraint user_roles_role_check check (role in ('super_admin', 'auditor', 'student'))
);
-- select is enough for the "view own roles" policy; insert/update/delete are
-- required for the super-admin-only management policy below to ever be
-- reached (RLS only ever narrows a privilege the GRANT system already allows).
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create index if not exists idx_user_roles_user on public.user_roles(user_id);

-- ---------- Course-scoped staffing ----------
create table if not exists public.course_staff (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (course_id, user_id),
  constraint course_staff_role_check check (role in ('instructor', 'teaching_assistant'))
);
-- insert/delete needed for both the super-admin-manages and the
-- instructor-manages-their-own-TAs policies below.
grant select, insert, update, delete on public.course_staff to authenticated;
grant all on public.course_staff to service_role;
alter table public.course_staff enable row level security;
create index if not exists idx_course_staff_course on public.course_staff(course_id);
create index if not exists idx_course_staff_user on public.course_staff(user_id);

-- ---------- Point enrollments/progress at profiles so PostgREST can embed
-- profile data (name/email) directly on roster queries. profiles.id is a
-- 1:1 mirror of auth.users.id (enforced by handle_new_user below), so this
-- is a like-for-like retarget, not a data change. ----------
alter table public.enrollments drop constraint if exists enrollments_user_id_fkey;
alter table public.enrollments
  add constraint enrollments_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;

alter table public.lesson_progress drop constraint if exists lesson_progress_user_id_fkey;
alter table public.lesson_progress
  add constraint lesson_progress_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade;

create index if not exists idx_enrollments_course on public.enrollments(course_id);
create index if not exists idx_lesson_progress_lesson on public.lesson_progress(lesson_id);

-- ---------- Permission helper functions ----------
-- SECURITY DEFINER so they can read user_roles/course_staff without being
-- subject to (and recursing into) the RLS policies defined on those tables.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles where user_id = _user_id and role = _role
  );
$$;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, anon;

create or replace function public.is_super_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(_user_id, 'super_admin');
$$;
grant execute on function public.is_super_admin(uuid) to authenticated, anon;

create or replace function public.is_course_staff(
  _user_id uuid,
  _course_id uuid,
  _roles public.app_role[] default array['instructor', 'teaching_assistant']::public.app_role[]
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_super_admin(_user_id)
    or exists (
      select 1 from public.course_staff
      where user_id = _user_id and course_id = _course_id and role = any(_roles)
    );
$$;
grant execute on function public.is_course_staff(uuid, uuid, public.app_role[]) to authenticated, anon;

create or replace function public.is_course_instructor(_user_id uuid, _course_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_course_staff(_user_id, _course_id, array['instructor']::public.app_role[]);
$$;
grant execute on function public.is_course_instructor(uuid, uuid) to authenticated, anon;

-- ---------- Sign-up trigger: default role + email mirror ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, organisation, preferred_track, email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'organisation',
    new.raw_user_meta_data ->> 'preferred_track',
    new.email
  )
  on conflict (id) do update set email = excluded.email;

  insert into public.user_roles (user_id, role)
  values (new.id, 'student')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

-- Keep profiles.email in sync if the auth email changes later.
create or replace function public.handle_user_email_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.email is distinct from old.email then
    update public.profiles set email = new.email where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.handle_user_email_update();

revoke execute on function public.handle_user_email_update() from anon, authenticated, public;

-- Backfill: give every already-registered user their default student role,
-- and mirror their email onto profiles, in case this migration runs after
-- accounts already exist.
insert into public.user_roles (user_id, role)
select u.id, 'student' from auth.users u
on conflict (user_id, role) do nothing;

update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id and (p.email is distinct from u.email);

-- ---------- user_roles policies ----------
drop policy if exists "Users can view their own platform roles" on public.user_roles;
create policy "Users can view their own platform roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id or public.is_super_admin(auth.uid()));

drop policy if exists "Super admins manage platform roles" on public.user_roles;
create policy "Super admins manage platform roles" on public.user_roles
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

-- ---------- course_staff policies ----------
drop policy if exists "Course staff visible to staff and admins" on public.course_staff;
create policy "Course staff visible to staff and admins" on public.course_staff
  for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_super_admin(auth.uid())
    or public.is_course_staff(auth.uid(), course_id)
  );

drop policy if exists "Super admins manage course staff" on public.course_staff;
create policy "Super admins manage course staff" on public.course_staff
  for all to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop policy if exists "Instructors add TAs to their own course" on public.course_staff;
create policy "Instructors add TAs to their own course" on public.course_staff
  for insert to authenticated
  with check (role = 'teaching_assistant' and public.is_course_instructor(auth.uid(), course_id));

drop policy if exists "Instructors remove TAs from their own course" on public.course_staff;
create policy "Instructors remove TAs from their own course" on public.course_staff
  for delete to authenticated
  using (role = 'teaching_assistant' and public.is_course_instructor(auth.uid(), course_id));

-- ---------- courses / lessons: grant write privileges now that RLS below
-- allows super_admins and course instructors to use them. Migration 4 only
-- granted SELECT (writes went through service_role); RLS policies are only
-- ever consulted for privileges the SQL GRANT system already allows, so
-- both are required together. ----------
grant insert, update, delete on public.courses to authenticated;
grant insert, update, delete on public.lessons to authenticated;

-- ---------- courses policies (SELECT policy from migration 4 stays as-is) ----------
drop policy if exists "Super admins create courses" on public.courses;
create policy "Super admins create courses" on public.courses
  for insert to authenticated with check (public.is_super_admin(auth.uid()));

drop policy if exists "Super admins delete courses" on public.courses;
create policy "Super admins delete courses" on public.courses
  for delete to authenticated using (public.is_super_admin(auth.uid()));

drop policy if exists "Admins and course instructors update courses" on public.courses;
create policy "Admins and course instructors update courses" on public.courses
  for update to authenticated
  using (public.is_super_admin(auth.uid()) or public.is_course_instructor(auth.uid(), id))
  with check (public.is_super_admin(auth.uid()) or public.is_course_instructor(auth.uid(), id));

-- ---------- lessons policies (SELECT policy from migration 4 stays as-is) ----------
drop policy if exists "Admins and course instructors manage lessons" on public.lessons;
create policy "Admins and course instructors manage lessons" on public.lessons
  for all to authenticated
  using (public.is_super_admin(auth.uid()) or public.is_course_instructor(auth.uid(), course_id))
  with check (public.is_super_admin(auth.uid()) or public.is_course_instructor(auth.uid(), course_id));

-- ---------- enrollments: add staff/auditor read access ----------
drop policy if exists "Course staff view enrollments for their course" on public.enrollments;
create policy "Course staff view enrollments for their course" on public.enrollments
  for select to authenticated
  using (public.is_course_staff(auth.uid(), course_id) or public.is_super_admin(auth.uid()));

drop policy if exists "Auditors view all enrollments" on public.enrollments;
create policy "Auditors view all enrollments" on public.enrollments
  for select to authenticated using (public.has_role(auth.uid(), 'auditor'));

-- ---------- lesson_progress: add staff/auditor read access ----------
drop policy if exists "Course staff view progress in their course" on public.lesson_progress;
create policy "Course staff view progress in their course" on public.lesson_progress
  for select to authenticated
  using (
    exists (
      select 1 from public.lessons l
      where l.id = lesson_progress.lesson_id
        and (public.is_course_staff(auth.uid(), l.course_id) or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "Auditors view all lesson progress" on public.lesson_progress;
create policy "Auditors view all lesson progress" on public.lesson_progress
  for select to authenticated
  using (public.has_role(auth.uid(), 'auditor'));

-- ---------- profiles: admin + course-staff read access ----------
drop policy if exists "Super admins view all profiles" on public.profiles;
create policy "Super admins view all profiles" on public.profiles
  for select to authenticated using (public.is_super_admin(auth.uid()));

drop policy if exists "Super admins update any profile" on public.profiles;
create policy "Super admins update any profile" on public.profiles
  for update to authenticated
  using (public.is_super_admin(auth.uid()))
  with check (public.is_super_admin(auth.uid()));

drop policy if exists "Course staff view their students' profiles" on public.profiles;
create policy "Course staff view their students' profiles" on public.profiles
  for select to authenticated
  using (
    exists (
      select 1 from public.enrollments e
      where e.user_id = profiles.id and public.is_course_staff(auth.uid(), e.course_id)
    )
  );
