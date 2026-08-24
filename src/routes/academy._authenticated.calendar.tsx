import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PortalHeading, Panel, Spinner, ErrorNotice } from "@/academy/components/ui";
import { fetchMyEvents, type CourseEvent } from "@/academy/lib/lms";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/_authenticated/calendar")({
  head: () => ({
    meta: [{ title: "Calendar | Quantum Basics Academy" }],
  }),
  component: AcademyCalendar,
});

const MONTH_FORMAT = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

/** Sun-start 6x7 grid covering the given month, including lead/trail days
 * from the adjacent months so every week row is full. */
function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - first.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

function AcademyCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CourseEvent[] | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const grid = useMemo(() => monthGrid(year, month), [year, month]);
  const todayKey = toDateKey(today);

  const load = useCallback(async () => {
    setEvents(null);
    setEventsError(null);
    const gridStart = grid.at(0);
    const gridEnd = grid.at(-1);
    if (!gridStart || !gridEnd) return;
    const { data, error } = await fetchMyEvents(toDateKey(gridStart), toDateKey(gridEnd));
    setEvents(data);
    setEventsError(error);
  }, [grid]);

  useEffect(() => {
    void load();
  }, [load]);

  function goToMonth(delta: number) {
    const next = new Date(year, month + delta, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  }

  const eventsByDate = new Map<string, CourseEvent[]>();
  for (const event of events ?? []) {
    const list = eventsByDate.get(event.date) ?? [];
    list.push(event);
    eventsByDate.set(event.date, list);
  }

  return (
    <>
      <PortalHeading
        label="Academy"
        title="Calendar"
        description="Deadlines and events for the courses you're enrolled on, plus academy-wide dates."
      />

      <Panel>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold">{MONTH_FORMAT.format(new Date(year, month))}</h2>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => goToMonth(-1)}
              className="grid h-8 w-8 place-items-center rounded border border-[var(--qa-line)] hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => goToMonth(1)}
              className="grid h-8 w-8 place-items-center rounded border border-[var(--qa-line)] hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {events === null ? (
          <div className="mt-6">
            <Spinner label="Loading events…" />
          </div>
        ) : eventsError ? (
          <div className="mt-6">
            <ErrorNotice message={eventsError} onRetry={() => void load()} />
          </div>
        ) : (
          <div className="mt-5">
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded border border-[var(--qa-line)] bg-[var(--qa-line)] text-xs font-semibold text-muted-foreground">
              {WEEKDAY_LABELS.map((label) => (
                <div key={label} className="bg-secondary/60 px-2 py-1.5 text-center">
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b border-x border-b border-[var(--qa-line)] bg-[var(--qa-line)]">
              {grid.map((date) => {
                const key = toDateKey(date);
                const inMonth = date.getMonth() === month;
                const dayEvents = eventsByDate.get(key) ?? [];
                return (
                  <div
                    key={key}
                    className={`min-h-[5.5rem] bg-card p-1.5 ${inMonth ? "" : "bg-secondary/30 text-muted-foreground/50"}`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                        key === todayKey ? "bg-primary font-semibold text-primary-foreground" : ""
                      }`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          title={event.description ?? event.title}
                          className="truncate rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-medium text-primary"
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 ? (
                        <div className="text-[0.65rem] text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Panel>

      <div className="mt-6">
        <h2 className="qa-label text-muted-foreground">Upcoming</h2>
        <div className="mt-3 space-y-2">
          {(events ?? [])
            .filter((e) => e.date >= todayKey)
            .slice(0, 8)
            .map((event) => (
              <Panel key={event.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {event.courseTitle ?? "Academy-wide"}
                  </p>
                </div>
                <span className="qa-label text-muted-foreground">
                  {new Date(`${event.date}T00:00:00`).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </Panel>
            ))}
          {events !== null && events.filter((e) => e.date >= todayKey).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing scheduled ahead.</p>
          ) : null}
        </div>
      </div>
    </>
  );
}
