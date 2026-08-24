import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { S as LoaderCircle, a as UserPlus, n as X, u as Search } from "../_libs/lucide-react.mjs";
import { i as fetchCourses, m as roleBadges, n as ROLE_LABELS, o as fetchMyAccess, p as postNotice, r as createEvent, t as PortalShell } from "./roles-X33_OEsl.mjs";
import { c as TextField, r as Panel, t as Btn } from "./ui-pvzeBS6D.mjs";
import { a as fetchPlatformStats, c as removeCourseStaffMember, l as removePlatformRole, n as assignPlatformRole, o as isAssignablePlatformRole, t as assignCourseStaff, u as searchProfiles } from "./staff-Bnu4PpAQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._authenticated.admin-EQ8NuGTu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLATFORM_ROLE_OPTIONS = [
	"super_admin",
	"auditor",
	"student"
];
var COURSE_ROLE_OPTIONS = ["instructor", "teaching_assistant"];
function AdminPanel() {
	const [name, setName] = (0, import_react.useState)("Admin");
	const [badges, setBadges] = (0, import_react.useState)([]);
	const [stats, setStats] = (0, import_react.useState)(null);
	const [courses, setCourses] = (0, import_react.useState)([]);
	const [query, setQuery] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)(null);
	const [searching, setSearching] = (0, import_react.useState)(false);
	const search = (0, import_react.useCallback)(async (q) => {
		setSearching(true);
		setResults(await searchProfiles(q));
		setSearching(false);
	}, []);
	const loadShell = (0, import_react.useCallback)(async () => {
		const [{ data: userData }, access, platformStats, courseList] = await Promise.all([
			supabase.auth.getUser(),
			fetchMyAccess(),
			fetchPlatformStats(),
			fetchCourses()
		]);
		if (userData.user) {
			const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", userData.user.id).maybeSingle();
			setName(profile?.full_name?.trim() || userData.user.email || "Admin");
		}
		setBadges(roleBadges(access));
		setStats(platformStats);
		setCourses(courseList);
	}, []);
	(0, import_react.useEffect)(() => {
		loadShell();
		search("");
	}, [loadShell, search]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PortalShell, {
		name,
		roles: badges,
		showAdmin: true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "qa-label text-primary",
					children: "Academy admin"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-2xl font-semibold tracking-tight md:text-3xl",
					children: "Roles & staffing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-xl text-sm text-muted-foreground",
					children: "Assign platform roles and staff courses with instructors and teaching assistants."
				})
			] }),
			stats ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Users",
						value: stats.totalUsers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Courses",
						value: stats.totalCourses
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Enrolments",
						value: stats.totalEnrollments
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Instructors",
						value: stats.totalInstructors
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Teaching assistants",
						value: stats.totalTAs
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoticeForm, { courses }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventForm, { courses })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold tracking-tight",
						children: "Find a user"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							search(query);
						},
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (e) => setQuery(e.target.value),
								placeholder: "Search by name or email…",
								className: "h-11 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
							children: "Search"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 space-y-4",
						children: searching ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Searching…"]
						}) : results && results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No users found."
						}) : results?.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminUserRow, {
							row,
							courses,
							onChanged: () => search(query)
						}, row.id))
					})
				]
			})
		]
	});
}
function CourseSelect({ courses, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "qa-label text-muted-foreground",
			children: "Scope"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "mt-1.5 h-11 w-full rounded border border-[var(--qa-line)] bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "",
				children: "Academy-wide"
			}), courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: c.id,
				children: c.title
			}, c.id))]
		})]
	});
}
function NoticeForm({ courses }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [courseId, setCourseId] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("idle");
	async function handleSubmit(e) {
		e.preventDefault();
		if (!title.trim() || !body.trim()) return;
		setBusy(true);
		const { error } = await postNotice({
			title: title.trim(),
			body: body.trim(),
			courseId: courseId || null
		});
		setBusy(false);
		if (error) {
			setStatus("error");
			return;
		}
		setStatus("posted");
		setTitle("");
		setBody("");
		setCourseId("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-base font-semibold",
		children: "Post a notice"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "mt-4 grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Title",
				value: title,
				onChange: setTitle,
				placeholder: "New module released",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "qa-label text-muted-foreground",
					children: "Body"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: body,
					onChange: (e) => setBody(e.target.value),
					required: true,
					rows: 3,
					className: "mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseSelect, {
				courses,
				value: courseId,
				onChange: setCourseId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				type: "submit",
				disabled: busy,
				children: busy ? "Posting…" : "Post notice"
			}),
			status === "posted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary",
				children: "Notice posted."
			}) : null,
			status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: "Couldn't post that notice. Try again."
			}) : null
		]
	})] });
}
function EventForm({ courses }) {
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)("");
	const [courseId, setCourseId] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("idle");
	async function handleSubmit(e) {
		e.preventDefault();
		if (!title.trim() || !date) return;
		setBusy(true);
		const { error } = await createEvent({
			title: title.trim(),
			description: description.trim(),
			date,
			courseId: courseId || null
		});
		setBusy(false);
		if (error) {
			setStatus("error");
			return;
		}
		setStatus("posted");
		setTitle("");
		setDescription("");
		setDate("");
		setCourseId("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-base font-semibold",
		children: "Add a calendar event"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "mt-4 grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Title",
				value: title,
				onChange: setTitle,
				placeholder: "Assessment window opens",
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
				label: "Date",
				type: "date",
				value: date,
				onChange: setDate,
				required: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "qa-label text-muted-foreground",
					children: "Description (optional)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 2,
					className: "mt-1.5 w-full rounded border border-[var(--qa-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CourseSelect, {
				courses,
				value: courseId,
				onChange: setCourseId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Btn, {
				type: "submit",
				disabled: busy,
				children: busy ? "Adding…" : "Add event"
			}),
			status === "posted" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-primary",
				children: "Event added."
			}) : null,
			status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: "Couldn't add that event. Try again."
			}) : null
		]
	})] });
}
function StatCard({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa-card p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-3xl font-semibold tracking-tight",
			children: value
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs uppercase tracking-widest text-muted-foreground",
			children: label
		})]
	});
}
function AdminUserRow({ row, courses, onChanged }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [newPlatformRole, setNewPlatformRole] = (0, import_react.useState)("");
	const [newCourseId, setNewCourseId] = (0, import_react.useState)("");
	const [newCourseRole, setNewCourseRole] = (0, import_react.useState)("instructor");
	const assignablePlatformRoles = PLATFORM_ROLE_OPTIONS.filter((r) => isAssignablePlatformRole(r) && !row.platformRoles.includes(r));
	async function handleAddPlatformRole() {
		if (!newPlatformRole) return;
		setBusy(true);
		await assignPlatformRole(row.id, newPlatformRole);
		setBusy(false);
		setNewPlatformRole("");
		onChanged();
	}
	async function handleRemovePlatformRole(role) {
		setBusy(true);
		await removePlatformRole(row.id, role);
		setBusy(false);
		onChanged();
	}
	async function handleAddCourseStaff() {
		if (!newCourseId) return;
		setBusy(true);
		await assignCourseStaff(newCourseId, row.id, newCourseRole);
		setBusy(false);
		setNewCourseId("");
		onChanged();
	}
	async function handleRemoveCourseStaff(staffId) {
		setBusy(true);
		await removeCourseStaffMember(staffId);
		setBusy(false);
		onChanged();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: row.fullName || "Unnamed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: row.email
					}),
					row.organisation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: row.organisation
					}) : null
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-1.5",
				children: [row.platformRoles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, {
					label: ROLE_LABELS[role],
					onRemove: () => handleRemovePlatformRole(role),
					disabled: busy
				}, role)), row.courseStaff.map((cs) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, {
					label: `${ROLE_LABELS[cs.role]} · ${cs.courseTitle}`,
					onRemove: () => handleRemoveCourseStaff(cs.staffId),
					disabled: busy
				}, cs.staffId))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: newPlatformRole,
						onChange: (e) => setNewPlatformRole(e.target.value),
						className: "h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Add platform role…"
						}), assignablePlatformRoles.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: role,
							children: ROLE_LABELS[role]
						}, role))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !newPlatformRole || busy,
						onClick: handleAddPlatformRole,
						className: "inline-flex h-9 items-center gap-1 rounded-full bg-secondary px-3 text-xs font-semibold transition-colors hover:bg-secondary/70 disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), " Add"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: newCourseId,
						onChange: (e) => setNewCourseId(e.target.value),
						className: "h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "Assign to course…"
						}), courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c.id,
							children: c.title
						}, c.id))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: newCourseRole,
						onChange: (e) => setNewCourseRole(e.target.value),
						className: "h-9 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary",
						children: COURSE_ROLE_OPTIONS.map((role) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: role,
							children: ROLE_LABELS[role]
						}, role))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !newCourseId || busy,
						onClick: handleAddCourseStaff,
						className: "inline-flex h-9 items-center gap-1 rounded-full bg-secondary px-3 text-xs font-semibold transition-colors hover:bg-secondary/70 disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), " Assign"]
					})
				]
			})
		]
	});
}
function RoleBadge({ label, onRemove, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			disabled,
			onClick: onRemove,
			"aria-label": `Remove ${label}`,
			className: "text-muted-foreground hover:text-destructive disabled:opacity-60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
		})]
	});
}
//#endregion
export { AdminPanel as component };
