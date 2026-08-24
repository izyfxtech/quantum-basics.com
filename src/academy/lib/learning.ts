import { supabase } from "@/integrations/supabase/client";
import type { ListResult } from "@/academy/lib/teaching";
import type { QuestionType, QuizOption } from "@/academy/lib/teaching";
import type { Json } from "@/integrations/supabase/types";

// ---------------------------------------------------------------------------
// Submissions (student side of the Assignments tab)
// ---------------------------------------------------------------------------

export type MySubmission = {
  id: string;
  assignmentId: string;
  content: string | null;
  submittedAt: string;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
};

/** The signed-in student's own submissions across a set of assignments —
 * scoped to `user_id = auth.uid()` by RLS regardless of what's asked for,
 * so this is always safe to call with every assignment id in a course. */
export async function fetchMySubmissions(assignmentIds: string[]): Promise<ListResult<MySubmission>> {
  if (!assignmentIds.length) return { data: [], error: null };
  const { data, error } = await supabase
    .from("submissions")
    .select("id, assignment_id, content, submitted_at, score, feedback, graded_at")
    .in("assignment_id", assignmentIds);
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    assignmentId: row.assignment_id,
    content: row.content,
    submittedAt: row.submitted_at,
    score: row.score,
    feedback: row.feedback,
    gradedAt: row.graded_at,
  }));
  return { data: rows, error: null };
}

/** Creates or replaces the student's own submission for an assignment.
 * RLS enforces the insert requires the assignment to be published and the
 * caller enrolled; the update branch (when a submission already exists)
 * requires it isn't graded yet — a graded submission surfaces a specific,
 * friendly error instead of the raw Postgres permission-denied message. */
export async function submitAssignment(
  assignmentId: string,
  content: string,
): Promise<{ error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { error: "You need to be signed in to submit." };

  const { error } = await supabase.from("submissions").upsert(
    {
      assignment_id: assignmentId,
      user_id: userId,
      content,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "assignment_id,user_id" },
  );

  if (error) {
    if (error.code === "42501") {
      return {
        error: "This assignment has already been graded, so it can no longer be resubmitted.",
      };
    }
    return { error: error.message };
  }
  return { error: null };
}

// ---------------------------------------------------------------------------
// Quizzes — taking one (student side of the Quizzes tab)
// ---------------------------------------------------------------------------

export type AttemptQuestion = {
  id: string;
  questionType: QuestionType;
  prompt: string;
  options: QuizOption[];
  points: number;
  sortOrder: number;
};

/** Reads through the quiz_questions_for_attempt() RPC rather than the
 * quiz_questions table directly — that RPC hardcodes a column list that
 * never includes correct_answer, so there is no query shape a student
 * could construct here that leaks the answer key (see the migration
 * comment above its definition in 20260822120000_teacher_dashboard_schema
 * .sql). The cast mirrors the same pattern already used for
 * course_lesson_previews() in academy.courses.$slug.tsx: this RPC predates
 * the generated Database types, so its signature isn't in types.ts. */
export async function fetchQuizQuestionsForAttempt(
  quizId: string,
): Promise<ListResult<AttemptQuestion>> {
  const { data, error } = await (
    supabase.rpc as unknown as (
      fn: "quiz_questions_for_attempt",
      args: { _quiz_id: string },
    ) => Promise<{
      data:
        | {
            id: string;
            quiz_id: string;
            question_type: string;
            prompt: string;
            options: Json;
            points: number;
            sort_order: number;
          }[]
        | null;
      error: { message: string } | null;
    }>
  )("quiz_questions_for_attempt", { _quiz_id: quizId });
  if (error) return { data: [], error: error.message };

  const rows = (data ?? [])
    .map((row) => ({
      id: row.id,
      questionType: row.question_type as QuestionType,
      prompt: row.prompt,
      options: (row.options as unknown as QuizOption[]) ?? [],
      points: Number(row.points),
      sortOrder: Number(row.sort_order),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return { data: rows, error: null };
}

export type MyQuizAttempt = {
  id: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  maxScore: number | null;
  answers: Record<string, Json>;
};

/** The signed-in student's own attempts at one quiz, most recent first. */
export async function fetchMyQuizAttempts(quizId: string): Promise<ListResult<MyQuizAttempt>> {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("id, attempt_number, started_at, submitted_at, score, max_score, answers")
    .eq("quiz_id", quizId)
    .order("attempt_number", { ascending: false });
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    attemptNumber: row.attempt_number,
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
    score: row.score,
    maxScore: row.max_score,
    answers: (row.answers as Record<string, Json>) ?? {},
  }));
  return { data: rows, error: null };
}

/** Starts a new attempt. The before-insert trigger on quiz_attempts
 * (enforce_quiz_attempt_and_number) is the actual source of truth for
 * "is this quiz published" and "has max_attempts been reached" — it
 * raises a Postgres exception in either case, which this turns into the
 * message shown to the student rather than a raw SQL error. */
export async function startQuizAttempt(
  quizId: string,
): Promise<{ data: { id: string; attemptNumber: number; startedAt: string } | null; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { data: null, error: "You need to be signed in to start a quiz." };

  const { data, error } = await supabase
    .from("quiz_attempts")
    .insert({ quiz_id: quizId, user_id: userId })
    .select("id, attempt_number, started_at")
    .single();
  if (error) return { data: null, error: error.message };
  return {
    data: { id: data.id, attemptNumber: data.attempt_number, startedAt: data.started_at },
    error: null,
  };
}

/** Saves in-progress answers without submitting — allowed while
 * submitted_at is still null (see the "Students update their own
 * in-progress attempt" RLS policy). */
export async function saveQuizProgress(
  attemptId: string,
  answers: Record<string, Json>,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("quiz_attempts")
    .update({ answers: answers as unknown as Json })
    .eq("id", attemptId);
  return { error: error?.message ?? null };
}

/** Submits the attempt for grading. Score/max_score are entirely
 * server-computed by the before-update grading trigger — nothing this
 * function sends for those columns would be trusted even if it tried. */
export async function submitQuizAttempt(
  attemptId: string,
  answers: Record<string, Json>,
): Promise<{ data: { score: number; maxScore: number } | null; error: string | null }> {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .update({ answers: answers as unknown as Json, submitted_at: new Date().toISOString() })
    .eq("id", attemptId)
    .select("score, max_score")
    .single();
  if (error) return { data: null, error: error.message };
  return { data: { score: Number(data.score ?? 0), maxScore: Number(data.max_score ?? 0) }, error: null };
}
