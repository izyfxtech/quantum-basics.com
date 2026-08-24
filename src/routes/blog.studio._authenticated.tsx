import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchMyBlogAccess, type BlogAccess } from "@/blog/lib/auth";
import { BlogAccessContext } from "@/blog/lib/context";
import { BlogStudioShell } from "@/blog/components/BlogStudioShell";
import { EmptyState, ErrorNotice, Spinner } from "@/blog/components/ui";
import "@/blog/studio.css";

export const Route = createFileRoute("/blog/studio/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/blog/studio/auth" });
  },
  component: BlogStudioGuard,
});

// Deliberately doesn't redirect when signed in but off the blog team —
// there's nowhere useful to send that account, so it gets a plain
// explanation and a way to sign out instead of a redirect loop.
function BlogStudioGuard() {
  const [access, setAccess] = useState<BlogAccess | null | "loading">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setAccess("loading");
    setError(null);
    const result = await fetchMyBlogAccess();
    setError(result.error);
    setAccess(result.access);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (access === "loading") {
    return (
      <div className="bs flex min-h-screen items-center justify-center">
        <Spinner label="Loading Studio…" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bs flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <ErrorNotice message={error} onRetry={() => void load()} />
        </div>
      </div>
    );
  }

  if (access === null) {
    return (
      <div className="bs flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md">
          <EmptyState
            title="No Studio access yet"
            body="Your account isn't on the blog team. Ask an existing editor to add your email from Studio → Team."
          />
        </div>
      </div>
    );
  }

  return (
    <BlogAccessContext.Provider value={access}>
      <BlogStudioShell>
        <Outlet />
      </BlogStudioShell>
    </BlogAccessContext.Provider>
  );
}
