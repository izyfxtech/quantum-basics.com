import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { academyTracks } from "@/data/site";
import { Btn, SelectField, Spinner, TextField } from "@/academy/components/ui";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/_authenticated/onboarding")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Set up your account | Quantum Basics Academy" }],
  }),
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [track, setTrack] = useState(academyTracks[0]?.title ?? "");

  const load = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, organisation, preferred_track")
      .eq("id", data.user.id)
      .maybeSingle();
    setFullName(profile?.full_name ?? "");
    setPhone(profile?.phone ?? "");
    setOrganisation(profile?.organisation ?? "");
    setTrack(profile?.preferred_track ?? academyTracks[0]?.title ?? "");
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      setSaving(false);
      navigate({ to: "/academy/auth", replace: true });
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        organisation: organisation.trim() || null,
        preferred_track: track,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }

    // The parent layout cached "onboarding incomplete" from beforeLoad —
    // invalidate so it re-checks before we land on the dashboard.
    await router.invalidate();
    navigate({ to: "/academy/dashboard", replace: true });
  }

  if (loading) {
    return (
      <div className="qa flex min-h-screen items-center justify-center bg-[var(--qa-surface)]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="qa flex min-h-screen items-center justify-center bg-[var(--qa-surface)] px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded bg-primary text-[0.7rem] font-bold text-primary-foreground">
            QB
          </span>
          <span className="qa-label">Academy</span>
        </div>

        <div className="qa-card p-8 md:p-10">
          <p className="qa-label text-primary">One last step</p>
          <h1 className="mt-3 text-2xl font-semibold">Set up your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us a little about yourself so we can tailor the Academy to you.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
            <TextField
              label="Full name"
              value={fullName}
              onChange={setFullName}
              placeholder="Ada Obi"
              required
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                label="Phone"
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder="+234 800 000 0000"
              />
              <TextField
                label="Organisation"
                value={organisation}
                onChange={setOrganisation}
                placeholder="Company or institution"
              />
            </div>
            <SelectField
              label="Preferred track"
              value={track}
              onChange={setTrack}
              options={academyTracks.map((t) => t.title)}
            />

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <Btn type="submit" disabled={saving} className="mt-2">
              {saving ? "Saving…" : "Continue to dashboard"} <ArrowRight className="h-4 w-4" />
            </Btn>
          </form>
        </div>
      </div>
    </div>
  );
}
