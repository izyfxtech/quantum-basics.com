import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { subdomainPrefixForHost } from "@/academy/lib/subdomains";

// Lets a subdomain (academy.quantum-basics.com) transparently serve an
// existing internal route prefix (/academy/...) without moving any route
// files: the route tree still defines "/academy/dashboard" etc. exactly as
// before; this rewrite maps the physical public URL to that logical route
// on the way in, and back to the physical URL for hrefs/history on the way
// out. See src/lib/subdomains.ts for the host -> prefix mapping and
// src/server.ts for the matching 301 redirect on the main domain.
const subdomainRewrite = {
  input: ({ url }: { url: URL }) => {
    const prefix = subdomainPrefixForHost(url.hostname);
    if (!prefix) return url;
    if (url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)) return url;
    url.pathname = url.pathname === "/" ? prefix : `${prefix}${url.pathname}`;
    return url;
  },
  output: ({ url }: { url: URL }) => {
    const prefix = subdomainPrefixForHost(url.hostname);
    if (!prefix) return url;
    if (url.pathname === prefix) url.pathname = "/";
    else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
    return url;
  },
};

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Preload a route's JS chunk (and loader, for the few routes that have
    // one) on link hover/touchstart, so clicking feels instant instead of
    // waiting for a fresh chunk fetch. This was previously inert:
    // defaultPreloadStaleTime was set below with no defaultPreload, and
    // preloading defaults to off, so nothing ever actually preloaded.
    defaultPreload: "intent",
    // Treat a preload as fresh for a few seconds after it fires, so the
    // loader data it fetched on hover is actually reused on click rather
    // than being immediately stale and re-fetched a second time.
    defaultPreloadStaleTime: 10_000,
    rewrite: subdomainRewrite,
  });

  return router;
};
