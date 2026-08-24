-- Teacher dashboard core schema: assignments, submissions, quizzes,
-- quiz_questions, quiz_attempts.
-- Idempotent: safe to re-run against a database where this has already applied.
--
-- Write-access split follows the precedent already set elsewhere in this
-- schema, not a new convention:
--   - assignment/quiz DEFINITIONS (the graded instrument itself) follow the
--     `lessons` precedent (20260820090000): authoring is instructor-only,
--     TAs are read-only on it. Getting a due date or a correct answer wrong
--     is a course-content mistake, same class as a wrong lesson body.
--   - GRADING (submissions, quiz_attempts) follows the `notices`/
--     `course_events` precedent (20260822090000): any course_staff row
--     (instructor OR teaching_assistant) can act. Grading assistance is a
--     normal TA duty, same class as posting a notice.
--
-- quiz_questions is never directly SELECTable by students (it holds
-- correct_answer) -- they read it only through the
-- quiz_questions_for_attempt() security-definer RPC below, which hardcodes
-- a safe column list. Same pattern as course_lesson_previews()
-- (20260821090000_lock_lesson_content.sql).

-- ---------- assignments ----------
create table if not exists public.assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  instructions text,
  due_at timestamptz,
  max_score numeric not null default 100,
  published boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.assignments to authenticated;
grant all on public.assignments to service_role;
alter table public.assignments enable row level security;
create index if not exists idx_assignments_course on public.assignments(course_id);

drop trigger if exists update_assignments_updated_at on public.assignments;
create trigger update_assignments_updated_at
before update on public.assignments
for each row execute function public.update_updated_at_column();

drop policy if exists "Enrolled students view published assignments" on public.assignments;
create policy "Enrolled students view published assignments" on public.assignments
  for select to authenticated
  using (
    published = true
    and exists (select 1 from public.enrollments e where e.course_id = assignments.course_id and e.user_id = auth.uid())
  );

drop policy if exists "Course staff view all assignments in their course" on public.assignments;
create policy "Course staff view all assignments in their course" on public.assignments
  for select to authenticated
  using (public.is_course_staff(auth.uid(), course_id) or public.is_super_admin(auth.uid()));

drop policy if exists "Instructors manage assignments in their course" on public.assignments;
create policy "Instructors manage assignments in their course" on public.assignments
  for all to authenticated
  using (public.is_course_instructor(auth.uid(), course_id) or public.is_super_admin(auth.uid()))
  with check (public.is_course_instructor(auth.uid(), course_id) or public.is_super_admin(auth.uid()));

-- ---------- submissions ----------
-- One row per (assignment, student): resubmission overwrites content/
-- file_path via UPDATE until graded, rather than accumulating attempt rows
-- (assignments aren't timed/limited-attempt the way quizzes are).
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references public.assignments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text,
  file_path text,
  submitted_at timestamptz not null default now(),
  score numeric,
  feedback text,
  graded_by uuid references public.profiles(id) on delete set null,
  graded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (assignment_id, user_id)
);
grant select, insert, update, delete on public.submissions to authenticated;
grant all on public.submissions to service_role;
alter table public.submissions enable row level security;
create index if not exists idx_submissions_assignment on public.submissions(assignment_id);
create index if not exists idx_submissions_user on public.submissions(user_id);

drop trigger if exists update_submissions_updated_at on public.submissions;
create trigger update_submissions_updated_at
before update on public.submissions
for each row execute function public.update_updated_at_column();

