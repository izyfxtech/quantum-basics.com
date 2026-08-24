-- Security hardening pass, two independent fixes found in a codebase review:
--
-- 1. profiles.email / profiles.staff_eligible are system-managed columns
--    (kept in sync from auth.users, or set by the staff-eligibility email
--    check — see 20260822110000_staff_eligibility.sql) but the original
--    "Users can update their own profile" RLS policy from
--    20260819121704_...sql has no column-level restriction, so any signed-
--    in user could currently UPDATE their own row and set staff_eligible
--    = true directly, or edit `email` so it drifts from auth.users.email.
--
--    staff_eligible is documented as advisory only (an admin still has to
--    manually staff a course), so this was never a privilege escalation --
--    but it lets anyone inject themselves into the admin shortlist, and
--    the email drift is a real data-integrity bug. Fixed here the same way
--    the RBAC migration already describes the GRANT-vs-RLS relationship:
--    REVOKE at the column-privilege level, which applies regardless of any
--    RLS policy, while leaving the columns fully writable by the
--    SECURITY DEFINER trigger functions that legitimately maintain them
--    (those run as the function owner, not as `authenticated`).
--
-- 2. "Students update their own in-progress attempt" on quiz_attempts only
--    checked `user_id = auth.uid()` in its WITH CHECK. Before submitting
--    (while submitted_at is still null), a student could UPDATE their own
--    attempt row and set `score`/`feedback` directly -- harmless once they
--    actually submit (the grading trigger below unconditionally
--    recomputes score/max_score at that point) but nothing stopped a
--    student from displaying a self-assigned score in an unsubmitted
--    attempt in the meantime. Tightened so score/max_score must stay null
--    unless this update is itself the submit (submitted_at transitioning
--    non-null, at which point the trigger's computed values are what's
--    actually being checked), and feedback -- staff-only, always -- must
--    stay null in a student's own update regardless.

-- --- Fix 1: profiles column lockdown -----------------------------------

revoke update (email, staff_eligible) on public.profiles from authenticated;

-- --- Fix 2: quiz_attempts pre-submission tampering ----------------------

drop policy if exists "Students update their own in-progress attempt" on public.quiz_attempts;

create policy "Students update their own in-progress attempt"
  on public.quiz_attempts for update
  using (user_id = auth.uid() and submitted_at is null)
  with check (
    user_id = auth.uid()
    and feedback is null
    and (submitted_at is not null or (score is null and max_score is null))
  );
