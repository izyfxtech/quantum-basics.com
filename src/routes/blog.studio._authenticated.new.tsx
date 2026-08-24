import { createFileRoute } from "@tanstack/react-router";
import { useBlogAccess } from "@/blog/lib/context";
import { PostEditor } from "@/blog/components/PostEditor";
import { StudioHeading } from "@/blog/components/ui";

export const Route = createFileRoute("/blog/studio/_authenticated/new")({
  head: () => ({ meta: [{ title: "New post | Quantum Basics Blog Studio" }] }),
  component: NewPost,
});

function NewPost() {
  const access = useBlogAccess();
  return (
    <>
      <StudioHeading label="Blog Studio" title="New post" />
      <PostEditor access={access} post={null} />
    </>
  );
}
