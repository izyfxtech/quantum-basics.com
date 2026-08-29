import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";

// beforeLoad reruns on every navigation into this route or any of its
// children (it isn't covered by loader staleTime) -- so a naive per-user
// "has this account completed onboarding" check would mean re-querying
// profiles on every single click around the Academy. Once true it can
// never go false again, so it's safe to remember for the session instead
// of asking the database again each time. Keyed by user id (not just a
// boolean) so it naturally re-checks for a different account signing in
// in the same tab, and keeps re-checking every time for an account that's
// still incomplete.
let onboardedUserId: string | null = null;

export const Route = createFileRoute("/academy/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUser();
    if (!user) throw redirect({ to: "/academy/auth" });

    if (user.id !== onboardedUserId) {
      // Every account needs to complete onboarding once before it can reach
      // the rest of the app — skip the check on the onboarding route itself
      // to avoid a redirect loop.
      if (location.pathname !== "/academy/onboarding") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("onboarding_completed_at")
          .eq("id", user.id)
          .maybeSingle();
        if (!profile?.onboarding_completed_at) {
          throw redirect({ to: "/academy/onboarding" });
        }
        onboardedUserId = user.id;
      }
    }

    return { user };
  },
  component: () => <Outlet />,
});
