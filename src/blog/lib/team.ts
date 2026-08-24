import { supabase } from "@/integrations/supabase/client";
import type { BlogRole } from "@/blog/lib/auth";
import type { ListResult } from "@/blog/lib/posts";

export type TeamMember = {
  id: string;
  userId: string;
  role: BlogRole;
  fullName: string | null;
  email: string | null;
  createdAt: string;
};

/** Reads through the blog_team() RPC rather than a plain table select —
 * see its definition in 20260822140000_blog_authoring.sql for why (it
 * needs to join profiles for names/emails without widening profiles' own
 * RLS to every blog editor). */
export async function fetchBlogTeam(): Promise<ListResult<TeamMember>> {
  const { data, error } = await supabase.rpc("blog_team");
  if (error) return { data: [], error: error.message };
  const rows = (data ?? []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    role: row.role,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
  }));
  return { data: rows, error: null };
}

export async function addTeamMember(
  email: string,
  role: BlogRole,
): Promise<{ error: string | null }> {
  const { error } = await supabase.rpc("add_blog_team_member", { _email: email, _role: role });
  return { error: error?.message ?? null };
}

export async function updateTeamMemberRole(
  id: string,
  role: BlogRole,
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("blog_editors").update({ role }).eq("id", id);
  return { error: error?.message ?? null };
}

export async function removeTeamMember(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase.from("blog_editors").delete().eq("id", id);
  return { error: error?.message ?? null };
}
