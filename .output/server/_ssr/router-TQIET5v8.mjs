import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { a as useRouterState, c as Outlet, d as createRootRouteWithContext, f as Link, g as notFound, h as redirect, i as HeadContent, l as lazyRouteComponent, m as useRouter, r as Scripts, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as subdomainPrefixForHost } from "./ssr.mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { P as ChevronDown, T as Globe, V as ArrowRight, g as Menu, h as MessageCircle, n as X, p as Phone, v as MapPin, y as Mail } from "../_libs/lucide-react.mjs";
import { a as useMotionValue, c as AnimatePresence, n as animate, o as useScroll, r as useSpring, t as useInView } from "../_libs/framer-motion+[...].mjs";
import { t as motion } from "../_libs/motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tetrapak-BLSBy5zL.js
var cocacola_default = "data:image/jpeg;base64,/9j/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCABPALkDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD06iiigAooooAKKbJIkUbPIyqijJYnAArk9U8Y/vfs+kQ+c5OBIwyCfYd6mUlHc2o4epWdoI66iuPS0157c3mqa0bBBzt44+vatrw3fTX+l+ZcMJHSRo/MUYEgB+9SUruxVXD8keZST9LmtRRRVnOFFFFABRRRQAUUVR1PVrPS4fMu5QCfuoOWb6Ck3bcqMZTfLFXZeorjV1zW9blZNKiS1t1+9M/O36np+VVzqOsWpMtpqD3kKsI3lkjHl7icDb3NR7RHWsDPZtJ9v60O6orkb6x8WIplj1FZiOSkWFP4Ais6z8W6nYz+TqMfnBThlddrih1EnqhxwEqkb05KXkjv6KoaZq9lqkW61lBYfejbhl/Cqmt+IIdNYW8KG4vH4WJe31q+ZWucyo1HPktqbVFczZ3GuJq1kl/PF/pIZmtlT/VqB1z69K6WhO4qlJ02le/oLRRRTMwqK5uIrW3eedwkaDLMakPArzvxXrZ1G7NtA3+iwnHH8betROfKrnVhMNLEVOVbdSLW9butcult4FdYC2I4l6ufU11fhzw9FpcQnnAe8YcnqE9h/jVPwbogt4RqNyn76QfugR91fX6mtDxHr0ekW4SPD3Ug+RT0UepqIq3vyOzEVeeSwuGWn5kXiyzgvbaBLjUI7REfcd/8Q9hWnpKWcWnQx6fIskCDCspzn1/GuS8L2UetX1zd6sxuJUxiNz698elamiXFnpcGp3LOIrP7SREPXAwcD604u75jKtScYexUm3HpbS7/ABZ0jusaF3YKo5JJwBVe21Kxu5TFbXcUrjqqtk1xjz3/AIv1IwRloLKM5YdgPU+pp+mRW0viGKDTLURQ2Lky3JJ3PgYOfqaPaXemwnglGL537yV7dvX18jusiqi6pp7TNCt5AZFGSu8cVyOta3da1fDS9IJ8pjtLLwX9TnstUvENlY6TbwadboJLs4eabv7AemaHU7DpYC9ozdm+nZd2egQ3dtcMVguIpCBkhGBxSJeWsknlx3ETSf3VcE/lWHoeiS2WgukbrDe3K5aQrnZnoPwFZ4soPCFvLdyyrc3ko2QjbjHqarmaV2jJYenKUowld3stN/8AgGt4i8QRaTF5UWJLtx8q9l9zXM6Lo914hvGvb+VzBn5nPVz6D0FVNH0648QaqzTuxTO+eQ/yFekRwpb2wht0CKi4RR0FZpOo7vY66so4KHs6fxvd9jDkhXULo6RZjydNtcC4Kcb2/uA/zqTUI47nUbHSLZQsUBE8wUcKo+6PxNU9Lvrq20/7Fa6fO+os7GQyIVQMT94t3FbWk6d9ghdpZPNuZjvmlP8AE3+Aq1qctRunq+m3m+7NCs3VtFs9WixcJiQfdlXhlrSrJ8Q6wmkWJcYaeT5Yk9/X6Cqla2pz0faOolT3ONurRfDl22J1uL3/AJYhB9wH+Jh6+gpI55dFnEvk/aNTk+Z2kUsIge3u3r6VpeEtKe+un1i/y4DEpu/ibu30FbfmPrV+BCzLp9s/zOpx57jsD/dHf1rFRuro9eriVCThL3rL3nt8v+B1OehbxJrNz5sUQtty7DNs2fL6ZPP5Vc/4RC+/6DD/APj3+NdhS1oqa66nDLHz/wCXaUV6f5hRRRWhwmF4u1I2GkMkbYmuD5a47Dufyri/Dmm/2nq0cTD9zH88n0Hb8a0vHdwZNWigz8sUefxNa3gO1Eemy3RHzTPgfQVzv36lj3Kb+rYHnW8v6/I6C+uotPsJbmThIlzgfoK8+0u3m8R+IDJdElSfMl9l7KP5V0njuR10eNFzteUBvyNc54Z1c6XJOkdo9xNPgRhTzn0+lOo05JPYjBUpRw06sPieh0viO0tt1vHZoY9SlIjhaJipC9ycdgK47V4YotQ+xWkksywnZlmzl++B25rvNL0+4jM2o6gwe/mXAA6RL2UVwGnXEdvrUNxdglEm3Scc9aVRbeZrgJP3knflX3v/AC7Ho2haaml6ZHAAPMI3SN6sa57xdrEUAk02wCo8hzcOgx+H19a05tbk1PdbaEGY4/eXTKQkQ9vU1wMckcd8skwaSNZdzZ6sM06krKyMsFhpTqyqVd1rb/M7HRLWHw9oUmqXij7RIuQD1APRR9azPDlo+ratNquoEeTC292boW7D6CqfiTV7jUrlEeJoIIwDHE3Xnua2tEtpdW0+C0SFrbS4uZST81w3cfSkmm7LoazjOnSlVm/enu+y7I6Sy1KO7s5LzY0dupO1343qP4vpXnWr382tasZFBIZtkKeg7V1njW8FnpMdlDhDOduBxhB/kVi+CLEXGpvdSD5LZcjP94/5NOo3JqBngoxo0pYlr0OnsorPwzoq/aZFQ9ZG7u3t61Sg8XJNMrf2fOtozhPPPQE+tc/qNzL4i8SJbox8nzPLjA7L3NdTrsUUenWmk2yBfPlSNVHZQck/pTUm/h2RjUowg17XWctX5G6SAMk4HXNc/c+KIzdNbaXaS38i/eMfCj8ayPFGtyXdx/ZOnElN2xyvV2/uj2qzoE8Hh63u7XUlEFyuZAT0lXHG096bnd2REMIoU/aTV29o+Xd9ToNO1SG+0z7cQYlXO8P/AAEda4SaSbxP4hABKxE4GekcY71a1bUBbeH4bCKRTNdMZrjYc7QTnb/n0qfwz4fuJ7cz3TmG1mAJReGlX0J7L/Opk3JqJ00accNCVZ6N6I1941CL7DYN5GlW42zXAON4HVVPp6moD4ps7eRbLSbCW5SMYHljAwPQVleINTa+uE0XSFAt1ITbHwHPp9BVy/SHwvoX2eAg390MNJ3x3P0HajmfQhUI2ipq7lsv1Zfg8XWtzex2tta3EjyEAHgfX8q6KuS8EaT5cLalMvzyDbFnsvc/jXW1pBtq7OLGRpQqclLp+YtFFFWcp5142jZNfZyOJI1I/lXS+CpUk0BEUjdG7Kw/HNWPEeiLrFqoRglxFzGx6H2PtXH2Y1zw7dsy2khVuHXaWR/xFYO8J36HtRlHFYRUk7Sj3PQbu1gvbdoLmNZI26qar6fo+n6aSbS2VGPVjy35msi28T3k4AXQrpn/ANnp+oq4tz4guR+7sra0U95pC5H4CtOaL1PPdGtBOMnZev8AwTarF1DRdCkuDc3kcSOeWJk2hvqM0NpGoXI/03WZ8HqluojH59ahbwfpT8ym5kb+80pJod30ClyU3f2jXov+GJ01rQbKIQw3dvGi9FjGR+lULd/CP2w3Eb24lLZ+fIGfoeKq6j4JQRs+mztvH/LOXofxrB07w9qOoyOqReUsbbXaTgA+nvWcpSvax30qOGlByjVa79DvZ9J0rUp1vJYY53wAHDZB9M44NaKKqKFRQqgYAAwBXGWnhvXdLcS2F7CSOqZIVvqDxXSadqEs2IL+2a2ugPunlX91Pf6VpF91Y4a9Oy9yfMl+HyOS8eux1aBD91Ycj8Sa0vCFuZPDd0sLBJZnZdx7cYqfxfok2owx3Nou+eEEFO7L7e9c3ot3relSvFa2Urhz80TxHGfX2rJ+7O7PRhavglCDSa7+R2ljp+n6BYM42qEXMkz/AHm/z6Vg399MbSfXZQY2kHkWKN1VT1f6mr9vpWo6tKlxr7qsKHclpH0z6tUfjiznn0+3a2iZ0hc7lQZwMYHFXK/LoctHl9sozldt6vp6fP8A4BneBdPWa5mv5RnyvlTP949T/n1rYuhHr2rLbKqvZWTbpnxw79lB9PWsDw9putzxPBFJLZ2UpzIxXBP+73rtbexhs9P+yWiBFCkD3OOp96VNXjaxeNmo13Lmu9lbp/wTzl4o9T8SeRbRrHDJNsVUGAFH/wBYV1fizVl02wWwtGCzyLt4/gTpXK6fYaxb6uotbWRbmNjhmT5R7k9MVa8R6NfW91FK/m3TzLmSVVJy/p7DpWabUXZHdUhSnWpxlJWS2NDwdZw2lnPrV4QqKCqE9h3P9KzUE3ijxFufKxdT/sRipLjS9aXw4n2jzBBG42Wyr82D3OKl8OaLqdwsiuZLSzlx5pxh5AOw7gU9XaNiW4R9pX51fZeS8vM6Symkv9QH2NzFptp8g28CZumP90Vt1R011EZt4rfyYoflQDpir1bx2PCqu8tgoooqjMKKKKACiiigAooooAKQADpS0UAFIQDjIBxzS0UAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf//Z";
var fanmilk_default = "/assets/fanmilk-S3iIsjaU.jpg";
var wacot_default = "/assets/wacot-BBGOzypr.jpg";
var tetrapak_default = "/assets/tetrapak-w5Z836wB.png";
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/case-studies-BRNFqlr2.js
var case_power_audit_default = "/assets/case-power-audit-Clf7Lmj1.jpg";
var case_energy_management_default = "/assets/case-energy-management-BKrsFIMU.jpg";
var case_packaging_audit_default = "/assets/case-packaging-audit-Cp_RwtNl.jpg";
var case_calibration_default = "/assets/case-calibration-Bd8bB968.jpg";
var caseStudies = [
	{
		slug: "wacot-power-system-audit",
		client: "WACOT Ltd",
		logo: wacot_default,
		title: "Plant-wide power system audit",
		summary: "Full power system audit of the WACOT Katsina processing plant, identifying distribution constraints and efficiency gains across the facility.",
		hero: case_power_audit_default,
		heroAlt: "Engineers measuring power quality at a plant switchgear panel",
		sector: "Agro-processing",
		location: "Katsina, Nigeria",
		period: "Multi-phase engagement",
		scopeLines: [
			"Power system audit",
			"Load profiling & harmonics study",
			"Distribution reliability review"
		],
		challenge: "The Katsina processing plant had grown in stages, and the electrical distribution network had grown with it — without a single consolidated view of loading, protection coordination or power quality. Production teams were seeing nuisance trips and unexplained losses, but no one could point to where the network was actually constrained.",
		sections: [
			{
				heading: "What we did",
				body: "We audited the plant end to end, from the incoming supply and generation sets through the LV distribution boards to the final process loads. Every board was traced, labelled and captured in an as-built single-line diagram, and instrumentation was installed to record real behaviour rather than nameplate assumptions.",
				bullets: [
					"As-built single-line diagram of the full distribution network",
					"Logging of voltage, current, power factor and harmonics at key boards",
					"Thermographic inspection of switchgear, busbars and terminations",
					"Protection settings and coordination review",
					"Cable and breaker sizing verification against measured load"
				]
			},
			{
				heading: "What we found",
				body: "Measured demand differed sharply from the assumed load allocation. Several feeders were running close to their thermal limit while others were barely loaded, power factor was low enough to attract penalty on the utility bill, and harmonic distortion from drives was heating transformers and neutral conductors."
			},
			{
				heading: "Recommendations delivered",
				body: "The audit closed with a prioritised remediation plan — quick wins that could be executed during a normal shift change, and capital items scoped with budget figures so the plant could plan them into the next maintenance window.",
				bullets: [
					"Load rebalancing across feeders to remove thermal constraints",
					"Power factor correction sizing to eliminate utility penalties",
					"Harmonic mitigation at the largest drive groups",
					"Retermination and replacement schedule for hot joints found on survey"
				]
			}
		],
		outcomes: [
			"Single verified view of plant electrical loading",
			"Prioritised, costed remediation roadmap",
			"Identified power factor penalty removal on the utility bill",
			"Reduced risk of unplanned distribution failure"
		],
		gallery: [{
			src: case_power_audit_default,
			alt: "Power quality analyser connected to a distribution panel",
			caption: "Instrumented logging at plant distribution boards during the audit window."
		}]
	},
	{
		slug: "nbc-energy-management",
		client: "Nigeria Bottling Company (Coca-Cola)",
		logo: cocacola_default,
		title: "Energy management across three plants",
		summary: "Energy management systems for Ikeja Plant 1 & 2 and Asejire, plus occupancy sensors, photocell security lighting, UPS design and nationwide UPS maintenance.",
		hero: case_energy_management_default,
		heroAlt: "Energy monitoring instrumentation beside a beverage bottling line",
		sector: "Beverage manufacturing",
		location: "Ikeja & Asejire, Nigeria",
		period: "Multi-site programme",
		scopeLines: [
			"Energy management systems",
			"Lighting control & occupancy sensing",
			"UPS design and nationwide maintenance"
		],
		challenge: "Energy was one of the largest controllable costs across the bottling operation, but consumption was only visible at the plant meter. Without line-level and utility-level breakdown, there was no way to attribute cost to a process, prove the effect of an efficiency measure or catch drift when a line started consuming more than it should.",
		sections: [
			{
				heading: "Metering and visibility",
				body: "We deployed energy management systems at Ikeja Plant 1, Ikeja Plant 2 and Asejire, instrumenting incomers, major feeders and utility plant so that consumption could be resolved down to the process that caused it. Data was aggregated into dashboards that operations and engineering could read without a specialist.",
				bullets: [
					"Sub-metering of incomers, feeders and major utility plant",
					"Consumption dashboards with per-line and per-shift breakdown",
					"Baseline setting and drift alerting against expected consumption"
				]
			},
			{
				heading: "Lighting and passive savings",
				body: "Lighting was an easy, permanent saving. Occupancy sensors were installed in intermittently-used areas so lighting follows presence rather than shift patterns, and photocell control was applied to security lighting so external circuits track daylight rather than a timer that drifts through the year.",
				bullets: ["Occupancy-sensed lighting in warehouses, plant rooms and amenity areas", "Photocell-controlled perimeter and security lighting"]
			},
			{
				heading: "Secure power",
				body: "We designed the UPS provision protecting control systems and IT infrastructure, then took on scheduled UPS maintenance nationwide — battery testing, load-bank verification and replacement planning — so that backup power is a known quantity rather than an assumption.",
				bullets: ["UPS sizing and design for control and IT loads", "Nationwide preventive maintenance and battery replacement programme"]
			}
		],
		outcomes: [
			"Per-line and per-utility energy visibility across three plants",
			"Permanent lighting load reduction through occupancy and daylight control",
			"Verified, maintained backup power for critical control systems",
			"Consumption baselines that make future savings measurable"
		],
		gallery: [{
			src: case_energy_management_default,
			alt: "Energy monitoring display on a bottling line",
			caption: "Line-level energy monitoring feeding the plant consumption dashboards."
		}]
	},
	{
		slug: "tetra-pak-packaging-network-audit",
		client: "Tetra Pak",
		logo: tetrapak_default,
		title: "Packaging network power audit",
		summary: "Power system audit of the Chivita packaging systems distribution network, covering load profiling and reliability of the distribution infrastructure.",
		hero: case_packaging_audit_default,
		heroAlt: "Engineer reviewing a packaging plant electrical distribution room",
		sector: "Packaging systems",
		location: "Nigeria",
		period: "Audit engagement",
		scopeLines: [
			"Distribution network audit",
			"Load profiling",
			"Reliability and continuity assessment"
		],
		challenge: "Packaging lines are unforgiving: a voltage dip or a protection mis-trip stops the line and scraps product in process. Tetra Pak needed an independent view of whether the distribution infrastructure feeding the Chivita packaging systems could support the installed equipment reliably.",
		sections: [{
			heading: "Audit approach",
			body: "We profiled the distribution network under real production conditions rather than at idle, capturing start-up transients, steady-state loading and the interaction between the filling and packaging equipment and the rest of the site.",
			bullets: [
				"Load profiling across a full production cycle",
				"Voltage stability and dip capture at line supply points",
				"Earthing and bonding verification at machine level",
				"Protection discrimination review from incomer to machine"
			]
		}, {
			heading: "Findings and remediation",
			body: "The audit isolated the supply points most exposed to disturbance and the protection settings that would drop more of the plant than necessary on a downstream fault. Each finding was written up with a specific corrective action and a risk rating so the plant could sequence the work."
		}],
		outcomes: [
			"Independent verification of distribution adequacy for the packaging lines",
			"Protection discrimination corrections to limit fault impact",
			"Documented load profile for future line expansion",
			"Reduced exposure to disturbance-driven line stoppages"
		],
		gallery: [{
			src: case_packaging_audit_default,
			alt: "Distribution switchboards and cable management in a packaging plant",
			caption: "Distribution infrastructure surveyed during the packaging network audit."
		}]
	},
	{
		slug: "fanmilk-calibration-access-control",
		client: "FanMilk",
		logo: fanmilk_default,
		title: "Calibration and access control",
		summary: "Calibration of weighing scales and 12 production tanks for billing and process accuracy, followed by a site-wide access control implementation.",
		hero: case_calibration_default,
		heroAlt: "Technician calibrating instrumentation on a stainless steel production tank",
		sector: "Dairy manufacturing",
		location: "Nigeria",
		period: "2023 – 2024",
		scopeLines: [
			"Weighing scale calibration",
			"Calibration of 12 production tanks",
			"Site-wide access control"
		],
		challenge: "Measurement accuracy sits directly on top of both product quality and money: an out-of-tolerance scale distorts batch recipes and goods-received reconciliation, and uncalibrated tank level measurement makes yield accounting unreliable. Separately, site access was managed manually with no auditable record of who entered production areas.",
		sections: [{
			heading: "Calibration programme",
			body: "We calibrated the plant weighing scales and all twelve production tanks against traceable references, documenting as-found and as-left values so the plant has evidence of drift over time rather than a single pass/fail certificate.",
			bullets: [
				"Traceable calibration of weighing scales used for batching and receipt",
				"Level and volume calibration across 12 production tanks",
				"As-found / as-left recording to establish drift rates",
				"Recalibration interval recommendations per instrument"
			]
		}, {
			heading: "Access control implementation",
			body: "We then implemented access control across the site, mapping doors to zones and zones to roles so that production, cold chain and administrative areas are separately controlled. Every event is logged, which gives the plant both a security record and an attendance record from the same infrastructure.",
			bullets: [
				"Zone-based door controllers and readers",
				"Role-based access rights per department",
				"Full event logging with time & attendance reporting",
				"Anti-passback and controlled visitor access at main entries"
			]
		}],
		outcomes: [
			"Traceable measurement accuracy for batching and yield accounting",
			"Documented drift history supporting the plant quality system",
			"Auditable, role-based control of production area access",
			"Attendance reporting derived from existing access infrastructure"
		],
		gallery: [{
			src: case_calibration_default,
			alt: "Instrument calibration on dairy production tanks",
			caption: "Calibration of production tank instrumentation against traceable references."
		}]
	}
];
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-TQIET5v8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var styles_default = "/assets/styles-lXD071_l.css";
/**
* Like <Link>, but for pages that live on the main marketing domain (Home,
* About, Engineering Solutions, Projects, Contact) rather than under the
* "/academy" route prefix. The academy landing/catalogue pages still use
* the marketing SiteHeader/SiteFooter, and on the academy subdomain only
* "/academy/*" paths resolve internally (see src/router.tsx) — so a plain
* internal <Link to="/about"> rendered there would 404. This renders a
* real cross-origin <a> back to the main site in that case, and behaves
* exactly like <Link> everywhere else (including for "/academy" itself,
* which should stay internal — see SiteHeader/SiteFooter usage).
*/
function SiteLink({ to, hash, className, activeProps, onClick, onFocus, children, ...rest }) {
	const [crossOriginHref, setCrossOriginHref] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const labels = window.location.hostname.split(".");
		if (!(labels.length > 1 && (labels[0] === "academy" || labels[0] === "blog"))) {
			setCrossOriginHref(null);
			return;
		}
		const apex = labels.slice(1).join(".");
		const port = window.location.port ? `:${window.location.port}` : "";
		setCrossOriginHref(`${window.location.protocol}//${apex}${port}${to}${hash ? `#${hash}` : ""}`);
	}, [to, hash]);
	if (crossOriginHref) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: crossOriginHref,
		className,
		onClick,
		onFocus,
		...rest,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		className,
		onClick,
		onFocus,
		...hash ? { hash } : {},
		...activeProps ? { activeProps } : {},
		...rest,
		children
	});
}
var logo_default = "data:image/png;base64,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";
var solutions = [
	{
		hash: "wages-metering",
		label: "WAGES Metering",
		note: "Water, air, gas, electricity, steam"
	},
	{
		hash: "process-automation",
		label: "Industrial Automation",
		note: "Control systems and robotics"
	},
	{
		hash: "smart-grid",
		label: "Smart Grid & Power",
		note: "Monitoring, fault recovery, renewables"
	},
	{
		hash: "energy-management",
		label: "Energy Management",
		note: "Audits, metering, secure power"
	},
	{
		hash: "security",
		label: "Integrated Security",
		note: "CCTV, access control, surveillance"
	},
	{
		hash: "telecommunications",
		label: "Telecom Access Networks",
		note: "Planning, deployment, optimisation"
	}
];
var nav = [
	{
		to: "/about",
		label: "Who We Are"
	},
	{
		to: "/projects",
		label: "Project Track Record"
	},
	{
		to: "/academy",
		label: "Engineering Academy"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const closeTimer = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 12);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	const openMenu = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		setMenu(true);
	};
	const closeMenu = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		closeTimer.current = setTimeout(() => setMenu(false), 140);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: `sticky top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent bg-background"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 transition-all duration-500 lg:flex lg:justify-between ${scrolled ? "h-16" : "h-20"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLink, {
					to: "/",
					className: "group flex min-w-0 items-center gap-3",
					onClick: () => setOpen(false),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo_default,
						alt: "Quantum Basics Nigeria Limited logo",
						width: 40,
						height: 40,
						onError: (e) => {
							e.currentTarget.style.display = "none";
						},
						className: "h-10 w-10 shrink-0 rounded-sm object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0 font-display text-[0.95rem] font-semibold leading-tight",
						children: ["Quantum Basics", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-sans text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground",
							children: "…where Service works"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-1 lg:flex",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						onMouseEnter: openMenu,
						onMouseLeave: closeMenu,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLink, {
							to: "/services",
							onFocus: openMenu,
							activeProps: { className: "text-primary" },
							className: "inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
							"aria-expanded": menu,
							children: ["Engineering Solutions", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-3.5 w-3.5 transition-transform duration-300 ${menu ? "rotate-180" : ""}` })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: menu && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
							initial: {
								opacity: 0,
								y: 8
							},
							animate: {
								opacity: 1,
								y: 0
							},
							exit: {
								opacity: 0,
								y: 6
							},
							transition: {
								duration: .22,
								ease: [
									.16,
									1,
									.3,
									1
								]
							},
							className: "absolute left-0 top-full w-[26rem] rounded-md border border-border bg-card p-2 shadow-panel",
							children: [solutions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLink, {
								to: "/services",
								hash: s.hash,
								onClick: () => setMenu(false),
								className: "block rounded-sm px-3 py-2.5 transition-colors hover:bg-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-medium",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: s.note
								})]
							}, s.hash)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLink, {
								to: "/services",
								onClick: () => setMenu(false),
								className: "mt-1 flex items-center gap-2 border-t border-border px-3 py-2.5 text-sm font-medium text-primary",
								children: ["All eleven solution lines ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })]
							})]
						}) })]
					}), nav.map((item) => item.to === "/academy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						activeProps: { className: "text-primary" },
						className: "rounded-sm px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
						children: item.label
					}, item.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
						to: item.to,
						activeProps: { className: "text-primary" },
						className: "rounded-sm px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
						children: item.label
					}, item.to))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLink, {
						to: "/contact",
						className: "group inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep",
						children: ["Talk to an engineer", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" })]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": "Toggle navigation",
					"aria-expanded": open,
					onClick: () => setOpen((v) => !v),
					className: "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary lg:hidden",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
			initial: false,
			children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					height: 0,
					opacity: 0
				},
				animate: {
					height: "auto",
					opacity: 1
				},
				exit: {
					height: 0,
					opacity: 0
				},
				transition: {
					duration: .35,
					ease: [
						.16,
						1,
						.3,
						1
					]
				},
				className: "overflow-hidden border-t border-border bg-background lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "section-shell flex flex-col py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow py-2",
							children: "Engineering solutions"
						}),
						solutions.slice(0, 4).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
							to: "/services",
							hash: s.hash,
							onClick: () => setOpen(false),
							className: "rounded-sm px-2 py-2.5 text-[0.95rem] font-medium text-foreground/85",
							children: s.label
						}, s.hash)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
							to: "/services",
							onClick: () => setOpen(false),
							className: "rounded-sm px-2 py-2.5 text-[0.95rem] font-medium text-primary",
							children: "All solutions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-3 border-t border-border" }),
						nav.map((item) => item.to === "/academy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: item.to,
							onClick: () => setOpen(false),
							activeProps: { className: "text-primary" },
							className: "rounded-sm px-2 py-3 text-[0.95rem] font-medium text-foreground/85",
							children: item.label
						}, item.to) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
							to: item.to,
							onClick: () => setOpen(false),
							activeProps: { className: "text-primary" },
							className: "rounded-sm px-2 py-3 text-[0.95rem] font-medium text-foreground/85",
							children: item.label
						}, item.to)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
							to: "/contact",
							onClick: () => setOpen(false),
							className: "mt-3 inline-flex h-12 items-center justify-center rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground",
							children: "Talk to an engineer"
						})
					]
				})
			})
		})]
	});
}
var ease = [
	.16,
	1,
	.3,
	1
];
function Reveal({ children, delay = 0, y = 24, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		initial: {
			opacity: 0,
			y
		},
		whileInView: {
			opacity: 1,
			y: 0
		},
		viewport: {
			once: true,
			margin: "-80px"
		},
		transition: {
			duration: .7,
			delay,
			ease
		},
		children
	});
}
function Stagger({ children, className, delay = 0, gap = .08 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		initial: "hidden",
		whileInView: "show",
		viewport: {
			once: true,
			margin: "-60px"
		},
		variants: {
			hidden: {},
			show: { transition: {
				staggerChildren: gap,
				delayChildren: delay
			} }
		},
		children
	});
}
function StaggerItem({ children, className, y = 22 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		className,
		variants: {
			hidden: {
				opacity: 0,
				y
			},
			show: {
				opacity: 1,
				y: 0,
				transition: {
					duration: .6,
					ease
				}
			}
		},
		children
	});
}
function CountUp({ value, suffix = "", className }) {
	const ref = (0, import_react.useRef)(null);
	const inView = useInView(ref, {
		once: true,
		margin: "-40px"
	});
	const mv = useMotionValue(0);
	const [display, setDisplay] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		return mv.on("change", (v) => setDisplay(Math.round(v)));
	}, [mv]);
	(0, import_react.useEffect)(() => {
		if (!inView) return void 0;
		const controls = animate(mv, value, {
			duration: 1.6,
			ease: "easeOut"
		});
		return () => controls.stop();
	}, [
		inView,
		mv,
		value
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		ref,
		className,
		children: [display, suffix]
	});
}
function ScrollProgress() {
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 140,
		damping: 26,
		restDelta: .001
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		"aria-hidden": "true",
		style: { scaleX },
		className: "fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[image:var(--gradient-gold)]"
	});
}
function LogoChip({ item }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const img = ref.current;
		if (img && img.complete && img.naturalWidth === 0) setFailed(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "logo-chip",
		children: failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "whitespace-nowrap text-sm font-semibold tracking-tight text-muted-foreground",
			children: item.name
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			ref,
			src: item.logo,
			alt: `${item.name} logo`,
			onError: () => setFailed(true)
		})
	});
}
function LogoMarquee({ items, reverse = false }) {
	const loop = [...items, ...items];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "marquee-mask relative overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `flex w-max gap-3 ${reverse ? "marquee-track-rev" : "marquee-track"}`,
			children: loop.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoChip, { item }, `${item.name}-${i}`))
		})
	});
}
/** Thin animated bar-chart glyph used as a "live telemetry" cue. */
function LiveBars({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		"aria-hidden": "true",
		className: `inline-flex h-4 items-end gap-[3px] ${className}`,
		children: [
			0,
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "w-[3px] origin-bottom rounded-full bg-primary",
			style: {
				height: "100%",
				animation: `qb-ticker-bar ${1.1 + i * .22}s ease-in-out ${i * .12}s infinite`
			}
		}, i))
	});
}
var countries = [
	"Nigeria",
	"Ghana",
	"Cameroon",
	"Burkina Faso",
	"Côte d'Ivoire",
	"Tanzania",
	"South Africa"
];
var company = {
	name: "Quantum Basics Nigeria Limited",
	rc: "RC: 430458",
	tagline: "...where Service works",
	phone: "08142396880",
	phoneHref: "tel:+2348142396880",
	email: "info@quantumbasics.com",
	website: "www.quantum-basics.com",
	websiteHref: "https://www.quantum-basics.com",
	address: "No 15b Otegbola Street, Gbagada, Lagos, Nigeria",
	whatsapp: "08142396880",
	whatsappHref: "https://wa.me/2348142396880",
	hours: "Monday – Friday, 08:00 – 17:00 WAT"
};
var columns = [{
	title: "Company",
	links: [
		{
			to: "/about",
			label: "About us"
		},
		{
			to: "/projects",
			label: "Projects & clients"
		},
		{
			to: "/academy",
			label: "Academy"
		},
		{
			to: "/contact",
			label: "Contact"
		}
	]
}, {
	title: "Solutions",
	links: [
		{
			to: "/services",
			label: "WAGES metering"
		},
		{
			to: "/services",
			label: "Industrial automation"
		},
		{
			to: "/services",
			label: "Smart grid & energy"
		},
		{
			to: "/services",
			label: "Security systems"
		},
		{
			to: "/services",
			label: "Telecom access networks"
		}
	]
}];
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "bg-ink text-ink-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-semibold",
						children: company.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs uppercase tracking-[0.2em] text-accent",
						children: [
							company.rc,
							" · ",
							company.tagline
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-md text-sm leading-relaxed text-ink-muted",
						children: "Engineering intelligent infrastructure across energy, oil & gas, utilities, industry and connectivity — designed, deployed and optimised end to end."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-6 space-y-3 text-sm text-ink-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), company.address]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: `mailto:${company.email}`,
									className: "hover:text-accent",
									children: company.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: company.phoneHref,
									className: "hover:text-accent",
									children: company.phone
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: company.whatsappHref,
									className: "hover:text-accent",
									children: ["WhatsApp ", company.whatsapp]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "mt-0.5 h-4 w-4 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: company.websiteHref,
									className: "hover:text-accent",
									children: company.website
								})]
							})
						]
					})
				]
			}), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink-foreground",
				children: col.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: col.links.map((link) => link.to === "/academy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: link.to,
					className: "text-sm text-ink-muted transition-colors hover:text-accent",
					children: link.label
				}) }, link.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
					to: link.to,
					className: "text-sm text-ink-muted transition-colors hover:text-accent",
					children: link.label
				}) }, link.label))
			})] }, col.title))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-white/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-shell flex flex-col gap-3 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Quantum Basics Nigeria Limited. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-x-5 gap-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
							to: "/privacy",
							className: "transition-colors hover:text-accent",
							children: "Privacy Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLink, {
							to: "/cookies",
							className: "transition-colors hover:text-accent",
							children: "Cookie Policy"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Partnership · Relationship · Commitment to Excellence" })
					]
				})]
			})
		})]
	});
}
var PUBLIC_NAV = [{
	to: "/academy",
	label: "Overview"
}, {
	to: "/academy/courses",
	label: "Courses"
}];
/**
* Chrome for the public Academy pages. Built only from this module — it
* shares no component, hero or layout with the marketing site so the portal
* can be deployed on its own hostname (academy.quantum-basics.com) without
* dragging quantum-basics.com's navigation along.
*/
function PortalLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "qa flex min-h-screen flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalTopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalFooter, {})
		]
	});
}
function PortalTopBar() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [signedIn, setSignedIn] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
		const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
		return () => data.subscription.unsubscribe();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 bg-[var(--qa-rail)] text-[var(--qa-rail-fg)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "qa-wrap flex h-14 items-center justify-between gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/academy",
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground",
						children: "QB"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "qa-label text-[var(--qa-rail-fg)]",
						children: "Academy"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "hidden items-center gap-7 sm:flex",
					children: [PUBLIC_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: item.to,
						activeOptions: { exact: item.to === "/academy" },
						activeProps: { className: "text-primary" },
						inactiveProps: { className: "text-[var(--qa-rail-muted)] hover:text-white" },
						className: "text-sm transition-colors",
						children: item.label
					}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: signedIn ? "/academy/dashboard" : "/academy/auth",
						className: "rounded bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep",
						children: signedIn ? "My learning" : "Sign in"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((value) => !value),
					className: "sm:hidden",
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-white/10 sm:hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "qa-wrap flex flex-col py-3",
				children: [PUBLIC_NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.to,
					onClick: () => setOpen(false),
					className: "py-2.5 text-sm text-[var(--qa-rail-muted)]",
					children: item.label
				}, item.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: signedIn ? "/academy/dashboard" : "/academy/auth",
					onClick: () => setOpen(false),
					className: "py-2.5 text-sm font-semibold text-primary",
					children: signedIn ? "My learning" : "Sign in"
				})]
			})
		}) : null]
	});
}
function PortalFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-16 bg-[var(--qa-rail)] py-8 text-[var(--qa-rail-fg)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "qa-wrap flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "qa-label text-[var(--qa-rail-muted)]",
				children: ["Quantum Basics Academy · ", (/* @__PURE__ */ new Date()).getFullYear()]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-5 text-sm text-[var(--qa-rail-muted)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/academy/courses",
						className: "hover:text-white",
						children: "Courses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/academy/auth",
						className: "hover:text-white",
						children: "Sign in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://quantum-basics.com",
						className: "hover:text-white",
						children: "quantum-basics.com"
					})
				]
			})]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$19 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				name: "author",
				content: "Quantum Basics Nigeria Limited"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap"
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon.png"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var APP_SHELL_PATH_PREFIXES = [
	"/academy/auth",
	"/academy/dashboard",
	"/academy/onboarding",
	"/academy/admin"
];
function isAcademyAppRoute(pathname) {
	return APP_SHELL_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}
