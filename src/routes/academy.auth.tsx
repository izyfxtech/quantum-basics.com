import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { physicalPath } from "@/academy/lib/subdomains";
import { Btn, TextField } from "@/academy/components/ui";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In or Create an Account | Quantum Basics Academy" },
      {
        name: "description",
        content:
          "Sign in to the Quantum Basics Academy learning portal or create an account to enrol on automation, metering, energy and connectivity training tracks.",
      },
      { property: "og:title", content: "Quantum Basics Academy — Sign in or sign up" },
      {
        property: "og:description",
        content: "Access your Academy account and upcoming online courses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AcademyAuth,
});

type Mode = "signin" | "signup" | "reset";

/** Absolute post-auth redirect URL, correct whether the app is served from
 * the academy subdomain (physical "/dashboard") or the legacy "/academy"
 * path on the main domain — see src/academy/lib/subdomains.ts. */
function dashboardRedirectUrl() {
  return `${window.location.origin}${physicalPath(window.location.hostname, "/academy/dashboard")}`;
}

function resetPasswordRedirectUrl() {
  return `${window.location.origin}${physicalPath(window.location.hostname, "/academy/reset-password")}`;
}

// Three small, self-contained actions — each does exactly one Supabase call
// and either returns or throws. No branching, no navigation, no shared
// state: keeping them this bare makes it obvious at a glance that sign-in
// and sign-up genuinely don't share any logic beyond the email/password
// fields, and it's why the caller below can be a two-line dispatch instead
// of one function with three interleaved code paths.

async function signIn(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

/** Returns true if the new account already has a live session (email
 * confirmation off) and is ready to move straight into onboarding; false if
 * Supabase requires the person to confirm their email first. */
async function signUp(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: dashboardRedirectUrl() },
  });
  if (error) throw error;
  return data.session !== null;
}

async function sendResetLink(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: resetPasswordRedirectUrl(),
  });
  if (error) throw error;
}

function AcademyAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Only redirect on mount if the user already has a session (e.g. they
  // navigated straight to /academy/auth while logged in). Deliberately not
  // also subscribing to onAuthStateChange here — see handleSubmit below for
  // where the post-auth navigation actually happens instead.
  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/academy/dashboard", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
        // Existing account: beforeLoad on /academy/_authenticated still
        // checks onboarding status as a safety net (e.g. an account that
        // confirmed its email but never finished onboarding), but the
        // common case is a direct hop straight to the dashboard.
        navigate({ to: "/academy/dashboard", replace: true });
      } else if (mode === "signup") {
        const hasSession = await signUp(email, password);
        if (hasSession) {
          // A brand-new account always needs onboarding — send it there
          // directly instead of via /academy/dashboard, whose beforeLoad
          // redirect would otherwise race this same navigate() and was the
          // actual source of the flicker between the two screens.
          navigate({ to: "/academy/onboarding", replace: true });
        } else {
          setNotice("Account created. Check your email to confirm your address, then sign in.");
        }
      } else {
        await sendResetLink(email);
        setNotice("If an account exists for that email, a password reset link is on its way.");
      }
    } catch (err) {
      // Covers both a resolved-with-error result (re-thrown by the helpers
      // above) and a genuinely thrown failure — network drops, CORS/origin
      // rejections, etc. — so the spinner never hangs silently either way.
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setLoading(true);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: dashboardRedirectUrl(),
        },
      });
      // On success Supabase redirects the browser to Google, so there is
      // nothing further to do here. We only reach this point on failure.
      if (oauthError) {
        setError(oauthError.message ?? "Google sign-in failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="qa flex min-h-screen items-center justify-center bg-[var(--qa-surface)] px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/academy" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
            QB
          </span>
          <span className="qa-label">Academy</span>
        </Link>

        <div className="qa-card p-8 md:p-10">
          {mode === "reset" ? (
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError(null);
                setNotice(null);
              }}
              className="mb-6 text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              ← Back to sign in
            </button>
          ) : (
            <div className="flex gap-1 rounded border border-[var(--qa-line)] bg-secondary/60 p-1">
              {(["signin", "signup"] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError(null);
                    setNotice(null);
                  }}
                  className={`h-9 flex-1 rounded text-sm font-semibold transition-colors ${
                    mode === m
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>
          )}

          {mode !== "reset" ? (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="mt-7 inline-flex h-11 w-full items-center justify-center gap-3 rounded border border-[var(--qa-line)] bg-background text-sm font-semibold transition-colors hover:bg-secondary disabled:opacity-60"
              >
                <GoogleMark />
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4">
                <span className="h-px flex-1 bg-[var(--qa-line)]" />
                <span className="qa-label text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-[var(--qa-line)]" />
              </div>
            </>
          ) : (
            <p className="mt-7 text-sm text-muted-foreground">
              Enter the email on your account and we'll send you a link to reset your password.
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@company.com"
              required
            />
            {mode !== "reset" ? (
              <div>
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="At least 8 characters"
                  required
                />
                {mode === "signin" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("reset");
                      setError(null);
                      setNotice(null);
                    }}
                    className="mt-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Forgot password?
                  </button>
                ) : null}
              </div>
            ) : null}

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p className="text-sm text-primary" role="status">
                {notice}
              </p>
            ) : null}

            <Btn type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
            </Btn>
          </form>

          {mode !== "reset" ? (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signin" ? (
                <>
                  New to the Academy?{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary"
                    onClick={() => setMode("signup")}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    className="font-semibold text-primary"
                    onClick={() => setMode("signin")}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.76-2.11-6.71-4.94H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.18 15.23 0 12 0A12 12 0 0 0 1.29 6.61l4 3.1C6.24 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}
