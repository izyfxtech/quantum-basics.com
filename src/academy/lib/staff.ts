import { supabase } from "@/integrations/supabase/client";
import type { CourseStaffRole } from "@/academy/lib/roles";
import type { ListResult } from "@/academy/lib/teaching";

export type RosterEntry = {
  enrollmentId: string;
  userId: string;
  fullName: string | null;
  email: string | null;
  organisation: string | null;
  completedLessons: number;
  totalLessons: number;
  percent: number;
};

export type CourseStaffMember = {
  id: string;
  userId: string;
  role: CourseStaffRole;
  fullName: string | null;
  email: string | null;
};

/** Roster + per-student progress for a single course. Visible to that
 * course's instructor/TA (or a super admin) under RLS. */
export async function fetchCourseRoster(courseId: string): Promise<ListResult<RosterEntry>> {
  const [enrollmentsRes, lessonsRes] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, user_id, profiles(full_name, email, organisation)")
      .eq("course_id", courseId),
    supabase.from("lessons").select("id").eq("course_id", courseId),
  ]);
  if (enrollmentsRes.error) return { data: [], error: enrollmentsRes.error.message };
  if (lessonsRes.error) return { data: [], error: lessonsRes.error.message };

  const lessonIds = (lessonsRes.data ?? []).map((l) => l.id);
  const totalLessons = lessonIds.length;

  let completedByUser = new Map<string, number>();
  if (lessonIds.length) {
    const { data: progress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("user_id, lesson_id")
      .in("lesson_id", lessonIds);
    if (progressError) return { data: [], error: progressError.message };
    completedByUser = new Map();
    for (const row of progress ?? []) {
      completedByUser.set(row.user_id, (completedByUser.get(row.user_id) ?? 0) + 1);
    }
  }

  const rows = (enrollmentsRes.data ?? []).map((row) => {
    const profile = row.profiles as {
      full_name: string | null;
      email: string | null;
      organisation: string | null;
    } | null;
    const completed = completedByUser.get(row.user_id) ?? 0;
    return {
      enrollmentId: row.id,
      userId: row.user_id,
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? null,
      organisation: profile?.organisation ?? null,
      completedLessons: completed,
      totalLessons,
      percent: totalLessons ? Math.round((completed / totalLessons) * 100) : 0,
    };
  });
  return { data: rows, error: null };
}

/** Instructors + TAs currently staffed on a course. */
export async function fetchCourseStaffList(courseId: string): Promise<ListResult<CourseStaffMember>> {
  const { data, error } = await supabase
    .from("course_staff")
    .select("id, user_id, role, profiles(full_name, email)")
    .eq("course_id", courseId);
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => {
    const profile = row.profiles as { full_name: string | null; email: string | null } | null;
    return {
      id: row.id,
      userId: row.user_id,
      role: row.role as CourseStaffRole,
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? null,
    };
  });
  return { data: rows, error: null };
}

/** An instructor promotes one of their currently-enrolled students to TA on
 * their own course. RLS restricts this to the course's instructor(s) and
 * to the 'teaching_assistant' role — it cannot be used to add instructors. */
export async function promoteStudentToTA(
  courseId: string,
  userId: string,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("course_staff")
    .insert({ course_id: courseId, user_id: userId, role: "teaching_assistant" });
  return { error: error?.message ?? null };
}

/** Remove a course_staff row (super admin: any row; instructor: only a TA
 * row on a course they instruct — both enforced by RLS). */
export async function removeCourseStaffMember(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("course_staff").delete().eq("id", id);
  return { error: error?.message ?? null };
}
