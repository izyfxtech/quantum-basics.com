import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as physicalPath } from "./ssr.mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { S as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as TextField, t as Btn } from "./ui-pvzeBS6D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy.auth-D2x-JeQ-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Absolute post-auth redirect URL, correct whether the app is served from
* the academy subdomain (physical "/dashboard") or the legacy "/academy"
* path on the main domain — see src/academy/lib/subdomains.ts. */
function dashboardRedirectUrl() {
	return `${window.location.origin}${physicalPath(window.location.hostname, "/academy/dashboard")}`;
}
function AcademyAuth() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((_event, session) => {
			if (session) navigate({
				to: "/academy/dashboard",
				replace: true
			});
		});
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session) navigate({
				to: "/academy/dashboard",
				replace: true
			});
		});
		return () => data.subscription.unsubscribe();
	}, [navigate]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setNotice(null);
		setLoading(true);
		if (mode === "signin") {
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password
			});
			setLoading(false);
			if (signInError) {
				setError(signInError.message);
				return;
			}
			navigate({
				to: "/academy/dashboard",
				replace: true
			});
			return;
		}
		const { data, error: signUpError } = await supabase.auth.signUp({
			email,
			password,
			options: { emailRedirectTo: dashboardRedirectUrl() }
		});
		setLoading(false);
		if (signUpError) {
			setError(signUpError.message);
			return;
		}
		if (!data.session) {
			setNotice("Account created. Check your email to confirm your address, then sign in.");
			return;
		}
		navigate({
			to: "/academy/dashboard",
			replace: true
		});
	}
	async function handleGoogle() {
		setError(null);
		setLoading(true);
		const { error: oauthError } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: dashboardRedirectUrl() }
		});
		if (oauthError) {
			setLoading(false);
			setError(oauthError.message ?? "Google sign-in failed. Please try again.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "qa flex min-h-screen items-center justify-center bg-[var(--qa-surface)] px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/academy",
				className: "mb-8 flex items-center justify-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground",
					children: "QB"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "qa-label",
					children: "Academy"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "qa-card p-8 md:p-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 rounded border border-[var(--qa-line)] bg-secondary/60 p-1",
						children: ["signin", "signup"].map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setMode(m);
								setError(null);
								setNotice(null);
							},
							className: `h-9 flex-1 rounded text-sm font-semibold transition-colors ${mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
							children: m === "signin" ? "Sign in" : "Create account"
						}, m))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: handleGoogle,
						disabled: loading,
						className: "mt-7 inline-flex h-11 w-full items-center justify-center gap-3 rounded border border-[var(--qa-line)] bg-background text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleMark, {}), "Continue with Google"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "my-6 flex items-center gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-[var(--qa-line)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "qa-label text-muted-foreground",
								children: "or"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-[var(--qa-line)]" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "grid gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Email",
								type: "email",
								value: email,
								onChange: setEmail,
								placeholder: "you@company.com",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Password",
								type: "password",
								value: password,
								onChange: setPassword,
								placeholder: "At least 8 characters",
								required: true
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								role: "alert",
								children: error
							}) : null,
							notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-primary",
								role: "status",
								children: notice
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								type: "submit",
								disabled: loading,
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : null, mode === "signin" ? "Sign in" : "Create account"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-center text-sm text-muted-foreground",
						children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"New to the Academy?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-primary",
								onClick: () => setMode("signup"),
								children: "Create an account"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"Already registered?",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold text-primary",
								onClick: () => setMode("signin"),
								children: "Sign in"
							})
						] })
					})
				]
			})]
		})
	});
}
function GoogleMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className: "h-4 w-4",
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.76-2.11-6.71-4.94H1.29v3.1A12 12 0 0 0 12 24Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1C6.24 6.86 8.88 4.75 12 4.75Z"
			})
		]
	});
}
//#endregion
export { AcademyAuth as component };
