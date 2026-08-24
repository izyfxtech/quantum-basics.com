import { supabase } from "@/integrations/supabase/client";
import type { ListResult } from "@/academy/lib/teaching";

export type Notice = {
  id: string;
  title: string;
  body: string;
  courseId: string | null;
  courseTitle: string | null;
  createdAt: string;
};

export type CourseEvent = {
  id: string;
  title: string;
  description: string | null;
  date: string; // YYYY-MM-DD
  courseId: string | null;
  courseTitle: string | null;
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  track: string;
  level: string;
  duration: string;
};

export type Lesson = { id: string; title: string; body: string; minutes: number };

export type CourseProgress = {
  course: Course;
  totalLessons: number;
  completedLessons: number;
  percent: number;
  totalMinutes: number;
  nextLesson: Lesson | null;
};

const COURSE_COLUMNS = "id, slug, title, summary, track, level, duration";

export async function fetchCourses(): Promise<ListResult<Course>> {
  const { data, error } = await supabase.from("courses").select(COURSE_COLUMNS).order("sort_order");
  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function fetchCoursesByIds(ids: string[]): Promise<ListResult<Course>> {
  if (!ids.length) return { data: [], error: null };
  const { data, error } = await supabase.from("courses").select(COURSE_COLUMNS).in("id", ids);
  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

export async function fetchCourseBySlug(
  slug: string,
): Promise<{ data: Course | null; error: string | null }> {
  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data ?? null, error: null };
}

export async function fetchLessons(courseId: string): Promise<ListResult<Lesson>> {
  const { data, error } = await supabase
    .from("lessons")
    .select("id, title, body, minutes")
    .eq("course_id", courseId)
    .order("sort_order");
  if (error) return { data: [], error: error.message };
  return { data: data ?? [], error: null };
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

/** Course IDs the signed-in user is personally enrolled in as a student.
 * Deliberately scoped to `user_id` -- without it, course staff/super
 * admins/auditors (who can see every enrollment row for a course, or
 * platform-wide, under RLS) would get back course IDs that have nothing
 * to do with their own enrollment. See `fetchStaffedCourseIds` for the
 * separate "courses I teach" list. Errors are swallowed to [] here on
 * purpose: this is an internal helper composed into several public
 * fetch*() functions below, each of which surfaces its own top-level
 * error instead. */
export async function fetchEnrolledCourseIds(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data } = await supabase.from("enrollments").select("course_id").eq("user_id", userId);
  return (data ?? []).map((row) => row.course_id);
}

/** Course IDs the signed-in user is staffed on (instructor/TA). Course
 * staff are never personally "enrolled" as a student, but should still see
 * notices/events for courses they teach -- see `fetchMyNotices`/
 * `fetchMyEvents`, which merge this with `fetchEnrolledCourseIds`. */
export async function fetchStaffedCourseIds(): Promise<string[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data } = await supabase.from("course_staff").select("course_id").eq("user_id", userId);
  return (data ?? []).map((row) => row.course_id);
}

/** Lesson IDs, among `lessonIds`, the signed-in user has personally
 * completed. Scoped to `user_id` for the same reason as
 * `fetchEnrolledCourseIds` -- course staff/admins/auditors can see other
 * students' `lesson_progress` rows under RLS, and this must not pick those
 * up as the current user's own completions. */
export async function fetchCompletedLessonIds(lessonIds: string[]): Promise<string[]> {
  if (!lessonIds.length) return [];
  const userId = await getCurrentUserId();
  if (!userId) return [];
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  return (data ?? []).map((row) => row.lesson_id);
}

export async function enrol(courseId: string, userId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("enrollments").insert({ user_id: userId, course_id: courseId });
  return { error: error?.message ?? null };
}

/** courseId null posts an academy-wide notice/event. RLS restricts this to
 * super admins and, for a specific course, that course's staff. */
export async function postNotice(input: {
  title: string;
  body: string;
  courseId: string | null;
}): Promise<{ error: string | null }> {
  const { data: user } = await supabase.auth.getUser();
  const { error } = await supabase.from("notices").insert({
    title: input.title,
    body: input.body,
    course_id: input.courseId,
    created_by: user.user?.id ?? null,
  });
  return { error: error?.message ?? null };
}

