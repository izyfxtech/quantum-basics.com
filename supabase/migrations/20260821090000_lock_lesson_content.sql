-- Close the public anon-read gap on lesson content.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- Migration 4 (20260820080544) granted `select` on public.lessons to both
-- anon and authenticated, with a "Lessons are publicly readable" policy
-- using (true) -- meaning full lesson body content (not just the syllabus
-- titles/durations) was readable by anyone with the public Supabase key,
-- signed in or not, enrolled or not. This migration:
--   1. Revokes anon's direct select access to public.lessons.
--   2. Replaces the "publicly readable" policy with one scoped to enrolled
--      students, course staff, super admins, and auditors.
--   3. Adds a security-definer RPC that returns only the safe preview
--      columns (id, title, minutes, sort_order -- no body) for the public
--      course syllabus view, callable by anon and authenticated alike.

revoke select on public.lessons from anon;

drop policy if exists "Lessons are publicly readable" on public.lessons;

drop policy if exists "Enrolled students and staff read lesson content" on public.lessons;
create policy "Enrolled students and staff read lesson content" on public.lessons
  for select to authenticated
  using (
    exists (
      select 1
      from public.enrollments e
      where e.course_id = lessons.course_id
        and e.user_id = auth.uid()
    )
    or public.is_course_staff(auth.uid(), course_id)
    or public.is_super_admin(auth.uid())
    or public.has_role(auth.uid(), 'auditor')
  );

-- Public/anon-safe syllabus preview -- titles + durations only, no body.
-- security definer so it works even though the base-table RLS above now
-- blocks anon and non-enrolled authenticated users from public.lessons.
create or replace function public.course_lesson_previews(_course_id uuid)
returns table (id uuid, title text, minutes int, sort_order int)
language sql
security definer
set search_path = public
stable
as $$
  select l.id, l.title, l.minutes, l.sort_order
  from public.lessons l
  where l.course_id = _course_id
  order by l.sort_order;
$$;

-- Defense in depth: even though this function only ever selects the safe
-- preview columns, revoke direct table access from the function owner's
-- role isn't practical here (it needs read access to compute the result),
-- so instead we rely on the fixed, hardcoded column list above -- this
-- function will never return `body` no matter what future columns are
-- added to public.lessons.
grant execute on function public.course_lesson_previews(uuid) to anon, authenticated;
