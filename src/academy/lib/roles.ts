import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
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

// AcademyShell and several individual pages (dashboard, admin, teaching)
// each call fetchMyAccess() on their own mount, so a single first visit to
// the Academy could fire this same pair of queries 2-3 times over. Same
// short-TTL, dedup-in-flight pattern as getCurrentUser() -- a role change
// can take up to this long to show up in nav badges/elevated-access
// branches, which is an acceptable tradeoff for "my own roles, for
// display and client-side branching" (every actual authorization decision
// still happens at the RLS/route-guard level against a live query, not
// against this cache).
const ACCESS_CACHE_TTL_MS = 15_000;
let cached: { access: MyAccess | null; expiresAt: number } | null = null;
let inFlight: Promise<MyAccess | null> | null = null;

if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange(() => {
    cached = null;
    inFlight = null;
  });
}

async function fetchMyAccessUncached(): Promise<MyAccess | null> {
  const user = await getCurrentUser();
  const userId = user?.id;
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

export async function fetchMyAccess(): Promise<MyAccess | null> {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.access;
  if (inFlight) return inFlight;

  inFlight = fetchMyAccessUncached()
    .then((access) => {
      cached = { access, expiresAt: Date.now() + ACCESS_CACHE_TTL_MS };
      return access;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
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
