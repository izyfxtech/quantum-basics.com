import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useBlogAccess } from "@/blog/lib/context";
import { fetchPost, type BlogPost } from "@/blog/lib/posts";
import { PostEditor } from "@/blog/components/PostEditor";
import { EmptyState, ErrorNotice, Spinner, StudioHeading } from "@/blog/components/ui";

export const Route = createFileRoute("/blog/studio/_authenticated/$postId")({
  head: () => ({ meta: [{ title: "Edit post | Quantum Basics Blog Studio" }] }),
  component: EditPost,
});

function EditPost() {
  const { postId } = Route.useParams();
  const access = useBlogAccess();
  const [post, setPost] = useState<BlogPost | null | "loading">("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setPost("loading");
    const { data, error } = await fetchPost(postId);
    setError(error);
    setPost(data);
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <>
      <Link
        to="/blog/studio"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </Link>

      {error ? (
        <ErrorNotice message={error} onRetry={() => void load()} />
      ) : post === "loading" ? (
        <Spinner label="Loading post…" />
      ) : post === null ? (
        <EmptyState
          title="Post not found"
          body="It may have been deleted, or you don't have access to it."
        />
      ) : (
        <>
          <StudioHeading label="Blog Studio" title={post.title || "Edit post"} />
          <PostEditor access={access} post={post} />
        </>
      )}
    </>
  );
}
