/**
 * Maps a subdomain's first label to the internal route prefix that already
 * exists in the route tree. Adding a subdomain here does NOT require moving
 * any route files — it just tells the router which physical (public) URLs
 * correspond to which existing "/academy/..." (or future "/blog/...")
 * logical routes.
 *
 * academy.quantum-basics.com/dashboard  <->  logical route /academy/dashboard
 * blog.quantum-basics.com/...           <->  logical route /blog/...
 */
export const SUBDOMAIN_PREFIXES: Record<string, string> = {
  academy: "/academy",
  blog: "/blog",
};

export function subdomainPrefixForHost(hostname: string): string | null {
  const label = hostname.split(".")[0];
  return label ? (SUBDOMAIN_PREFIXES[label] ?? null) : null;
}

/** Logical in-app path -> physical (public-facing) path for a given
 * hostname. On academy.quantum-basics.com, "/academy/dashboard" is served
 * at "/dashboard"; on any other host (main domain, plain localhost) it's
 * unchanged. Used for building absolute redirect URLs that need to be
 * correct regardless of which host they're generated from (email
 * confirmation links, OAuth callbacks). */
export function physicalPath(hostname: string, logicalPath: string): string {
  const prefix = subdomainPrefixForHost(hostname);
  if (!prefix) return logicalPath;
  if (logicalPath === prefix) return "/";
  if (logicalPath.startsWith(`${prefix}/`)) return logicalPath.slice(prefix.length);
  return logicalPath;
}
