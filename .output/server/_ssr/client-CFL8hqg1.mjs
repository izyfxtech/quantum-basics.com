import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-CFL8hqg1.js
function isNewSupabaseApiKey(value) {
	return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}
function createSupabaseFetch(supabaseKey) {
	return (input, init) => {
		const headers = new Headers(typeof Request !== "undefined" && input instanceof Request ? input.headers : void 0);
		if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
		if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) headers.delete("Authorization");
		headers.set("apikey", supabaseKey);
		return fetch(input, {
			...init,
			headers
		});
	};
}
function createSupabaseClient() {
	const SUPABASE_URL = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cmR1ZXpua3Ryb2VwZmtwanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDI5OTAsImV4cCI6MjEwMjcxODk5MH0.j14nBiu4A5llBbyGb7Euch1iRsiAfGw3OOKvRSH1Sgo",
		"VITE_SUPABASE_PROJECT_ID": "surdueznktroepfkpjsn",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_fSE4YF9XVz4CQZdapvIreQ_unt-SQXX",
		"VITE_SUPABASE_URL": "https://surdueznktroepfkpjsn.supabase.co"
	}["VITE_SUPABASE_URL"] || process.env["SUPABASE_URL"];
	const SUPABASE_ANON_KEY = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/",
		"VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1cmR1ZXpua3Ryb2VwZmtwanNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNDI5OTAsImV4cCI6MjEwMjcxODk5MH0.j14nBiu4A5llBbyGb7Euch1iRsiAfGw3OOKvRSH1Sgo",
		"VITE_SUPABASE_PROJECT_ID": "surdueznktroepfkpjsn",
		"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_fSE4YF9XVz4CQZdapvIreQ_unt-SQXX",
		"VITE_SUPABASE_URL": "https://surdueznktroepfkpjsn.supabase.co"
	}["VITE_SUPABASE_ANON_KEY"] || process.env["SUPABASE_ANON_KEY"];
	if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
		const message = `Missing Supabase environment variable(s): ${[...!SUPABASE_URL ? ["SUPABASE_URL"] : [], ...!SUPABASE_ANON_KEY ? ["SUPABASE_ANON_KEY"] : []].join(", ")}. Set the required env vars in .env (see .env.example).`;
		console.error(`[Supabase] ${message}`);
		throw new Error(message);
	}
	return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		global: { fetch: createSupabaseFetch(SUPABASE_ANON_KEY) },
		auth: {
			storage: typeof window !== "undefined" ? localStorage : void 0,
			persistSession: true,
			autoRefreshToken: true
		}
	});
}
var _supabase;
var supabase = new Proxy({}, { get(_, prop, receiver) {
	if (!_supabase) _supabase = createSupabaseClient();
	return Reflect.get(_supabase, prop, receiver);
} });
//#endregion
export { supabase as t };
