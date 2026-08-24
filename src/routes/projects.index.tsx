import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro, SectionHeading } from "@/components/site/PageHero";
import { caseStudies, customers, projects, telecomProjects, type Project } from "@/data/site";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/site/BrandLogo";
import { motion } from "motion/react";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects & Clients | Quantum Basics Nigeria Limited" },
      {
        name: "description",
        content:
          "A cross-section of completed projects for Fanmilk, Flour Mills, Zipline, Konexa and other industrial, energy and network clients across Africa.",
      },
      { property: "og:title", content: "Projects & Clients | Quantum Basics" },
      {
        property: "og:description",
        content:
          "Historical project delivery across metering, automation, power, security and network builds.",
      },
    ],
  }),
  component: Projects,
});

function Projects() {
  return (
    <>
      <PageIntro
        eyebrow="Track record"
        title="A cross-section of completed projects"
        description="Calibration and metering, access control, lighting, hybrid power monitoring, switchgear construction and national telecom network programmes."
      />

      <section className="section-shell py-20 md:py-24">
        <SectionHeading
          eyebrow="Project history"
          title="Energy, metering, automation & power projects"
        />
        <ProjectTable rows={projects} />
      </section>

      <section className="bg-secondary/60 py-20 md:py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Telecom programmes"
            title="Network rollout, drive test & optimisation history"
            description="Programmes delivered for operators and OEMs across Nigeria, Benin, Côte d'Ivoire and the Congo."
          />
          <ProjectTable rows={telecomProjects} />
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <div className="section-shell">
          <SectionHeading
            eyebrow="Case studies"
            title="Deeper engagements"
            description="A closer look at four programmes that shaped how we deliver energy and process projects. Open any card for the full write-up."
          />
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" gap={0.08}>
            {caseStudies.map((c) => (
              <StaggerItem key={c.slug}>
                <Link
                  to="/projects/$slug"
                  params={{ slug: c.slug }}
                  className="lift group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
                >
                  <div className="mb-5 flex h-24 items-center justify-center rounded-md bg-muted px-4">
                    <img
                      src={c.logo}
                      alt={`${c.client} logo`}
                      loading="lazy"
                      className="max-h-14 w-auto max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-base font-semibold">{c.title}</h3>
                  <p className="mt-1 text-xs font-medium uppercase tracking-widest text-primary">
                    {c.client}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {c.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Read the full project
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section-shell py-20 md:py-24">
        <SectionHeading
          eyebrow="Our customers"
          title="Trusted by operators, manufacturers and utilities"
        />
        <Stagger className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6" gap={0.04}>
          {customers.map((c) => (
            <StaggerItem key={c.name} y={12}>
              <span className="lift flex h-24 items-center justify-center rounded-xl border border-border bg-card px-4">
                <BrandLogo
                  name={c.name}
                  src={c.logo}
                  className="max-h-12 w-auto max-w-full object-contain"
                />
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </section>
    </>
  );
}

function ProjectTable({ rows }: { rows: Project[] }) {
  return (
    <Reveal y={30} className="mt-10 overflow-x-auto rounded-2xl border border-border shadow-panel">
      <table className="w-full min-w-[36rem] text-left text-sm">
        <thead className="bg-secondary">
          <tr>
            <th className="px-5 py-4 font-display font-semibold">Client</th>
            <th className="px-5 py-4 font-display font-semibold">Project</th>
            <th className="px-5 py-4 font-display font-semibold whitespace-nowrap">Period</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, i) => (
            <motion.tr
              key={`${p.client}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: Math.min(i, 12) * 0.035 }}
              className="border-t border-border bg-card align-top transition-colors hover:bg-primary/5"
            >
              <td className="px-5 py-4 font-medium">{p.client}</td>
              <td className="px-5 py-4 text-muted-foreground">{p.project}</td>
              <td className="px-5 py-4 whitespace-nowrap text-muted-foreground">{p.period}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </Reveal>
  );
}
