import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { M as ChevronLeft, N as ChevronRight } from "../_libs/lucide-react.mjs";
import { f as isSuperAdmin, m as roleBadges, o as fetchMyAccess, s as fetchMyEvents, t as PortalShell } from "./roles-X33_OEsl.mjs";
import { i as PortalHeading, o as Spinner, r as Panel } from "./ui-pvzeBS6D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._authenticated.calendar-Cy2endWP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MONTH_FORMAT = new Intl.DateTimeFormat(void 0, {
	month: "long",
	year: "numeric"
});
var WEEKDAY_LABELS = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];
function toDateKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
/** Sun-start 6x7 grid covering the given month, including lead/trail days
* from the adjacent months so every week row is full. */
function monthGrid(year, month) {
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
	const today = /* @__PURE__ */ new Date();
	const [year, setYear] = (0, import_react.useState)(today.getFullYear());
	const [month, setMonth] = (0, import_react.useState)(today.getMonth());
	const [events, setEvents] = (0, import_react.useState)(null);
	const [roles, setRoles] = (0, import_react.useState)([]);
	const [admin, setAdmin] = (0, import_react.useState)(false);
	const grid = (0, import_react.useMemo)(() => monthGrid(year, month), [year, month]);
	const todayKey = toDateKey(today);
	const load = (0, import_react.useCallback)(async () => {
		setEvents(null);
		const access = await fetchMyAccess();
		setRoles(roleBadges(access));
		setAdmin(isSuperAdmin(access));
		const gridStart = grid.at(0);
		const gridEnd = grid.at(-1);
		if (!gridStart || !gridEnd) return;
		setEvents(await fetchMyEvents(toDateKey(gridStart), toDateKey(gridEnd)));
	}, [grid]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	function goToMonth(delta) {
		const next = new Date(year, month + delta, 1);
		setYear(next.getFullYear());
		setMonth(next.getMonth());
	}
	const eventsByDate = /* @__PURE__ */ new Map();
	for (const event of events ?? []) {
		const list = eventsByDate.get(event.date) ?? [];
		list.push(event);
		eventsByDate.set(event.date, list);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		name: "Calendar",
		roles,
		showAdmin: admin,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalHeading, {
				label: "Academy",
				title: "Calendar",
				description: "Deadlines and events for the courses you're enrolled on, plus academy-wide dates."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-semibold",
					children: MONTH_FORMAT.format(new Date(year, month))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Previous month",
						onClick: () => goToMonth(-1),
						className: "grid h-8 w-8 place-items-center rounded border border-[var(--qa-line)] hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Next month",
						onClick: () => goToMonth(1),
						className: "grid h-8 w-8 place-items-center rounded border border-[var(--qa-line)] hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
					})]
				})]
			}), events === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, { label: "Loading events…" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-px overflow-hidden rounded border border-[var(--qa-line)] bg-[var(--qa-line)] text-xs font-semibold text-muted-foreground",
					children: WEEKDAY_LABELS.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-secondary/60 px-2 py-1.5 text-center",
						children: label
					}, label))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-px overflow-hidden rounded-b border-x border-b border-[var(--qa-line)] bg-[var(--qa-line)]",
					children: grid.map((date) => {
						const key = toDateKey(date);
						const inMonth = date.getMonth() === month;
						const dayEvents = eventsByDate.get(key) ?? [];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `min-h-[5.5rem] bg-card p-1.5 ${inMonth ? "" : "bg-secondary/30 text-muted-foreground/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${key === todayKey ? "bg-primary font-semibold text-primary-foreground" : ""}`,
								children: date.getDate()
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 space-y-1",
								children: [dayEvents.slice(0, 2).map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									title: event.description ?? event.title,
									className: "truncate rounded bg-primary/10 px-1.5 py-0.5 text-[0.65rem] font-medium text-primary",
									children: event.title
								}, event.id)), dayEvents.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[0.65rem] text-muted-foreground",
									children: [
										"+",
										dayEvents.length - 2,
										" more"
									]
								}) : null]
							})]
						}, key);
					})
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "qa-label text-muted-foreground",
					children: "Upcoming"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 space-y-2",
					children: [(events ?? []).filter((e) => e.date >= todayKey).slice(0, 8).map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "flex items-center justify-between gap-4 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: event.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: event.courseTitle ?? "Academy-wide"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "qa-label text-muted-foreground",
							children: (/* @__PURE__ */ new Date(`${event.date}T00:00:00`)).toLocaleDateString(void 0, {
								month: "short",
								day: "numeric"
							})
						})]
					}, event.id)), events !== null && events.filter((e) => e.date >= todayKey).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing scheduled ahead."
					}) : null]
				})]
			})
		]
	});
}
//#endregion
export { AcademyCalendar as component };
