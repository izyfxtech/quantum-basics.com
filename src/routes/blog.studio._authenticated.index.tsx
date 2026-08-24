import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useBlogAccess } from "@/blog/lib/context";
import { fetchStudioPosts, type PostListItem } from "@/blog/lib/posts";
import { Btn, EmptyState, ErrorNotice, Panel, Spinner, StudioHeading, Tag } from "@/blog/components/ui";

export const Route = createFileRoute("/blog/studio/_authenticated/")({
  head: () => ({ meta: [{ title: "Dashboard | Quantum Basics Blog Studio" }] }),
  component: StudioDashboard,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StudioDashboard() {
  const access = useBlogAccess();
  const [scope, setScope] = useState<"all" | "mine">(access.role === "editor" ? "all" : "mine");
  const [posts, setPosts] = useState<PostListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchStudioPosts(scope, access.userId);
    setPosts(data);
    setError(error);
  }, [scope, access.userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <StudioHeading
          label="Blog Studio"
          title="Posts"
          description="Write, edit and publish the Quantum Basics blog."
        />
        <Link to="/blog/studio/new">
          <Btn>
            <Plus className="h-4 w-4" /> New post
          </Btn>
        </Link>
      </div>

      {access.role === "editor" ? (
        <div className="mb-6 flex gap-1 rounded-full border border-[var(--bs-line)] bg-secondary/40 p-1 w-fit">
          {(["all", "mine"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setScope(s);
                setPosts(null);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                scope === s ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              {s === "all" ? "Everyone's posts" : "My posts"}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <ErrorNotice message={error} onRetry={() => void load()} />
      ) : posts === null ? (
        <Spinner label="Loading posts…" />
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          body="Start a new post — it'll save as a draft until you publish it."
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <Link key={post.id} to="/blog/studio/$postId" params={{ postId: post.id }}>
              <Panel className="flex items-center justify-between gap-4 transition-colors hover:border-primary">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    {post.published ? null : <Tag>Draft</Tag>}
                  </div>
                  <p className="bs-label mt-1.5">
                    {post.category} · Updated {formatDate(post.updatedAt)}
                    {post.published && post.publishedAt
                      ? ` · Published ${formatDate(post.publishedAt)}`
                      : ""}
                  </p>
                </div>
              </Panel>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
