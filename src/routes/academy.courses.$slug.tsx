import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Lock,
  Timer,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
import { Btn, EmptyState, ErrorNotice, Meter, Panel, Spinner, Tag } from "@/academy/components/ui";
import {
  fetchCourseAssignments,
  fetchCourseMaterials,
  fetchCourseQuizzes,
  materialDownloadUrl,
  type Assignment,
  type Material,
  type Quiz,
} from "@/academy/lib/teaching";
import {
  fetchMyQuizAttempts,
  fetchMySubmissions,
  fetchQuizQuestionsForAttempt,
  saveQuizProgress,
  startQuizAttempt,
  submitAssignment,
  submitQuizAttempt,
  type AttemptQuestion,
  type MyQuizAttempt,
  type MySubmission,
} from "@/academy/lib/learning";
import type { Json } from "@/integrations/supabase/types";
import "@/academy/academy.css";

// `course_lesson_previews` is a security-definer RPC added in migration
// 20260821090000_lock_lesson_content.sql -- it isn't in the generated
// Database types yet (regenerate with `supabase gen types typescript`
// once the migration has run against the project). Typed narrowly here
// rather than widening the whole client's typing; call it exactly like
// `supabase.from(...)` elsewhere in this file, just through this cast.
function fetchLessonPreviews(courseId: string) {
  return (
    supabase.rpc as unknown as (
      fn: "course_lesson_previews",
      args: { _course_id: string },
    ) => Promise<{ data: LessonPreview[] | null; error: unknown }>
  )("course_lesson_previews", { _course_id: courseId });
}

export const Route = createFileRoute("/academy/courses/$slug")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Course | Quantum Basics Academy" },
      {
        name: "description",
        content:
          "Work through the lessons in this Quantum Basics Academy course and mark your progress as you go.",
      },
      { property: "og:title", content: "Quantum Basics Academy course" },
      {
        property: "og:description",
        content: "Lesson-by-lesson online training from Quantum Basics Academy.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursePage,
});

type Course = {
  id: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  duration: string;
};

type LessonPreview = { id: string; title: string; minutes: number; sort_order: number };
type LessonBody = { id: string; body: string };
type Tab = "lessons" | "materials" | "assignments" | "quizzes";

const TABS: { key: Tab; label: string }[] = [
  { key: "lessons", label: "Lessons" },
  { key: "materials", label: "Materials" },
  { key: "assignments", label: "Assignments" },
  { key: "quizzes", label: "Quizzes" },
];

