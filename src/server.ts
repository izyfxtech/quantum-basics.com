import "./lib/error-capture";

import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { PROVISIONED_APEX_HOSTS, SUBDOMAIN_PREFIXES } from "./academy/lib/subdomains";

const PREFIX_TO_SUBDOMAIN_LABEL = Object.fromEntries(
  Object.entries(SUBDOMAIN_PREFIXES).map(([label, prefix]) => [prefix, label]),
);

/**
 * On the main domain, permanently redirect legacy "/academy/*" (and future
 * "/blog/*") paths to their dedicated subdomain — e.g.
 * quantum-basics.com/academy/dashboard -> academy.quantum-basics.com/dashboard.
 * Requests already arriving on a subdomain (or on plain localhost during
 * local testing) are left alone; the router's own rewrite (src/router.tsx)
 * handles those. Requires the subdomain to actually be pointed at this app
 * with your host (add a domain/DNS entry for e.g. academy.quantum-basics.com
 * in your Vercel project) — this redirect alone doesn't provision that.
 */
function redirectToSubdomain(request: Request): Response | null {
  const url = new URL(request.url);

  // Only redirect on hosts where academy.<host> / blog.<host> are real,
  // DNS-provisioned domains (see PROVISIONED_APEX_HOSTS). On anything else —
  // Vercel's own *.vercel.app default/preview domains, localhost, etc. —
  // "academy.<that-host>" doesn't resolve, so redirecting there would just
  // break the page (browser can't reach it). Leave /academy/* and /blog/*
  // served directly on those hosts instead.
  if (!PROVISIONED_APEX_HOSTS.includes(url.hostname)) return null;

  const hostLabel = url.hostname.split(".")[0];
  if (hostLabel && SUBDOMAIN_PREFIXES[hostLabel]) return null; // already on a subdomain

  const [, firstSegment, ...rest] = url.pathname.split("/");
  const targetLabel = firstSegment ? PREFIX_TO_SUBDOMAIN_LABEL[`/${firstSegment}`] : undefined;
  if (!targetLabel) return null;

  const apexHost = url.hostname.replace(/^www\./, "");
  const target = new URL(url);
  target.hostname = `${targetLabel}.${apexHost}`;
  target.pathname = `/${rest.join("/")}`;
  return Response.redirect(target.toString(), 301);
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Documented TanStack Start entry-point pattern (see
// https://tanstack.com/start/latest/docs/framework/react/guide/server-entry-point):
// wrap a `fetch(request)` handler with `createServerEntry` for type safety,
// and call the framework's own default handler for anything not handled
// here. No `env`/`ctx` params — those are Cloudflare Workers-specific and
// unused since this app now targets Vercel (Nitro auto-detects the host at
// build time; see vite.config.ts). If you ever redeploy to Cloudflare
// Workers, Nitro's cloudflare-module preset delivers bindings via
// `request` itself (e.g. `(request as { cf?: unknown }).cf`) or through
// `getBindings()` in `@tanstack/react-start/server`, not extra fetch args.
export default createServerEntry({
  async fetch(request: Request) {
    try {
      const redirect = redirectToSubdomain(request);
      if (redirect) return redirect;

      const response = await handler.fetch(request);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
});

