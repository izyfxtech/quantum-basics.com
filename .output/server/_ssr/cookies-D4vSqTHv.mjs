import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as company } from "./router-TQIET5v8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cookies-D4vSqTHv.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		title: "1. What are cookies",
		body: "Cookies are small text files placed on your device when you visit a website. They help the site function correctly and let us understand how it is used."
	},
	{
		title: "2. How we use cookies",
		body: "We use strictly necessary cookies to keep you signed in to the Academy platform and to remember basic preferences as you move between pages. We may also use analytics-type cookies to understand overall site traffic and usage patterns, so we can improve the site over time."
	},
	{
		title: "3. Types of cookies we use",
		body: "Essential cookies: required for core functionality such as authentication and session management, and cannot be switched off. Preference cookies: remember choices you make on the site. Analytics cookies: help us understand how visitors interact with the site, typically in aggregate and anonymised form."
	},
	{
		title: "4. Managing cookies",
		body: "Most browsers let you view, manage and delete cookies through their settings. Blocking essential cookies may affect the functionality of this website, including the ability to sign in to the Academy platform."
	},
	{
		title: "5. Third-party cookies",
		body: "Some features of this site rely on third-party infrastructure providers (for example, our hosting and authentication provider), which may set their own cookies as part of delivering those services. Their use of cookies is governed by their own policies."
	},
	{
		title: "6. Changes to this policy",
		body: "We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date."
	},
	{
		title: "7. Contact us",
		body: `If you have questions about this Cookie Policy, contact us at ${company.email} or ${company.phone}.`
	}
];
function Cookies() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-16 md:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-primary",
				children: "Legal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 max-w-2xl text-[2rem] leading-[1.12] md:text-[2.5rem]",
				children: "Cookie Policy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "measure mt-4 text-base leading-relaxed text-muted-foreground",
				children: "This policy explains how Quantum Basics Nigeria Limited uses cookies and similar technologies on this website and the Academy platform. It is provided as a general reference and should be reviewed periodically."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted-foreground",
				children: "Last updated: 21 August 2026"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-10",
				children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-semibold text-foreground",
					children: s.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground",
					children: s.body
				})] }, s.title))
			})
		]
	});
}
//#endregion
export { Cookies as component };
