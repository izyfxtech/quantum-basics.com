import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { subdomainPrefixForHost } from "@/academy/lib/subdomains";

type SiteLinkProps = {
  to: string;
  hash?: string;
  className?: string;
  activeProps?: { className?: string };
  onClick?: () => void;
  onFocus?: () => void;
  "aria-expanded"?: boolean;
  children?: ReactNode;
};

/**
 * Like <Link>, but aware that this app can be mounted on a product
 * subdomain (academy.quantum-basics.com, blog.quantum-basics.com) where
 * only that product's own route prefix resolves internally (see the
 * rewrite in src/router.tsx). A plain internal <Link to="/about"> rendered
 * on academy.* would try to resolve as "/academy/about" and 404 — and a
 * link to a *different* product's root (e.g. "/blog" while mounted on
 * academy.*) has the same problem.
 *
 * SiteLink handles both cases the same way: if `to` belongs to the
 * subdomain we're currently mounted on, it's a normal internal <Link>;
 * otherwise it's a real cross-origin <a> back to the apex domain, which
 * 301-redirects /academy/* and /blog/* paths to their own subdomain (see
 * src/server.ts) — so the link still lands in the right place, it just
 * takes one extra hop instead of an in-app navigation.
 */
export function SiteLink({
  to,
  hash,
  className,
  activeProps,
  onClick,
  onFocus,
  children,
  ...rest
}: SiteLinkProps) {
  const [crossOriginHref, setCrossOriginHref] = useState<string | null>(null);

  useEffect(() => {
    const prefix = subdomainPrefixForHost(window.location.hostname);
    const staysOnCurrentSubdomain = !prefix || to === prefix || to.startsWith(`${prefix}/`);
    if (staysOnCurrentSubdomain) {
      setCrossOriginHref(null);
      return;
    }
    const apex = window.location.hostname.split(".").slice(1).join(".");
    const port = window.location.port ? `:${window.location.port}` : "";
    setCrossOriginHref(`${window.location.protocol}//${apex}${port}${to}${hash ? `#${hash}` : ""}`);
  }, [to, hash]);

  if (crossOriginHref) {
    return (
      <a href={crossOriginHref} className={className} onClick={onClick} onFocus={onFocus} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={className}
      onClick={onClick}
      onFocus={onFocus}
      {...(hash ? { hash } : {})}
      {...(activeProps ? { activeProps } : {})}
      {...rest}
    >
      {children}
    </Link>
  );
}
