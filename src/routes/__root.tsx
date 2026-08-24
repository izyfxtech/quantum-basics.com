import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/site/SiteHeader";
import { ScrollProgress } from "@/components/site/Motion";
import { SiteFooter } from "@/components/site/SiteFooter";
import { AcademyShell } from "@/academy/components/AcademyShell";
import { supabase } from "@/integrations/supabase/client";
import { company } from "@/data/company";
import defaultOgImage from "@/assets/hero-control-room.jpg";

// og:image needs to be a fully-qualified absolute URL (crawlers don't
// resolve it relative to the page they found it on) -- combine the
// Vite-fingerprinted asset path with the one production origin this site
// is actually served from, since Vite's `?url`-style imports only ever
// resolve to a root-relative path. Any page-specific route below that
// wants its own image (blog posts use their post's hero image) just adds
// its own og:image meta entry with the same "property" key; TanStack
// Router's head merging replaces this default rather than duplicating it.
const DEFAULT_OG_IMAGE = `${company.websiteHref}${defaultOgImage}`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Quantum Basics Nigeria Limited" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// The sign-in screen and the onboarding form are intentionally bare — no
// sidebar, no marketing chrome, just a centred card.
//
// "/academy" itself is a different case: it's the exact page the marketing
// SiteHeader/SiteFooter link to ("Engineering Academy" / "Academy") — it's
// conceptually a marketing landing page advertising the Academy, not a
// screen inside the LMS product, so it keeps the normal marketing chrome
// below instead of the AcademyShell rail.
//
// Every other /academy/* route (catalogue, course pages, dashboard,
// calendar, grades, admin) is the actual product and shares the single
// AcademyShell rail, so that part of the app reads as one product rather
// than a public site with an app bolted on.
const BARE_ACADEMY_PATH_PREFIXES = ["/academy/auth", "/academy/onboarding"];

function isBareAcademyRoute(pathname: string): boolean {
  return BARE_ACADEMY_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

function isAcademyRoute(pathname: string): boolean {
  // Exact "/academy" is excluded here — it renders as a marketing page (see
  // above) — everything nested under it is the product.
  return pathname !== "/academy" && pathname.startsWith("/academy/");
}

// Blog Studio (the authoring CMS) is a third, separate property from both
// the marketing site and the Academy — see the header comment in
// 20260822140000_blog_authoring.sql for why it's kept structurally
// independent. Every route under /blog/studio supplies its own complete
// chrome already (blog.studio.auth.tsx renders its own centred card;
// blog.studio._authenticated.tsx renders BlogStudioShell itself once
// access is confirmed), so — unlike the Academy — root doesn't wrap
// anything here; it only needs to stay out of the way and skip the
// marketing SiteHeader/SiteFooter. Public blog reading (/blog, /blog/$slug)
// is NOT part of this: those keep the normal marketing chrome below, since
// visitors reading an article still expect Quantum Basics' own site around
// it — only the authoring tool is segmented.
function isBlogStudioRoute(pathname: string): boolean {
  return pathname === "/blog/studio" || pathname.startsWith("/blog/studio/");
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const isAcademy = isAcademyRoute(pathname);
  const isBareAcademy = isAcademy && isBareAcademyRoute(pathname);
  const isBlogStudio = isBlogStudioRoute(pathname);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  if (isBareAcademy || isBlogStudio) {
    // Sign-in / onboarding (Academy) and the whole Blog Studio tree render
    // their own chrome-free or self-chroming layout — see the comments
    // above isBareAcademyRoute / isBlogStudioRoute.
    return (
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    );
  }

  if (isAcademy) {
    return (
      <QueryClientProvider client={queryClient}>
        <AcademyShell>
          <Outlet />
        </AcademyShell>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <ScrollProgress />
        <SiteHeader />
        <main className="flex-1">
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </QueryClientProvider>
  );
}
