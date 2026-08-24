import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import "../academy.css";

const PUBLIC_NAV = [
  { to: "/academy", label: "Overview" },
  { to: "/academy/courses", label: "Courses" },
] as const;

/**
 * Chrome for the public Academy pages. Built only from this module — it
 * shares no component, hero or layout with the marketing site so the portal
 * can be deployed on its own hostname (academy.quantum-basics.com) without
 * dragging quantum-basics.com's navigation along.
 */
export function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="qa flex min-h-screen flex-col">
      <PortalTopBar />
      <main className="flex-1">{children}</main>
      <PortalFooter />
    </div>
  );
}

function PortalTopBar() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(Boolean(session)),
    );
    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[var(--qa-rail)] text-[var(--qa-rail-fg)]">
      <div className="qa-wrap flex h-14 items-center justify-between gap-6">
        <Link to="/academy" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
            QB
          </span>
          <span className="qa-label text-[var(--qa-rail-fg)]">Academy</span>
        </Link>

        <nav className="hidden items-center gap-7 sm:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/academy" }}
              activeProps={{ className: "text-primary" }}
              inactiveProps={{ className: "text-[var(--qa-rail-muted)] hover:text-white" }}
              className="text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to={signedIn ? "/academy/dashboard" : "/academy/auth"}
            className="rounded bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            {signedIn ? "My learning" : "Sign in"}
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
          className="sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 sm:hidden">
          <div className="qa-wrap flex flex-col py-3">
            {PUBLIC_NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-[var(--qa-rail-muted)]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to={signedIn ? "/academy/dashboard" : "/academy/auth"}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-semibold text-primary"
            >
              {signedIn ? "My learning" : "Sign in"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function PortalFooter() {
  return (
    <footer className="mt-16 bg-[var(--qa-rail)] py-8 text-[var(--qa-rail-fg)]">
      <div className="qa-wrap flex flex-wrap items-center justify-between gap-4">
        <p className="qa-label text-[var(--qa-rail-muted)]">
          Quantum Basics Academy · {new Date().getFullYear()}
        </p>
        <div className="flex flex-wrap items-center gap-5 text-sm text-[var(--qa-rail-muted)]">
          <Link to="/academy/courses" className="hover:text-white">
            Courses
          </Link>
          <Link to="/academy/auth" className="hover:text-white">
            Sign in
          </Link>
          {/* Deliberately the only outbound link to the marketing site. */}
          <a href="https://quantum-basics.com" className="hover:text-white">
            quantum-basics.com
          </a>
        </div>
      </div>
    </footer>
  );
}