function isAcademyPublicRoute(pathname) {
	return pathname === "/academy" || pathname.startsWith("/academy/");
}
function RootComponent() {
	const { queryClient } = Route$19.useRouteContext();
	const router = useRouter();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const isAppRoute = isAcademyAppRoute(pathname);
	const isAcademyPublic = !isAppRoute && isAcademyPublicRoute(pathname);
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	if (isAppRoute) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
	if (isAcademyPublic) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortalLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollProgress, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		})
	});
}
var $$splitComponentImporter$18 = () => import("./routes-COqPaH9r.mjs");
var Route$18 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Quantum Basics Nigeria Limited | Intelligent Infrastructure Engineering" },
		{
			name: "description",
			content: "Engineering company delivering WAGES metering, industrial automation, smart grid, energy management, security and telecom network systems across Africa."
		},
		{
			property: "og:title",
			content: "Quantum Basics Nigeria Limited | Intelligent Infrastructure Engineering"
		},
		{
			property: "og:description",
			content: "Designing, deploying and optimising intelligent infrastructure across energy, oil & gas, utilities, industry and connectivity."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./about-CuApg6Ro.mjs");
var Route$17 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About Quantum Basics | Engineering Services Across Africa" },
		{
			name: "description",
			content: "Quantum Basics Nigeria Limited is an engineering services company delivering energy, industrial and infrastructure solutions in seven African countries."
		},
		{
			property: "og:title",
			content: "About Quantum Basics Nigeria Limited"
		},
		{
			property: "og:description",
			content: "Our story, core values, African reach and the engineering partners behind our infrastructure work."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./academy-9JadWqQh.mjs");
var Route$16 = createFileRoute("/academy")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./contact-ia1S5dTf.mjs");
var Route$15 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Quantum Basics | Request an Engineering Consultation" },
		{
			name: "description",
			content: "Talk to the Quantum Basics engineering team about metering, automation, energy, security, telecom or academy training enquiries."
		},
		{
			property: "og:title",
			content: "Contact Quantum Basics Nigeria Limited"
		},
		{
			property: "og:description",
			content: "Request a consultation for your network, plant, utility or training programme."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./cookies-D4vSqTHv.mjs");
var Route$14 = createFileRoute("/cookies")({
	head: () => ({ meta: [{ title: "Cookie Policy | Quantum Basics Nigeria Limited" }, {
		name: "description",
		content: "How Quantum Basics Nigeria Limited uses cookies and similar technologies on this website and the Academy platform."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./privacy-CWVifrj_.mjs");
var Route$13 = createFileRoute("/privacy")({
	head: () => ({ meta: [{ title: "Privacy Policy | Quantum Basics Nigeria Limited" }, {
		name: "description",
		content: "How Quantum Basics Nigeria Limited collects, uses and protects information submitted through this website and the Academy platform."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./services-C8Aq3O_B.mjs");
var Route$12 = createFileRoute("/services")({
	head: () => ({ meta: [
		{ title: "Solutions | Quantum Basics Nigeria Limited" },
		{
			name: "description",
			content: "Industrial communications, WAGES metering, smart grid, smart field, process automation, energy management, security and telecommunications solutions from Quantum Basics."
		},
		{
			property: "og:title",
			content: "Quantum Basics Solutions"
		},
		{
			property: "og:description",
			content: "Engineered, deployed and optimised connected systems for energy, oil & gas, utilities, manufacturing and connectivity."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./academy.index-Bs7qGT1D.mjs");
var Route$11 = createFileRoute("/academy/")({
	head: () => ({ meta: [
		{ title: "Quantum Basics Academy | Industrial Automation & Energy Training" },
		{
			name: "description",
			content: "Practical training in industrial automation, WAGES metering, energy management, smart infrastructure and connectivity across four competency tracks."
		},
		{
			property: "og:title",
			content: "Quantum Basics Academy"
		},
		{
			property: "og:description",
			content: "Expert-led, hands-on training tracks for engineers, corporate teams, graduates and school leavers."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./academy._authenticated-DiAY0cEN.mjs");
var Route$10 = createFileRoute("/academy/_authenticated")({
	ssr: false,
	beforeLoad: async ({ location }) => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/academy/auth" });
		if (location.pathname !== "/academy/onboarding") {
			const { data: profile } = await supabase.from("profiles").select("onboarding_completed_at").eq("id", data.user.id).maybeSingle();
			if (!profile?.onboarding_completed_at) throw redirect({ to: "/academy/onboarding" });
		}
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./academy.auth-D2x-JeQ-.mjs");
var Route$9 = createFileRoute("/academy/auth")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Sign In or Create an Account | Quantum Basics Academy" },
		{
			name: "description",
			content: "Sign in to the Quantum Basics Academy learning portal or create an account to enrol on automation, metering, energy and connectivity training tracks."
		},
		{
			property: "og:title",
			content: "Quantum Basics Academy — Sign in or sign up"
		},
		{
			property: "og:description",
			content: "Access your Academy account and upcoming online courses."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
/** Absolute post-auth redirect URL, correct whether the app is served from
* the academy subdomain (physical "/dashboard") or the legacy "/academy"
* path on the main domain — see src/academy/lib/subdomains.ts. */
var $$splitComponentImporter$8 = () => import("./projects.index-C8b1z1_S.mjs");
var Route$8 = createFileRoute("/projects/")({
	head: () => ({ meta: [
		{ title: "Projects & Clients | Quantum Basics Nigeria Limited" },
		{
			name: "description",
			content: "A cross-section of completed projects for Fanmilk, Flour Mills, Zipline, Konexa and other industrial, energy and network clients across Africa."
		},
		{
			property: "og:title",
			content: "Projects & Clients | Quantum Basics"
		},
		{
			property: "og:description",
			content: "Historical project delivery across metering, automation, power, security and network builds."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./projects._slug-BD2qCcIM.mjs");
var $$splitNotFoundComponentImporter = () => import("./projects._slug-CWteVSMI.mjs");
var Route$7 = createFileRoute("/projects/$slug")({
	loader: ({ params }) => {
		const study = caseStudies.find((c) => c.slug === params.slug);
		if (!study) throw notFound();
		return { study };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Project not found | Quantum Basics" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { study } = loaderData;
		const title = `${study.title} — ${study.client} | Quantum Basics`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: study.summary
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: study.summary
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		] };
	},
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./academy._authenticated.admin-EQ8NuGTu.mjs");
var Route$6 = createFileRoute("/academy/_authenticated/admin")({
	ssr: false,
	head: () => ({ meta: [{ title: "Admin | Quantum Basics Academy" }] }),
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/academy/auth" });
		const { data: rows } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).eq("role", "super_admin");
		if (!rows || rows.length === 0) throw redirect({ to: "/academy/dashboard" });
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./academy._authenticated.calendar-Cy2endWP.mjs");
var Route$5 = createFileRoute("/academy/_authenticated/calendar")({
	head: () => ({ meta: [{ title: "Calendar | Quantum Basics Academy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
/** Sun-start 6x7 grid covering the given month, including lead/trail days
* from the adjacent months so every week row is full. */
var $$splitComponentImporter$4 = () => import("./academy._authenticated.dashboard-BnXB3fis.mjs");
var Route$4 = createFileRoute("/academy/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard | Quantum Basics Academy" }, {
		name: "description",
		content: "Your Quantum Basics Academy learning portal: enrolled courses, lesson progress and teaching tools."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
/** Sunday-to-Saturday range containing today, as YYYY-MM-DD strings. */
var $$splitComponentImporter$3 = () => import("./academy._authenticated.grades-CXfsk9aU.mjs");
var Route$3 = createFileRoute("/academy/_authenticated/grades")({
	head: () => ({ meta: [{ title: "Grades | Quantum Basics Academy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
/**
* Grades are derived from lesson completion — this LMS doesn't have
* separate scored assessments yet, so "grade" here means course
* completion, banded into the labels below.
*/
var $$splitComponentImporter$2 = () => import("./academy._authenticated.onboarding-CCSuv_-H.mjs");
var Route$2 = createFileRoute("/academy/_authenticated/onboarding")({
	ssr: false,
	head: () => ({ meta: [{ title: "Set up your account | Quantum Basics Academy" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./academy.courses.index-DgyMj1BR.mjs");
var Route$1 = createFileRoute("/academy/courses/")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Course Catalogue | Quantum Basics Academy" },
		{
			name: "description",
			content: "Browse the Quantum Basics Academy course catalogue: PLC and SCADA, WAGES metering, energy management and industrial networks, delivered as self-paced online modules."
		},
		{
			property: "og:title",
			content: "Quantum Basics Academy course catalogue"
		},
		{
			property: "og:description",
			content: "Self-paced online courses in automation, metering, energy and smart infrastructure."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./academy.courses._slug-Bhx--UkJ.mjs");
var Route = createFileRoute("/academy/courses/$slug")({
	ssr: false,
	head: () => ({ meta: [
		{ title: "Course | Quantum Basics Academy" },
		{
			name: "description",
			content: "Work through the lessons in this Quantum Basics Academy course and mark your progress as you go."
		},
		{
			property: "og:title",
			content: "Quantum Basics Academy course"
		},
		{
			property: "og:description",
			content: "Lesson-by-lesson online training from Quantum Basics Academy."
		},
		{
			property: "og:type",
			content: "article"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$19
});
var AboutRoute = Route$17.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$19
});
var AcademyRoute = Route$16.update({
	id: "/academy",
	path: "/academy",
	getParentRoute: () => Route$19
});
var ContactRoute = Route$15.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$19
});
var CookiesRoute = Route$14.update({
	id: "/cookies",
	path: "/cookies",
	getParentRoute: () => Route$19
});
var PrivacyRoute = Route$13.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$19
});
var ServicesRoute = Route$12.update({
	id: "/services",
	path: "/services",
	getParentRoute: () => Route$19
});
var AcademyIndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => AcademyRoute
});
var AcademyAuthenticatedRoute = Route$10.update({
	id: "/_authenticated",
	getParentRoute: () => AcademyRoute
});
var AcademyAuthRoute = Route$9.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => AcademyRoute
});
var ProjectsIndexRoute = Route$8.update({
	id: "/projects/",
	path: "/projects/",
	getParentRoute: () => Route$19
});
var ProjectsSlugRoute = Route$7.update({
	id: "/projects/$slug",
	path: "/projects/$slug",
	getParentRoute: () => Route$19
});
var AcademyAuthenticatedAdminRoute = Route$6.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => AcademyAuthenticatedRoute
});
var AcademyAuthenticatedCalendarRoute = Route$5.update({
	id: "/calendar",
	path: "/calendar",
	getParentRoute: () => AcademyAuthenticatedRoute
});
var AcademyAuthenticatedDashboardRoute = Route$4.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AcademyAuthenticatedRoute
});
var AcademyAuthenticatedGradesRoute = Route$3.update({
	id: "/grades",
	path: "/grades",
	getParentRoute: () => AcademyAuthenticatedRoute
});
var AcademyAuthenticatedOnboardingRoute = Route$2.update({
	id: "/onboarding",
	path: "/onboarding",
	getParentRoute: () => AcademyAuthenticatedRoute
});
var AcademyCoursesIndexRoute = Route$1.update({
	id: "/courses/",
	path: "/courses/",
	getParentRoute: () => AcademyRoute
});
var AcademyCoursesSlugRoute = Route.update({
	id: "/courses/$slug",
	path: "/courses/$slug",
	getParentRoute: () => AcademyRoute
});
var AcademyAuthenticatedRouteChildren = {
	AcademyAuthenticatedAdminRoute,
	AcademyAuthenticatedCalendarRoute,
	AcademyAuthenticatedDashboardRoute,
	AcademyAuthenticatedGradesRoute,
	AcademyAuthenticatedOnboardingRoute
};
var AcademyRouteChildren = {
	AcademyAuthenticatedRoute: AcademyAuthenticatedRoute._addFileChildren(AcademyAuthenticatedRouteChildren),
	AcademyAuthRoute,
	AcademyIndexRoute,
	AcademyCoursesSlugRoute,
	AcademyCoursesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AcademyRoute: AcademyRoute._addFileChildren(AcademyRouteChildren),
	ContactRoute,
	CookiesRoute,
	PrivacyRoute,
	ServicesRoute,
	ProjectsSlugRoute,
	ProjectsIndexRoute
};
var routeTree = Route$19._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var subdomainRewrite = {
	input: ({ url }) => {
		const prefix = subdomainPrefixForHost(url.hostname);
		if (!prefix) return url;
		if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) return url;
		url.pathname = url.pathname === "/" ? prefix : `${prefix}${url.pathname}`;
		return url;
	},
	output: ({ url }) => {
		const prefix = subdomainPrefixForHost(url.hostname);
		if (!prefix) return url;
		if (url.pathname === prefix) url.pathname = "/";
		else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
		return url;
	}
};
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0,
		rewrite: subdomainRewrite
	});
};
//#endregion
export { countries as a, LogoMarquee as c, StaggerItem as d, caseStudies as f, wacot_default as g, tetrapak_default as h, company as i, Reveal as l, fanmilk_default as m, Route as n, CountUp as o, cocacola_default as p, Route$7 as r, LiveBars as s, router_exports as t, Stagger as u };
