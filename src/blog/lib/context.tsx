import { createContext, useContext } from "react";
import type { BlogAccess } from "@/blog/lib/auth";

export const BlogAccessContext = createContext<BlogAccess | null>(null);

/** Only valid inside blog.studio._authenticated.tsx's subtree, which is the
 * only place this context is provided (after confirming the user is on the
 * blog team) — every studio page route lives under it. */
export function useBlogAccess(): BlogAccess {
  const access = useContext(BlogAccessContext);
  if (!access)
    throw new Error("useBlogAccess() called outside the Blog Studio authenticated layout");
  return access;
}
