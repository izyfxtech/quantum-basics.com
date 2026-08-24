import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock, Cpu, Gauge, Network, Search, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState, PortalHeading, Spinner, Tag } from "@/academy/components/ui";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/courses/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Course Catalogue | Quantum Basics Academy" },
      {
        name: "description",
        content:
          "Browse the Quantum Basics Academy course catalogue: PLC and SCADA, WAGES metering, energy management and industrial networks, delivered as self-paced online modules.",
      },
      { property: "og:title", content: "Quantum Basics Academy course catalogue" },
      {
        property: "og:description",
        content:
          "Self-paced online courses in automation, metering, energy and smart infrastructure.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CourseCatalogue,
});

type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  duration: string;
};

/** Maps a course's free-text track name to a representative icon, so the
 * catalogue reads as sorted-and-categorised rather than a flat list. Falls
 * back to a generic book icon for any track name that doesn't match. */
function trackIcon(track: string) {
  const t = track.toLowerCase();
  if (t.includes("automation") || t.includes("field")) return Cpu;
  if (t.includes("meter") || t.includes("utility") || t.includes("wages")) return Gauge;
  if (t.includes("energy") || t.includes("retail")) return Zap;
  if (t.includes("telecom") || t.includes("connectivity") || t.includes("network")) return Network;
  return BookOpen;
}

function CourseCatalogue() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("all");
  const [sort, setSort] = useState<"curriculum" | "title" | "level">("curriculum");

  useEffect(() => {
    let active = true;
    void (async () => {
      const { data } = await supabase
        .from("courses")
        .select("id, slug, title, summary, track, level, duration")
        .order("sort_order");
      if (!active) return;
      setCourses(data ?? []);

      const { data: session } = await supabase.auth.getUser();
      if (!session.user) return;
      const { data: rows } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", session.user.id);
      if (active) setEnrolled(new Set((rows ?? []).map((r) => r.course_id)));
    })();
    return () => {
      active = false;
    };
  }, []);

  const tracks = useMemo(() => {
    if (!courses) return [];
    return Array.from(new Set(courses.map((c) => c.track))).sort();
  }, [courses]);

  const visible = useMemo(() => {
    if (!courses) return [];
    const q = query.trim().toLowerCase();
    const filtered = courses.filter((c) => {
      const matchesTrack = track === "all" || c.track === track;
      const matchesQuery =
        !q || c.title.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q);
      return matchesTrack && matchesQuery;
    });
    if (sort === "title") return [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "level") return [...filtered].sort((a, b) => a.level.localeCompare(b.level));
    return filtered;
  }, [courses, query, track, sort]);

  return (
    <div>
      <PortalHeading
        label="Learning portal"
        title="Course catalogue"
        description="Self-paced online modules drawn from the work we do in the field. Enrol, work through the lessons and track your progress from your dashboard."
        actions={
          <Link
            to="/academy/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Go to my dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {courses === null ? (
        <Spinner label="Loading courses…" />
      ) : courses.length === 0 ? (
        <EmptyState
          title="No courses published yet"
          body="Check back soon — new courses are added to the catalogue regularly."
        />
      ) : (
        <>
          <div className="qa-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:max-w-xs sm:flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search courses…"
                aria-label="Search courses"
                className="h-10 w-full rounded border border-[var(--qa-line)] bg-card pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={track}
                onChange={(event) => setTrack(event.target.value)}
                aria-label="Filter by track"
                className="h-10 rounded border border-[var(--qa-line)] bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
              >
                <option value="all">All tracks</option>
                {tracks.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as typeof sort)}
                aria-label="Sort courses"
                className="h-10 rounded border border-[var(--qa-line)] bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
              >
                <option value="curriculum">Sort: Curriculum order</option>
                <option value="title">Sort: Course name</option>
                <option value="level">Sort: Level</option>
              </select>
            </div>
          </div>

          {visible.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title={`No courses match “${query || track}”`}
                body="Try a different search term, or clear the track filter to see the full catalogue."
              />
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {visible.map((course) => (
                <CourseCard key={course.id} course={course} enrolled={enrolled.has(course.id)} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CourseCard({ course, enrolled }: { course: Course; enrolled: boolean }) {
  const Icon = trackIcon(course.track);

  return (
    <Link
      to="/academy/courses/$slug"
      params={{ slug: course.slug }}
      className="qa-card group flex flex-col p-6 transition-colors hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        {enrolled ? <Tag>Enrolled</Tag> : null}
      </div>

      <p className="mt-4 qa-label text-primary">{course.track}</p>
      <h2 className="mt-2 text-lg font-semibold leading-snug">{course.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{course.summary}</p>

      <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-[var(--qa-line)] pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="h-3.5 w-3.5" /> {course.level}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" /> {course.duration}
        </span>
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        {enrolled ? "Continue course" : "View course"}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
