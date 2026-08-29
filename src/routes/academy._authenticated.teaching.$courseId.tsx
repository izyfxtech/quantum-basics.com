import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  GripVertical,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
import {
  Btn,
  EmptyState,
  ErrorNotice,
  FIELD_CLASS,
  Panel,
  PortalHeading,
  Spinner,
  Tag,
} from "@/academy/components/ui";
import {
  createAssignment,
  createQuiz,
  createQuizQuestion,
  deleteAssignment,
  deleteCourseMaterial,
  deleteQuiz,
  deleteQuizQuestion,
  fetchAssignmentGradebook,
  fetchCourseAssignments,
  fetchCourseMaterials,
  fetchCourseQuizzes,
  fetchQuizAttempts,
  fetchQuizQuestions,
  gradeSubmission,
  materialDownloadUrl,
  ungradeSubmission,
  updateAssignment,
  updateQuiz,
  updateQuizQuestion,
  uploadCourseMaterial,
  type Assignment,
  type Material,
  type QuestionType,
  type Quiz,
  type QuizAttemptSummary,
  type QuizOption,
  type QuizQuestion,
  type SubmissionRow,
} from "@/academy/lib/teaching";
import type { Json } from "@/integrations/supabase/types";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/_authenticated/teaching/$courseId")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Teaching | Quantum Basics Academy" }],
  }),
  beforeLoad: async ({ params }) => {
    // getCurrentUser() is cached (see that module), so this doesn't repeat
    // the parent route's own Auth check. The staff/admin lookup below is a
    // live per-navigation authorization check, same reasoning as admin.tsx.
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/academy/auth" });

    const [{ data: staffRow }, { data: adminRow }] = await Promise.all([
      supabase
        .from("course_staff")
        .select("id")
        .eq("course_id", params.courseId)
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "super_admin")
        .maybeSingle(),
    ]);
    if (!staffRow && !adminRow) throw redirect({ to: "/academy/teaching" });
  },
  component: TeachingCourseWorkspace,
});

type TabKey = "materials" | "assignments" | "gradebook" | "quizzes";
const TABS: { key: TabKey; label: string }[] = [
  { key: "materials", label: "Materials" },
  { key: "assignments", label: "Assignments" },
  { key: "gradebook", label: "Gradebook" },
  { key: "quizzes", label: "Quizzes" },
];

function TeachingCourseWorkspace() {
  const { courseId } = Route.useParams();
  const [course, setCourse] = useState<{ title: string; track: string } | null>(null);
  const [tab, setTab] = useState<TabKey>("materials");

  useEffect(() => {
    void supabase
      .from("courses")
      .select("title, track")
      .eq("id", courseId)
      .maybeSingle()
      .then(({ data }) => setCourse(data));
  }, [courseId]);

  return (
    <>
      <Link
        to="/academy/teaching"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> My courses
      </Link>

      <PortalHeading
        label={course?.track ?? "Academy"}
        title={course?.title ?? "Course workspace"}
        description="Manage materials, assignments, grading and quizzes for this course."
      />

      <div className="mb-6 flex flex-wrap gap-1.5 border-b border-[var(--qa-line)] pb-px">
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

      {tab === "materials" ? <MaterialsPanel courseId={courseId} /> : null}
      {tab === "assignments" ? <AssignmentsPanel courseId={courseId} /> : null}
      {tab === "gradebook" ? <GradebookPanel courseId={courseId} /> : null}
      {tab === "quizzes" ? <QuizzesPanel courseId={courseId} /> : null}
    </>
  );
}

