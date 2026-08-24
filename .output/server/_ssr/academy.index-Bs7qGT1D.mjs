import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { R as Building2, V as ArrowRight, i as Users, r as Wrench, w as GraduationCap } from "../_libs/lucide-react.mjs";
import { r as Panel, s as Tag } from "./ui-pvzeBS6D.mjs";
import { n as academyTracks, t as academyAudience } from "./academy-BiY6yBAS.mjs";
import { t as academy_default } from "./academy-FUMlYNsh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy.index-Bs7qGT1D.js
var import_jsx_runtime = require_jsx_runtime();
var pillars = [
	{
		icon: Building2,
		title: "Industry-aligned curriculum",
		body: "Courses designed in direct response to the needs of manufacturing, energy, oil and gas, and utilities."
	},
	{
		icon: GraduationCap,
		title: "Expert-led instruction",
		body: "Learn from seasoned professionals with deep, real-world experience in high-stakes technical fields."
	},
	{
		icon: Wrench,
		title: "Practical, hands-on learning",
		body: "Theory meets execution through real case studies, simulations and problem-solving frameworks."
	},
	{
		icon: Users,
		title: "Enterprise-grade focus",
		body: "Not just the technology — the efficiency, safety and operational excellence complex systems demand."
	}
];
function Academy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-[var(--qa-line)] bg-[var(--qa-surface)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "qa-wrap grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { children: "Learning portal" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-4 max-w-xl text-[2rem] leading-[1.1] md:text-[2.75rem]",
							children: "Bridging the knowledge gap in industrial technology"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base",
							children: "As industries evolve, the demand for highly skilled, forward-thinking professionals has never been greater. We turn complex technical concepts into practical, industry-ready expertise."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/academy/auth",
							className: "mt-8 inline-flex h-11 items-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep",
							children: ["Sign up for a track ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: academy_default,
						alt: "Instructor teaching trainees on PLC and SCADA equipment",
						loading: "lazy",
						width: 1408,
						height: 912,
						className: "w-full rounded object-cover"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "qa-wrap py-14 md:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "qa-label text-primary",
						children: "Our core pillars"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-2xl md:text-[1.75rem]",
						children: "Built for people who run real systems"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2",
						children: pillars.map(({ icon: Icon, title, body }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							className: "flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-sm leading-relaxed text-muted-foreground",
								children: body
							})] })]
						}, title))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-[var(--qa-line)] bg-secondary/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "qa-wrap py-14 md:py-20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "qa-label text-primary",
							children: "Training tracks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 text-2xl md:text-[1.75rem]",
							children: "Four primary competency tracks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-xl text-sm text-muted-foreground",
							children: "The curriculum mirrors the full scope of solutions Quantum Basics delivers in the field."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 grid gap-4 md:grid-cols-2",
							children: academyTracks.map((track) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "qa-label text-primary",
									children: track.number
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 text-lg font-semibold",
									children: track.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted-foreground",
									children: track.scope
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 qa-label text-muted-foreground",
									children: "Key modules"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-1.5",
									children: track.modules.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "border-l-2 border-primary/40 pl-3 text-sm",
										children: m
									}, m))
								})
							] }, track.number))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "qa-wrap py-14 md:py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "qa-label text-primary",
						children: "Who we serve"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 text-2xl md:text-[1.75rem]",
						children: "Learning paths for every stage"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: academyAudience.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold",
							children: a.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted-foreground",
							children: a.body
						})] }, a.title))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "qa-wrap pb-16 md:pb-24",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "qa-card px-8 py-12 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mx-auto max-w-2xl text-2xl md:text-[1.9rem]",
							children: "Join the future of industry"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-xl text-sm text-muted-foreground",
							children: "Our mission is to equip the next generation of industry leaders with the skills to drive efficiency, innovation and sustainable growth."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/academy/auth",
							className: "mt-7 inline-flex h-11 items-center gap-2 rounded bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep",
							children: ["Sign up now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { Academy as component };
