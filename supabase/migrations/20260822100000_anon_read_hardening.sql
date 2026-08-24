-- Tighten anon's read/execute surface to match what's actually intended.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- 1. notices_select / course_events_select (added in
--    20260822090000_notices_and_events.sql) were granted `to authenticated,
--    anon`, so an anonymous, not-signed-in visitor could read every
--    platform-wide (course_id is null) notice/event. That migration's own
--    header says "signed-in users see platform-wide rows plus rows for any
--    course they are enrolled in or staffed on" -- anon was never meant to
--    be in scope. Re-scope both policies to `authenticated` only, and
--    revoke the matching table-level anon grant.
--
-- 2. has_role/is_super_admin/is_course_staff/is_course_instructor were
--    granted EXECUTE to anon alongside authenticated when first created
--    (20260820090000_rbac_permissions.sql). No policy actually evaluates
--    these for the anon role -- the only `to ... anon` policies are the
--    always-public `using (true)` ones on courses/lessons-preview, plus
--    notices/course_events select, which fix #1 above now scopes to
--    authenticated only. Revoke anon's EXECUTE; authenticated keeps it.

revoke select on public.notices from anon;
revoke select on public.course_events from anon;

drop policy if exists "notices_select" on public.notices;
create policy "notices_select"
  on public.notices for select
  to authenticated
  using (
    course_id is null
    or public.is_super_admin(auth.uid())
    or public.is_course_staff(auth.uid(), course_id)
    or exists (
      select 1 from public.enrollments e
      where e.course_id = notices.course_id and e.user_id = auth.uid()
    )
  );

drop policy if exists "course_events_select" on public.course_events;
create policy "course_events_select"
  on public.course_events for select
  to authenticated
  using (
    course_id is null
    or public.is_super_admin(auth.uid())
    or public.is_course_staff(auth.uid(), course_id)
    or exists (
      select 1 from public.enrollments e
      where e.course_id = course_events.course_id and e.user_id = auth.uid()
    )
  );

revoke execute on function public.has_role(uuid, public.app_role) from anon;
revoke execute on function public.is_super_admin(uuid) from anon;
revoke execute on function public.is_course_staff(uuid, uuid, public.app_role[]) from anon;
revoke execute on function public.is_course_instructor(uuid, uuid) from anon;
