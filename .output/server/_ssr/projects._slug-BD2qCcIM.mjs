import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Check, H as ArrowLeft, V as ArrowRight } from "../_libs/lucide-react.mjs";
import { d as StaggerItem, f as caseStudies, l as Reveal, r as Route$7, u as Stagger } from "./router-TQIET5v8.mjs";
import { r as SectionHeading, t as PageHero } from "./PageHero-BlzZQPb_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects._slug-BD2qCcIM.js
var import_jsx_runtime = require_jsx_runtime();
function CaseStudyPage() {
	const { study } = Route$7.useLoaderData();
	const others = caseStudies.filter((c) => c.slug !== study.slug).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHero, {
			eyebrow: study.client,
			title: study.title,
			description: study.summary,
			variant: "spotlight",
			image: study.hero,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/projects",
				className: "mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground/80 transition-colors hover:text-ink-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to the track record"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section-shell py-14 md:py-16",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-6 rounded-2xl border border-border bg-card p-7 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Client",
						value: study.client
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Sector",
						value: study.sector
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Location",
						value: study.location
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
						label: "Engagement",
						value: study.period
					})
				]
			}) })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "section-shell grid gap-12 pb-8 lg:grid-cols-[0.9fr_1.4fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:sticky lg:top-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow text-primary",
						children: "Scope"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3",
						children: study.scopeLines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mt-0.5 h-4 w-4 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: line })]
						}, line))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 rule-line" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: study.logo,
						alt: `${study.client} logo`,
						loading: "lazy",
						className: "mt-8 max-h-12 w-auto object-contain"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Reveal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-primary",
				children: "The challenge"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-base leading-relaxed text-muted-foreground md:text-lg",
				children: study.challenge
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-14 space-y-14",
				children: study.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl md:text-3xl",
						children: section.heading
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-base leading-relaxed text-muted-foreground",
						children: section.body
					}),
					section.bullets ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3 border-l border-border pl-6",
						children: section.bullets.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: b
						}, b))
					}) : null
				] }) }, section.heading))
			})] })]
		}),
		study.gallery?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "section-shell py-16 md:py-20",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stagger, {
				className: "grid gap-6 md:grid-cols-2",
				gap: .08,
				children: study.gallery.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaggerItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "overflow-hidden rounded-2xl border border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: g.src,
						alt: g.alt,
						loading: "lazy",
						width: 1600,
						height: 1e3,
						className: "h-64 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "p-5 text-sm text-muted-foreground",
						children: g.caption
					})]
				}) }, g.src + g.caption))
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "bg-secondary/70 py-20 md:py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-shell",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
						eyebrow: "Outcomes",
						title: "What the client got"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stagger, {
						className: "mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
						children: study.outcomes.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaggerItem, {
							className: "border-t border-border pt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed",
								children: o
							})
						}, o))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/contact",
						className: "group mt-12 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep",
						children: ["Discuss a similar project ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "section-shell py-20 md:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeading, {
				eyebrow: "More work",
				title: "Other engagements"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stagger, {
				className: "mt-10 grid gap-6 md:grid-cols-3",
				gap: .08,
				children: others.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaggerItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/projects/$slug",
					params: { slug: c.slug },
					className: "lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.hero,
						alt: c.heroAlt,
						loading: "lazy",
						width: 1600,
						height: 1e3,
						className: "h-40 w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium uppercase tracking-widest text-primary",
								children: c.client
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 flex-1 text-base font-semibold",
								children: c.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary",
								children: ["Read more", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })]
							})
						]
					})]
				}) }, c.slug))
			})]
		})
	] });
}
function Fact({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-xs font-medium uppercase tracking-widest text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "mt-2 text-sm font-semibold",
		children: value
	})] });
}
//#endregion
export { CaseStudyPage as component };
