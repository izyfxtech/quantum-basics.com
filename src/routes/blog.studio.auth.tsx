import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Btn, TextField } from "@/blog/components/ui";
import "@/blog/studio.css";

export const Route = createFileRoute("/blog/studio/auth")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Sign In | Quantum Basics Blog Studio" }],
  }),
  component: BlogStudioAuth,
});

type Mode = "signin" | "signup" | "reset";

function resetPasswordRedirectUrl() {
  return `${window.location.origin}/academy/reset-password?redirect=${encodeURIComponent("/blog/studio")}`;
}

function BlogStudioAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) navigate({ to: "/blog/studio", replace: true });
    });
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate({ to: "/blog/studio", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    if (mode === "reset") {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetPasswordRedirectUrl(),
      });
      setLoading(false);
      if (resetError) {
        setError(resetError.message);
        return;
      }
      setNotice("If an account exists for that email, a password reset link is on its way.");
      return;
    }

    if (mode === "signin") {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setError(signInError.message);
        return;
      }
      navigate({ to: "/blog/studio", replace: true });
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/blog/studio` },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    if (!data.session) {
      setNotice("Account created. Check your email to confirm your address, then sign in.");
      return;
    }
    navigate({ to: "/blog/studio", replace: true });
  }

  return (
    <div className="bs flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/blog" className="mb-8 flex items-center justify-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
            QB
          </span>
          <span className="bs-label">Blog Studio</span>
        </Link>

        <div className="bs-card p-8 md:p-10">
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
            <div className="flex gap-1 rounded border border-[var(--bs-line)] bg-secondary/60 p-1">
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

          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Studio access is by invitation — an existing editor adds your email to the team."
              : mode === "signup"
                ? "Creating an account doesn't grant Studio access by itself — ask an editor to add your email afterwards."
                : "Enter the email on your account and we'll send you a link to reset your password."}
          </p>

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
        </div>
      </div>
    </div>
  );
}
