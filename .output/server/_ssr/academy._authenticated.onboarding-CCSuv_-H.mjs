import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { m as useRouter, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./client-CFL8hqg1.mjs";
import { V as ArrowRight } from "../_libs/lucide-react.mjs";
import { a as SelectField, c as TextField, o as Spinner, t as Btn } from "./ui-pvzeBS6D.mjs";
import { n as academyTracks } from "./academy-BiY6yBAS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/academy._authenticated.onboarding-CCSuv_-H.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const navigate = useNavigate();
	const router = useRouter();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [organisation, setOrganisation] = (0, import_react.useState)("");
	const [track, setTrack] = (0, import_react.useState)(academyTracks[0]?.title ?? "");
	const load = (0, import_react.useCallback)(async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) return;
		const { data: profile } = await supabase.from("profiles").select("full_name, phone, organisation, preferred_track").eq("id", data.user.id).maybeSingle();
		setFullName(profile?.full_name ?? "");
		setPhone(profile?.phone ?? "");
		setOrganisation(profile?.organisation ?? "");
		setTrack(profile?.preferred_track ?? academyTracks[0]?.title ?? "");
		setLoading(false);
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setSaving(true);
		const { data } = await supabase.auth.getUser();
		if (!data.user) {
			setSaving(false);
			navigate({
				to: "/academy/auth",
				replace: true
			});
			return;
		}
		const { error: updateError } = await supabase.from("profiles").update({
			full_name: fullName.trim(),
			phone: phone.trim() || null,
			organisation: organisation.trim() || null,
			preferred_track: track,
			onboarding_completed_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", data.user.id);
		setSaving(false);
		if (updateError) {
			setError(updateError.message);
			return;
		}
		await router.invalidate();
		navigate({
			to: "/academy/dashboard",
			replace: true
		});
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "qa flex min-h-screen items-center justify-center bg-[var(--qa-surface)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spinner, {})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "qa flex min-h-screen items-center justify-center bg-[var(--qa-surface)] px-4 py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-lg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 flex items-center gap-2.5",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "qa-label text-primary",
						children: "One last step"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 text-2xl font-semibold",
						children: "Set up your account"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Tell us a little about yourself so we can tailor the Academy to you."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "mt-8 grid gap-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
								label: "Full name",
								value: fullName,
								onChange: setFullName,
								placeholder: "Ada Obi",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-5 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Phone",
									type: "tel",
									value: phone,
									onChange: setPhone,
									placeholder: "+234 800 000 0000"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextField, {
									label: "Organisation",
									value: organisation,
									onChange: setOrganisation,
									placeholder: "Company or institution"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectField, {
								label: "Preferred track",
								value: track,
								onChange: setTrack,
								options: academyTracks.map((t) => t.title)
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								role: "alert",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Btn, {
								type: "submit",
								disabled: saving,
								className: "mt-2",
								children: [
									saving ? "Saving…" : "Continue to dashboard",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
								]
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { Onboarding as component };
