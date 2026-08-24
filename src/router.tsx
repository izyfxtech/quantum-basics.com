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
    defaultPreloadStaleTime: 0,
    rewrite: subdomainRewrite,
  });

  return router;
};
