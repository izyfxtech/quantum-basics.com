import { n as partners } from "./brands-FpVxzu9B.mjs";
import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as countries, d as StaggerItem, l as Reveal, u as Stagger } from "./router-TQIET5v8.mjs";
import { r as SectionHeading, t as PageHero } from "./PageHero-BlzZQPb_.mjs";
import { t as BrandLogo } from "./BrandLogo-DzLZcQ4O.mjs";
import { t as smart_field_default } from "./smart-field-C5zrQ7Lx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-CuApg6Ro.js
var import_jsx_runtime = require_jsx_runtime();
var africa_reach_map_default = "/assets/africa-reach-map-rbGMdCnw.jpg";
var values = [
	{
		title: "Partnership",
		body: "We work alongside clients as a long-term technical partner, not a one-off vendor."
	},
	{
		title: "Relationship",
		body: "Continuity of people and knowledge across the full lifecycle of every system we deliver."
	},
	{
		title: "Commitment to Excellence",
		body: "Engineering standards, safety and operational discipline on every site we touch."
	}
];
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: "Who we are",
			title: "A leading engineering services company for energy, industry and infrastructure",
			description: "Vast experience in energy and infrastructure solutions, industrial systems integration, end-to-end IT and network delivery, planning and optimisation — delivered by engineers who stay with the project.",
			variant: "beam",
			image: smart_field_default
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section-shell py-20 md:py-28",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-2 lg:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Our approach",
					title: "Engineering expertise meets digital transformation",
					description: "We are a technology-driven engineering company focused on designing, deploying and optimising intelligent infrastructure systems across energy, oil & gas, utilities, industrial and connectivity sectors. Our solutions combine engineering expertise, digital transformation and automation technologies to improve efficiency, reliability and operational visibility."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 rounded-xl border-l-4 border-primary bg-secondary/60 p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg font-medium",
						children: "\"We are committed to building smart, connected and efficient systems that power the future of industries, utilities and infrastructure.\""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted-foreground",
						children: "Our drive"
					})]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					y: 40,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: smart_field_default,
						alt: "Field engineer inspecting instrumented process equipment",
						loading: "lazy",
						width: 1200,
						height: 900,
						className: "rounded-2xl object-cover shadow-panel"
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary/60 py-20 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-shell",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Core values",
					title: "How we work"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stagger, {
					className: "mt-10 grid gap-6 md:grid-cols-3",
					gap: .1,
					children: values.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaggerItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "lift h-full rounded-2xl border border-border bg-card p-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-display text-sm font-semibold text-primary",
								children: ["0", i + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 text-lg font-semibold",
								children: v.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: v.body
							})
						]
					}) }, v.title))
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section-shell py-20 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "African reach",
						title: "Operating across seven countries",
						description: "Our teams and delivery partners support projects throughout West, East and Southern Africa."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stagger, {
						className: "mt-8 flex flex-wrap gap-3",
						gap: .05,
						children: countries.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaggerItem, {
							y: 10,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex h-12 items-center rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5",
								children: c
							})
						}, c))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						y: 24,
						className: "mt-8 overflow-hidden rounded-2xl border border-border bg-card p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: africa_reach_map_default,
							alt: "Map of Africa highlighting the countries where Quantum Basics delivers projects",
							loading: "lazy",
							className: "mx-auto w-full max-w-md object-contain"
						})
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
					eyebrow: "Technology partners",
					title: "Backed by global manufacturers",
					description: "We design and integrate with equipment and platforms from established industrial technology vendors."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stagger, {
					className: "mt-8 grid grid-cols-2 gap-3",
					gap: .06,
					children: partners.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaggerItem, {
						y: 12,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "lift flex h-20 items-center justify-center rounded-xl border border-border bg-card px-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogo, {
								name: p.name,
								src: p.logo
							})
						})
					}, p.name))
				})] })]
			})
		})
	] });
}
//#endregion
export { About as component };
