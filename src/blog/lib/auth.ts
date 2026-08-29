import { supabase } from "@/integrations/supabase/client";
import { getCurrentUser } from "@/integrations/supabase/current-user";

export type BlogRole = "editor" | "author";

export type BlogAccess = {
  userId: string;
  name: string;
  email: string;
  role: BlogRole;
};

/** `access: null, error: null` means: signed in, but genuinely not on the
 * blog team. `access: null, error: "..."` means the check itself failed
 * (network/RLS/etc) — callers must not conflate the two, since treating a
 * failed check as "not on team" would incorrectly lock out a real editor
 * on a bad connection instead of offering a retry. Deliberately checks
 * only blog_editors — never user_roles or course_staff, see the header
 * comment in 20260822140000_blog_authoring.sql for why. */
export async function fetchMyBlogAccess(): Promise<{
  access: BlogAccess | null;
  error: string | null;
}> {
  const user = await getCurrentUser();
  if (!user) return { access: null, error: null };

  const [membershipRes, profileRes] = await Promise.all([
    supabase.from("blog_editors").select("role").eq("user_id", user.id).maybeSingle(),
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
  ]);
  if (membershipRes.error) return { access: null, error: membershipRes.error.message };
  if (profileRes.error) return { access: null, error: profileRes.error.message };
  if (!membershipRes.data) return { access: null, error: null };

  return {
    access: {
      userId: user.id,
      name: profileRes.data?.full_name?.trim() || user.email || "Editor",
      email: user.email ?? "",
      role: membershipRes.data.role as BlogRole,
    },
    error: null,
  };
}
