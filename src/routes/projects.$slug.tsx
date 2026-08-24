import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { caseStudies, type CaseStudy } from "@/data/site";

export const Route = createFileRoute("/projects/$slug")({
  loader: ({ params }) => {
    const study = caseStudies.find((c) => c.slug === params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Project not found | Quantum Basics" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { study } = loaderData;
    const title = `${study.title} — ${study.client} | Quantum Basics`;
    return {
      meta: [
        { title },
        { name: "description", content: study.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: study.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: CaseStudyNotFound,
  component: CaseStudyPage,
});

function CaseStudyNotFound() {
  return (
    <section className="section-shell py-28 text-center">
      <h1 className="text-3xl">This project write-up doesn't exist</h1>
      <p className="mt-4 text-muted-foreground">It may have been moved or renamed.</p>
      <Link
        to="/projects"
        className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to the track record
      </Link>
    </section>
  );
}

function CaseStudyPage() {
  const { study } = Route.useLoaderData() as { study: CaseStudy };
  const others = caseStudies.filter((c) => c.slug !== study.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={study.client}
        title={study.title}
        description={study.summary}
        variant="spotlight"
        image={study.hero}
      >
        <Link
          to="/projects"
          className="mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground/80 transition-colors hover:text-ink-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the track record
        </Link>
      </PageHero>

      <section className="section-shell py-14 md:py-16">
        <Reveal>
          <dl className="grid gap-6 rounded-2xl border border-border bg-card p-7 sm:grid-cols-2 lg:grid-cols-4">
            <Fact label="Client" value={study.client} />
            <Fact label="Sector" value={study.sector} />
            <Fact label="Location" value={study.location} />
            <Fact label="Engagement" value={study.period} />
          </dl>
        </Reveal>
      </section>

      <section className="section-shell grid gap-12 pb-8 lg:grid-cols-[0.9fr_1.4fr]">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow text-primary">Scope</p>
            <ul className="mt-6 space-y-3">
              {study.scopeLines.map((line) => (
                <li key={line} className="flex gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rule-line" />
            <img
              src={study.logo}
              alt={`${study.client} logo`}
              loading="lazy"
              className="mt-8 max-h-12 w-auto object-contain"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow text-primary">The challenge</p>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              {study.challenge}
            </p>
          </Reveal>

          <div className="mt-14 space-y-14">
            {study.sections.map((section) => (
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
        </div>
      </section>

      {study.gallery?.length ? (
        <section className="section-shell py-16 md:py-20">
          <Stagger className="grid gap-6 md:grid-cols-2" gap={0.08}>
            {study.gallery.map((g) => (
              <StaggerItem key={g.src + g.caption}>
                <figure className="overflow-hidden rounded-2xl border border-border bg-card">
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    width={1600}
                    height={1000}
                    className="h-64 w-full object-cover"
                  />
                  <figcaption className="p-5 text-sm text-muted-foreground">{g.caption}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      ) : null}

      <section className="bg-secondary/70 py-20 md:py-24">
        <div className="section-shell">
          <SectionHeading eyebrow="Outcomes" title="What the client got" />
          <Stagger className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {study.outcomes.map((o) => (
              <StaggerItem key={o} className="border-t border-border pt-6">
                <p className="text-sm leading-relaxed">{o}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <Link
            to="/contact"
            className="group mt-12 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Discuss a similar project <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <SectionHeading eyebrow="More work" title="Other engagements" />
        <Stagger className="mt-10 grid gap-6 md:grid-cols-3" gap={0.08}>
          {others.map((c) => (
            <StaggerItem key={c.slug}>
              <Link
                to="/projects/$slug"
                params={{ slug: c.slug }}
                className="lift group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary"
              >
                <img
                  src={c.hero}
                  alt={c.heroAlt}
                  loading="lazy"
                  width={1600}
                  height={1000}
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-medium uppercase tracking-widest text-primary">
                    {c.client}
                  </p>
                  <h3 className="mt-2 flex-1 text-base font-semibold">{c.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Read more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold">{value}</dd>
    </div>
  );
}
