import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useBlogAccess } from "@/blog/lib/context";
import {
  addTeamMember,
  fetchBlogTeam,
  removeTeamMember,
  updateTeamMemberRole,
  type TeamMember,
} from "@/blog/lib/team";
import type { BlogRole } from "@/blog/lib/auth";
import {
  Btn,
  EmptyState,
  ErrorNotice,
  Panel,
  Spinner,
  StudioHeading,
  TextField,
} from "@/blog/components/ui";

export const Route = createFileRoute("/blog/studio/_authenticated/team")({
  head: () => ({ meta: [{ title: "Team | Quantum Basics Blog Studio" }] }),
  component: TeamPage,
});

function TeamPage() {
  const access = useBlogAccess();
  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<BlogRole>("author");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchBlogTeam();
    setTeam(data);
    setLoadError(error);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (access.role !== "editor") {
    return (
      <>
        <StudioHeading label="Blog Studio" title="Team" />
        <EmptyState title="Editors only" body="Ask a Studio editor if the team needs a change." />
      </>
    );
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: err } = await addTeamMember(email.trim(), role);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    setEmail("");
    void load();
  }

  async function handleRoleChange(member: TeamMember, newRole: BlogRole) {
    const { error: err } = await updateTeamMemberRole(member.id, newRole);
    if (err) {
      setLoadError(err);
      return;
    }
    void load();
  }

  async function handleRemove(member: TeamMember) {
    if (!confirm(`Remove ${member.fullName || member.email} from the blog team?`)) return;
    const { error: err } = await removeTeamMember(member.id);
    if (err) {
      setLoadError(err);
      return;
    }
    void load();
  }

  return (
    <>
      <StudioHeading
        label="Blog Studio"
        title="Team"
        description="Who can write and publish on the blog."
      />

      <Panel className="mb-8">
        <h2 className="text-sm font-semibold">Add a team member</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          They need to have signed in at least once already — sign-up doesn't grant access by
          itself.
        </p>
        <form onSubmit={handleAdd} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <TextField label="Email" type="email" value={email} onChange={setEmail} required />
          </div>
          <label className="block">
            <span className="bs-label">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as BlogRole)}
              className="mt-1.5 h-[42px] rounded border border-[var(--bs-line)] bg-card px-3 text-sm"
            >
              <option value="author">Author</option>
              <option value="editor">Editor</option>
            </select>
          </label>
          <Btn type="submit" disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </Btn>
        </form>
        {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
      </Panel>

      {loadError ? (
        <ErrorNotice message={loadError} onRetry={() => void load()} />
      ) : team === null ? (
        <Spinner label="Loading team…" />
      ) : (
        <div className="space-y-3">
          {team.map((member) => (
            <Panel key={member.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold">{member.fullName || "Unnamed"}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={member.role}
                  onChange={(e) => handleRoleChange(member, e.target.value as BlogRole)}
                  disabled={member.userId === access.userId}
                  className="h-9 rounded border border-[var(--bs-line)] bg-card px-2 text-sm disabled:opacity-60"
                >
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                </select>
                <button
                  type="button"
                  onClick={() => handleRemove(member)}
                  disabled={member.userId === access.userId}
                  aria-label="Remove"
                  className="rounded p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}