export async function createEvent(input: {
  title: string;
  description: string;
  date: string;
  courseId: string | null;
}): Promise<{ error: string | null }> {
  const { data: user } = await supabase.auth.getUser();
  const { error } = await supabase.from("course_events").insert({
    title: input.title,
    description: input.description || null,
    event_date: input.date,
    course_id: input.courseId,
    created_by: user.user?.id ?? null,
  });
  return { error: error?.message ?? null };
}

export async function unenrol(courseId: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("enrollments").delete().eq("course_id", courseId);
  return { error: error?.message ?? null };
}

export async function setLessonComplete(
  lessonId: string,
  userId: string,
  complete: boolean,
): Promise<{ error: string | null }> {
  if (complete) {
    const { error } = await supabase.from("lesson_progress").insert({ user_id: userId, lesson_id: lessonId });
    return { error: error?.message ?? null };
  }
  const { error } = await supabase.from("lesson_progress").delete().eq("lesson_id", lessonId);
  return { error: error?.message ?? null };
}

/** Progress for every course the signed-in learner is enrolled on. */
export async function fetchMyProgress(): Promise<ListResult<CourseProgress>> {
  const enrolledIds = await fetchEnrolledCourseIds();
  if (!enrolledIds.length) return { data: [], error: null };

  const { data: courses, error: coursesError } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .in("id", enrolledIds)
    .order("sort_order");
  if (coursesError) return { data: [], error: coursesError.message };

  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("id, title, body, minutes, course_id, sort_order")
    .in("course_id", enrolledIds)
    .order("sort_order");
  if (lessonsError) return { data: [], error: lessonsError.message };

  const completed = new Set(
    await fetchCompletedLessonIds((lessons ?? []).map((lesson) => lesson.id)),
  );

  const rows = (courses ?? []).map((course) => {
    const courseLessons = (lessons ?? []).filter((lesson) => lesson.course_id === course.id);
    const done = courseLessons.filter((lesson) => completed.has(lesson.id));
    const next = courseLessons.find((lesson) => !completed.has(lesson.id)) ?? null;
    return {
      course,
      totalLessons: courseLessons.length,
      completedLessons: done.length,
      percent: courseLessons.length ? Math.round((done.length / courseLessons.length) * 100) : 0,
      totalMinutes: courseLessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0),
      nextLesson: next
        ? { id: next.id, title: next.title, body: next.body, minutes: next.minutes }
        : null,
    };
  });
  return { data: rows, error: null };
}

/**
 * Platform-wide notices plus notices for any course the signed-in user is
 * enrolled in or staffed on — RLS enforces the same scope server-side (see
 * migration 20260822090000_notices_and_events.sql), this mirrors it
 * client-side so an anonymous or not-yet-enrolled visitor only ever
 * queries what they can see.
 */
export async function fetchMyNotices(limit = 8): Promise<ListResult<Notice>> {
  const [enrolledIds, staffedIds] = await Promise.all([
    fetchEnrolledCourseIds(),
    fetchStaffedCourseIds(),
  ]);
  const courseIds = Array.from(new Set([...enrolledIds, ...staffedIds]));
  const orClause = courseIds.length
    ? `course_id.is.null,course_id.in.(${courseIds.join(",")})`
    : "course_id.is.null";

  const { data, error } = await supabase
    .from("notices")
    .select("id, title, body, created_at, course_id, courses(title)")
    .or(orClause)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body,
    courseId: row.course_id,
    courseTitle: (row.courses as { title: string } | null)?.title ?? null,
    createdAt: row.created_at,
  }));
  return { data: rows, error: null };
}

/**
 * Platform-wide events plus events for any course the signed-in user is
 * enrolled in or staffed on, within an inclusive date range (YYYY-MM-DD
 * strings).
 */
export async function fetchMyEvents(from: string, to: string): Promise<ListResult<CourseEvent>> {
  const [enrolledIds, staffedIds] = await Promise.all([
    fetchEnrolledCourseIds(),
    fetchStaffedCourseIds(),
  ]);
  const courseIds = Array.from(new Set([...enrolledIds, ...staffedIds]));
  const orClause = courseIds.length
    ? `course_id.is.null,course_id.in.(${courseIds.join(",")})`
    : "course_id.is.null";

  const { data, error } = await supabase
    .from("course_events")
    .select("id, title, description, event_date, course_id, courses(title)")
    .or(orClause)
    .gte("event_date", from)
    .lte("event_date", to)
    .order("event_date");
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.event_date,
    courseId: row.course_id,
    courseTitle: (row.courses as { title: string } | null)?.title ?? null,
  }));
  return { data: rows, error: null };
}
