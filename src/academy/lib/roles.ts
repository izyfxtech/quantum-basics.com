import { supabase } from "@/integrations/supabase/client";
import type { Enums } from "@/integrations/supabase/types";

export type AppRole = Enums<"app_role">;
export type CourseStaffRole = Extract<AppRole, "instructor" | "teaching_assistant">;

export type CourseStaffAssignment = {
  courseId: string;
  role: CourseStaffRole;
};

/** Everything the signed-in user is allowed to do, gathered in one place. */
export type MyAccess = {
  userId: string;
  platformRoles: AppRole[];
  courseStaff: CourseStaffAssignment[];
};

const EMPTY_ACCESS_ROLES: AppRole[] = [];
const EMPTY_COURSE_STAFF: CourseStaffAssignment[] = [];

export async function fetchMyAccess(): Promise<MyAccess | null> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return null;

  const [{ data: roleRows }, { data: staffRows }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", userId),
    supabase.from("course_staff").select("course_id, role").eq("user_id", userId),
  ]);

  return {
    userId,
    platformRoles: (roleRows ?? []).map((r) => r.role) ?? EMPTY_ACCESS_ROLES,
    courseStaff:
      (staffRows ?? []).map((r) => ({
        courseId: r.course_id,
        role: r.role as CourseStaffRole,
      })) ?? EMPTY_COURSE_STAFF,
  };
}

export function isSuperAdmin(access: MyAccess | null): boolean {
  return Boolean(access?.platformRoles.includes("super_admin"));
}

export function isAuditor(access: MyAccess | null): boolean {
  return Boolean(access?.platformRoles.includes("auditor"));
}

export function instructorCourseIds(access: MyAccess | null): string[] {
  return access?.courseStaff.filter((a) => a.role === "instructor").map((a) => a.courseId) ?? [];
}

export function taCourseIds(access: MyAccess | null): string[] {
  return (
    access?.courseStaff.filter((a) => a.role === "teaching_assistant").map((a) => a.courseId) ??
    []
  );
}

export function staffCourseIds(access: MyAccess | null): string[] {
  return access?.courseStaff.map((a) => a.courseId) ?? [];
}

export function isCourseInstructor(access: MyAccess | null, courseId: string): boolean {
  return isSuperAdmin(access) || instructorCourseIds(access).includes(courseId);
}

export function isCourseStaff(access: MyAccess | null, courseId: string): boolean {
  return isSuperAdmin(access) || staffCourseIds(access).includes(courseId);
}

export function hasElevatedAccess(access: MyAccess | null): boolean {
  return Boolean(
    access &&
      (isSuperAdmin(access) || isAuditor(access) || access.courseStaff.length > 0),
  );
}

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super Admin",
  instructor: "Instructor",
  teaching_assistant: "Teaching Assistant",
  student: "Student",
  auditor: "Auditor",
};

/** All distinct role labels the user currently holds, for badges/nav. */
export function roleBadges(access: MyAccess | null): string[] {
  if (!access) return [];
  const labels = new Set<string>();
  for (const r of access.platformRoles) labels.add(ROLE_LABELS[r]);
  for (const a of access.courseStaff) labels.add(ROLE_LABELS[a.role]);
  if (labels.size === 0) labels.add(ROLE_LABELS.student);
  return Array.from(labels);
}
