import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/academy/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/academy/auth" });

    // Every account needs to complete onboarding once before it can reach
    // the rest of the app — skip the check on the onboarding route itself
    // to avoid a redirect loop.
    if (location.pathname !== "/academy/onboarding") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed_at")
        .eq("id", data.user.id)
        .maybeSingle();
      if (!profile?.onboarding_completed_at) {
        throw redirect({ to: "/academy/onboarding" });
      }
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});