function CoursePage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [previews, setPreviews] = useState<LessonPreview[]>([]);
  // Lesson body content, keyed by lesson id. Only ever populated for
  // enrolled students / course staff -- RLS enforces this server-side too
  // (see migration 20260821090000_lock_lesson_content.sql), this is just
  // the client-side reflection of that: unlocked() below gates the UI.
  const [bodies, setBodies] = useState<Map<string, string>>(new Map());
  const [done, setDone] = useState<Set<string>>(new Set());
  const [enrolled, setEnrolled] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("lessons");

  // `enrolled` reflects this user's own enrollment row and drives the
  // enrol button / progress meter. Course staff, super admins, and
  // auditors are never "enrolled" as a student, but RLS still lets them
  // read lesson bodies (see migration 20260821090000_lock_lesson_content.sql).
  // `bodies` only ever gets populated when that select actually returns
  // rows, so use it -- not personal enrollment -- as the signal for
  // whether the content itself is unlocked.
  const unlocked = enrolled || bodies.size > 0;

  const load = useCallback(async () => {
    const { data: c } = await supabase
      .from("courses")
      .select("id, title, summary, track, level, duration")
      .eq("slug", slug)
      .maybeSingle();
    if (!c) {
      setLoading(false);
      return;
    }
    setCourse(c);

    // Safe for anyone: titles + durations only, no lesson body.
    const { data: ls } = await fetchLessonPreviews(c.id);
    const sorted = [...(ls ?? [])].sort((a, b) => a.sort_order - b.sort_order);
    setPreviews(sorted);
    setActive((prev) => prev ?? sorted[0]?.id ?? null);

    const user = await getCurrentUser();
    setSignedIn(Boolean(user));
    if (user) {
      const { data: e } = await supabase
        .from("enrollments")
        .select("id")
        .eq("course_id", c.id)
        .eq("user_id", user.id)
        .maybeSingle();
      const isEnrolled = Boolean(e);
      setEnrolled(isEnrolled);

      // Lesson body is RLS-gated to enrolled students / course staff /
      // admins / auditors. This select naturally comes back empty for
      // anyone else, but only attempt it once there's a signed-in user to
      // avoid an unnecessary round trip for anonymous visitors.
      const { data: full } = await supabase.from("lessons").select("id, body").eq("course_id", c.id);
      if (full?.length) {
        setBodies(new Map(full.map((l: LessonBody) => [l.id, l.body])));
      }

      const ids = sorted.map((l) => l.id);
      if (ids.length) {
        const { data: p } = await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("user_id", user.id)
          .in("lesson_id", ids);
        setDone(new Set((p ?? []).map((r) => r.lesson_id)));
      }
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    void load();
  }, [load]);

  async function enrol() {
    if (!course) return;
    const user = await getCurrentUser();
    if (!user) {
      navigate({ to: "/academy/auth" });
      return;
    }
    setBusy(true);
    await supabase.from("enrollments").insert({ user_id: user.id, course_id: course.id });
    setEnrolled(true);
    // Now that the enrollment row exists, RLS grants access to lesson
    // bodies -- fetch them so the newly-unlocked lessons render immediately
    // instead of waiting on the next full reload.
    const { data: full } = await supabase.from("lessons").select("id, body").eq("course_id", course.id);
    if (full?.length) {
      setBodies(new Map(full.map((l: LessonBody) => [l.id, l.body])));
    }
    setBusy(false);
  }

  async function toggleLesson(lessonId: string) {
    const user = await getCurrentUser();
    if (!user) {
      navigate({ to: "/academy/auth" });
      return;
    }
    if (done.has(lessonId)) {
      await supabase.from("lesson_progress").delete().eq("lesson_id", lessonId);
      setDone((prev) => {
        const next = new Set(prev);
        next.delete(lessonId);
        return next;
      });
    } else {
      await supabase
        .from("lesson_progress")
        .insert({ user_id: user.id, lesson_id: lessonId });
      setDone((prev) => new Set(prev).add(lessonId));
    }
  }

  if (loading) {
    return (
      <div>
        <Spinner label="Loading course…" />
      </div>
    );
  }

  if (!course) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Course not found</h1>
        <Link to="/academy/courses" className="mt-4 inline-block text-sm font-semibold text-primary">
          Back to the catalogue
        </Link>
      </div>
    );
  }

  const pct = previews.length ? Math.round((done.size / previews.length) * 100) : 0;
  const activeIndex = previews.findIndex((l) => l.id === active);
  const activeLesson = activeIndex >= 0 ? previews[activeIndex] : null;
  const activeBody = activeLesson ? bodies.get(activeLesson.id) : undefined;
  const activeDone = activeLesson ? done.has(activeLesson.id) : false;
  const prevLesson = activeIndex > 0 ? previews[activeIndex - 1] : null;
  const nextLesson =
    activeIndex >= 0 && activeIndex < previews.length - 1 ? previews[activeIndex + 1] : null;

  return (
    <div>
      <Link
        to="/academy/courses"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All courses
      </Link>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Tag>{course.track}</Tag>
          <h1 className="mt-3 text-2xl md:text-[1.75rem]">{course.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {course.summary}
          </p>
        </div>
        {enrolled ? (
          <span className="qa-label rounded border border-primary/25 bg-primary/8 px-3 py-1.5 text-primary">
            Enrolled · {pct}% complete
          </span>
        ) : (
          <Btn onClick={enrol} disabled={busy}>
            {signedIn ? "Enrol in this course" : "Sign in to enrol"}
          </Btn>
        )}
      </div>

      {enrolled ? (
        <div className="mt-6 max-w-md">
          <Meter percent={pct} />
          <p className="mt-2 text-xs text-muted-foreground">
            {done.size} of {previews.length} lessons complete
          </p>
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-1.5 border-b border-[var(--qa-line)] pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-t px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "lessons" ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[19rem_1fr]">
          {/* Lesson list / navigation rail */}
          <nav aria-label="Lessons">
            <ol className="space-y-1.5">
              {previews.map((lesson, i) => {
                const isDone = done.has(lesson.id);
                const isActive = active === lesson.id;
                return (
                  <li key={lesson.id}>
                    <button
                      type="button"
                      onClick={() => setActive(lesson.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors ${
                        isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                      }`}
                    >
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-semibold ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : "border border-[var(--qa-line)] text-muted-foreground"
                        }`}
                      >
                        {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 truncate font-medium">
                          {lesson.title}
                          {!unlocked ? <Lock className="h-3 w-3 shrink-0 text-muted-foreground" /> : null}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" /> {lesson.minutes} min
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Active lesson content */}
          <Panel>
            {activeLesson ? (
              <>
                <p className="qa-label text-muted-foreground">
                  Lesson {activeIndex + 1} of {previews.length} · {activeLesson.minutes} min
                </p>
                <h2 className="mt-2 text-lg font-semibold">{activeLesson.title}</h2>

                {unlocked && activeBody ? (
                  <>
                    <div className="qa-prose mt-4">
                      <p>{activeBody}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Btn
                        variant={activeDone ? "outline" : "solid"}
                        onClick={() => toggleLesson(activeLesson.id)}
                      >
                        {activeDone ? "Mark as not complete" : "Mark lesson complete"}
                      </Btn>
                    </div>
                  </>
                ) : (
                  <div className="mt-4 flex flex-col items-start gap-3">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Lock className="h-4 w-4" />
                      {signedIn
                        ? "Enrol in this course to unlock the full lesson."
                        : "Sign in and enrol in this course to unlock the full lesson."}
                    </p>
                    <Btn onClick={enrol} disabled={busy}>
                      {signedIn ? "Enrol in this course" : "Sign in to enrol"}
                    </Btn>
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between border-t border-[var(--qa-line)] pt-5">
                  <button
                    type="button"
                    disabled={!prevLesson}
                    onClick={() => prevLesson && setActive(prevLesson.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <button
                    type="button"
                    disabled={!nextLesson}
                    onClick={() => nextLesson && setActive(nextLesson.id)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">This course has no lessons yet.</p>
            )}
          </Panel>
        </div>
      ) : null}

      {tab === "materials" ? (
        <div className="mt-8">
          {unlocked ? (
            <MaterialsTab courseId={course.id} />
          ) : (
            <LockedTab signedIn={signedIn} onEnrol={enrol} busy={busy} what="materials" />
          )}
        </div>
      ) : null}

      {tab === "assignments" ? (
        <div className="mt-8">
          {unlocked ? (
            <AssignmentsTab courseId={course.id} />
          ) : (
            <LockedTab signedIn={signedIn} onEnrol={enrol} busy={busy} what="assignments" />
          )}
        </div>
      ) : null}

      {tab === "quizzes" ? (
        <div className="mt-8">
          {unlocked ? (
            <QuizzesTab courseId={course.id} />
          ) : (
            <LockedTab signedIn={signedIn} onEnrol={enrol} busy={busy} what="quizzes" />
          )}
        </div>
      ) : null}
    </div>
  );
}

function LockedTab({
  signedIn,
  busy,
  onEnrol,
  what,
}: {
  signedIn: boolean;
  busy: boolean;
  onEnrol: () => void;
  what: string;
}) {
  return (
    <Panel className="flex flex-col items-start gap-3">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Lock className="h-4 w-4" />
        {signedIn
          ? `Enrol in this course to see its ${what}.`
          : `Sign in and enrol in this course to see its ${what}.`}
      </p>
      <Btn onClick={onEnrol} disabled={busy}>
        {signedIn ? "Enrol in this course" : "Sign in to enrol"}
      </Btn>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Materials tab
// ---------------------------------------------------------------------------

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function MaterialsTab({ courseId }: { courseId: string }) {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchCourseMaterials(courseId);
    setMaterials(data);
    setError(error);
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDownload(material: Material) {
    setDownloadError(null);
    const { url, error } = await materialDownloadUrl(material.storagePath);
    if (error) {
      setDownloadError(error);
      return;
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  if (materials === null) return <Spinner label="Loading materials…" />;
  if (error) return <ErrorNotice message={error} onRetry={() => void load()} />;
  if (materials.length === 0) {
    return (
      <EmptyState
        title="No materials yet"
        body="Your instructor hasn't uploaded any slides, handouts or reference files for this course."
      />
    );
  }

  return (
    <div className="space-y-3">
      {downloadError ? <ErrorNotice message={downloadError} /> : null}
      {materials.map((m) => (
        <Panel key={m.id} className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{m.title}</p>
              {m.description ? (
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{m.description}</p>
              ) : null}
              <p className="qa-label mt-1 text-muted-foreground">{formatBytes(m.sizeBytes)}</p>
            </div>
          </div>
          <Btn variant="outline" onClick={() => handleDownload(m)} className="shrink-0">
            <Download className="h-4 w-4" /> Download
          </Btn>
        </Panel>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Assignments tab
// ---------------------------------------------------------------------------

function AssignmentsTab({ courseId }: { courseId: string }) {
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Map<string, MySubmission>>(new Map());
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data: assignmentRows, error: assignmentsError } = await fetchCourseAssignments(courseId);
    setAssignments(assignmentRows);
    setError(assignmentsError);
    if (assignmentsError) return;

    const { data: subRows, error: subError } = await fetchMySubmissions(
      assignmentRows.map((a) => a.id),
    );
    if (subError) {
      setError(subError);
      return;
    }
    setSubmissions(new Map(subRows.map((s) => [s.assignmentId, s])));
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (assignments === null) return <Spinner label="Loading assignments…" />;
  if (error) return <ErrorNotice message={error} onRetry={() => void load()} />;
  if (assignments.length === 0) {
    return (
      <EmptyState
        title="No assignments yet"
        body="Your instructor hasn't posted any assignments for this course."
      />
    );
  }

  return (
    <div className="space-y-3">
      {assignments.map((a) => (
        <AssignmentCard
          key={a.id}
          assignment={a}
          submission={submissions.get(a.id) ?? null}
          open={openId === a.id}
          onToggle={() => setOpenId((prev) => (prev === a.id ? null : a.id))}
          onSubmitted={() => void load()}
        />
      ))}
    </div>
  );
}

function AssignmentCard({
  assignment,
  submission,
  open,
  onToggle,
  onSubmitted,
}: {
  assignment: Assignment;
  submission: MySubmission | null;
  open: boolean;
  onToggle: () => void;
  onSubmitted: () => void;
}) {
  const [content, setContent] = useState(submission?.content ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const graded = submission?.gradedAt != null;
  const isPastDue = assignment.dueAt ? new Date(assignment.dueAt).getTime() < Date.now() : false;

  useEffect(() => {
    setContent(submission?.content ?? "");
  }, [submission?.content]);

  async function handleSubmit() {
    setBusy(true);
    setError(null);
    const { error } = await submitAssignment(assignment.id, content.trim());
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    onSubmitted();
  }

  return (
    <Panel>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">{assignment.title}</h3>
            {graded ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Graded · {submission!.score}/
                {assignment.maxScore}
              </span>
            ) : submission ? (
              <Tag>Submitted</Tag>
            ) : isPastDue ? (
              <Tag>Past due</Tag>
            ) : (
              <Tag>Not submitted</Tag>
            )}
          </div>
          {assignment.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{assignment.description}</p>
          ) : null}
          <p className="qa-label mt-2 text-muted-foreground">
            {assignment.dueAt ? `Due ${new Date(assignment.dueAt).toLocaleString()}` : "No due date"} ·{" "}
            {assignment.maxScore} pts
          </p>
        </div>
      </button>

      {open ? (
        <div className="mt-4 border-t border-[var(--qa-line)] pt-4">
          {assignment.instructions ? (
            <p className="qa-prose mb-4 text-sm text-muted-foreground">{assignment.instructions}</p>
          ) : null}

          {graded && submission?.feedback ? (
            <div className="mb-4 rounded border border-primary/20 bg-primary/5 p-3 text-sm">
              <p className="qa-label text-primary">Feedback</p>
              <p className="mt-1 whitespace-pre-wrap">{submission.feedback}</p>
            </div>
          ) : null}

          <label className="block">
            <span className="qa-label text-muted-foreground">Your response</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={graded}
              rows={6}
              placeholder="Write your submission here…"
              className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25 disabled:opacity-60"
            />
          </label>

          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}

          {!graded ? (
            <div className="mt-3">
              <Btn onClick={handleSubmit} disabled={busy || !content.trim()}>
                {busy ? "Submitting…" : submission ? "Resubmit" : "Submit"}
              </Btn>
            </div>
          ) : null}
        </div>
      ) : null}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Quizzes tab
// ---------------------------------------------------------------------------

function QuizzesTab({ courseId }: { courseId: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [takingQuiz, setTakingQuiz] = useState<Quiz | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchCourseQuizzes(courseId);
    setQuizzes(data);
    setError(error);
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (takingQuiz) {
    return <QuizAttemptView quiz={takingQuiz} onExit={() => setTakingQuiz(null)} />;
  }

  if (quizzes === null) return <Spinner label="Loading quizzes…" />;
  if (error) return <ErrorNotice message={error} onRetry={() => void load()} />;
  if (quizzes.length === 0) {
    return (
      <EmptyState title="No quizzes yet" body="Your instructor hasn't published a quiz for this course." />
    );
  }

  return (
    <div className="space-y-3">
      {quizzes.map((q) => (
        <QuizCard key={q.id} quiz={q} onStart={() => setTakingQuiz(q)} />
      ))}
    </div>
  );
}

function QuizCard({ quiz, onStart }: { quiz: Quiz; onStart: () => void }) {
  const [attempts, setAttempts] = useState<MyQuizAttempt[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchMyQuizAttempts(quiz.id);
    setAttempts(data);
    setError(error);
  }, [quiz.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitted = (attempts ?? []).filter((a) => a.submittedAt);
  const inProgress = (attempts ?? []).find((a) => !a.submittedAt);
  const best = submitted.reduce<MyQuizAttempt | null>((top, a) => {
    if (a.score === null) return top;
    if (!top || (top.score ?? -1) < a.score) return a;
    return top;
  }, null);
  const attemptsUsed = attempts?.length ?? 0;
  const attemptsExhausted = quiz.maxAttempts != null && attemptsUsed >= quiz.maxAttempts && !inProgress;

  return (
    <Panel className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h3 className="font-semibold">{quiz.title}</h3>
        {quiz.description ? (
          <p className="mt-1 text-sm text-muted-foreground">{quiz.description}</p>
        ) : null}
        <p className="qa-label mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Timer className="h-3 w-3" />
            {quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} min limit` : "No time limit"}
          </span>
          <span>
            {quiz.maxAttempts
              ? `${attemptsUsed}/${quiz.maxAttempts} attempts used`
              : `${attemptsUsed} attempt${attemptsUsed === 1 ? "" : "s"} so far`}
          </span>
          {best ? (
            <span className="font-semibold text-primary">
              Best: {best.score}/{best.maxScore}
            </span>
          ) : null}
        </p>
        {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
      </div>
      <Btn onClick={onStart} disabled={attemptsExhausted} className="shrink-0">
        {inProgress ? "Continue attempt" : attemptsExhausted ? "No attempts left" : "Start quiz"}
      </Btn>
    </Panel>
  );
}

function QuizAttemptView({ quiz, onExit }: { quiz: Quiz; onExit: () => void }) {
  const [phase, setPhase] = useState<"loading" | "error" | "active" | "submitted">("loading");
  const [error, setError] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AttemptQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, Json>>({});
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ score: number; maxScore: number } | null>(null);
  const [deadline, setDeadline] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    async function begin() {
      // Resume an in-progress attempt if one already exists, rather than
      // always starting a fresh one -- a student who navigates away and
      // back shouldn't lose their place or burn another attempt.
      const [existingRes, questionsRes] = await Promise.all([
        fetchMyQuizAttempts(quiz.id),
        fetchQuizQuestionsForAttempt(quiz.id),
      ]);
      if (cancelled) return;
      if (questionsRes.error) {
        setError(questionsRes.error);
        setPhase("error");
        return;
      }
      setQuestions(questionsRes.data);

      const existing = existingRes.data.find((a) => !a.submittedAt);
      if (existing) {
        setAttemptId(existing.id);
        setAnswers(existing.answers);
        if (quiz.timeLimitMinutes) {
          setDeadline(new Date(existing.startedAt).getTime() + quiz.timeLimitMinutes * 60_000);
        }
        setPhase("active");
        return;
      }

      const { data, error } = await startQuizAttempt(quiz.id);
      if (cancelled) return;
      if (error || !data) {
        setError(error ?? "Couldn't start the attempt.");
        setPhase("error");
        return;
      }
      setAttemptId(data.id);
      if (quiz.timeLimitMinutes) {
        setDeadline(new Date(data.startedAt).getTime() + quiz.timeLimitMinutes * 60_000);
      }
      setPhase("active");
    }
    void begin();
    return () => {
      cancelled = true;
    };
  }, [quiz.id, quiz.timeLimitMinutes]);

  const submit = useCallback(async () => {
    if (!attemptId || busy) return;
    setBusy(true);
    const { data, error } = await submitQuizAttempt(attemptId, answers);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    setResult(data);
    setPhase("submitted");
  }, [attemptId, answers, busy]);

  // Client-side countdown only -- there is no server-side enforcement of
  // time_limit_minutes (a late-but-genuine submit isn't currently
  // rejected), this just auto-submits so a student can't sit on an
  // unlimited-feeling attempt once time is technically up.
  useEffect(() => {
    if (phase !== "active" || !deadline) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [phase, deadline]);

  useEffect(() => {
    if (phase === "active" && deadline && now >= deadline) {
      void submit();
    }
  }, [phase, deadline, now, submit]);

  useEffect(() => {
    if (!attemptId || phase !== "active") return;
    const timeout = setTimeout(() => {
      void saveQuizProgress(attemptId, answers);
    }, 800);
    return () => clearTimeout(timeout);
  }, [attemptId, answers, phase]);

  function setAnswer(questionId: string, value: Json) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }

  async function handleSaveAndExit() {
    if (attemptId) {
      setBusy(true);
      await saveQuizProgress(attemptId, answers);
      setBusy(false);
    }
    onExit();
  }

  if (phase === "loading") return <Spinner label="Preparing your attempt…" />;
  if (phase === "error") {
    return (
      <div>
        <ErrorNotice message={error ?? "Something went wrong."} />
        <div className="mt-4">
          <Btn variant="outline" onClick={onExit}>
            <ArrowLeft className="h-4 w-4" /> Back to quizzes
          </Btn>
        </div>
      </div>
    );
  }

  if (phase === "submitted" && result) {
    const percent = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
    return (
      <Panel className="text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-3 text-lg font-semibold">Quiz submitted</h2>
        <p className="mt-1 text-3xl font-semibold tracking-tight">
          {result.score}/{result.maxScore}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{percent}%</p>
        <Btn variant="outline" onClick={onExit} className="mt-6">
          Back to quizzes
        </Btn>
      </Panel>
    );
  }

  const remainingMs = deadline ? deadline - now : null;
  const remainingLabel =
    remainingMs !== null
      ? `${Math.max(0, Math.floor(remainingMs / 60000))}:${String(
          Math.max(0, Math.floor((remainingMs % 60000) / 1000)),
        ).padStart(2, "0")}`
      : null;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{quiz.title}</h2>
          <p className="qa-label mt-1 text-muted-foreground">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </p>
        </div>
        {remainingLabel ? (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold ${
              remainingMs !== null && remainingMs < 60_000
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : "border-primary/25 bg-primary/8 text-primary"
            }`}
          >
            <Timer className="h-3.5 w-3.5" /> {remainingLabel}
          </span>
        ) : null}
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <Panel key={q.id}>
            <p className="qa-label text-muted-foreground">
              Question {i + 1} · {q.points} pt{q.points === 1 ? "" : "s"}
            </p>
            <p className="mt-1.5 font-medium">{q.prompt}</p>

            <div className="mt-4">
              {q.questionType === "short_answer" ? (
                <input
                  value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                  onChange={(e) => setAnswer(q.id, e.target.value)}
                  className="h-10 w-full max-w-sm rounded border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
                  placeholder="Your answer"
                />
              ) : q.questionType === "multiple_choice" ? (
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const selected = Array.isArray(answers[q.id])
                      ? (answers[q.id] as string[]).includes(opt.id)
                      : false;
                    return (
                      <label key={opt.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(e) => {
                            const current = Array.isArray(answers[q.id])
                              ? [...(answers[q.id] as string[])]
                              : [];
                            const next = e.target.checked
                              ? [...current, opt.id]
                              : current.filter((id) => id !== opt.id);
                            setAnswer(q.id, next);
                          }}
                        />
                        {opt.text}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {q.options.map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === opt.id}
                        onChange={() => setAnswer(q.id, opt.id)}
                      />
                      {opt.text}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        ))}
      </div>

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <div className="mt-6 flex items-center gap-3">
        <Btn onClick={submit} disabled={busy}>
          {busy ? "Submitting…" : "Submit quiz"}
        </Btn>
        <Btn variant="ghost" onClick={handleSaveAndExit} disabled={busy}>
          Save & exit
        </Btn>
      </div>
    </div>
  );
}
