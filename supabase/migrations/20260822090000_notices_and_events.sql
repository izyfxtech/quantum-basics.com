-- Academy dashboard additions: notices (announcements) and calendar events.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- notices        — short announcements. course_id null = platform-wide,
--                   otherwise scoped to one course.
-- course_events  — calendar entries (deadlines, live sessions, etc).
--                   course_id null = platform-wide, otherwise scoped to one
--                   course. event_date is a plain date (no per-timezone time
--                   component needed for the current calendar view).
--
-- Read access: signed-in users see platform-wide rows plus rows for any
-- course they are enrolled in or staffed on; course staff/super admins see
-- everything for their own courses; super admins see everything.
-- Write access: course staff (their own course) and super admins (any).

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  body text not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.course_events (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  event_date date not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists notices_course_id_idx on public.notices (course_id);
create index if not exists notices_created_at_idx on public.notices (created_at desc);
create index if not exists course_events_course_id_idx on public.course_events (course_id);
create index if not exists course_events_event_date_idx on public.course_events (event_date);

grant select, insert, update, delete on public.notices to authenticated;
grant select on public.notices to anon;
grant all on public.notices to service_role;

grant select, insert, update, delete on public.course_events to authenticated;
grant select on public.course_events to anon;
grant all on public.course_events to service_role;

alter table public.notices enable row level security;
alter table public.course_events enable row level security;

drop policy if exists "notices_select" on public.notices;
create policy "notices_select"
  on public.notices for select
  to authenticated, anon
  using (
    course_id is null
    or public.is_super_admin(auth.uid())
    or public.is_course_staff(auth.uid(), course_id)
    or exists (
      select 1 from public.enrollments e
      where e.course_id = notices.course_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "notices_write" on public.notices;
create policy "notices_write"
  on public.notices for all
  to authenticated
  using (
    public.is_super_admin(auth.uid())
    or (course_id is not null and public.is_course_staff(auth.uid(), course_id))
  )
  with check (
    public.is_super_admin(auth.uid())
    or (course_id is not null and public.is_course_staff(auth.uid(), course_id))
  );

drop policy if exists "course_events_select" on public.course_events;
create policy "course_events_select"
  on public.course_events for select
  to authenticated, anon
  using (
    course_id is null
    or public.is_super_admin(auth.uid())
    or public.is_course_staff(auth.uid(), course_id)
    or exists (
      select 1 from public.enrollments e
      where e.course_id = course_events.course_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "course_events_write" on public.course_events;
create policy "course_events_write"
  on public.course_events for all
  to authenticated
  using (
    public.is_super_admin(auth.uid())
    or (course_id is not null and public.is_course_staff(auth.uid(), course_id))
  )
  with check (
    public.is_super_admin(auth.uid())
    or (course_id is not null and public.is_course_staff(auth.uid(), course_id))
  );
