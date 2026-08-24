import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as company } from "./router-TQIET5v8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/privacy-CWVifrj_.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		title: "1. Information we collect",
		body: "We collect information you provide directly, such as your name, email address, phone number and company details when you submit a contact or consultation request, register for the Academy, or otherwise correspond with us. We may also collect limited technical information automatically, such as browser type, device information and pages visited, to help us understand how the site is used."
	},
	{
		title: "2. How we use your information",
		body: "We use the information we collect to respond to enquiries, provide and improve our services, deliver Academy course content and track learning progress, communicate with you about projects or training, and meet legal and regulatory obligations."
	},
	{
		title: "3. Sharing of information",
		body: "We do not sell your personal information. We may share information with service providers who help us operate this website and the Academy platform (such as hosting and database providers), or where required by law or to protect our rights."
	},
	{
		title: "4. Data storage and security",
		body: "Information submitted through this website, including Academy accounts, is stored using reputable third-party infrastructure providers with industry-standard security controls. While we take reasonable steps to protect your information, no method of transmission or storage is completely secure."
	},
	{
		title: "5. Your rights",
		body: "You may request access to, correction of, or deletion of your personal information at any time by contacting us using the details below. Academy account holders can also update most of their information directly from their account settings."
	},
	{
		title: "6. Cookies",
		body: "This website uses cookies and similar technologies to operate correctly and to understand site usage. See our Cookie Policy for details."
	},
	{
		title: "7. Changes to this policy",
		body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date."
	},
	{
		title: "8. Contact us",
		body: `If you have questions about this Privacy Policy or how your information is handled, contact us at ${company.email} or ${company.phone}.`
	}
];
function Privacy() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "section-shell py-16 md:py-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow text-primary",
				children: "Legal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 max-w-2xl text-[2rem] leading-[1.12] md:text-[2.5rem]",
				children: "Privacy Policy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "measure mt-4 text-base leading-relaxed text-muted-foreground",
				children: "This policy explains how Quantum Basics Nigeria Limited collects, uses and protects information submitted through this website and the Academy platform. It is provided as a general reference and should be reviewed periodically."
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
export { Privacy as component };
