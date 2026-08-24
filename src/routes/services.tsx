import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Activity,
  Cable,
  Cpu,
  Droplets,
  Fuel,
  Gauge,
  Radio,
  ShieldCheck,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import { PageHero, SectionHeading } from "@/components/site/PageHero";
import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { services } from "@/data/services";
import telecomImage from "@/assets/telecom-tower.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Solutions | Quantum Basics Nigeria Limited" },
      {
        name: "description",
        content:
          "Industrial communications, WAGES metering, smart grid, smart field, process automation, energy management, security and telecommunications solutions from Quantum Basics.",
      },
      { property: "og:title", content: "Quantum Basics Solutions" },
      {
        property: "og:description",
        content:
          "Engineered, deployed and optimised connected systems for energy, oil & gas, utilities, manufacturing and connectivity.",
      },
    ],
  }),
  component: Services,
});

const ICONS: Record<string, typeof Gauge> = {
  "industrial-communications": Radio,
  "wages-metering": Gauge,
  "smart-grid": Activity,
  "smart-field": Cpu,
  "process-automation": Cpu,
  "energy-management": Zap,
  "smart-water": Droplets,
  security: ShieldCheck,
  "fuel-retailing": Fuel,
  "resource-management": Users,
  telecommunications: Cable,
};

function Services() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Solutions engineered around how your site actually runs"
        description="Eleven practice areas spanning industrial communications, metering, energy management, automation, security and connectivity — specified, deployed and measured after commissioning."
        variant="ledger"
        image={telecomImage}
      >
        <Link
          to="/contact"
          className="mt-10 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
        >
          Talk to an engineer <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHero>

      <section className="section-shell py-20 md:py-24">
        <SectionHeading
          eyebrow="Our practices"
          title="Eleven areas, one delivery team"
          description="Each practice draws on the same field engineers, so a project that spans metering, automation and security is delivered as one coordinated scope rather than three separate vendors."
        />

        <div className="mt-14 space-y-16">
          {services.map((service, i) => {
            const Icon = ICONS[service.slug] ?? Sun;
            return (
              <div key={service.slug} id={service.slug} className="scroll-mt-24">
              <Reveal>
                <article className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-12">
                  <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-6">
                    <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="font-display text-sm font-semibold text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold md:text-2xl">{service.title}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {service.summary}
                    </p>
                    <Stagger className="mt-6 grid gap-2.5 sm:grid-cols-2" gap={0.04}>
                      {service.points.map((point) => (
                        <StaggerItem key={point} y={8}>
                          <span className="flex items-start gap-2.5 text-sm">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {point}
                          </span>
                        </StaggerItem>
                      ))}
                    </Stagger>
                  </div>
                </article>
              </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section-shell pb-24">
        <div className="rounded-2xl border border-border bg-secondary/70 px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold md:text-4xl">
            Have a project in mind?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Tell us what you're running and where it needs to get to — we'll scope the practice
            areas that apply.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-md bg-primary px-7 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Talk to an engineer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
