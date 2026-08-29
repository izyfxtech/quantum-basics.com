import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
import type { CourseStaffRole } from "@/academy/lib/roles";
import type { Json, Tables, TablesUpdate } from "@/integrations/supabase/types";
import { validateUploadFile } from "@/lib/file-validation";

/** Shared result shape for read functions in this module: `error` is a
 * human-readable message when the query failed, `null` on success (even if
 * the result set is empty — an empty course legitimately has zero
 * materials/assignments/quizzes). Callers should treat "data is [] and
 * error is set" as a failed load, not an empty state, and offer a retry
 * rather than silently rendering "nothing here". */
export type ListResult<T> = { data: T[]; error: string | null };

// ---------------------------------------------------------------------------
// My courses
// ---------------------------------------------------------------------------

export type TeachingCourse = {
  id: string;
  slug: string;
  title: string;
  track: string;
  role: CourseStaffRole;
};

/** Courses the signed-in user is staffed on (instructor or TA). Deliberately
 * scoped to their own course_staff rows, not "every course" even for a
 * super admin without one — that's what /academy/admin is for. */
export async function fetchMyTeachingCourses(): Promise<ListResult<TeachingCourse>> {
  const user = await getCurrentUser();
  const userId = user?.id;
  if (!userId) return { data: [], error: null };

  const { data, error } = await supabase
    .from("course_staff")
    .select("role, courses(id, slug, title, track)")
    .eq("user_id", userId);
  if (error) return { data: [], error: error.message };

  const rows = (data ?? [])
    .map((row) => {
      const course = row.courses as {
        id: string;
        slug: string;
        title: string;
        track: string;
      } | null;
      if (!course) return null;
      return {
        id: course.id,
        slug: course.slug,
        title: course.title,
        track: course.track,
        role: row.role as CourseStaffRole,
      };
    })
    .filter((c): c is TeachingCourse => c !== null);
  return { data: rows, error: null };
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  instructions: string | null;
  dueAt: string | null;
  maxScore: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

const ASSIGNMENT_COLUMNS =
  "id, course_id, title, description, instructions, due_at, max_score, published, created_at, updated_at";

function mapAssignment(row: Tables<"assignments">): Assignment {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    description: row.description ?? "",
    instructions: row.instructions ?? null,
    dueAt: row.due_at ?? null,
    maxScore: Number(row.max_score),
    published: Boolean(row.published),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Every assignment row RLS lets the caller see for this course: for
 * students that's published + enrolled only, for course staff/admins it's
 * everything (including drafts) — the same query, filtered server-side,
 * so this is safe to call from both the teacher workspace and the student
 * course page. */
export async function fetchCourseAssignments(courseId: string): Promise<ListResult<Assignment>> {
  const { data, error } = await supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .eq("course_id", courseId)
    .order("due_at", { ascending: true, nullsFirst: false });
  if (error) return { data: [], error: error.message };
  return { data: ((data ?? []) as Tables<"assignments">[]).map(mapAssignment), error: null };
}

export async function createAssignment(input: {
  courseId: string;
  title: string;
  description: string;
  instructions: string | null;
  dueAt?: string | null;
  maxScore: number;
  published: boolean;
}): Promise<{ error: string | null }> {
  const user = await getCurrentUser();
  const { error } = await supabase.from("assignments").insert({
    course_id: input.courseId,
    title: input.title,
    description: input.description,
    instructions: input.instructions,
    due_at: input.dueAt || null,
    max_score: input.maxScore,
    published: input.published,
    created_by: user?.id ?? null,
  });
  return { error: error?.message ?? null };
}

export async function updateAssignment(
  id: string,
  patch: Partial<{
    title: string;
    description: string;
    instructions: string | null;
    dueAt: string | null;
    maxScore: number;
    published: boolean;
  }>,
): Promise<{ error: string | null }> {
  const row: TablesUpdate<"assignments"> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.instructions !== undefined) row.instructions = patch.instructions;
  if (patch.dueAt !== undefined) row.due_at = patch.dueAt;
  if (patch.maxScore !== undefined) row.max_score = patch.maxScore;
  if (patch.published !== undefined) row.published = patch.published;
  const { error } = await supabase.from("assignments").update(row).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteAssignment(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("assignments").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------------------------------------------------------------------------
// Submissions / gradebook
// ---------------------------------------------------------------------------

export type SubmissionRow = {
  submissionId: string | null; // null = student hasn't submitted yet
  userId: string;
  studentName: string | null;
  studentEmail: string | null;
  content: string | null;
  filePath: string | null;
  submittedAt: string | null;
  score: number | null;
  feedback: string | null;
  gradedAt: string | null;
};

/** Full gradebook row set for one assignment: every enrolled student, left-
 * joined against their submission (if any) so "not submitted" is visible
 * rather than just absent from the list. */
export async function fetchAssignmentGradebook(
  assignmentId: string,
  courseId: string,
): Promise<ListResult<SubmissionRow>> {
  const [rosterRes, submissionsRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("user_id, profiles(full_name, email)")
      .eq("course_id", courseId),
    supabase
      .from("submissions")
      .select("id, user_id, content, file_path, submitted_at, score, feedback, graded_at")
      .eq("assignment_id", assignmentId),
  ]);
  if (rosterRes.error) return { data: [], error: rosterRes.error.message };
  if (submissionsRes.error) return { data: [], error: submissionsRes.error.message };

  const byUser = new Map((submissionsRes.data ?? []).map((s) => [s.user_id, s]));

  const rows = (rosterRes.data ?? []).map((r) => {
    const profile = r.profiles as { full_name: string | null; email: string | null } | null;
    const sub = byUser.get(r.user_id);
    return {
      submissionId: sub?.id ?? null,
      userId: r.user_id,
      studentName: profile?.full_name ?? null,
      studentEmail: profile?.email ?? null,
      content: sub?.content ?? null,
      filePath: sub?.file_path ?? null,
      submittedAt: sub?.submitted_at ?? null,
      score: sub?.score ?? null,
      feedback: sub?.feedback ?? null,
      gradedAt: sub?.graded_at ?? null,
    };
  });
  return { data: rows, error: null };
}

export async function gradeSubmission(
  submissionId: string,
  input: { score: number; feedback: string },
): Promise<{ error: string | null }> {
  const user = await getCurrentUser();
  const { error } = await supabase
    .from("submissions")
    .update({
      score: input.score,
      feedback: input.feedback,
      graded_by: user?.id ?? null,
      graded_at: new Date().toISOString(),
    })
    .eq("id", submissionId);
  return { error: error?.message ?? null };
}

/** Clears a grade so the student can resubmit (RLS only lets students edit
 * their own submission while graded_at is null). */
export async function ungradeSubmission(submissionId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("submissions")
    .update({ score: null, feedback: null, graded_by: null, graded_at: null })
    .eq("id", submissionId);
  return { error: error?.message ?? null };
}

// ---------------------------------------------------------------------------
// Materials (Supabase Storage)
// ---------------------------------------------------------------------------

export type Material = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  storagePath: string;
  contentType: string | null;
  sizeBytes: number | null;
  createdAt: string;
};

const MATERIALS_BUCKET = "course-materials";

/** RLS-filtered the same way as fetchCourseAssignments above: staff see
 * everything for their course, enrolled students see the same rows (the
 * `materials_select` policy already covers both), so this one function
 * backs both the teacher workspace and the student course page. */
export async function fetchCourseMaterials(courseId: string): Promise<ListResult<Material>> {
  const { data, error } = await supabase
    .from("materials")
    .select("id, course_id, title, description, storage_path, content_type, size_bytes, created_at")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    description: row.description,
    storagePath: row.storage_path,
    contentType: row.content_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  }));
  return { data: rows, error: null };
}

