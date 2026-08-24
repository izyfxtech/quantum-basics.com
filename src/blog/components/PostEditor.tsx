import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ImageIcon, Loader2, Plus, Trash2, X } from "lucide-react";
import { Btn, FIELD_CLASS, Panel, Tag, TextArea, TextField } from "@/blog/components/ui";
import {
  createPost,
  deletePost,
  estimateReadMinutes,
  heroImageUrl,
  removeHeroImage,
  slugExists,
  slugify,
  updatePost,
  uploadHeroImage,
  type BlogPost,
  type BlogSection,
  type PostInput,
} from "@/blog/lib/posts";
import type { BlogAccess } from "@/blog/lib/auth";

function emptySection(): BlogSection {
  return { heading: "", body: "", bullets: [] };
}

function toDateInputValue(iso: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}

export function PostEditor({ access, post }: { access: BlogAccess; post: BlogPost | null }) {
  const navigate = useNavigate();
  const isNew = post === null;
  const readOnly = !isNew && access.role !== "editor" && post!.createdBy !== access.userId;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [category, setCategory] = useState(post?.category ?? "");
  const [summary, setSummary] = useState(post?.summary ?? "");
  const [byline, setByline] = useState(post?.byline ?? "Quantum Basics Engineering Team");
  const [heroPath, setHeroPath] = useState<string | null>(post?.heroImagePath ?? null);
  const [heroAlt, setHeroAlt] = useState(post?.heroAlt ?? "");
  const [uploadingHero, setUploadingHero] = useState(false);
  const [sections, setSections] = useState<BlogSection[]>(
    post?.sections.length ? post.sections : [emptySection()],
  );
  const [readMinutes, setReadMinutes] = useState(String(post?.readMinutes ?? 5));
  const [published, setPublished] = useState(post?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(toDateInputValue(post?.publishedAt ?? null));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleHeroFile(file: File) {
    setUploadingHero(true);
    setError(null);
    const { path, error: uploadError } = await uploadHeroImage(file);
    setUploadingHero(false);
    if (uploadError) {
      setError(uploadError);
      return;
    }
    if (heroPath) await removeHeroImage(heroPath);
    setHeroPath(path);
  }

  async function handleRemoveHero() {
    if (heroPath) await removeHeroImage(heroPath);
    setHeroPath(null);
  }

  function updateSection(index: number, patch: Partial<BlogSection>) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((prev) => [...prev, emptySection()]);
  }
  function removeSection(index: number) {
    setSections((prev) => prev.filter((_, i) => i !== index));
  }
  function addBullet(index: number) {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, bullets: [...(s.bullets ?? []), ""] } : s)),
    );
  }
  function updateBullet(sectionIndex: number, bulletIndex: number, value: string) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? { ...s, bullets: (s.bullets ?? []).map((b, j) => (j === bulletIndex ? value : b)) }
          : s,
      ),
    );
  }
  function removeBullet(sectionIndex: number, bulletIndex: number) {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? { ...s, bullets: (s.bullets ?? []).filter((_, j) => j !== bulletIndex) }
          : s,
      ),
    );
  }

  function handleEstimate() {
    setReadMinutes(String(estimateReadMinutes(sections)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanSlug = slugify(slug);
    if (!cleanSlug) {
      setError("Slug can't be empty.");
      return;
    }
    const cleanSections = sections
      .filter((s) => s.heading.trim() || s.body.trim())
      .map((s) => ({
        heading: s.heading.trim(),
        body: s.body.trim(),
        ...((s.bullets ?? []).filter((b) => b.trim()).length
          ? { bullets: (s.bullets ?? []).map((b) => b.trim()).filter(Boolean) }
          : {}),
      }));

    setBusy(true);
    const { exists, error: slugCheckError } = await slugExists(cleanSlug, post?.id);
    if (slugCheckError) {
      setBusy(false);
      setError(`Couldn't verify the slug is free: ${slugCheckError}`);
      return;
    }
    if (exists) {
      setBusy(false);
      setError("That slug is already in use by another post.");
      return;
    }

    const payload: PostInput = {
      slug: cleanSlug,
      category: category.trim(),
      title: title.trim(),
      summary: summary.trim(),
      heroImagePath: heroPath,
      heroAlt: heroAlt.trim() || null,
      byline: byline.trim() || "Quantum Basics Engineering Team",
      sections: cleanSections,
      readMinutes: Number(readMinutes) || 1,
      published,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
    };

    const { error: err } = isNew ? await createPost(payload) : await updatePost(post!.id, payload);
    setBusy(false);
    if (err) {
      setError(err);
      return;
    }
    navigate({ to: "/blog/studio" });
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm(`Delete "${post.title}" permanently?`)) return;
    setBusy(true);
    await deletePost(post);
    setBusy(false);
    navigate({ to: "/blog/studio" });
  }

  if (readOnly) {
    return (
      <Panel>
        <p className="font-semibold">You can only edit your own posts</p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          This one belongs to another author. Ask an editor if it needs a change.
        </p>
      </Panel>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-6">
        <Panel>
          <TextField label="Title" value={title} onChange={handleTitleChange} required />
          <div className="mt-4">
            <TextField
              label="Slug"
              value={slug}
              onChange={(v) => {
                setSlugTouched(true);
                setSlug(v);
              }}
              hint={`/blog/${slugify(slug) || "…"}`}
              required
            />
          </div>
          <div className="mt-4">
            <TextArea label="Summary" value={summary} onChange={setSummary} rows={2} />
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Body</h2>
            <Btn type="button" variant="ghost" onClick={addSection}>
              <Plus className="h-3.5 w-3.5" /> Add section
            </Btn>
          </div>
          <div className="mt-4 grid gap-5">
            {sections.map((section, i) => (
              <div key={i} className="rounded-lg border border-[var(--bs-line)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <TextField
                      label={`Section ${i + 1} heading`}
                      value={section.heading}
                      onChange={(v) => updateSection(i, { heading: v })}
                    />
                  </div>
                  {sections.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeSection(i)}
                      aria-label="Remove section"
                      className="mt-6 rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                <div className="mt-3">
                  <TextArea
                    label="Body"
                    value={section.body}
                    onChange={(v) => updateSection(i, { body: v })}
                    rows={4}
                  />
                </div>
                <div className="mt-3">
                  <span className="bs-label">Bullets (optional)</span>
                  <div className="mt-1.5 grid gap-2">
                    {(section.bullets ?? []).map((bullet, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <input
                          value={bullet}
                          onChange={(e) => updateBullet(i, j, e.target.value)}
                          className={`${FIELD_CLASS} mt-0 flex-1`}
                        />
                        <button
                          type="button"
                          onClick={() => removeBullet(i, j)}
                          aria-label="Remove bullet"
                          className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <Btn
                      type="button"
                      variant="ghost"
                      onClick={() => addBullet(i)}
                      className="w-fit"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add bullet
                    </Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="grid gap-6">
        <Panel>
          <h2 className="text-sm font-semibold">Hero image</h2>
          {heroPath ? (
            <div className="mt-3">
              <img
                src={heroImageUrl(heroPath)}
                alt={heroAlt}
                className="h-36 w-full rounded object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveHero}
                className="mt-2 text-xs font-semibold text-destructive"
              >
                Remove image
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 flex h-36 w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-[var(--bs-line)] text-muted-foreground hover:border-primary hover:text-primary"
            >
              {uploadingHero ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
              <span className="text-xs font-medium">
                {uploadingHero ? "Uploading…" : "Upload hero image"}
              </span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleHeroFile(file);
            }}
          />
          <div className="mt-3">
            <TextField label="Alt text" value={heroAlt} onChange={setHeroAlt} />
          </div>
        </Panel>

        <Panel>
          <h2 className="text-sm font-semibold">Details</h2>
          <div className="mt-3 grid gap-4">
            <TextField label="Category" value={category} onChange={setCategory} required />
            <TextField label="Byline" value={byline} onChange={setByline} />
            <div>
              <TextField
                label="Read time (minutes)"
                type="number"
                min={1}
                value={readMinutes}
                onChange={setReadMinutes}
              />
              <button
                type="button"
                onClick={handleEstimate}
                className="mt-1.5 text-xs font-semibold text-primary"
              >
                Estimate from body
              </button>
            </div>
          </div>
        </Panel>

        <Panel>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
          {published ? (
            <div className="mt-3">
              <TextField
                label="Published date"
                type="date"
                value={publishedAt}
                onChange={setPublishedAt}
                hint="Leave blank to stamp the moment you publish."
              />
            </div>
          ) : (
            <Tag>Draft — only the blog team can see this</Tag>
          )}
        </Panel>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        <div className="flex flex-col gap-2">
          <Btn type="submit" disabled={busy}>
            {busy ? "Saving…" : isNew ? "Create post" : "Save changes"}
          </Btn>
          {!isNew ? (
            <Btn type="button" variant="outline" onClick={handleDelete} disabled={busy}>
              <Trash2 className="h-4 w-4" /> Delete post
            </Btn>
          ) : null}
        </div>
      </div>
    </form>
  );
}
