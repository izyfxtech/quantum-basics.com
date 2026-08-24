import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PortalHeading, Meter, Panel, Spinner, ErrorNotice } from "@/academy/components/ui";
import { fetchMyProgress, type CourseProgress } from "@/academy/lib/lms";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/_authenticated/grades")({
  head: () => ({
    meta: [{ title: "Grades | Quantum Basics Academy" }],
  }),
  component: AcademyGrades,
});

/**
 * Grades are derived from lesson completion — this LMS doesn't have
 * separate scored assessments yet, so "grade" here means course
 * completion, banded into the labels below.
 */
function band(percent: number): { label: string; tone: string } {
  if (percent >= 100) return { label: "Complete", tone: "text-primary" };
  if (percent >= 70) return { label: "On track", tone: "text-primary" };
  if (percent >= 30) return { label: "In progress", tone: "text-muted-foreground" };
  if (percent > 0) return { label: "Just started", tone: "text-muted-foreground" };
  return { label: "Not started", tone: "text-muted-foreground" };
}

function AcademyGrades() {
  const [progress, setProgress] = useState<CourseProgress[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchMyProgress();
    setProgress(data);
    setError(error);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const overall = progress?.length
    ? Math.round(progress.reduce((sum, p) => sum + p.percent, 0) / progress.length)
    : 0;

  return (
    <>
      <PortalHeading
        label="Academy"
        title="Grades"
        description="Grades reflect lesson completion within each course you're enrolled on."
      />

      {progress === null ? (
        <Spinner label="Loading grades…" />
      ) : error ? (
        <ErrorNotice message={error} onRetry={() => void load()} />
      ) : progress.length === 0 ? (
        <Panel>
          <p className="text-sm text-muted-foreground">
            You are not enrolled on any course yet.{" "}
            <Link to="/academy/courses" className="font-semibold text-primary hover:underline">
              Browse the catalogue
            </Link>{" "}
            to get started.
          </p>
        </Panel>
      ) : (
        <>
          <Panel className="mb-4 flex items-center justify-between gap-6">
            <div>
              <p className="qa-label text-muted-foreground">Overall</p>
              <p className="mt-1 text-2xl font-semibold">{overall}%</p>
            </div>
            <div className="max-w-xs flex-1">
              <Meter percent={overall} />
            </div>
          </Panel>

          <div className="space-y-3">
            {progress.map((item) => {
              const b = band(item.percent);
              return (
                <Panel key={item.course.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="qa-label text-primary">{item.course.track}</p>
                      <h3 className="mt-1 text-base font-semibold">{item.course.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.completedLessons} of {item.totalLessons} lessons complete
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold">{item.percent}%</p>
                      <p className={`qa-label ${b.tone}`}>{b.label}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Meter percent={item.percent} />
                  </div>
                  <Link
                    to="/academy/courses/$slug"
                    params={{ slug: item.course.slug }}
                    className="mt-4 inline-block text-sm font-semibold text-primary hover:underline"
                  >
                    {item.percent === 100 ? "Review course" : "Continue course"}
                  </Link>
                </Panel>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
