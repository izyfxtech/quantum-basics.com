import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  BookOpen,
  Calendar as CalendarIcon,
  ChevronDown,
  Clock,
  GraduationCap,
  Loader2,
  Megaphone,
  PlayCircle,
  ShieldCheck,
  Trophy,
  UserMinus,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
import { Btn, ErrorNotice } from "@/academy/components/ui";
import {
  fetchCoursesByIds,
  fetchMyEvents,
  fetchMyNotices,
  fetchMyProgress,
  unenrol,
  type Course,
  type CourseEvent,
  type CourseProgress,
  type Notice,
} from "@/academy/lib/lms";
import {
  fetchCourseRoster,
  fetchCourseStaffList,
  promoteStudentToTA,
  removeCourseStaffMember,
  type CourseStaffMember,
  type RosterEntry,
} from "@/academy/lib/staff";
import { fetchPlatformStats, type PlatformStats } from "@/academy/lib/admin";
import {
  fetchMyAccess,
  isCourseInstructor,
  isSuperAdmin,
  isAuditor,
  staffCourseIds,
  type MyAccess,
} from "@/academy/lib/roles";

export const Route = createFileRoute("/academy/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard | Quantum Basics Academy" },
      {
        name: "description",
        content:
          "Your Quantum Basics Academy learning portal: enrolled courses, lesson progress and teaching tools.",
      },
    ],
  }),
  component: AcademyDashboard,
});

type Profile = {
  full_name: string | null;
  organisation: string | null;
  preferred_track: string | null;
};

function AcademyDashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [progress, setProgress] = useState<CourseProgress[] | null>(null);
  const [progressError, setProgressError] = useState<string | null>(null);
  const [access, setAccess] = useState<MyAccess | null>(null);
  const [staffCourses, setStaffCourses] = useState<Course[] | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [notices, setNotices] = useState<Notice[] | null>(null);
  const [noticesError, setNoticesError] = useState<string | null>(null);
  const [weekEvents, setWeekEvents] = useState<CourseEvent[] | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setEmail(user.email ?? null);

    const { start, end } = currentWeekRange();
    const [{ data: row }, myAccess, myProgress, myNotices, myWeekEvents] = await Promise.all([
      supabase
        .from("profiles")
        .select("full_name, organisation, preferred_track")
        .eq("id", user.id)
        .maybeSingle(),
      fetchMyAccess(),
      fetchMyProgress(),
      fetchMyNotices(5),
      fetchMyEvents(start, end),
    ]);
    setProfile(row ?? null);
    setProgress(myProgress.data);
    setProgressError(myProgress.error);
    setAccess(myAccess);
    setNotices(myNotices.data);
    setNoticesError(myNotices.error);
    setWeekEvents(myWeekEvents.data);
    setEventsError(myWeekEvents.error);

    const staffIds = staffCourseIds(myAccess);
    if (staffIds.length) {
      const staffCoursesRes = await fetchCoursesByIds(staffIds);
      setStaffCourses(staffCoursesRes.data);
    } else {
      setStaffCourses([]);
    }

    if (isSuperAdmin(myAccess) || isAuditor(myAccess)) {
      const statsRes = await fetchPlatformStats();
      setStats(statsRes.data);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleLeave(courseId: string) {
    await unenrol(courseId);
    setProgress((prev) => prev?.filter((item) => item.course.id !== courseId) ?? null);
  }

  const name = profile?.full_name?.trim() || email || "learner";
  const active = progress ?? [];
  const completedCourses = active.filter((item) => item.percent === 100).length;
  const lessonsDone = active.reduce((sum, item) => sum + item.completedLessons, 0);
  const admin = isSuperAdmin(access);
  const auditor = isAuditor(access);

  return (
    <>
      <div>
        <p className="qa-label text-primary">Academy account</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Welcome back, {name}
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          Pick up where you left off, track lesson progress and manage your enrolments.
        </p>
        <Link
          to="/academy/courses"
          className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <GraduationCap className="h-4 w-4" /> Browse the catalogue
        </Link>
      </div>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        <div className="qa-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="qa-label text-muted-foreground">Notices</h2>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </div>
          {notices === null ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading notices…</p>
          ) : noticesError ? (
            <div className="mt-4">
              <ErrorNotice message={noticesError} onRetry={() => void load()} />
            </div>
          ) : notices.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">No notices right now.</p>
          ) : (
            <ul className="mt-3 divide-y divide-[var(--qa-line)]">
              {notices.map((n) => (
                <li key={n.id} className="py-2.5">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {n.courseTitle ?? "Academy-wide"} ·{" "}
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="qa-card p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="qa-label text-muted-foreground">This week</h2>
            <Link
              to="/academy/calendar"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <CalendarIcon className="h-3.5 w-3.5" /> Full calendar
            </Link>
          </div>
          {eventsError ? (
            <div className="mt-3">
              <ErrorNotice message={eventsError} onRetry={() => void load()} />
            </div>
          ) : (
            <WeekStrip events={weekEvents ?? []} />
          )}
        </div>
      </section>

      {admin || auditor ? (
        <section className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold tracking-tight">Platform overview</h2>
            {admin ? (
              <Link
                to="/academy/admin"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Manage roles & staffing
              </Link>
            ) : null}
          </div>
          {stats ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <StatCard label="Users" value={stats.totalUsers} />
              <StatCard label="Courses" value={stats.totalCourses} />
              <StatCard label="Enrolments" value={stats.totalEnrollments} />
              <StatCard label="Instructors" value={stats.totalInstructors} />
              <StatCard label="Teaching assistants" value={stats.totalTAs} />
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">Loading platform stats…</p>
          )}
        </section>
      ) : null}

      {staffCourses && staffCourses.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">Courses you teach & assist</h2>
          <div className="mt-4 space-y-4">
            {staffCourses.map((course) => (
              <StaffCourseCard
                key={course.id}
                course={course}
                canManageStaff={isCourseInstructor(access, course.id)}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight">My learning</h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard icon={BookOpen} label="Courses enrolled" value={active.length} />
          <StatCard icon={PlayCircle} label="Lessons completed" value={lessonsDone} />
          <StatCard icon={Trophy} label="Courses completed" value={completedCourses} />
        </div>

        {progress === null ? (
          <p className="mt-6 text-sm text-muted-foreground">Loading your courses…</p>
        ) : progressError ? (
          <div className="mt-6">
            <ErrorNotice message={progressError} onRetry={() => void load()} />
          </div>
        ) : active.length === 0 ? (
          <div className="mt-6 qa-card p-8 text-sm text-muted-foreground">
            You are not enrolled on any course yet.{" "}
            <Link to="/academy/courses" className="font-semibold text-primary hover:underline">
              Browse the catalogue
            </Link>{" "}
            to get started.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {active.map((item) => (
              <article
                key={item.course.id}
                className="flex h-full flex-col qa-card p-7"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  {item.course.track}
                </p>
                <h3 className="mt-3 text-lg font-semibold">{item.course.title}</h3>
                <div className="mt-5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {item.completedLessons} of {item.totalLessons} lessons · {item.percent}%
                  </p>
                </div>
                <p className="mt-4 flex-1 text-sm text-muted-foreground">
                  {item.nextLesson ? (
                    <>
                      Next up: <span className="text-foreground">{item.nextLesson.title}</span>
                      <span className="ml-2 inline-flex items-center gap-1 text-xs">
                        <Clock className="h-3.5 w-3.5" /> {item.nextLesson.minutes} min
                      </span>
                    </>
                  ) : (
                    "Course complete — well done."
                  )}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/academy/courses/$slug"
                    params={{ slug: item.course.slug }}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    {item.percent === 100 ? "Review course" : "Continue"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleLeave(item.course.id)}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-input bg-background px-5 text-sm font-semibold transition-colors hover:bg-secondary"
                  >
                    Leave course
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-12 qa-card p-8 md:p-10">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Your details
        </h3>
        <dl className="mt-6 grid gap-5 text-sm sm:grid-cols-2">
          <Detail label="Email" value={email} />
          <Detail label="Full name" value={profile?.full_name} />
          <Detail label="Organisation" value={profile?.organisation} />
          <Detail label="Preferred track" value={profile?.preferred_track} />
        </dl>
      </section>
    </>
  );
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Sunday-to-Saturday range containing today, as YYYY-MM-DD strings. */
function currentWeekRange(): { start: string; end: string } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return { start: toDateKey(start), end: toDateKey(end) };
}

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function WeekStrip({ events }: { events: CourseEvent[] }) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    const key = toDateKey(date);
    return {
      key,
      dayOfMonth: date.getDate(),
      isToday: key === toDateKey(today),
      events: events.filter((e) => e.date === key),
    };
  });

  return (
    <div className="mt-4">
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i}>{label}</span>
        ))}
      </div>
      <div className="mt-1.5 grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day.key}
            className={`flex h-8 items-center justify-center rounded text-xs ${
              day.isToday ? "bg-primary font-semibold text-primary-foreground" : "text-foreground"
            }`}
          >
            {day.dayOfMonth}
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {days
          .flatMap((day) => day.events)
          .slice(0, 4)
          .map((event) => (
            <li key={event.id} className="text-sm">
              <span className="font-medium">{event.title}</span>{" "}
              <span className="text-xs text-muted-foreground">
                ·{" "}
                {new Date(`${event.date}T00:00:00`).toLocaleDateString(undefined, {
                  weekday: "short",
                  day: "numeric",
                })}
              </span>
            </li>
          ))}
        {days.every((day) => day.events.length === 0) ? (
          <li className="text-sm text-muted-foreground">Nothing scheduled this week.</li>
        ) : null}
      </ul>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon?: typeof BookOpen;
  label: string;
  value: number;
}) {
  return (
    <div className="qa-card p-6">
      {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
      <p className={Icon ? "mt-4 text-3xl font-semibold tracking-tight" : "text-3xl font-semibold tracking-tight"}>
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-medium text-foreground">{value?.trim() || "—"}</dd>
    </div>
  );
}

function StaffCourseCard({
  course,
  canManageStaff,
}: {
  course: Course;
  canManageStaff: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roster, setRoster] = useState<RosterEntry[] | null>(null);
  const [staff, setStaff] = useState<CourseStaffMember[] | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoading(true);
    const [r, s] = await Promise.all([fetchCourseRoster(course.id), fetchCourseStaffList(course.id)]);
    setRoster(r.data);
    setStaff(s.data);
    setDetailError(r.error ?? s.error);
    setLoading(false);
  }, [course.id]);

  async function toggle() {
    const next = !open;
    setOpen(next);
    if (next && roster === null) await loadDetail();
  }

  async function handlePromote() {
    if (!selected) return;
    setBusy(true);
    const { error } = await promoteStudentToTA(course.id, selected);
    setBusy(false);
    if (!error) {
      setSelected("");
      await loadDetail();
    } else {
      setDetailError(error);
    }
  }

  async function handleRemoveStaff(id: string) {
    setBusy(true);
    const { error } = await removeCourseStaffMember(id);
    setBusy(false);
    if (error) setDetailError(error);
    await loadDetail();
  }

  const avgPercent = roster?.length
    ? Math.round(roster.reduce((sum, r) => sum + r.percent, 0) / roster.length)
    : 0;

  const staffUserIds = new Set((staff ?? []).map((s) => s.userId));
  const eligibleForTA = (roster ?? []).filter((r) => !staffUserIds.has(r.userId));

  return (
    <div className="qa-card">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 p-6 text-left"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {course.track}
          </p>
          <h3 className="mt-1 text-base font-semibold">{course.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {roster ? `${roster.length} enrolled · ${avgPercent}% avg. progress` : "View roster"}
          </p>
        </div>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="border-t border-border p-6">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading…
            </p>
          ) : detailError ? (
            <ErrorNotice message={detailError} onRetry={() => void loadDetail()} />
          ) : (
            <>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Staff
              </h4>
              <ul className="mt-3 space-y-2">
                {(staff ?? []).map((member) => (
                  <li
                    key={member.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-secondary/50 px-4 py-2 text-sm"
                  >
                    <span>
                      {member.fullName || member.email || "Unnamed"}{" "}
                      <span className="text-xs uppercase tracking-wide text-muted-foreground">
                        · {member.role === "instructor" ? "Instructor" : "Teaching assistant"}
                      </span>
                    </span>
                    {canManageStaff && member.role === "teaching_assistant" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => handleRemoveStaff(member.id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-destructive hover:underline disabled:opacity-60"
                      >
                        <UserMinus className="h-3.5 w-3.5" /> Remove
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>

              {canManageStaff ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                  >
                    <option value="">Promote an enrolled student to TA…</option>
                    {eligibleForTA.map((r) => (
                      <option key={r.userId} value={r.userId}>
                        {r.fullName || r.email || r.userId}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!selected || busy}
                    onClick={handlePromote}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                  >
                    Make TA
                  </button>
                </div>
              ) : null}

              <h4 className="mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Roster
              </h4>
              {roster && roster.length > 0 ? (
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-xs uppercase tracking-widest text-muted-foreground">
                        <th className="pb-2 pr-4 font-semibold">Student</th>
                        <th className="pb-2 pr-4 font-semibold">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roster.map((r) => (
                        <tr key={r.enrollmentId} className="border-t border-border">
                          <td className="py-2 pr-4">
                            <p className="font-medium">{r.fullName || "—"}</p>
                            <p className="text-xs text-muted-foreground">{r.email}</p>
                          </td>
                          <td className="py-2 pr-4">
                            {r.completedLessons}/{r.totalLessons} lessons · {r.percent}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No one is enrolled yet.</p>
              )}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
