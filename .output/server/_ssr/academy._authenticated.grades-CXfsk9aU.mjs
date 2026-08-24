import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as isSuperAdmin, l as fetchMyProgress, m as roleBadges, o as fetchMyAccess, t as PortalShell } from "./roles-X33_OEsl.mjs";
import { i as PortalHeading, n as Meter, o as Spinner, r as Panel } from "./ui-pvzeBS6D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._authenticated.grades-CXfsk9aU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Grades are derived from lesson completion — this LMS doesn't have
* separate scored assessments yet, so "grade" here means course
* completion, banded into the labels below.
*/
function band(percent) {
	if (percent >= 100) return {
		label: "Complete",
		tone: "text-primary"
	};
	if (percent >= 70) return {
		label: "On track",
		tone: "text-primary"
	};
	if (percent >= 30) return {
		label: "In progress",
		tone: "text-muted-foreground"
	};
	if (percent > 0) return {
		label: "Just started",
		tone: "text-muted-foreground"
	};
	return {
		label: "Not started",
		tone: "text-muted-foreground"
	};
}
function AcademyGrades() {
	const [progress, setProgress] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [admin, setAdmin] = (0, import_react.useState)(false);
	const load = (0, import_react.useCallback)(async () => {
		const access = await fetchMyAccess();
		setRoles(roleBadges(access));
		setAdmin(isSuperAdmin(access));
		setProgress(await fetchMyProgress());
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const overall = progress?.length ? Math.round(progress.reduce((sum, p) => sum + p.percent, 0) / progress.length) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		name: "Grades",
		roles,
		showAdmin: admin,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalHeading, {
			label: "Academy",
			title: "Grades",
			description: "Grades reflect lesson completion within each course you're enrolled on."
		}), progress === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { label: "Loading grades…" }) : progress.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"You are not enrolled on any course yet.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/academy/courses",
					className: "font-semibold text-primary hover:underline",
					children: "Browse the catalogue"
				}),
				" ",
				"to get started."
			]
		}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mb-4 flex items-center justify-between gap-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "qa-label text-muted-foreground",
				children: "Overall"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-2xl font-semibold",
				children: [overall, "%"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-w-xs flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { percent: overall })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: progress.map((item) => {
				const b = band(item.percent);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "qa-label text-primary",
									children: item.course.track
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 text-base font-semibold",
									children: item.course.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: [
										item.completedLessons,
										" of ",
										item.totalLessons,
										" lessons complete"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xl font-semibold",
								children: [item.percent, "%"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `qa-label ${b.tone}`,
								children: b.label
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { percent: item.percent })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/academy/courses/$slug",
						params: { slug: item.course.slug },
						className: "mt-4 inline-block text-sm font-semibold text-primary hover:underline",
						children: item.percent === 100 ? "Review course" : "Continue course"
					})
				] }, item.course.id);
			})
		})] })]
	});
}
//#endregion
export { AcademyGrades as component };
