import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageIntro, SectionHeading } from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { supabase } from "@/integrations/supabase/client";
import { heroImageUrl, type BlogSection } from "@/blog/lib/posts";

type PostRow = {
  slug: string;
  category: string;
  title: string;
  summary: string;
  hero_image_path: string | null;
  hero_alt: string | null;
  byline: string;
  published_at: string | null;
  read_minutes: number;
  sections: BlogSection[];
};

type RelatedRow = { slug: string; title: string; category: string; hero_image_path: string | null };

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const { data: post } = await supabase
      .from("blog_posts")
      .select(
        "slug, category, title, summary, hero_image_path, hero_alt, byline, published_at, read_minutes, sections",
      )
      .eq("slug", params.slug)
      .eq("published", true)
      .maybeSingle();
    if (!post) throw notFound();

    const { data: others } = await supabase
      .from("blog_posts")
      .select("slug, title, category, hero_image_path")
      .eq("published", true)
      .neq("slug", params.slug)
      .order("published_at", { ascending: false })
      .limit(3);

    return { post: post as unknown as PostRow, others: (others ?? []) as RelatedRow[] };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found | Quantum Basics Blog" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { post } = loaderData;
    const title = `${post.title} | Quantum Basics Blog`;
    return {
      meta: [
        { title },
        { name: "description", content: post.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: post.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(post.hero_image_path
          ? [
              { property: "og:image", content: heroImageUrl(post.hero_image_path) },
              { name: "twitter:image", content: heroImageUrl(post.hero_image_path) },
            ]
          : []),
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPostPage,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function PostNotFound() {
  return (
    <section className="section-shell py-28 text-center">
      <h1 className="text-3xl">This article doesn't exist</h1>
      <p className="mt-4 text-muted-foreground">It may have been moved or unpublished.</p>
      <Link
        to="/blog"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the blog
      </Link>
    </section>
  );
}

function BlogPostPage() {
  const { post, others } = Route.useLoaderData() as { post: PostRow; others: RelatedRow[] };

  return (
    <>
      <PageIntro eyebrow={post.category} title={post.title} description={post.summary}>
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {post.byline} · {post.published_at ? formatDate(post.published_at) : ""} ·{" "}
            {post.read_minutes} min read
          </p>
        </div>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
      </PageIntro>

      {post.hero_image_path ? (
        <Reveal>
          <div className="section-shell -mt-2">
            <img
              src={heroImageUrl(post.hero_image_path)}
              alt={post.hero_alt ?? post.title}
              fetchPriority="high"
              width={1600}
              height={1000}
              className="h-64 w-full rounded-2xl border border-border object-cover md:h-96"
            />
          </div>
        </Reveal>
      ) : null}

      <section className="section-shell py-14 md:py-16">
        <div className="mx-auto max-w-3xl space-y-12">
          {post.sections.map((section) => (
            <Reveal key={section.heading}>
              <article>
                <h2 className="text-2xl md:text-3xl">{section.heading}</h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
                {section.bullets ? (
                  <ul className="mt-6 space-y-3 border-l border-border pl-6">
                    {section.bullets.map((b) => (
                      <li key={b} className="text-sm leading-relaxed text-muted-foreground">
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {others.length ? (
        <section className="bg-secondary/60 py-20 md:py-24">
          <div className="section-shell">
            <SectionHeading eyebrow="Keep reading" title="More from the blog" />
            <Stagger className="mt-10 grid gap-6 md:grid-cols-3" gap={0.08}>
              {others.map((p) => (
                <StaggerItem key={p.slug}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
                  >
                    {p.hero_image_path ? (
                      <img
                        src={heroImageUrl(p.hero_image_path)}
                        alt={p.title}
                        loading="lazy"
                        width={1200}
                        height={800}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center bg-gradient-to-br from-secondary to-secondary/40">
                        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                          {p.category}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-xs font-medium uppercase tracking-widest text-primary">
                        {p.category}
                      </p>
                      <h3 className="mt-2 flex-1 text-base font-semibold leading-snug">
                        {p.title}
                      </h3>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Read more
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : null}
    </>
  );
}
