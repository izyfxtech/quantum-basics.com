import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesUpdate } from "@/integrations/supabase/types";
import { validateUploadFile } from "@/lib/file-validation";

export type ListResult<T> = { data: T[]; error: string | null };

export type BlogSection = { heading: string; body: string; bullets?: string[] };

export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  heroImagePath: string | null;
  heroAlt: string | null;
  byline: string;
  sections: BlogSection[];
  readMinutes: number;
  published: boolean;
  publishedAt: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostListItem = Pick<
  BlogPost,
  "id" | "slug" | "title" | "category" | "published" | "publishedAt" | "updatedAt" | "createdBy"
>;

const HERO_BUCKET = "blog-media";

function mapPost(row: Tables<"blog_posts">): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    title: row.title,
    summary: row.summary,
    heroImagePath: row.hero_image_path,
    heroAlt: row.hero_alt,
    byline: row.byline,
    sections: (row.sections as unknown as BlogSection[]) ?? [],
    readMinutes: row.read_minutes,
    published: row.published,
    publishedAt: row.published_at,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Dashboard list. `scope: "mine"` is what an author sees; an editor can
 * still switch to it, but defaults to "all". RLS backs this up either
 * way — an author's query for "all" would just come back the same as
 * "mine" since their SELECT policy only reaches their own rows. */
export async function fetchStudioPosts(
  scope: "all" | "mine",
  userId: string,
): Promise<ListResult<PostListItem>> {
  let query = supabase
    .from("blog_posts")
    .select("id, slug, title, category, published, published_at, updated_at, created_by")
    .order("updated_at", { ascending: false });
  if (scope === "mine") query = query.eq("created_by", userId);

  const { data, error } = await query;
  if (error) return { data: [], error: error.message };

  const rows = (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    published: row.published,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  }));
  return { data: rows, error: null };
}

export async function fetchPost(
  id: string,
): Promise<{ data: BlogPost | null; error: string | null }> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) return { data: null, error: error.message };
  return { data: data ? mapPost(data as Tables<"blog_posts">) : null, error: null };
}

/** `exists: null` means the check itself failed (network/RLS/etc) — the
 * caller should block on that ambiguity rather than assume the slug is
 * free, since silently treating a failed check as "available" is exactly
 * how a duplicate slug would slip through. */
export async function slugExists(
  slug: string,
  excludingId?: string,
): Promise<{ exists: boolean | null; error: string | null }> {
  let query = supabase.from("blog_posts").select("id").eq("slug", slug).limit(1);
  if (excludingId) query = query.neq("id", excludingId);
  const { data, error } = await query;
  if (error) return { exists: null, error: error.message };
  return { exists: (data ?? []).length > 0, error: null };
}

export type PostInput = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  heroImagePath: string | null;
  heroAlt: string | null;
  byline: string;
  sections: BlogSection[];
  readMinutes: number;
  published: boolean;
  publishedAt: string | null;
};

export async function createPost(
  input: PostInput,
): Promise<{ data: BlogPost | null; error: string | null }> {
  const { data: userData } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      slug: input.slug,
      category: input.category,
      title: input.title,
      summary: input.summary,
      hero_image_path: input.heroImagePath,
      hero_alt: input.heroAlt,
      byline: input.byline,
      sections: input.sections as unknown as Tables<"blog_posts">["sections"],
      read_minutes: input.readMinutes,
      published: input.published,
      published_at: input.publishedAt,
      created_by: userData.user?.id ?? null,
    })
    .select("*")
    .single();
  return {
    data: data ? mapPost(data as Tables<"blog_posts">) : null,
    error: error?.message ?? null,
  };
}

export async function updatePost(id: string, input: PostInput): Promise<{ error: string | null }> {
  const row: TablesUpdate<"blog_posts"> = {
    slug: input.slug,
    category: input.category,
    title: input.title,
    summary: input.summary,
    hero_image_path: input.heroImagePath,
    hero_alt: input.heroAlt,
    byline: input.byline,
    sections: input.sections as unknown as Tables<"blog_posts">["sections"],
    read_minutes: input.readMinutes,
    published: input.published,
    published_at: input.publishedAt,
  };
  const { error } = await supabase.from("blog_posts").update(row).eq("id", id);
  return { error: error?.message ?? null };
}

export async function deletePost(
  post: Pick<BlogPost, "id" | "heroImagePath">,
): Promise<{ error: string | null }> {
  if (post.heroImagePath) await supabase.storage.from(HERO_BUCKET).remove([post.heroImagePath]);
  const { error } = await supabase.from("blog_posts").delete().eq("id", post.id);
  return { error: error?.message ?? null };
}

/** Uploads to the public blog-media bucket at "{uuid}-{filename}" and
 * returns the storage path to save on the post (not the URL — the public
 * URL is derived from the path with heroImageUrl() wherever it's needed,
 * so nothing goes stale if the bucket or project ever moves). */
export async function uploadHeroImage(
  file: File,
): Promise<{ path: string | null; error: string | null }> {
  const sizeError = validateUploadFile(file);
  if (sizeError) return { path: null, error: sizeError };

  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage
    .from(HERO_BUCKET)
    .upload(path, file, file.type ? { contentType: file.type } : {});
  if (error) return { path: null, error: error.message };
  return { path, error: null };
}

export async function removeHeroImage(path: string): Promise<void> {
  await supabase.storage.from(HERO_BUCKET).remove([path]);
}

export function heroImageUrl(path: string): string {
  return supabase.storage.from(HERO_BUCKET).getPublicUrl(path).data.publicUrl;
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** ~200 words/minute, rounded up, minimum 1 — a starting point the editor
 * can always override before publishing. */
export function estimateReadMinutes(sections: BlogSection[]): number {
  const words = sections
    .flatMap((s) => [s.heading, s.body, ...(s.bullets ?? [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
