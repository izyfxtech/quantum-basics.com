import { createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Search, UserPlus, X } from "lucide-react";
import { Btn, ErrorNotice, Panel, TextField } from "@/academy/components/ui";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
import { createEvent, fetchCourses, postNotice, type Course } from "@/academy/lib/lms";
import {
  assignCourseStaff,
  assignPlatformRole,
  fetchPlatformStats,
  isAssignablePlatformRole,
  PROFILE_SEARCH_PAGE_SIZE,
  removePlatformRole,
  searchProfiles,
  type AdminProfileRow,
  type PlatformStats,
} from "@/academy/lib/admin";
import { removeCourseStaffMember } from "@/academy/lib/staff";
import { ROLE_LABELS, type AppRole, type CourseStaffRole } from "@/academy/lib/roles";

export const Route = createFileRoute("/academy/_authenticated/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin | Quantum Basics Academy" }],
  }),
  beforeLoad: async () => {
    // getCurrentUser() is cached (see that module) so this doesn't repeat
    // the parent route's own Auth check. The super_admin lookup below is
    // left as a live query on every navigation, not cached the same way —
    // it's an authorization boundary rather than a one-way flag like
    // onboarding, so a just-revoked admin should stop seeing this page
    // promptly rather than for however long a cache TTL says.
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/academy/auth" });
    const { data: rows } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "super_admin");
    if (!rows || rows.length === 0) throw redirect({ to: "/academy/dashboard" });
  },
  component: AdminPanel,
});

const PLATFORM_ROLE_OPTIONS: AppRole[] = ["super_admin", "auditor", "student"];
const COURSE_ROLE_OPTIONS: CourseStaffRole[] = ["instructor", "teaching_assistant"];

