import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { A as Clock, F as Check, H as ArrowLeft, M as ChevronLeft, N as ChevronRight, x as Lock } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-TQIET5v8.mjs";
import { n as Meter, o as Spinner, r as Panel, s as Tag, t as Btn } from "./ui-pvzeBS6D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy.courses._slug-Bhx--UkJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fetchLessonPreviews(courseId) {
	return supabase.rpc("course_lesson_previews", { _course_id: courseId });
}
function CoursePage() {
	const { slug } = Route.useParams();
	const navigate = useNavigate();
	const [course, setCourse] = (0, import_react.useState)(null);
	const [previews, setPreviews] = (0, import_react.useState)([]);
	const [bodies, setBodies] = (0, import_react.useState)(/* @__PURE__ */ new Map());
	const [done, setDone] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [enrolled, setEnrolled] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const unlocked = enrolled;
	const load = (0, import_react.useCallback)(async () => {
		const { data: c } = await supabase.from("courses").select("id, title, summary, track, level, duration").eq("slug", slug).maybeSingle();
		if (!c) {
			setLoading(false);
			return;
		}
		setCourse(c);
		const { data: ls } = await fetchLessonPreviews(c.id);
		const sorted = [...ls ?? []].sort((a, b) => a.sort_order - b.sort_order);
		setPreviews(sorted);
		setActive((prev) => prev ?? sorted[0]?.id ?? null);
		const { data: session } = await supabase.auth.getUser();
		setSignedIn(Boolean(session.user));
		if (session.user) {
			const { data: e } = await supabase.from("enrollments").select("id").eq("course_id", c.id).maybeSingle();
			setEnrolled(Boolean(e));
			const { data: full } = await supabase.from("lessons").select("id, body").eq("course_id", c.id);
			if (full?.length) setBodies(new Map(full.map((l) => [l.id, l.body])));
			const ids = sorted.map((l) => l.id);
			if (ids.length) {
				const { data: p } = await supabase.from("lesson_progress").select("lesson_id").in("lesson_id", ids);
				setDone(new Set((p ?? []).map((r) => r.lesson_id)));
			}
		}
		setLoading(false);
	}, [slug]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function enrol() {
		if (!course) return;
		const { data: session } = await supabase.auth.getUser();
		if (!session.user) {
			navigate({ to: "/academy/auth" });
			return;
		}
		setBusy(true);
		await supabase.from("enrollments").insert({
			user_id: session.user.id,
			course_id: course.id
		});
		setEnrolled(true);
		const { data: full } = await supabase.from("lessons").select("id, body").eq("course_id", course.id);
		if (full?.length) setBodies(new Map(full.map((l) => [l.id, l.body])));
		setBusy(false);
	}
	async function toggleLesson(lessonId) {
		const { data: session } = await supabase.auth.getUser();
		if (!session.user) {
			navigate({ to: "/academy/auth" });
			return;
		}
		if (done.has(lessonId)) {
			await supabase.from("lesson_progress").delete().eq("lesson_id", lessonId);
			setDone((prev) => {
				const next = new Set(prev);
				next.delete(lessonId);
				return next;
			});
		} else {
			await supabase.from("lesson_progress").insert({
				user_id: session.user.id,
				lesson_id: lessonId
			});
			setDone((prev) => new Set(prev).add(lessonId));
		}
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "qa qa-wrap py-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { label: "Loading course…" })
	});
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa qa-wrap py-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-xl font-semibold",
			children: "Course not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/academy/courses",
			className: "mt-4 inline-block text-sm font-semibold text-primary",
			children: "Back to the catalogue"
		})]
	});
	const pct = previews.length ? Math.round(done.size / previews.length * 100) : 0;
	const activeIndex = previews.findIndex((l) => l.id === active);
	const activeLesson = activeIndex >= 0 ? previews[activeIndex] : null;
	const activeBody = activeLesson ? bodies.get(activeLesson.id) : void 0;
	const activeDone = activeLesson ? done.has(activeLesson.id) : false;
	const prevLesson = activeIndex > 0 ? previews[activeIndex - 1] : null;
	const nextLesson = activeIndex >= 0 && activeIndex < previews.length - 1 ? previews[activeIndex + 1] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa qa-wrap py-10 md:py-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/academy/courses",
				className: "inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " All courses"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: course.track }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-2xl md:text-[1.75rem]",
						children: course.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground",
						children: course.summary
					})
				] }), enrolled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "qa-label rounded border border-primary/25 bg-primary/8 px-3 py-1.5 text-primary",
					children: [
						"Enrolled · ",
						pct,
						"% complete"
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
					onClick: enrol,
					disabled: busy,
					children: signedIn ? "Enrol in this course" : "Sign in to enrol"
				})]
			}),
			enrolled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, { percent: pct }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: [
						done.size,
						" of ",
						previews.length,
						" lessons complete"
					]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-[19rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					"aria-label": "Lessons",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "space-y-1.5",
						children: previews.map((lesson, i) => {
							const isDone = done.has(lesson.id);
							const isActive = active === lesson.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActive(lesson.id),
								"aria-current": isActive ? "true" : void 0,
								className: `flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-6 w-6 shrink-0 place-items-center rounded-full text-[0.65rem] font-semibold ${isDone ? "bg-primary text-primary-foreground" : "border border-[var(--qa-line)] text-muted-foreground"}`,
									children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 truncate font-medium",
										children: [lesson.title, !unlocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3 shrink-0 text-muted-foreground" }) : null]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-0.5 flex items-center gap-1 text-xs text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
											" ",
											lesson.minutes,
											" min"
										]
									})]
								})]
							}) }, lesson.id);
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: activeLesson ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "qa-label text-muted-foreground",
						children: [
							"Lesson ",
							activeIndex + 1,
							" of ",
							previews.length,
							" · ",
							activeLesson.minutes,
							" min"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 text-lg font-semibold",
						children: activeLesson.title
					}),
					unlocked && activeBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "qa-prose mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: activeBody })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex flex-wrap items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							variant: activeDone ? "outline" : "solid",
							onClick: () => toggleLesson(activeLesson.id),
							children: activeDone ? "Mark as not complete" : "Mark lesson complete"
						})
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), signedIn ? "Enrol in this course to unlock the full lesson." : "Sign in and enrol in this course to unlock the full lesson."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
							onClick: enrol,
							disabled: busy,
							children: signedIn ? "Enrol in this course" : "Sign in to enrol"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex items-center justify-between border-t border-[var(--qa-line)] pt-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !prevLesson,
							onClick: () => prevLesson && setActive(prevLesson.id),
							className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" }), " Previous"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: !nextLesson,
							onClick: () => nextLesson && setActive(nextLesson.id),
							className: "inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40",
							children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "This course has no lessons yet."
				}) })]
			})
		]
	});
}
//#endregion
export { CoursePage as component };
