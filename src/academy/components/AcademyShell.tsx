import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Calendar,
  ClipboardList,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";
import { fetchMyAccess, isSuperAdmin, roleBadges } from "@/academy/lib/roles";
import "../academy.css";

type NavItem = { to: string; label: string; icon: typeof Home };

const PUBLIC_NAV: NavItem[] = [
  { to: "/academy", label: "Overview", icon: Home },
  { to: "/academy/courses", label: "Courses", icon: BookOpen },
];

const AUTHENTICATED_NAV: NavItem[] = [
  { to: "/academy/dashboard", label: "My learning", icon: LayoutDashboard },
  { to: "/academy/courses", label: "Courses", icon: BookOpen },
  { to: "/academy/calendar", label: "Calendar", icon: Calendar },
  { to: "/academy/grades", label: "Grades", icon: GraduationCap },
];

type Identity = {
  loading: boolean;
  signedIn: boolean;
  name: string;
  roles: string[];
  admin: boolean;
  teaching: boolean;
};

const ANONYMOUS: Identity = {
  loading: false,
  signedIn: false,
  name: "",
  roles: [],
  admin: false,
  teaching: false,
};

/** Self-fetches who's signed in (if anyone) so no page has to thread
 * name/roles/admin through as props any more — the shell figures it out
 * once, and refreshes whenever the auth state changes. */
function useAcademyIdentity(): Identity {
  const [state, setState] = useState<Identity>({ ...ANONYMOUS, loading: true });

  useEffect(() => {
    let active = true;

    async function load() {
      const user = await getCurrentUser();
      if (!user) {
        if (active) setState(ANONYMOUS);
        return;
      }

      const [{ data: profile }, access] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        fetchMyAccess(),
      ]);
      if (!active) return;
      setState({
        loading: false,
        signedIn: true,
        name: profile?.full_name?.trim() || user.email || "Learner",
        roles: roleBadges(access),
        admin: isSuperAdmin(access),
        teaching: Boolean(access && access.courseStaff.length > 0),
      });
    }

    void load();
    const { data: sub } = supabase.auth.onAuthStateChange(() => void load());
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

/**
 * Chrome for every /academy page — the public landing/catalogue/course
 * pages and the signed-in dashboard/calendar/grades/admin screens alike.
 * One rail, self-adapting to auth state, so the whole section reads as a
 * single product instead of a marketing shell bolted to an app shell.
 *
 * The desktop rail is `lg:fixed`, taking it out of document flow entirely,
 * so it never scrolls with the page — only the content column beside it
 * scrolls. Below `lg` it collapses into a slide-in drawer.
 */
export function AcademyShell({ children }: { children: ReactNode }) {
  const identity = useAcademyIdentity();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav: NavItem[] = identity.signedIn ? [...AUTHENTICATED_NAV] : [...PUBLIC_NAV];
  if (identity.signedIn && identity.teaching) {
    nav.push({ to: "/academy/teaching", label: "My courses", icon: ClipboardList });
  }
  if (identity.signedIn && identity.admin) {
    nav.push({ to: "/academy/admin", label: "Administration", icon: ShieldCheck });
  }

  async function signOut() {
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/academy/auth", replace: true });
  }

  return (
    <div className="qa flex min-h-screen">
      {/* Desktop rail: fixed, so page scroll never moves it. */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-60 lg:flex-col lg:overflow-y-auto lg:bg-[var(--qa-rail)] lg:text-[var(--qa-rail-fg)]">
        <RailContent identity={identity} nav={nav} onSignOut={signOut} onNavigate={() => {}} />
      </aside>

      {/* Mobile slide-in drawer. */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-64 flex-col overflow-y-auto bg-[var(--qa-rail)] text-[var(--qa-rail-fg)]">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 text-[var(--qa-rail-muted)]"
            >
              <X className="h-5 w-5" />
            </button>
            <RailContent
              identity={identity}
              nav={nav}
              onSignOut={signOut}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="flex h-14 shrink-0 items-center gap-3 bg-[var(--qa-rail)] px-4 text-[var(--qa-rail-fg)] lg:hidden">
          <button type="button" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <span className="qa-label">Quantum Basics Academy</span>
        </header>

        <main className="flex-1 px-5 py-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <ShellFooter />
      </div>
    </div>
  );
}

function RailContent({
  identity,
  nav,
  onSignOut,
  onNavigate,
}: {
  identity: Identity;
  nav: NavItem[];
  onSignOut: () => void;
  onNavigate: () => void;
}) {
  return (
    <>
      <Link to="/academy" onClick={onNavigate} className="flex h-14 items-center gap-2.5 px-5">
        <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
          QB
        </span>
        <span className="qa-label">Academy</span>
      </Link>

      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/academy" }}
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
        {identity.loading ? (
          <div className="h-9" />
        ) : identity.signedIn ? (
          <>
            <p className="truncate text-sm font-semibold">{identity.name}</p>
            {identity.roles.length ? (
              <p className="qa-label mt-1 text-[var(--qa-rail-muted)]">
                {identity.roles.join(" · ")}
              </p>
            ) : null}
            <button
              type="button"
              onClick={onSignOut}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded border border-white/15 px-3 py-2 text-xs font-semibold text-[var(--qa-rail-fg)] transition-colors hover:bg-white/10"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </>
        ) : (
          <Link
            to="/academy/auth"
            onClick={onNavigate}
            className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Sign in
          </Link>
        )}
      </div>
    </>
  );
}

function ShellFooter() {
  return (
    <footer className="qa-rule shrink-0 px-5 py-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="qa-label text-muted-foreground">
          Quantum Basics Academy · {new Date().getFullYear()}
        </p>
        {/* Deliberately the only outbound link to the marketing site. */}
        <a
          href="https://quantum-basics.com"
          className="qa-label text-muted-foreground hover:text-foreground"
        >
          quantum-basics.com
        </a>
      </div>
    </footer>
  );
}
