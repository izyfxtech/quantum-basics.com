import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { supabase } from "@/integrations/supabase/client";
import { heroImageUrl } from "@/blog/lib/posts";

const LIST_COLUMNS =
  "id, slug, category, title, summary, hero_image_path, hero_alt, published_at, read_minutes";

type ListRow = {
  id: string;
  slug: string;
  category: string;
  title: string;
  summary: string;
  hero_image_path: string | null;
  hero_alt: string | null;
  published_at: string | null;
  read_minutes: number;
};

export const Route = createFileRoute("/blog/")({
  loader: async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select(LIST_COLUMNS)
      .eq("published", true)
      .order("published_at", { ascending: false });
    return { posts: (data ?? []) as ListRow[] };
  },
  head: () => ({
    meta: [
      { title: "Blog | Quantum Basics Nigeria Limited" },
      {
        name: "description",
        content:
          "Field notes on industrial automation, WAGES metering, energy management and telecom network delivery from the Quantum Basics engineering team.",
      },
      { property: "og:title", content: "Quantum Basics Blog" },
      {
        property: "og:description",
        content: "Field notes on industrial automation, metering, energy and network delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogIndex,
});

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function Hero({ post, className }: { post: ListRow; className: string }) {
  if (!post.hero_image_path) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gradient-to-br from-secondary to-secondary/40`}
      >
        <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {post.category}
        </span>
      </div>
    );
  }
  return (
    <img
      src={heroImageUrl(post.hero_image_path)}
      alt={post.hero_alt ?? post.title}
      loading="lazy"
      className={`${className} object-cover`}
    />
  );
}

function BlogIndex() {
  const { posts } = Route.useLoaderData() as { posts: ListRow[] };
  const [featured, ...rest] = posts;

  return (
    <>
      <PageIntro
        eyebrow="Insights"
        title="Notes from the field"
        description="Practical write-ups on industrial automation, metering, energy management and network delivery — drawn from the projects our engineers actually work on."
      />

      <section className="section-shell py-16 md:py-20">
        {featured ? (
          <Reveal>
            <Link
              to="/blog/$slug"
              params={{ slug: featured.slug }}
              className="lift group grid overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary lg:grid-cols-2"
            >
              <Hero post={featured} className="h-56 w-full lg:h-full" />
              <div className="flex flex-col justify-center p-7 md:p-10">
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  {featured.category}
                </p>
                <h2 className="mt-3 text-2xl font-semibold md:text-3xl">{featured.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  {featured.summary}
                </p>
                <p className="mt-6 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {featured.published_at ? formatDate(featured.published_at) : ""} ·{" "}
                  {featured.read_minutes} min read
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read the article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        ) : (
          <p className="text-center text-muted-foreground">
            No articles published yet — check back soon.
          </p>
        )}

        {rest.length ? (
          <Stagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" gap={0.08}>
            {rest.map((post) => (
              <StaggerItem key={post.slug}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
                >
                  <Hero post={post} className="h-40 w-full" />
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium uppercase tracking-widest text-primary">
                      {post.category}
                    </p>
                    <h3 className="mt-2 text-base font-semibold leading-snug">{post.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {post.summary}
                    </p>
                    <p className="mt-5 text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      {post.published_at ? formatDate(post.published_at) : ""} · {post.read_minutes}{" "}
                      min read
                    </p>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}
      </section>
    </>
  );
}
