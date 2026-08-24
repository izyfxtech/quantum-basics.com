import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { A as Clock, V as ArrowRight, z as BookOpen } from "../_libs/lucide-react.mjs";
import { i as PortalHeading, o as Spinner, r as Panel } from "./ui-pvzeBS6D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy.courses.index-DgyMj1BR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CourseCatalogue() {
	const [courses, setCourses] = (0, import_react.useState)(null);
	const [enrolled, setEnrolled] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		let active = true;
		(async () => {
			const { data } = await supabase.from("courses").select("id, slug, title, summary, track, level, duration").order("sort_order");
			if (!active) return;
			setCourses(data ?? []);
			const { data: session } = await supabase.auth.getUser();
			if (!session.user) return;
			const { data: rows } = await supabase.from("enrollments").select("course_id");
			if (active) setEnrolled(new Set((rows ?? []).map((r) => r.course_id)));
		})();
		return () => {
			active = false;
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa qa-wrap py-10 md:py-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalHeading, {
			label: "Learning portal",
			title: "Course catalogue",
			description: "Self-paced online modules drawn from the work we do in the field. Enrol, work through the lessons and track your progress from your dashboard.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/academy/dashboard",
				className: "inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline",
				children: ["Go to my dashboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
			})
		}), courses === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { label: "Loading courses…" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: courses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "flex flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "qa-label text-primary",
						children: course.track
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-lg font-semibold",
						children: course.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 flex-1 text-sm leading-relaxed text-muted-foreground",
						children: course.summary
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-3.5 w-3.5" }),
								" ",
								course.level
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
								" ",
								course.duration
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/academy/courses/$slug",
						params: { slug: course.slug },
						className: "mt-5 inline-flex h-10 items-center justify-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep",
						children: [enrolled.has(course.id) ? "Continue course" : "View course", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			}, course.id))
		})]
	});
}
//#endregion
export { CourseCatalogue as component };