function AdminPanel() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [shellError, setShellError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [staffEligibleOnly, setStaffEligibleOnly] = useState(false);
  const [results, setResults] = useState<AdminProfileRow[] | null>(null);
  const [resultsTotal, setResultsTotal] = useState(0);
  const [resultsPage, setResultsPage] = useState(0);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  const search = useCallback(async (q: string, eligibleOnly: boolean, page = 0) => {
    setSearching(true);
    const { rows, total, error } = await searchProfiles(q, { staffEligibleOnly: eligibleOnly, page });
    setSearchError(error);
    setResultsTotal(total);
    setResultsPage(page);
    setResults((prev) => (page === 0 || !prev ? rows : [...prev, ...rows]));
    setSearching(false);
  }, []);

  const loadShell = useCallback(async () => {
    const [statsRes, coursesRes] = await Promise.all([fetchPlatformStats(), fetchCourses()]);
    setStats(statsRes.data);
    setStatsError(statsRes.error);
    setCourses(coursesRes.data);
    setShellError(coursesRes.error);
  }, []);

  useEffect(() => {
    void loadShell();
    void search("", staffEligibleOnly);
    // Deliberately re-runs only when `loadShell` changes (i.e. once, on
    // mount) -- `search` and `staffEligibleOnly` are read here just to
    // seed the initial unfiltered result set; the checkbox's own onChange
    // re-invokes `search` directly when the filter actually changes.
  }, [loadShell]);

  return (
    <>
      <div>
        <p className="qa-label text-primary">Academy admin</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">Roles & staffing</h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Assign platform roles and staff courses with instructors and teaching assistants.
        </p>
      </div>

      {statsError ? (
        <div className="mt-8">
          <ErrorNotice message={statsError} onRetry={() => void loadShell()} />
        </div>
      ) : stats ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Users" value={stats.totalUsers} />
          <StatCard label="Courses" value={stats.totalCourses} />
          <StatCard label="Enrolments" value={stats.totalEnrollments} />
          <StatCard label="Instructors" value={stats.totalInstructors} />
          <StatCard label="Teaching assistants" value={stats.totalTAs} />
        </div>
      ) : null}

      {shellError ? (
        <div className="mt-8">
          <ErrorNotice message={shellError} onRetry={() => void loadShell()} />
        </div>
      ) : null}

      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        <NoticeForm courses={courses} />
        <EventForm courses={courses} />
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">Find a user</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Accounts signed up with an @quantum-basics.com email are flagged staff-eligible — use the
          filter below to shortlist them when staffing a course.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void search(query, staffEligibleOnly);
          }}
          className="mt-4 flex flex-wrap items-center gap-3"
        >
          <div className="relative min-w-[240px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={staffEligibleOnly}
              onChange={(e) => {
                setStaffEligibleOnly(e.target.checked);
                void search(query, e.target.checked);
              }}
            />
            Staff-eligible only
          </label>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        <div className="mt-6 space-y-4">
          {searchError ? (
            <ErrorNotice message={searchError} onRetry={() => void search(query, staffEligibleOnly)} />
          ) : searching && !results ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching…
            </p>
          ) : results && results.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found.</p>
          ) : (
            <>
              {results?.map((row) => (
                <AdminUserRow
                  key={row.id}
                  row={row}
                  courses={courses}
                  onChanged={() => search(query, staffEligibleOnly, resultsPage)}
                />
              ))}
              {results && results.length > 0 ? (
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Showing {results.length} of {resultsTotal}
                  </p>
                  {results.length < resultsTotal ? (
                    <Btn
                      variant="outline"
                      disabled={searching}
                      onClick={() => void search(query, staffEligibleOnly, resultsPage + 1)}
                    >
                      {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Load {Math.min(PROFILE_SEARCH_PAGE_SIZE, resultsTotal - results.length)} more
                    </Btn>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function CourseSelect({
  courses,
  value,
  onChange,
}: {
  courses: Course[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="qa-label text-muted-foreground">Scope</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full rounded border border-[var(--qa-line)] bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
      >
        <option value="">Academy-wide</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function NoticeForm({ courses }: { courses: Course[] }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [courseId, setCourseId] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "posted" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    setBusy(true);
    const { error } = await postNotice({
      title: title.trim(),
      body: body.trim(),
      courseId: courseId || null,
    });
    setBusy(false);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("posted");
    setTitle("");
    setBody("");
    setCourseId("");
  }

  return (
    <Panel>
      <h2 className="text-base font-semibold">Post a notice</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="New module released"
          required
        />
        <label className="block">
          <span className="qa-label text-muted-foreground">Body</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            rows={3}
            className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>
        <CourseSelect courses={courses} value={courseId} onChange={setCourseId} />
        <Btn type="submit" disabled={busy}>
          {busy ? "Posting…" : "Post notice"}
        </Btn>
        {status === "posted" ? <p className="text-sm text-primary">Notice posted.</p> : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">Couldn't post that notice. Try again.</p>
        ) : null}
      </form>
    </Panel>
  );
}

function EventForm({ courses }: { courses: Course[] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [courseId, setCourseId] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"idle" | "posted" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !date) return;
    setBusy(true);
    const { error } = await createEvent({
      title: title.trim(),
      description: description.trim(),
      date,
      courseId: courseId || null,
    });
    setBusy(false);
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("posted");
    setTitle("");
    setDescription("");
    setDate("");
    setCourseId("");
  }

  return (
    <Panel>
      <h2 className="text-base font-semibold">Add a calendar event</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4">
        <TextField
          label="Title"
          value={title}
          onChange={setTitle}
          placeholder="Assessment window opens"
          required
        />
        <TextField label="Date" type="date" value={date} onChange={setDate} required />
        <label className="block">
          <span className="qa-label text-muted-foreground">Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
          />
        </label>
        <CourseSelect courses={courses} value={courseId} onChange={setCourseId} />
        <Btn type="submit" disabled={busy}>
          {busy ? "Adding…" : "Add event"}
        </Btn>
        {status === "posted" ? <p className="text-sm text-primary">Event added.</p> : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">Couldn't add that event. Try again.</p>
        ) : null}
      </form>
    </Panel>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="qa-card p-6">
      <p className="text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function AdminUserRow({
  row,
  courses,
  onChanged,
}: {
  row: AdminProfileRow;
  courses: Course[];
  onChanged: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [newPlatformRole, setNewPlatformRole] = useState<AppRole | "">("");
  const [newCourseId, setNewCourseId] = useState("");
  const [newCourseRole, setNewCourseRole] = useState<CourseStaffRole>("instructor");

  const assignablePlatformRoles = PLATFORM_ROLE_OPTIONS.filter(
    (r) => isAssignablePlatformRole(r) && !row.platformRoles.includes(r),
  );

  async function handleAddPlatformRole() {
    if (!newPlatformRole) return;
    setBusy(true);
    await assignPlatformRole(row.id, newPlatformRole);
    setBusy(false);
    setNewPlatformRole("");
    onChanged();
  }

  async function handleRemovePlatformRole(role: AppRole) {
    setBusy(true);
    await removePlatformRole(row.id, role);
    setBusy(false);
    onChanged();
  }

  async function handleAddCourseStaff() {
    if (!newCourseId) return;
    setBusy(true);
    await assignCourseStaff(newCourseId, row.id, newCourseRole);
    setBusy(false);
    setNewCourseId("");
    onChanged();
  }

  async function handleRemoveCourseStaff(staffId: string) {
    setBusy(true);
    await removeCourseStaffMember(staffId);
    setBusy(false);
    onChanged();
  }

  return (
    <div className="qa-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 font-semibold">
            {row.fullName || "Unnamed"}
            {row.staffEligible ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-primary">
                Staff-eligible
              </span>
            ) : null}
          </p>
          <p className="text-sm text-muted-foreground">{row.email}</p>
          {row.organisation ? (
            <p className="text-xs text-muted-foreground">{row.organisation}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {row.platformRoles.map((role) => (
          <RoleBadge
            key={role}
            label={ROLE_LABELS[role]}
            onRemove={() => handleRemovePlatformRole(role)}
            disabled={busy}
          />
        ))}
        {row.courseStaff.map((cs) => (
          <RoleBadge
            key={cs.staffId}
            label={`${ROLE_LABELS[cs.role]} · ${cs.courseTitle}`}
            onRemove={() => handleRemoveCourseStaff(cs.staffId)}
            disabled={busy}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={newPlatformRole}
          onChange={(e) => setNewPlatformRole(e.target.value as AppRole)}
          className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
        >
          <option value="">Add platform role…</option>
          {assignablePlatformRoles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!newPlatformRole || busy}
          onClick={handleAddPlatformRole}
          className="inline-flex h-9 items-center gap-1 rounded-full bg-secondary px-3 text-xs font-semibold transition-colors hover:bg-secondary/70 disabled:opacity-60"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add
        </button>

        <select
          value={newCourseId}
          onChange={(e) => setNewCourseId(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
        >
          <option value="">Assign to course…</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
        <select
          value={newCourseRole}
          onChange={(e) => setNewCourseRole(e.target.value as CourseStaffRole)}
          className="h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary"
        >
          {COURSE_ROLE_OPTIONS.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={!newCourseId || busy}
          onClick={handleAddCourseStaff}
          className="inline-flex h-9 items-center gap-1 rounded-full bg-secondary px-3 text-xs font-semibold transition-colors hover:bg-secondary/70 disabled:opacity-60"
        >
          <UserPlus className="h-3.5 w-3.5" /> Assign
        </button>
      </div>
    </div>
  );
}

function RoleBadge({
  label,
  onRemove,
  disabled,
}: {
  label: string;
  onRemove: () => void;
  disabled: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
      {label}
      <button
        type="button"
        disabled={disabled}
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-muted-foreground hover:text-destructive disabled:opacity-60"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
