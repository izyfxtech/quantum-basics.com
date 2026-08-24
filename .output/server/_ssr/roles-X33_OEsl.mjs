import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { C as LayoutDashboard, I as Calendar, b as LogOut, g as Menu, l as ShieldCheck, n as X, w as GraduationCap, z as BookOpen } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/roles-X33_OEsl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Shell for the signed-in LMS (dashboard, course player, onboarding, admin).
* A product surface with a dark rail — no marketing header, hero or footer.
*/
function PortalShell({ name, roles, showAdmin, children }) {
	const navigate = useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	const nav = [
		{
			to: "/academy/dashboard",
			label: "My learning",
			icon: LayoutDashboard
		},
		{
			to: "/academy/courses",
			label: "Catalogue",
			icon: BookOpen
		},
		{
			to: "/academy/calendar",
			label: "Calendar",
			icon: Calendar
		},
		{
			to: "/academy/grades",
			label: "Grades",
			icon: GraduationCap
		}
	];
	if (showAdmin) nav.push({
		to: "/academy/admin",
		label: "Administration",
		icon: ShieldCheck
	});
	async function signOut() {
		await supabase.auth.signOut();
		navigate({
			to: "/academy/auth",
			replace: true
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa flex min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-60 shrink-0 flex-col bg-[var(--qa-rail)] text-[var(--qa-rail-fg)] lg:flex",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
					name,
					roles,
					nav,
					onSignOut: signOut,
					onNavigate: () => {}
				})
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 bg-black/60",
					"aria-hidden": "true",
					onClick: () => setOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "relative flex h-full w-64 flex-col bg-[var(--qa-rail)] text-[var(--qa-rail-fg)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Close menu",
						onClick: () => setOpen(false),
						className: "absolute right-3 top-4 text-[var(--qa-rail-muted)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
						name,
						roles,
						nav,
						onSignOut: signOut,
						onNavigate: () => setOpen(false)
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-14 items-center gap-3 bg-[var(--qa-rail)] px-4 text-[var(--qa-rail-fg)] lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Open menu",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "qa-label",
						children: "Quantum Basics Academy"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-5 py-8 lg:px-10 lg:py-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto w-full max-w-5xl",
						children
					})
				})]
			})
		]
	});
}
function Rail({ name, roles, nav, onSignOut, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-14 items-center gap-2.5 px-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground",
				children: "QB"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "qa-label",
				children: "Academy"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex-1 space-y-0.5 px-3 py-4",
			children: nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				activeProps: { className: "bg-white/10 text-white" },
				inactiveProps: { className: "text-[var(--qa-rail-muted)] hover:bg-white/5" },
				className: "flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), item.label]
			}, item.to))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-white/10 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-semibold",
					children: name
				}),
				roles.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "qa-label mt-1 text-[var(--qa-rail-muted)]",
					children: roles.join(" · ")
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onSignOut,
					className: "mt-4 inline-flex w-full items-center justify-center gap-2 rounded border border-white/15 px-3 py-2 text-xs font-semibold text-[var(--qa-rail-fg)] transition-colors hover:bg-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Sign out"]
				})
			]
		})
	] });
}
var COURSE_COLUMNS = "id, slug, title, summary, track, level, duration";
async function fetchCourses() {
	const { data } = await supabase.from("courses").select(COURSE_COLUMNS).order("sort_order");
	return data ?? [];
}
async function fetchCoursesByIds(ids) {
	if (!ids.length) return [];
	const { data } = await supabase.from("courses").select(COURSE_COLUMNS).in("id", ids);
	return data ?? [];
}
async function fetchEnrolledCourseIds() {
	const { data } = await supabase.from("enrollments").select("course_id");
	return (data ?? []).map((row) => row.course_id);
}
async function fetchCompletedLessonIds(lessonIds) {
	if (!lessonIds.length) return [];
	const { data } = await supabase.from("lesson_progress").select("lesson_id").in("lesson_id", lessonIds);
	return (data ?? []).map((row) => row.lesson_id);
}
/** courseId null posts an academy-wide notice/event. RLS restricts this to
* super admins and, for a specific course, that course's staff. */
async function postNotice(input) {
	const { data: user } = await supabase.auth.getUser();
	return supabase.from("notices").insert({
		title: input.title,
		body: input.body,
		course_id: input.courseId,
		created_by: user.user?.id ?? null
	});
}
async function createEvent(input) {
	const { data: user } = await supabase.auth.getUser();
	return supabase.from("course_events").insert({
		title: input.title,
		description: input.description || null,
		event_date: input.date,
		course_id: input.courseId,
		created_by: user.user?.id ?? null
	});
}
async function unenrol(courseId) {
	await supabase.from("enrollments").delete().eq("course_id", courseId);
}
/** Progress for every course the signed-in learner is enrolled on. */
async function fetchMyProgress() {
	const enrolledIds = await fetchEnrolledCourseIds();
	if (!enrolledIds.length) return [];
	const { data: courses } = await supabase.from("courses").select(COURSE_COLUMNS).in("id", enrolledIds).order("sort_order");
	const { data: lessons } = await supabase.from("lessons").select("id, title, body, minutes, course_id, sort_order").in("course_id", enrolledIds).order("sort_order");
	const completed = new Set(await fetchCompletedLessonIds((lessons ?? []).map((lesson) => lesson.id)));
	return (courses ?? []).map((course) => {
		const courseLessons = (lessons ?? []).filter((lesson) => lesson.course_id === course.id);
		const done = courseLessons.filter((lesson) => completed.has(lesson.id));
		const next = courseLessons.find((lesson) => !completed.has(lesson.id)) ?? null;
		return {
			course,
			totalLessons: courseLessons.length,
			completedLessons: done.length,
			percent: courseLessons.length ? Math.round(done.length / courseLessons.length * 100) : 0,
			totalMinutes: courseLessons.reduce((sum, lesson) => sum + (lesson.minutes ?? 0), 0),
			nextLesson: next ? {
				id: next.id,
				title: next.title,
				body: next.body,
				minutes: next.minutes
			} : null
		};
	});
}
/**
* Platform-wide notices plus notices for any course the signed-in user is
* enrolled in — RLS enforces the same scope server-side (see migration
* 20260822090000_notices_and_events.sql), this mirrors it client-side so an
* anonymous or not-yet-enrolled visitor only ever queries what they can see.
*/
async function fetchMyNotices(limit = 8) {
	const enrolledIds = await fetchEnrolledCourseIds();
	const orClause = enrolledIds.length ? `course_id.is.null,course_id.in.(${enrolledIds.join(",")})` : "course_id.is.null";
	const { data } = await supabase.from("notices").select("id, title, body, created_at, course_id, courses(title)").or(orClause).order("created_at", { ascending: false }).limit(limit);
	return (data ?? []).map((row) => ({
		id: row.id,
		title: row.title,
		body: row.body,
		courseId: row.course_id,
		courseTitle: row.courses?.title ?? null,
		createdAt: row.created_at
	}));
}
/**
* Platform-wide events plus events for any course the signed-in user is
* enrolled in, within an inclusive date range (YYYY-MM-DD strings).
*/
async function fetchMyEvents(from, to) {
	const enrolledIds = await fetchEnrolledCourseIds();
	const orClause = enrolledIds.length ? `course_id.is.null,course_id.in.(${enrolledIds.join(",")})` : "course_id.is.null";
	const { data } = await supabase.from("course_events").select("id, title, description, event_date, course_id, courses(title)").or(orClause).gte("event_date", from).lte("event_date", to).order("event_date");
	return (data ?? []).map((row) => ({
		id: row.id,
		title: row.title,
		description: row.description,
		date: row.event_date,
		courseId: row.course_id,
		courseTitle: row.courses?.title ?? null
	}));
}
var EMPTY_ACCESS_ROLES = [];
var EMPTY_COURSE_STAFF = [];
async function fetchMyAccess() {
	const { data: userData } = await supabase.auth.getUser();
	const userId = userData.user?.id;
	if (!userId) return null;
	const [{ data: roleRows }, { data: staffRows }] = await Promise.all([supabase.from("user_roles").select("role").eq("user_id", userId), supabase.from("course_staff").select("course_id, role").eq("user_id", userId)]);
	return {
		userId,
		platformRoles: (roleRows ?? []).map((r) => r.role) ?? EMPTY_ACCESS_ROLES,
		courseStaff: (staffRows ?? []).map((r) => ({
			courseId: r.course_id,
			role: r.role
		})) ?? EMPTY_COURSE_STAFF
	};
}
function isSuperAdmin(access) {
	return Boolean(access?.platformRoles.includes("super_admin"));
}
function isAuditor(access) {
	return Boolean(access?.platformRoles.includes("auditor"));
}
function instructorCourseIds(access) {
	return access?.courseStaff.filter((a) => a.role === "instructor").map((a) => a.courseId) ?? [];
}
function staffCourseIds(access) {
	return access?.courseStaff.map((a) => a.courseId) ?? [];
}
function isCourseInstructor(access, courseId) {
	return isSuperAdmin(access) || instructorCourseIds(access).includes(courseId);
}
var ROLE_LABELS = {
	super_admin: "Super Admin",
	instructor: "Instructor",
	teaching_assistant: "Teaching Assistant",
	student: "Student",
	auditor: "Auditor"
};
/** All distinct role labels the user currently holds, for badges/nav. */
function roleBadges(access) {
	if (!access) return [];
	const labels = /* @__PURE__ */ new Set();
	for (const r of access.platformRoles) labels.add(ROLE_LABELS[r]);
	for (const a of access.courseStaff) labels.add(ROLE_LABELS[a.role]);
	if (labels.size === 0) labels.add(ROLE_LABELS.student);
	return Array.from(labels);
}
//#endregion
export { fetchCoursesByIds as a, fetchMyNotices as c, isCourseInstructor as d, isSuperAdmin as f, unenrol as g, staffCourseIds as h, fetchCourses as i, fetchMyProgress as l, roleBadges as m, ROLE_LABELS as n, fetchMyAccess as o, postNotice as p, createEvent as r, fetchMyEvents as s, PortalShell as t, isAuditor as u };