function formatBytes(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

function MaterialsPanel({ courseId }: { courseId: string }) {
  const [materials, setMaterials] = useState<Material[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchCourseMaterials(courseId);
    setMaterials(data);
    setLoadError(error);
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setBusy(true);
    setError(null);
    const { error: uploadError } = await uploadCourseMaterial(
      courseId,
      file,
      title.trim(),
      description.trim(),
    );
    setBusy(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    setTitle("");
    setDescription("");
    setFile(null);
    (document.getElementById("material-file-input") as HTMLInputElement | null)?.value &&
      ((document.getElementById("material-file-input") as HTMLInputElement).value = "");
    void load();
  }

  async function handleDelete(material: Material) {
    if (!confirm(`Remove "${material.title}"?`)) return;
    const { error } = await deleteCourseMaterial(material);
    if (error) setError(error);
    void load();
  }

  async function handleDownload(material: Material) {
    const { url, error } = await materialDownloadUrl(material.storagePath);
    if (error) {
      setError(error);
      return;
    }
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Panel>
        <h2 className="text-base font-semibold">Upload material</h2>
        <form onSubmit={handleUpload} className="mt-4 grid gap-4">
          <label className="block">
            <span className="qa-label text-muted-foreground">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Module 3 slide deck"
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className="qa-label text-muted-foreground">Description (optional)</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
            />
          </label>
          <label className="block">
            <span className="qa-label text-muted-foreground">File</span>
            <input
              id="material-file-input"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
              className="mt-1.5 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-xs file:font-semibold"
            />
          </label>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Btn type="submit" disabled={busy || !file}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {busy ? "Uploading…" : "Upload"}
          </Btn>
        </form>
      </Panel>

      <div>
        {materials === null ? (
          <Spinner label="Loading materials…" />
        ) : loadError ? (
          <ErrorNotice message={loadError} onRetry={() => void load()} />
        ) : materials.length === 0 ? (
          <EmptyState
            title="No materials yet"
            body="Upload slides, handouts or reference files for this course."
          />
        ) : (
          <div className="space-y-3">
            {materials.map((m) => (
              <Panel key={m.id} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4 shrink-0 text-primary" />
                    {m.title}
                  </p>
                  {m.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                  ) : null}
                  <p className="qa-label mt-2 text-muted-foreground">
                    {formatBytes(m.sizeBytes)} · {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleDownload(m)}
                    aria-label="Download"
                    className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m)}
                    aria-label="Delete"
                    className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

function AssignmentsPanel({ courseId }: { courseId: string }) {
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Assignment | "new" | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchCourseAssignments(courseId);
    setAssignments(data);
    setLoadError(error);
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this assignment and all its submissions?")) return;
    const { error } = await deleteAssignment(id);
    if (error) setLoadError(error);
    void load();
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Btn onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> New assignment
        </Btn>
      </div>

      {editing ? (
        <AssignmentForm
          courseId={courseId}
          assignment={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            void load();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {assignments === null ? (
        <Spinner label="Loading assignments…" />
      ) : loadError ? (
        <ErrorNotice message={loadError} onRetry={() => void load()} />
      ) : assignments.length === 0 ? (
        <EmptyState
          title="No assignments yet"
          body="Create an assignment for students to submit work against."
        />
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => (
            <Panel key={a.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{a.title}</h3>
                  {!a.published ? <Tag>Draft</Tag> : null}
                </div>
                {a.description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.description}</p>
                ) : null}
                <p className="qa-label mt-2 text-muted-foreground">
                  {a.dueAt ? `Due ${new Date(a.dueAt).toLocaleString()}` : "No due date"} ·{" "}
                  {a.maxScore} pts
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Btn variant="outline" onClick={() => setEditing(a)}>
                  Edit
                </Btn>
                <button
                  type="button"
                  onClick={() => handleDelete(a.id)}
                  aria-label="Delete"
                  className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentForm({
  courseId,
  assignment,
  onDone,
  onCancel,
}: {
  courseId: string;
  assignment: Assignment | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(assignment?.title ?? "");
  const [description, setDescription] = useState(assignment?.description ?? "");
  const [instructions, setInstructions] = useState(assignment?.instructions ?? "");
  const [dueAt, setDueAt] = useState(assignment?.dueAt ? assignment.dueAt.slice(0, 16) : "");
  const [maxScore, setMaxScore] = useState(String(assignment?.maxScore ?? 100));
  const [published, setPublished] = useState(assignment?.published ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      instructions: instructions.trim() || null,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
      maxScore: Number(maxScore) || 0,
      published,
    };
    const { error: err } = assignment
      ? await updateAssignment(assignment.id, payload)
      : await createAssignment({ courseId, ...payload });
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    onDone();
  }

  return (
    <Panel className="mb-4">
      <h2 className="text-base font-semibold">
        {assignment ? "Edit assignment" : "New assignment"}
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="block">
          <span className="qa-label text-muted-foreground">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="qa-label text-muted-foreground">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>
        <label className="block">
          <span className="qa-label text-muted-foreground">Instructions (optional)</span>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="qa-label text-muted-foreground">Due date</span>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className="qa-label text-muted-foreground">Max score</span>
            <input
              type="number"
              min={0}
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published (visible to enrolled students)
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex gap-2">
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : assignment ? "Save changes" : "Create assignment"}
          </Btn>
          <Btn type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Btn>
        </div>
      </form>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Gradebook
// ---------------------------------------------------------------------------

function GradebookPanel({ courseId }: { courseId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentsError, setAssignmentsError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [rows, setRows] = useState<SubmissionRow[] | null>(null);
  const [rowsError, setRowsError] = useState<string | null>(null);

  useEffect(() => {
    void fetchCourseAssignments(courseId).then(({ data, error }) => {
      setAssignments(data);
      setAssignmentsError(error);
      const first = data[0];
      if (first && !selectedId) setSelectedId(first.id);
    });
    // Deliberately re-runs only when `courseId` changes -- `selectedId` is
    // read here just to avoid clobbering a selection the user already
    // made if this ever re-ran; it isn't meant to re-trigger the effect.
  }, [courseId]);

  const load = useCallback(async () => {
    if (!selectedId) return;
    const { data, error } = await fetchAssignmentGradebook(selectedId, courseId);
    setRows(data);
    setRowsError(error);
  }, [selectedId, courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (assignmentsError) {
    return (
      <ErrorNotice
        message={assignmentsError}
        onRetry={() => {
          setAssignmentsError(null);
          void fetchCourseAssignments(courseId).then(({ data, error }) => {
            setAssignments(data);
            setAssignmentsError(error);
          });
        }}
      />
    );
  }

  if (!assignments.length) {
    return (
      <EmptyState
        title="No assignments to grade yet"
        body="Create an assignment first, from the Assignments tab."
      />
    );
  }

  return (
    <div>
      <label className="mb-6 block max-w-sm">
        <span className="qa-label text-muted-foreground">Assignment</span>
        <select
          value={selectedId}
          onChange={(e) => {
            setSelectedId(e.target.value);
            setRows(null);
          }}
          className={FIELD_CLASS}
        >
          {assignments.map((a) => (
            <option key={a.id} value={a.id}>
              {a.title}
            </option>
          ))}
        </select>
      </label>

      {rows === null ? (
        <Spinner label="Loading submissions…" />
      ) : rowsError ? (
        <ErrorNotice message={rowsError} onRetry={() => void load()} />
      ) : rows.length === 0 ? (
        <EmptyState title="No enrolled students" body="No one is enrolled on this course yet." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <GradeRow key={row.userId} row={row} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}

function GradeRow({ row, onChanged }: { row: SubmissionRow; onChanged: () => void }) {
  const [score, setScore] = useState(row.score !== null ? String(row.score) : "");
  const [feedback, setFeedback] = useState(row.feedback ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const graded = row.gradedAt !== null;

  async function handleGrade() {
    if (!row.submissionId) return;
    setBusy(true);
    setError(null);
    const { error } = await gradeSubmission(row.submissionId, {
      score: Number(score) || 0,
      feedback: feedback.trim(),
    });
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    onChanged();
  }

  async function handleReopen() {
    if (!row.submissionId) return;
    setBusy(true);
    setError(null);
    const { error } = await ungradeSubmission(row.submissionId);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    onChanged();
  }

  return (
    <Panel>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{row.studentName || "Unnamed"}</p>
          <p className="text-sm text-muted-foreground">{row.studentEmail}</p>
        </div>
        {!row.submissionId ? (
          <Tag>Not submitted</Tag>
        ) : graded ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            <CheckCircle2 className="h-4 w-4" /> Graded
          </span>
        ) : (
          <Tag>Submitted</Tag>
        )}
      </div>

      {row.submissionId ? (
        <>
          {row.content ? (
            <p className="mt-3 whitespace-pre-wrap rounded border border-[var(--qa-line)] bg-secondary/40 p-3 text-sm">
              {row.content}
            </p>
          ) : null}
          {row.filePath ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Attached file: {row.filePath.split("/").pop()}
            </p>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-[120px_1fr]">
            <label className="block">
              <span className="qa-label text-muted-foreground">Score</span>
              <input
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                disabled={graded}
                className={FIELD_CLASS}
              />
            </label>
            <label className="block">
              <span className="qa-label text-muted-foreground">Feedback</span>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={graded}
                rows={2}
                className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25 disabled:opacity-60"
              />
            </label>
          </div>
          <div className="mt-3">
            {graded ? (
              <Btn variant="outline" onClick={handleReopen} disabled={busy}>
                {busy ? "…" : "Reopen for resubmission"}
              </Btn>
            ) : (
              <Btn onClick={handleGrade} disabled={busy}>
                {busy ? "Saving…" : "Save grade"}
              </Btn>
            )}
          </div>
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
        </>
      ) : null}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------

function QuizzesPanel({ courseId }: { courseId: string }) {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Quiz | "new" | null>(null);
  const [selected, setSelected] = useState<Quiz | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchCourseQuizzes(courseId);
    setQuizzes(data);
    setLoadError(error);
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this quiz, its questions and all attempts?")) return;
    const { error } = await deleteQuiz(id);
    if (error) setLoadError(error);
    if (selected?.id === id) setSelected(null);
    void load();
  }

  if (selected) {
    return (
      <QuizBuilder
        quiz={selected}
        onBack={() => setSelected(null)}
        onQuizUpdated={(q) => setSelected(q)}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Btn onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" /> New quiz
        </Btn>
      </div>

      {editing ? (
        <QuizForm
          courseId={courseId}
          quiz={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            void load();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : null}

      {quizzes === null ? (
        <Spinner label="Loading quizzes…" />
      ) : loadError ? (
        <ErrorNotice message={loadError} onRetry={() => void load()} />
      ) : quizzes.length === 0 ? (
        <EmptyState
          title="No quizzes yet"
          body="Create a CBT quiz — question bank, timing and attempt limits, auto-graded."
        />
      ) : (
        <div className="space-y-3">
          {quizzes.map((q) => (
            <Panel key={q.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{q.title}</h3>
                  {!q.published ? <Tag>Draft</Tag> : null}
                </div>
                <p className="qa-label mt-2 text-muted-foreground">
                  {q.timeLimitMinutes ? `${q.timeLimitMinutes} min limit` : "No time limit"} ·{" "}
                  {q.maxAttempts ? `${q.maxAttempts} attempts max` : "Unlimited attempts"}
                </p>
              </div>
              <div className="flex shrink-0 gap-1.5">
                <Btn variant="outline" onClick={() => setSelected(q)}>
                  Questions
                </Btn>
                <Btn variant="outline" onClick={() => setEditing(q)}>
                  Edit
                </Btn>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  aria-label="Delete"
                  className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

function QuizForm({
  courseId,
  quiz,
  onDone,
  onCancel,
}: {
  courseId: string;
  quiz: Quiz | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(quiz?.title ?? "");
  const [description, setDescription] = useState(quiz?.description ?? "");
  const [timeLimit, setTimeLimit] = useState(
    quiz?.timeLimitMinutes ? String(quiz.timeLimitMinutes) : "",
  );
  const [maxAttempts, setMaxAttempts] = useState(quiz?.maxAttempts ? String(quiz.maxAttempts) : "");
  const [shuffle, setShuffle] = useState(quiz?.shuffleQuestions ?? false);
  const [published, setPublished] = useState(quiz?.published ?? false);
  const [dueAt, setDueAt] = useState(quiz?.dueAt ? quiz.dueAt.slice(0, 16) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload = {
      title: title.trim(),
      description: description.trim(),
      timeLimitMinutes: timeLimit ? Number(timeLimit) : null,
      maxAttempts: maxAttempts ? Number(maxAttempts) : null,
      shuffleQuestions: shuffle,
      published,
      dueAt: dueAt ? new Date(dueAt).toISOString() : null,
    };
    const { error: err } = quiz
      ? await updateQuiz(quiz.id, payload)
      : await createQuiz({ courseId, ...payload });
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    onDone();
  }

  return (
    <Panel className="mb-4">
      <h2 className="text-base font-semibold">{quiz ? "Edit quiz" : "New quiz"}</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <label className="block">
          <span className="qa-label text-muted-foreground">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={FIELD_CLASS}
          />
        </label>
        <label className="block">
          <span className="qa-label text-muted-foreground">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="qa-label text-muted-foreground">Time limit (min)</span>
            <input
              type="number"
              min={0}
              placeholder="No limit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className="qa-label text-muted-foreground">Max attempts</span>
            <input
              type="number"
              min={0}
              placeholder="Unlimited"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
          <label className="block">
            <span className="qa-label text-muted-foreground">Due date</span>
            <input
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={shuffle} onChange={(e) => setShuffle(e.target.checked)} />
          Shuffle question order per attempt
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published (students can see and attempt it)
        </label>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex gap-2">
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : quiz ? "Save changes" : "Create quiz"}
          </Btn>
          <Btn type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Btn>
        </div>
      </form>
    </Panel>
  );
}

const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: "Single choice",
  multiple_choice: "Multiple choice",
  true_false: "True / False",
  short_answer: "Short answer",
};

function emptyOptions(): QuizOption[] {
  return [
    { id: crypto.randomUUID(), text: "" },
    { id: crypto.randomUUID(), text: "" },
  ];
}

function QuizBuilder({
  quiz,
  onBack,
  onQuizUpdated,
}: {
  quiz: Quiz;
  onBack: () => void;
  onQuizUpdated: (q: Quiz) => void;
}) {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [questionsError, setQuestionsError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<QuizAttemptSummary[] | null>(null);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);
  const [showAttempts, setShowAttempts] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await fetchQuizQuestions(quiz.id);
    setQuestions(data);
    setQuestionsError(error);
  }, [quiz.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const loadAttempts = useCallback(async () => {
    const { data, error } = await fetchQuizAttempts(quiz.id);
    setAttempts(data);
    setAttemptsError(error);
  }, [quiz.id]);

  useEffect(() => {
    if (showAttempts) void loadAttempts();
  }, [showAttempts, loadAttempts]);

  async function handleDeleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    const { error } = await deleteQuizQuestion(id);
    if (error) setQuestionsError(error);
    void load();
  }

  const totalPoints = (questions ?? []).reduce((sum, q) => sum + q.points, 0);

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All quizzes
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{quiz.title}</h2>
          <p className="qa-label mt-1 text-muted-foreground">
            {(questions ?? []).length} questions · {totalPoints} points ·{" "}
            {quiz.published ? "Published" : "Draft"}
          </p>
        </div>
        <div className="flex gap-2">
          <Btn variant="outline" onClick={() => setShowAttempts((v) => !v)}>
            {showAttempts ? "Hide attempts" : "View attempts"}
          </Btn>
          <Btn onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4" /> Add question
          </Btn>
        </div>
      </div>

      {showAttempts ? (
        <Panel className="mb-6">
          <h3 className="text-sm font-semibold">Attempts</h3>
          {attempts === null ? (
            <Spinner label="Loading attempts…" />
          ) : attemptsError ? (
            <ErrorNotice message={attemptsError} onRetry={() => void loadAttempts()} />
          ) : attempts.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">No attempts yet.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {attempts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between border-t border-[var(--qa-line)] py-2 text-sm first:border-t-0"
                >
                  <div>
                    <p className="font-medium">{a.studentName || a.studentEmail}</p>
                    <p className="qa-label text-muted-foreground">
                      Attempt {a.attemptNumber} · {a.submittedAt ? "Submitted" : "In progress"}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {a.score !== null ? `${a.score} / ${a.maxScore}` : "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      ) : null}

      {adding ? (
        <QuestionForm
          quizId={quiz.id}
          nextSortOrder={(questions ?? []).length}
          onDone={() => {
            setAdding(false);
            void load();
          }}
          onCancel={() => setAdding(false)}
        />
      ) : null}

      {questions === null ? (
        <Spinner label="Loading questions…" />
      ) : questionsError ? (
        <ErrorNotice message={questionsError} onRetry={() => void load()} />
      ) : questions.length === 0 ? (
        <EmptyState
          title="No questions yet"
          body="Add single choice, multiple choice, true/false or short answer questions."
        />
      ) : (
        <div className="space-y-3">
          {questions.map((q) =>
            editingId === q.id ? (
              <QuestionForm
                key={q.id}
                quizId={quiz.id}
                question={q}
                nextSortOrder={q.sortOrder}
                onDone={() => {
                  setEditingId(null);
                  void load();
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Panel key={q.id} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Tag>{QUESTION_TYPE_LABELS[q.questionType]}</Tag>
                    <span className="qa-label text-muted-foreground">{q.points} pts</span>
                  </div>
                  <p className="mt-2 text-sm font-medium">{q.prompt}</p>
                  {q.options.length ? (
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      {q.options.map((opt) => (
                        <li key={opt.id}>
                          {isCorrectOption(q, opt.id) ? "✓ " : "· "}
                          {opt.text}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Btn variant="outline" onClick={() => setEditingId(q.id)}>
                    Edit
                  </Btn>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(q.id)}
                    aria-label="Delete"
                    className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Panel>
            ),
          )}
        </div>
      )}
    </div>
  );
}

function isCorrectOption(q: QuizQuestion, optionId: string): boolean {
  if (q.questionType === "single_choice" || q.questionType === "true_false") {
    return q.correctAnswer === optionId;
  }
  if (q.questionType === "multiple_choice" && Array.isArray(q.correctAnswer)) {
    return (q.correctAnswer as string[]).includes(optionId);
  }
  return false;
}

function QuestionForm({
  quizId,
  question,
  nextSortOrder,
  onDone,
  onCancel,
}: {
  quizId: string;
  question?: QuizQuestion;
  nextSortOrder: number;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [questionType, setQuestionType] = useState<QuestionType>(
    question?.questionType ?? "single_choice",
  );
  const [prompt, setPrompt] = useState(question?.prompt ?? "");
  const [points, setPoints] = useState(String(question?.points ?? 1));
  const [options, setOptions] = useState<QuizOption[]>(
    question?.options.length ? question.options : emptyOptions(),
  );
  const [singleCorrect, setSingleCorrect] = useState<string>(
    question && question.questionType === "single_choice" ? (question.correctAnswer as string) : "",
  );
  const [multiCorrect, setMultiCorrect] = useState<string[]>(
    question && question.questionType === "multiple_choice"
      ? ((question.correctAnswer as string[]) ?? [])
      : [],
  );
  const [trueFalseCorrect, setTrueFalseCorrect] = useState<"true" | "false">(
    question && question.questionType === "true_false"
      ? ((question.correctAnswer as "true" | "false") ?? "true")
      : "true",
  );
  const [shortAnswerCorrect, setShortAnswerCorrect] = useState(
    question && question.questionType === "short_answer"
      ? ((question.correctAnswer as string) ?? "")
      : "",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateOption(id: string, text: string) {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  }
  function addOption() {
    setOptions((prev) => [...prev, { id: crypto.randomUUID(), text: "" }]);
  }
  function removeOption(id: string) {
    setOptions((prev) => prev.filter((o) => o.id !== id));
    setMultiCorrect((prev) => prev.filter((x) => x !== id));
    if (singleCorrect === id) setSingleCorrect("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    let finalOptions: QuizOption[] = [];
    let correctAnswer: Json = null;

    if (questionType === "single_choice") {
      finalOptions = options.filter((o) => o.text.trim());
      correctAnswer = singleCorrect || null;
    } else if (questionType === "multiple_choice") {
      finalOptions = options.filter((o) => o.text.trim());
      correctAnswer = multiCorrect;
    } else if (questionType === "true_false") {
      finalOptions = [
        { id: "true", text: "True" },
        { id: "false", text: "False" },
      ];
      correctAnswer = trueFalseCorrect;
    } else {
      finalOptions = [];
      correctAnswer = shortAnswerCorrect.trim();
    }

    if (
      (questionType === "single_choice" || questionType === "multiple_choice") &&
      finalOptions.length < 2
    ) {
      setBusy(false);
      setError("Add at least two answer options.");
      return;
    }
    if (!correctAnswer || (Array.isArray(correctAnswer) && correctAnswer.length === 0)) {
      setBusy(false);
      setError("Mark which answer is correct.");
      return;
    }

    const payload = {
      questionType,
      prompt: prompt.trim(),
      options: finalOptions,
      correctAnswer,
      points: Number(points) || 1,
      sortOrder: nextSortOrder,
    };

    const { error: err } = question
      ? await updateQuizQuestion(question.id, payload)
      : await createQuizQuestion({ quizId, ...payload });

    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    onDone();
  }

  return (
    <Panel className="mb-4">
      <h3 className="text-sm font-semibold">{question ? "Edit question" : "Add question"}</h3>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <label className="block">
            <span className="qa-label text-muted-foreground">Question type</span>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as QuestionType)}
              className={FIELD_CLASS}
            >
              {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((t) => (
                <option key={t} value={t}>
                  {QUESTION_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="qa-label text-muted-foreground">Points</span>
            <input
              type="number"
              min={0}
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
        </div>

        <label className="block">
          <span className="qa-label text-muted-foreground">Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            rows={2}
            className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>

        {questionType === "single_choice" || questionType === "multiple_choice" ? (
          <div className="grid gap-2">
            <span className="qa-label text-muted-foreground">
              Options —{" "}
              {questionType === "single_choice"
                ? "select the correct one"
                : "check all correct ones"}
            </span>
            {options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-2">
                {questionType === "single_choice" ? (
                  <input
                    type="radio"
                    name="correct-option"
                    checked={singleCorrect === opt.id}
                    onChange={() => setSingleCorrect(opt.id)}
                  />
                ) : (
                  <input
                    type="checkbox"
                    checked={multiCorrect.includes(opt.id)}
                    onChange={(e) =>
                      setMultiCorrect((prev) =>
                        e.target.checked ? [...prev, opt.id] : prev.filter((x) => x !== opt.id),
                      )
                    }
                  />
                )}
                <input
                  value={opt.text}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
                  placeholder="Option text"
                  className={`${FIELD_CLASS} mt-0 flex-1`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(opt.id)}
                  aria-label="Remove option"
                  className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <Btn type="button" variant="ghost" onClick={addOption} className="w-fit">
              <Plus className="h-3.5 w-3.5" /> Add option
            </Btn>
          </div>
        ) : questionType === "true_false" ? (
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tf-correct"
                checked={trueFalseCorrect === "true"}
                onChange={() => setTrueFalseCorrect("true")}
              />
              True
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="tf-correct"
                checked={trueFalseCorrect === "false"}
                onChange={() => setTrueFalseCorrect("false")}
              />
              False
            </label>
          </div>
        ) : (
          <label className="block">
            <span className="qa-label text-muted-foreground">
              Correct answer (matched case-insensitively)
            </span>
            <input
              value={shortAnswerCorrect}
              onChange={(e) => setShortAnswerCorrect(e.target.value)}
              className={FIELD_CLASS}
            />
          </label>
        )}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex gap-2">
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : question ? "Save question" : "Add question"}
          </Btn>
          <Btn type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Btn>
        </div>
      </form>
    </Panel>
  );
}
