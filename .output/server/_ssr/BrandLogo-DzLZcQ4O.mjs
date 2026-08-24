import { i as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BrandLogo-DzLZcQ4O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Renders a brand/partner logo image, falling back to the plain company
* name if the image fails to load (e.g. a missing asset). Use this instead
* of a bare <img> anywhere a logo comes from data rather than a bundled,
* known-good asset.
*/
function BrandLogo({ name, src, className = "max-h-10 w-auto max-w-full object-contain" }) {
	const [failed, setFailed] = (0, import_react.useState)(false);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const img = ref.current;
		if (img && img.complete && img.naturalWidth === 0) setFailed(true);
	}, []);
	if (failed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "whitespace-nowrap text-sm font-semibold tracking-tight text-muted-foreground",
		children: name
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		ref,
		src,
		alt: `${name} logo`,
		loading: "lazy",
		onError: () => setFailed(true),
		className
	});
}
//#endregion
export { BrandLogo as t };
