import { supabase } from "@/integrations/supabase/client";
import type { AppRole, CourseStaffRole } from "@/academy/lib/roles";
import type { ListResult } from "@/academy/lib/teaching";

export type PlatformStats = {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalInstructors: number;
  totalTAs: number;
};

/** Platform-wide counts. Visible to super_admin (full) and auditor (via the
 * auditor read policies on enrollments/lesson_progress; profiles/course
 * counts use head-count queries that don't expose row contents). Any one
 * of the five counts failing (e.g. an RLS/permission problem) surfaces as
 * an error rather than silently rendering "0" for that card. */
export async function fetchPlatformStats(): Promise<{
  data: PlatformStats | null;
  error: string | null;
}> {
  const [users, courses, enrollments, instructors, tas] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("enrollments").select("id", { count: "exact", head: true }),
    supabase.from("course_staff").select("id", { count: "exact", head: true }).eq("role", "instructor"),
    supabase
      .from("course_staff")
      .select("id", { count: "exact", head: true })
      .eq("role", "teaching_assistant"),
  ]);

  const firstError = [users, courses, enrollments, instructors, tas].find((r) => r.error)?.error;
  if (firstError) return { data: null, error: firstError.message };

  return {
    data: {
      totalUsers: users.count ?? 0,
      totalCourses: courses.count ?? 0,
      totalEnrollments: enrollments.count ?? 0,
      totalInstructors: instructors.count ?? 0,
      totalTAs: tas.count ?? 0,
    },
    error: null,
  };
}

export type AdminProfileRow = {
  id: string;
  fullName: string | null;
  email: string | null;
  organisation: string | null;
  staffEligible: boolean;
  platformRoles: AppRole[];
  courseStaff: { staffId: string; courseId: string; courseTitle: string; role: CourseStaffRole }[];
};

// PostgREST's `.or()` takes a raw, comma-separated filter list, so a comma
// (or parenthesis/colon/period) in the search value would otherwise split
// or corrupt that list instead of being matched literally. Wrapping the
// value in double quotes makes the whole thing an opaque string as far as
// the filter-list parser is concerned; backslash and embedded double
// quotes then need their own escaping per PostgREST's quoting rules.
function escapeOrFilterValue(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

// Separately, `%` and `_` are ILIKE wildcards -- left unescaped, a searcher
// typing e.g. "50%" would silently match far more than intended. Escape
// them (and the backslash that escapes them) to literal characters first.
function escapeIlikeWildcards(value: string): string {
  return value.replace(/[\\%_]/g, (c) => `\\${c}`);
}

export const PROFILE_SEARCH_PAGE_SIZE = 25;

export type ProfileSearchResult = {
  rows: AdminProfileRow[];
  total: number;
  error: string | null;
};

/** Search across all profiles by name or email. Only super_admin can see
 * rows beyond their own under RLS, so this is effectively admin-only.
 * `staffEligibleOnly` narrows to accounts whose sign-up email matched the
 * @quantum-basics.com domain gate (see 20260822110000_staff_eligibility.sql)
 * -- the shortlist an admin actually wants when staffing a course, without
 * losing the ability to search every account for platform-role changes.
 * Paginated via `page` (0-indexed, PROFILE_SEARCH_PAGE_SIZE per page) —
 * `total` is the full match count so the UI can show "X of Y" and a
 * Load more affordance instead of silently truncating at 25. */
export async function searchProfiles(
  query: string,
  options: { staffEligibleOnly?: boolean; page?: number } = {},
): Promise<ProfileSearchResult> {
  const trimmed = query.trim();
  const page = options.page ?? 0;
  const from = page * PROFILE_SEARCH_PAGE_SIZE;
  const to = from + PROFILE_SEARCH_PAGE_SIZE - 1;

  let builder = supabase
    .from("profiles")
    .select(
      "id, full_name, email, organisation, staff_eligible, user_roles(role), course_staff(id, role, courses(id, title))",
      { count: "exact" },
    )
    .order("full_name", { ascending: true })
    .range(from, to);

  if (options.staffEligibleOnly) {
    builder = builder.eq("staff_eligible", true);
  }

  if (trimmed) {
    const pattern = escapeOrFilterValue(`%${escapeIlikeWildcards(trimmed)}%`);
    builder = builder.or(`full_name.ilike.${pattern},email.ilike.${pattern}`);
  }

  const { data, error, count } = await builder;
  if (error) return { rows: [], total: 0, error: error.message };

  const rows = (data ?? []).map((row) => {
    const roleRows = (row.user_roles ?? []) as { role: AppRole }[];
    const staffRows = (row.course_staff ?? []) as {
      id: string;
      role: CourseStaffRole;
      courses: { id: string; title: string } | null;
    }[];
    return {
      id: row.id,
      fullName: row.full_name,
      email: row.email,
      organisation: row.organisation,
      staffEligible: Boolean(row.staff_eligible),
      platformRoles: roleRows.map((r) => r.role),
      courseStaff: staffRows
        .filter((r) => r.courses)
        .map((r) => ({
          staffId: r.id,
          courseId: r.courses!.id,
          courseTitle: r.courses!.title,
          role: r.role,
        })),
    };
  });
  return { rows, total: count ?? rows.length, error: null };
}

export type AdminCourse = {
  id: string;
  slug: string;
  title: string;
  track: string;
  staff: { id: string; userId: string; role: CourseStaffRole; fullName: string | null }[];
};

/** Every course with its current staffing, for the assignment picker. */
export async function fetchAllCoursesWithStaff(): Promise<ListResult<AdminCourse>> {
  const { data, error } = await supabase
    .from("courses")
    .select("id, slug, title, track, course_staff(id, user_id, role, profiles(full_name))")
    .order("sort_order");
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => {
    const staffRows = (row.course_staff ?? []) as {
      id: string;
      user_id: string;
      role: CourseStaffRole;
      profiles: { full_name: string | null } | null;
    }[];
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      track: row.track,
      staff: staffRows.map((s) => ({
        id: s.id,
        userId: s.user_id,
        role: s.role,
        fullName: s.profiles?.full_name ?? null,
      })),
    };
  });
  return { data: rows, error: null };
}

const ASSIGNABLE_PLATFORM_ROLES: AppRole[] = ["super_admin", "auditor", "student"];

export function isAssignablePlatformRole(role: AppRole): boolean {
  return ASSIGNABLE_PLATFORM_ROLES.includes(role);
}

export async function assignPlatformRole(
  userId: string,
  role: AppRole,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  return { error: error?.message ?? null };
}

export async function removePlatformRole(
  userId: string,
  role: AppRole,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
  return { error: error?.message ?? null };
}

/** Super-admin-only: assign a course's instructor or TA directly (no
 * enrolment prerequisite — that requirement only applies to an instructor
 * self-service-adding a TA, see lib/staff.ts). */
export async function assignCourseStaff(
  courseId: string,
  userId: string,
  role: CourseStaffRole,
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("course_staff")
    .insert({ course_id: courseId, user_id: userId, role });
  return { error: error?.message ?? null };
}
