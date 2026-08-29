import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { EmptyState, ErrorNotice, Panel, PortalHeading, Spinner, Tag } from "@/academy/components/ui";
import { ROLE_LABELS } from "@/academy/lib/roles";
import { fetchMyTeachingCourses, type TeachingCourse } from "@/academy/lib/teaching";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/_authenticated/teaching")({
  ssr: false,
  head: () => ({
    meta: [{ title: "My courses | Quantum Basics Academy" }],
  }),
  // No beforeLoad here — the parent /academy/_authenticated route already
  // guarantees a signed-in user (it redirects to /academy/auth otherwise,
  // which short-circuits before this route's beforeLoad would ever run),
  // so re-checking here was a second redundant Auth round trip on every
  // navigation into this page for no additional safety.
  component: TeachingIndex,
});

function TeachingIndex() {
  const [courses, setCourses] = useState<TeachingCourse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchMyTeachingCourses();
    setCourses(data);
    setError(error);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <PortalHeading
        label="Academy"
        title="My courses"
        description="Courses you're staffed on as an instructor or teaching assistant."
      />

      {courses === null ? (
        <Spinner label="Loading your courses…" />
      ) : error ? (
        <ErrorNotice message={error} onRetry={() => void load()} />
      ) : courses.length === 0 ? (
        <EmptyState
          title="You're not staffed on a course yet"
          body="Ask a Quantum Basics admin to assign you as an instructor or teaching assistant from the admin panel."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map((course) => (
            <Panel key={course.id} className="flex flex-col">
              <p className="qa-label text-primary">{course.track}</p>
              <h2 className="mt-2 text-lg font-semibold">{course.title}</h2>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Tag>
                  <span className="inline-flex items-center gap-1">
                    {course.role === "instructor" ? (
                      <GraduationCap className="h-3 w-3" />
                    ) : (
                      <Users className="h-3 w-3" />
                    )}
                    {ROLE_LABELS[course.role]}
                  </span>
                </Tag>
              </div>
              <Link
                to="/academy/teaching/$courseId"
                params={{ courseId: course.id }}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                Open workspace <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
