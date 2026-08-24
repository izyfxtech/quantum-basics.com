import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { BookOpen, Calendar, GraduationCap, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import "../academy.css";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard };

/**
 * Shell for the signed-in LMS (dashboard, course player, onboarding, admin).
 * A product surface with a dark rail — no marketing header, hero or footer.
 */
export function PortalShell({
  name,
  roles,
  showAdmin,
  children,
}: {
  name: string;
  roles: string[];
  showAdmin: boolean;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = [
    { to: "/academy/dashboard", label: "My learning", icon: LayoutDashboard },
    { to: "/academy/courses", label: "Catalogue", icon: BookOpen },
    { to: "/academy/calendar", label: "Calendar", icon: Calendar },
    { to: "/academy/grades", label: "Grades", icon: GraduationCap },
  ];
  if (showAdmin) nav.push({ to: "/academy/admin", label: "Administration", icon: ShieldCheck });

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/academy/auth", replace: true });
  }

  return (
    <div className="qa flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col bg-[var(--qa-rail)] text-[var(--qa-rail-fg)] lg:flex">
        <Rail name={name} roles={roles} nav={nav} onSignOut={signOut} onNavigate={() => {}} />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-[var(--qa-rail)] text-[var(--qa-rail-fg)]">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-[var(--qa-rail-muted)]"
            >
              <X className="h-5 w-5" />
            </button>
            <Rail
              name={name}
              roles={roles}
              nav={nav}
              onSignOut={signOut}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 bg-[var(--qa-rail)] px-4 text-[var(--qa-rail-fg)] lg:hidden">
          <button type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="qa-label">Quantum Basics Academy</span>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

function Rail({
  name,
  roles,
  nav,
  onSignOut,
  onNavigate,
}: {
  name: string;
  roles: string[];
  nav: NavItem[];
  onSignOut: () => void;
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="flex h-14 items-center gap-2.5 px-5">
        <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
          QB
        </span>
        <span className="qa-label">Academy</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            activeProps={{ className: "bg-white/10 text-white" }}
            inactiveProps={{ className: "text-[var(--qa-rail-muted)] hover:bg-white/5" }}
            className="flex items-center gap-3 rounded px-3 py-2.5 text-sm transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-sm font-semibold">{name}</p>
        {roles.length ? (
          <p className="qa-label mt-1 text-[var(--qa-rail-muted)]">{roles.join(" · ")}</p>
        ) : null}
        <button
          type="button"
          onClick={onSignOut}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded border border-white/15 px-3 py-2 text-xs font-semibold text-[var(--qa-rail-fg)] transition-colors hover:bg-white/10"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </>
  );
}
