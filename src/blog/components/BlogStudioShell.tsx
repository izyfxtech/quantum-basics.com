import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LogOut, PenSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyBlogAccess, type BlogAccess } from "@/blog/lib/auth";
import "@/blog/studio.css";

const NAV = [
  { to: "/blog/studio", label: "Dashboard" },
  { to: "/blog/studio/new", label: "New post" },
];

/** Nav-display identity only — independent of the route-level guard in
 * blog.studio._authenticated.tsx, same split as AcademyShell's own
 * identity fetch versus academy._authenticated.tsx's guard. Renders
 * immediately with a loading state rather than blocking the whole shell
 * on this request. */
function useBlogIdentity(): BlogAccess | null | "loading" {
  const [identity, setIdentity] = useState<BlogAccess | null | "loading">("loading");

  useEffect(() => {
    let active = true;
    // Nav-display identity only — a failed check here just leaves the
    // name/role blank in the header; the route guard in
    // blog.studio._authenticated.tsx is what actually surfaces an error
    // and blocks the page.
    void fetchMyBlogAccess().then(({ access }) => {
      if (active) setIdentity(access);
    });
    const { data } = supabase.auth.onAuthStateChange(() => {
      void fetchMyBlogAccess().then(({ access }) => {
        if (active) setIdentity(access);
      });
    });
    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  return identity;
}

export function BlogStudioShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const identity = useBlogIdentity();
  const name = identity === "loading" || identity === null ? "" : identity.name;
  const role = identity === "loading" || identity === null ? null : identity.role;

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate({ to: "/blog/studio/auth" });
  }

  return (
    <div className="bs min-h-screen">
      <header className="border-b border-[var(--bs-line)] bg-[var(--bs-rail)]">
        <div className="bs-wrap flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link to="/blog/studio" className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
                QB
              </span>
              <span className="text-base" style={{ fontFamily: "var(--font-display)" }}>
                Studio
              </span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === item.to
                      ? "bg-primary/10 text-primary"
                      : "text-[var(--bs-rail-fg)] hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {role === "editor" ? (
                <Link
                  to="/blog/studio/team"
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    pathname === "/blog/studio/team"
                      ? "bg-primary/10 text-primary"
                      : "text-[var(--bs-rail-fg)] hover:bg-secondary"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" /> Team
                </Link>
              ) : null}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {name ? (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-tight">{name}</p>
                {role ? <p className="bs-label leading-tight">{role}</p> : null}
              </div>
            ) : null}
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="rounded-full p-2 text-[var(--bs-rail-fg)] hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="flex items-center gap-1 border-t border-[var(--bs-line)] px-4 py-2 sm:hidden">
          {[...NAV, ...(role === "editor" ? [{ to: "/blog/studio/team", label: "Team" }] : [])].map(
            (item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  pathname === item.to ? "bg-primary/10 text-primary" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </header>

      <main className="bs-wrap py-10 md:py-14">
        {name ? (
          <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground sm:hidden">
            <PenSquare className="h-3.5 w-3.5" /> {name} · {role}
          </div>
        ) : null}
        {children}
      </main>
    </div>
  );
}
