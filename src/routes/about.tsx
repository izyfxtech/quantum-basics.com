import { createFileRoute } from "@tanstack/react-router";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { countries, partners } from "@/data/site";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { BrandLogo } from "@/components/site/BrandLogo";
import fieldImage from "@/assets/smart-field.jpg";
import africaMap from "@/assets/africa-reach-map.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Quantum Basics | Engineering Services Across Africa" },
      {
        name: "description",
        content:
          "Quantum Basics Nigeria Limited is an engineering services company delivering energy, industrial and infrastructure solutions in seven African countries.",
      },
      { property: "og:title", content: "About Quantum Basics Nigeria Limited" },
      {
        property: "og:description",
        content:
          "Our story, core values, African reach and the engineering partners behind our infrastructure work.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    title: "Partnership",
    body: "We work alongside clients as a long-term technical partner, not a one-off vendor.",
  },
  {
    title: "Relationship",
    body: "Continuity of people and knowledge across the full lifecycle of every system we deliver.",
  },
  {
    title: "Commitment to Excellence",
    body: "Engineering standards, safety and operational discipline on every site we touch.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Who we are"
        title="A leading engineering services company for energy, industry and infrastructure"
        description="Vast experience in energy and infrastructure solutions, industrial systems integration, end-to-end IT and network delivery, planning and optimisation — delivered by engineers who stay with the project."
        variant="beam"
        image={fieldImage}
      />

      <section className="section-shell py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our approach"
              title="Engineering expertise meets digital transformation"
              description="We are a technology-driven engineering company focused on designing, deploying and optimising intelligent infrastructure systems across energy, oil & gas, utilities, industrial and connectivity sectors. Our solutions combine engineering expertise, digital transformation and automation technologies to improve efficiency, reliability and operational visibility."
            />
            <div className="mt-8 rounded-xl border-l-4 border-primary bg-secondary/60 p-6">
              <p className="font-display text-lg font-medium">
                "We are committed to building smart, connected and efficient systems that power the
                future of industries, utilities and infrastructure."
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Our drive</p>
            </div>
          </div>
          <Reveal y={40}>
            <img
              src={fieldImage}
              alt="Field engineer inspecting instrumented process equipment"
              loading="lazy"
              width={1200}
              height={900}
              className="rounded-2xl object-cover shadow-panel"
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/60 py-20 md:py-24">
        <div className="section-shell">
          <SectionHeading eyebrow="Core values" title="How we work" />
          <Stagger className="mt-10 grid gap-6 md:grid-cols-3" gap={0.1}>
            {values.map((v, i) => (
              <StaggerItem key={v.title}>
                <article className="lift h-full rounded-2xl border border-border bg-card p-7">
                  <span className="font-display text-sm font-semibold text-primary">0{i + 1}</span>
                  <h3 className="mt-3 text-lg font-semibold">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="African reach"
              title="Operating across seven countries"
              description="Our teams and delivery partners support projects throughout West, East and Southern Africa."
            />
            <Stagger className="mt-8 flex flex-wrap gap-3" gap={0.05}>
              {countries.map((c) => (
                <StaggerItem key={c} y={10}>
                  <span className="inline-flex h-12 items-center rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/5">
                    {c}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal
              y={24}
              className="mt-8 overflow-hidden rounded-2xl border border-border bg-card p-4"
            >
              <img
                src={africaMap}
                alt="Map of Africa highlighting the countries where Quantum Basics delivers projects"
                loading="lazy"
                className="mx-auto w-full max-w-md object-contain"
              />
            </Reveal>
          </div>

          <div>
            <SectionHeading
              eyebrow="Technology partners"
              title="Backed by global manufacturers"
              description="We design and integrate with equipment and platforms from established industrial technology vendors."
            />
            <Stagger className="mt-8 grid grid-cols-2 gap-3" gap={0.06}>
              {partners.map((p) => (
                <StaggerItem key={p.name} y={12}>
                  <span className="lift flex h-20 items-center justify-center rounded-xl border border-border bg-card px-6">
                    <BrandLogo name={p.name} src={p.logo} />
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>
    </>
  );
}
