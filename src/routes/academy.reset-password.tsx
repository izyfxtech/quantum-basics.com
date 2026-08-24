import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, TextField } from "@/academy/components/ui";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/reset-password")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Reset password | Quantum Basics Academy" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : "/academy/dashboard",
  }),
  component: ResetPassword,
});

/**
 * Where a "reset your password" email link lands. Supabase's client
 * processes the recovery tokens in the URL fragment automatically on load
 * (detectSessionInUrl, on by default) and fires onAuthStateChange with
 * event "PASSWORD_RECOVERY" once that session is live -- this page waits
 * for that event rather than assuming a session already exists, since a
 * direct visit (no recovery link) or an expired/already-used link should
 * show an explanatory state instead of a password form.
 */
function ResetPassword() {
  const { redirect } = Route.useSearch();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    // If the tab was already mid-recovery-flow when this listener
    // attaches (e.g. a fast reload), the event may have already fired --
    // fall back to checking for a live session directly.
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
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
          {done ? (
            <>
              <h1 className="text-lg font-semibold">Password updated</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your password has been changed. You're signed in with the new one.
              </p>
              <Btn className="mt-6" onClick={() => window.location.assign(redirect)}>
                Continue
              </Btn>
            </>
          ) : !ready ? (
            <>
              <h1 className="text-lg font-semibold">Preparing password reset…</h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                If nothing happens in a few seconds, the reset link may have expired — request a
                new one from the sign-in page.
              </p>
              <Link
                to="/academy/auth"
                className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
              >
                Back to sign in
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-lg font-semibold">Choose a new password</h1>
              <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
                <TextField
                  label="New password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="At least 8 characters"
                  required
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Re-enter your new password"
                  required
                />
                {error ? (
                  <p className="text-sm text-destructive" role="alert">
                    {error}
                  </p>
                ) : null}
                <Btn type="submit" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Update password
                </Btn>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