drop policy if exists "Students view their own submissions" on public.submissions;
create policy "Students view their own submissions" on public.submissions
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Course staff view submissions in their course" on public.submissions;
create policy "Course staff view submissions in their course" on public.submissions
  for select to authenticated
  using (
    exists (
      select 1 from public.assignments a
      where a.id = submissions.assignment_id
        and (public.is_course_staff(auth.uid(), a.course_id) or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "Students submit their own work" on public.submissions;
create policy "Students submit their own work" on public.submissions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.assignments a
      join public.enrollments e on e.course_id = a.course_id
      where a.id = submissions.assignment_id and e.user_id = auth.uid() and a.published = true
    )
  );

-- score/graded_by must stay null under this policy (both USING and WITH
-- CHECK require graded_at is null), so a student can resubmit content but
-- cannot grade themselves -- setting score without staff also setting
-- graded_at would violate WITH CHECK and roll back the whole update.
drop policy if exists "Students update their own ungraded submission" on public.submissions;
create policy "Students update their own ungraded submission" on public.submissions
  for update to authenticated
  using (user_id = auth.uid() and graded_at is null)
  with check (user_id = auth.uid() and graded_at is null and score is null and graded_by is null);

drop policy if exists "Students delete their own ungraded submission" on public.submissions;
create policy "Students delete their own ungraded submission" on public.submissions
  for delete to authenticated using (user_id = auth.uid() and graded_at is null);

drop policy if exists "Course staff grade submissions in their course" on public.submissions;
create policy "Course staff grade submissions in their course" on public.submissions
  for update to authenticated
  using (
    exists (
      select 1 from public.assignments a
      where a.id = submissions.assignment_id
        and (public.is_course_staff(auth.uid(), a.course_id) or public.is_super_admin(auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.assignments a
      where a.id = submissions.assignment_id
        and (public.is_course_staff(auth.uid(), a.course_id) or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "Course staff delete submissions in their course" on public.submissions;
create policy "Course staff delete submissions in their course" on public.submissions
  for delete to authenticated
  using (
    exists (
      select 1 from public.assignments a
      where a.id = submissions.assignment_id
        and (public.is_course_staff(auth.uid(), a.course_id) or public.is_super_admin(auth.uid()))
    )
  );

-- ---------- quizzes ----------
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  time_limit_minutes int,
  max_attempts int,
  shuffle_questions boolean not null default false,
  published boolean not null default false,
  due_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.quizzes to authenticated;
grant all on public.quizzes to service_role;
alter table public.quizzes enable row level security;
create index if not exists idx_quizzes_course on public.quizzes(course_id);

drop trigger if exists update_quizzes_updated_at on public.quizzes;
create trigger update_quizzes_updated_at
before update on public.quizzes
for each row execute function public.update_updated_at_column();

drop policy if exists "Enrolled students view published quizzes" on public.quizzes;
create policy "Enrolled students view published quizzes" on public.quizzes
  for select to authenticated
  using (
    published = true
    and exists (select 1 from public.enrollments e where e.course_id = quizzes.course_id and e.user_id = auth.uid())
  );

drop policy if exists "Course staff view all quizzes in their course" on public.quizzes;
create policy "Course staff view all quizzes in their course" on public.quizzes
  for select to authenticated
  using (public.is_course_staff(auth.uid(), course_id) or public.is_super_admin(auth.uid()));

drop policy if exists "Instructors manage quizzes in their course" on public.quizzes;
create policy "Instructors manage quizzes in their course" on public.quizzes
  for all to authenticated
  using (public.is_course_instructor(auth.uid(), course_id) or public.is_super_admin(auth.uid()))
  with check (public.is_course_instructor(auth.uid(), course_id) or public.is_super_admin(auth.uid()));

-- ---------- quiz_questions ----------
-- question_type: single_choice | multiple_choice | true_false | short_answer
-- options: jsonb array of {id, text} for choice types; [] for short_answer.
-- correct_answer: single_choice/true_false -> jsonb string (option id, or
-- "true"/"false"); multiple_choice -> jsonb array of option ids;
-- short_answer -> jsonb string, matched case-insensitively/trimmed.
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_type text not null default 'single_choice',
  prompt text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer jsonb not null default 'null'::jsonb,
  points numeric not null default 1,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint quiz_questions_type_check
    check (question_type in ('single_choice', 'multiple_choice', 'true_false', 'short_answer'))
);
grant select, insert, update, delete on public.quiz_questions to authenticated;
grant all on public.quiz_questions to service_role;
alter table public.quiz_questions enable row level security;
create index if not exists idx_quiz_questions_quiz on public.quiz_questions(quiz_id);

-- No student-facing select policy on this table at all -- see
-- quiz_questions_for_attempt() below for the safe read path.
drop policy if exists "Course staff view quiz questions in their course" on public.quiz_questions;
create policy "Course staff view quiz questions in their course" on public.quiz_questions
  for select to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_questions.quiz_id
        and (public.is_course_staff(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "Instructors manage quiz questions in their course" on public.quiz_questions;
create policy "Instructors manage quiz questions in their course" on public.quiz_questions
  for all to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_questions.quiz_id
        and (public.is_course_instructor(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_questions.quiz_id
        and (public.is_course_instructor(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  );

-- Safe read path for a student taking a quiz: fixed, hardcoded column list
-- that can never include correct_answer no matter what's added to the
-- table later. security definer so it works despite the table having no
-- student-facing RLS policy.
create or replace function public.quiz_questions_for_attempt(_quiz_id uuid)
returns table (
  id uuid,
  quiz_id uuid,
  question_type text,
  prompt text,
  options jsonb,
  points numeric,
  sort_order int
)
language sql
security definer
set search_path = public
stable
as $$
  select qq.id, qq.quiz_id, qq.question_type, qq.prompt, qq.options, qq.points, qq.sort_order
  from public.quiz_questions qq
  join public.quizzes q on q.id = qq.quiz_id
  where qq.quiz_id = _quiz_id
    and q.published = true
    and (
      public.is_course_staff(auth.uid(), q.course_id)
      or public.is_super_admin(auth.uid())
      or exists (select 1 from public.enrollments e where e.course_id = q.course_id and e.user_id = auth.uid())
    )
  order by qq.sort_order;
$$;
grant execute on function public.quiz_questions_for_attempt(uuid) to authenticated;

-- ---------- quiz_attempts ----------
create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  attempt_number int not null default 1,
  answers jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric,
  max_score numeric,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.quiz_attempts to authenticated;
grant all on public.quiz_attempts to service_role;
alter table public.quiz_attempts enable row level security;
create index if not exists idx_quiz_attempts_quiz_user on public.quiz_attempts(quiz_id, user_id);

drop trigger if exists update_quiz_attempts_updated_at on public.quiz_attempts;
create trigger update_quiz_attempts_updated_at
before update on public.quiz_attempts
for each row execute function public.update_updated_at_column();

-- Server-side attempt numbering + max_attempts enforcement. Runs as
-- security definer so it can read quizzes.max_attempts / .published
-- regardless of the inserting user's own grants, and so the count it does
-- is authoritative rather than trusting whatever attempt_number the client
-- sent.
create or replace function public.enforce_quiz_attempt_and_number()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _max_attempts int;
  _published boolean;
  _existing int;
begin
  select max_attempts, published into _max_attempts, _published
  from public.quizzes where id = new.quiz_id;

  if not coalesce(_published, false) then
    raise exception 'Cannot attempt an unpublished quiz';
  end if;

  select count(*) into _existing from public.quiz_attempts
  where quiz_id = new.quiz_id and user_id = new.user_id;

  if _max_attempts is not null and _existing >= _max_attempts then
    raise exception 'Maximum attempts (%) reached for this quiz', _max_attempts;
  end if;

  new.attempt_number := _existing + 1;
  return new;
end;
$$;

drop trigger if exists before_quiz_attempt_insert on public.quiz_attempts;
create trigger before_quiz_attempt_insert
before insert on public.quiz_attempts
for each row execute function public.enforce_quiz_attempt_and_number();

-- Auto-grading: fires the moment an attempt transitions into "submitted"
-- (submitted_at goes from null to non-null). Recomputes score/max_score
-- from quiz_questions server-side every time, so nothing the client sends
-- for those two columns is ever trusted.
create or replace function public.grade_quiz_attempt()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  _total numeric := 0;
  _earned numeric := 0;
  q record;
  _answer jsonb;
begin
  if new.submitted_at is null or old.submitted_at is not null then
    return new;
  end if;

  for q in select id, question_type, correct_answer, points from public.quiz_questions where quiz_id = new.quiz_id loop
    _total := _total + coalesce(q.points, 0);
    _answer := new.answers -> q.id::text;

    if _answer is null then
      continue;
    end if;

    if q.question_type in ('single_choice', 'true_false') then
      if _answer = q.correct_answer then
        _earned := _earned + coalesce(q.points, 0);
      end if;
    elsif q.question_type = 'multiple_choice' then
      -- Order-independent set comparison of two jsonb arrays of option ids.
      if (select coalesce(array_agg(x order by x), array[]::text[]) from jsonb_array_elements_text(_answer) x)
         = (select coalesce(array_agg(x order by x), array[]::text[]) from jsonb_array_elements_text(q.correct_answer) x)
      then
        _earned := _earned + coalesce(q.points, 0);
      end if;
    elsif q.question_type = 'short_answer' then
      if lower(trim(both from (_answer #>> '{}'))) = lower(trim(both from (q.correct_answer #>> '{}'))) then
        _earned := _earned + coalesce(q.points, 0);
      end if;
    end if;
  end loop;

  new.score := _earned;
  new.max_score := _total;
  return new;
end;
$$;

drop trigger if exists before_quiz_attempt_submit_grade on public.quiz_attempts;
create trigger before_quiz_attempt_submit_grade
before update on public.quiz_attempts
for each row execute function public.grade_quiz_attempt();

drop policy if exists "Students view their own attempts" on public.quiz_attempts;
create policy "Students view their own attempts" on public.quiz_attempts
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "Course staff view attempts in their course" on public.quiz_attempts;
create policy "Course staff view attempts in their course" on public.quiz_attempts
  for select to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_attempts.quiz_id
        and (public.is_course_staff(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  );

-- published check here is defense in depth on top of the trigger above
-- (20260821090000's comment on lessons/course_lesson_previews sets this
-- same "defense in depth" precedent).
drop policy if exists "Students start their own attempt" on public.quiz_attempts;
create policy "Students start their own attempt" on public.quiz_attempts
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.quizzes q
      join public.enrollments e on e.course_id = q.course_id
      where q.id = quiz_attempts.quiz_id and e.user_id = auth.uid() and q.published = true
    )
  );

-- Locked once submitted: USING requires the pre-update row still have
-- submitted_at null, so a student cannot touch an attempt again after
-- submitting it (score/feedback tampering included).
drop policy if exists "Students update their own in-progress attempt" on public.quiz_attempts;
create policy "Students update their own in-progress attempt" on public.quiz_attempts
  for update to authenticated
  using (user_id = auth.uid() and submitted_at is null)
  with check (user_id = auth.uid());

drop policy if exists "Course staff grade attempts in their course" on public.quiz_attempts;
create policy "Course staff grade attempts in their course" on public.quiz_attempts
  for update to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_attempts.quiz_id
        and (public.is_course_staff(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  )
  with check (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_attempts.quiz_id
        and (public.is_course_staff(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  );

drop policy if exists "Course staff delete attempts in their course" on public.quiz_attempts;
create policy "Course staff delete attempts in their course" on public.quiz_attempts
  for delete to authenticated
  using (
    exists (
      select 1 from public.quizzes q
      where q.id = quiz_attempts.quiz_id
        and (public.is_course_staff(auth.uid(), q.course_id) or public.is_super_admin(auth.uid()))
    )
  );