/** Uploads to the private course-materials bucket at "{courseId}/{uuid}-
 * {filename}" (the storage RLS policies rely on courseId being the first
 * path segment — see 20260822130000_course_materials_storage.sql), then
 * records the metadata row the UI actually lists from. */
export async function uploadCourseMaterial(
  courseId: string,
  file: File,
  title: string,
  description: string,
): Promise<{ error: string | null }> {
  const sizeError = validateUploadFile(file);
  if (sizeError) return { error: sizeError };

  const user = await getCurrentUser();
  const path = `${courseId}/${crypto.randomUUID()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .upload(path, file, file.type ? { contentType: file.type } : {});
  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("materials").insert({
    course_id: courseId,
    title: title || file.name,
    description: description || null,
    storage_path: path,
    content_type: file.type || null,
    size_bytes: file.size,
    uploaded_by: user?.id ?? null,
  });
  if (insertError) {
    await supabase.storage.from(MATERIALS_BUCKET).remove([path]);
    return { error: insertError.message };
  }
  return { error: null };
}

export async function deleteCourseMaterial(
  material: Pick<Material, "id" | "storagePath">,
): Promise<{
  error: string | null;
}> {
  await supabase.storage.from(MATERIALS_BUCKET).remove([material.storagePath]);
  const { error } = await supabase.from("materials").delete().eq("id", material.id);
  return { error: error?.message ?? null };
}

/** Short-lived signed URL for downloading/viewing a private material. */
export async function materialDownloadUrl(
  storagePath: string,
): Promise<{ url: string | null; error: string | null }> {
  const { data, error } = await supabase.storage
    .from(MATERIALS_BUCKET)
    .createSignedUrl(storagePath, 600);
  if (error) return { url: null, error: error.message };
  return { url: data?.signedUrl ?? null, error: null };
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

export type Quiz = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes: number | null;
  maxAttempts: number | null;
  shuffleQuestions: boolean;
  published: boolean;
  dueAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const QUIZ_COLUMNS =
  "id, course_id, title, description, time_limit_minutes, max_attempts, shuffle_questions, published, due_at, created_at, updated_at";

function mapQuiz(row: Tables<"quizzes">): Quiz {
  return {
    id: row.id,
    courseId: row.course_id,
    title: row.title,
    description: row.description ?? "",
    timeLimitMinutes: row.time_limit_minutes ?? null,
    maxAttempts: row.max_attempts ?? null,
    shuffleQuestions: Boolean(row.shuffle_questions),
    published: Boolean(row.published),
    dueAt: row.due_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Same dual-purpose (staff + enrolled student) query pattern as
 * fetchCourseAssignments/fetchCourseMaterials above. */
export async function fetchCourseQuizzes(courseId: string): Promise<ListResult<Quiz>> {
  const { data, error } = await supabase
    .from("quizzes")
    .select(QUIZ_COLUMNS)
    .eq("course_id", courseId)
    .order("created_at");
  if (error) return { data: [], error: error.message };
  return { data: ((data ?? []) as Tables<"quizzes">[]).map(mapQuiz), error: null };
}

export async function createQuiz(input: {
  courseId: string;
  title: string;
  description: string;
  timeLimitMinutes: number | null;
  maxAttempts: number | null;
  shuffleQuestions: boolean;
  published: boolean;
  dueAt: string | null;
}): Promise<{ data: Quiz | null; error: string | null }> {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("quizzes")
    .insert({
      course_id: input.courseId,
      title: input.title,
      description: input.description,
      time_limit_minutes: input.timeLimitMinutes,
      max_attempts: input.maxAttempts,
      shuffle_questions: input.shuffleQuestions,
      published: input.published,
      due_at: input.dueAt,
      created_by: user?.id ?? null,
    })
    .select(QUIZ_COLUMNS)
    .single();
  return { data: data ? mapQuiz(data as Tables<"quizzes">) : null, error: error?.message ?? null };
}

export async function updateQuiz(
  id: string,
  patch: Partial<{
    title: string;
    description: string;
    timeLimitMinutes: number | null;
    maxAttempts: number | null;
    shuffleQuestions: boolean;
    published: boolean;
    dueAt: string | null;
  }>,
): Promise<{ error: string | null }> {
  const row: TablesUpdate<"quizzes"> = {};
  if (patch.title !== undefined) row.title = patch.title;
  if (patch.description !== undefined) row.description = patch.description;
  if (patch.timeLimitMinutes !== undefined) row.time_limit_minutes = patch.timeLimitMinutes;
  if (patch.maxAttempts !== undefined) row.max_attempts = patch.maxAttempts;
  if (patch.shuffleQuestions !== undefined) row.shuffle_questions = patch.shuffleQuestions;
  if (patch.published !== undefined) row.published = patch.published;
  if (patch.dueAt !== undefined) row.due_at = patch.dueAt;
  const { error } = await supabase.from("quizzes").update(row).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteQuiz(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------------------------------------------------------------------------
// Quiz question bank
// ---------------------------------------------------------------------------

export type QuestionType = "single_choice" | "multiple_choice" | "true_false" | "short_answer";
export type QuizOption = { id: string; text: string };

export type QuizQuestion = {
  id: string;
  quizId: string;
  questionType: QuestionType;
  prompt: string;
  options: QuizOption[];
  /** single_choice/true_false: option id string. multiple_choice: string[]
   * of option ids. short_answer: plain string, matched case-insensitively. */
  correctAnswer: Json;
  points: number;
  sortOrder: number;
};

const QUESTION_COLUMNS =
  "id, quiz_id, question_type, prompt, options, correct_answer, points, sort_order";

function mapQuestion(row: Tables<"quiz_questions">): QuizQuestion {
  return {
    id: row.id,
    quizId: row.quiz_id,
    questionType: row.question_type as QuestionType,
    prompt: row.prompt,
    options: (row.options as unknown as QuizOption[]) ?? [],
    correctAnswer: row.correct_answer,
    points: Number(row.points),
    sortOrder: Number(row.sort_order),
  };
}

/** Staff-only direct read of the question bank (includes correct_answer).
 * Students never call this — they go through the quiz_questions_for_attempt
 * RPC (see academy/lib/learning.ts), which is the only path that can't
 * leak an answer key. */
export async function fetchQuizQuestions(quizId: string): Promise<ListResult<QuizQuestion>> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select(QUESTION_COLUMNS)
    .eq("quiz_id", quizId)
    .order("sort_order");
  if (error) return { data: [], error: error.message };
  return { data: ((data ?? []) as Tables<"quiz_questions">[]).map(mapQuestion), error: null };
}

export async function createQuizQuestion(input: {
  quizId: string;
  questionType: QuestionType;
  prompt: string;
  options: QuizOption[];
  correctAnswer: Json;
  points: number;
  sortOrder: number;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from("quiz_questions").insert({
    quiz_id: input.quizId,
    question_type: input.questionType,
    prompt: input.prompt,
    options: input.options as unknown as Json,
    correct_answer: input.correctAnswer,
    points: input.points,
    sort_order: input.sortOrder,
  });
  return { error: error?.message ?? null };
}

export async function updateQuizQuestion(
  id: string,
  patch: Partial<{
    questionType: QuestionType;
    prompt: string;
    options: QuizOption[];
    correctAnswer: Json;
    points: number;
    sortOrder: number;
  }>,
): Promise<{ error: string | null }> {
  const row: TablesUpdate<"quiz_questions"> = {};
  if (patch.questionType !== undefined) row.question_type = patch.questionType;
  if (patch.prompt !== undefined) row.prompt = patch.prompt;
  if (patch.options !== undefined) row.options = patch.options as unknown as Json;
  if (patch.correctAnswer !== undefined) row.correct_answer = patch.correctAnswer;
  if (patch.points !== undefined) row.points = patch.points;
  if (patch.sortOrder !== undefined) row.sort_order = patch.sortOrder;
  const { error } = await supabase.from("quiz_questions").update(row).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deleteQuizQuestion(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
  return { error: error?.message ?? null };
}

// ---------------------------------------------------------------------------
// Quiz attempts (staff review)
// ---------------------------------------------------------------------------

export type QuizAttemptSummary = {
  id: string;
  userId: string;
  studentName: string | null;
  studentEmail: string | null;
  attemptNumber: number;
  startedAt: string;
  submittedAt: string | null;
  score: number | null;
  maxScore: number | null;
};

export async function fetchQuizAttempts(quizId: string): Promise<ListResult<QuizAttemptSummary>> {
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select(
      "id, user_id, attempt_number, started_at, submitted_at, score, max_score, profiles(full_name, email)",
    )
    .eq("quiz_id", quizId)
    .order("started_at", { ascending: false });
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => {
    const profile = row.profiles as { full_name: string | null; email: string | null } | null;
    return {
      id: row.id,
      userId: row.user_id,
      studentName: profile?.full_name ?? null,
      studentEmail: profile?.email ?? null,
      attemptNumber: row.attempt_number,
      startedAt: row.started_at,
      submittedAt: row.submitted_at,
      score: row.score,
      maxScore: row.max_score,
    };
  });
  return { data: rows, error: null };
}
