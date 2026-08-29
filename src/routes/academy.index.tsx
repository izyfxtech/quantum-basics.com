import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Building2, GraduationCap, Users, Wrench } from "lucide-react";
import { academyAudience, academyTracks } from "@/data/site";
import { Panel, Tag } from "@/academy/components/ui";
import academyImage from "@/assets/academy.jpg";
import "@/academy/academy.css";

export const Route = createFileRoute("/academy/")({
  head: () => ({
    meta: [
      { title: "Quantum Basics Academy | Industrial Automation & Energy Training" },
      {
        name: "description",
        content:
          "Practical training in industrial automation, WAGES metering, energy management, smart infrastructure and connectivity across four competency tracks.",
      },
      { property: "og:title", content: "Quantum Basics Academy" },
      {
        property: "og:description",
        content:
          "Expert-led, hands-on training tracks for engineers, corporate teams, graduates and school leavers.",
      },
    ],
  }),
  component: Academy,
});

const pillars = [
  {
    icon: Building2,
    title: "Industry-aligned curriculum",
    body: "Courses designed in direct response to the needs of manufacturing, energy, oil and gas, and utilities.",
  },
  {
    icon: GraduationCap,
    title: "Expert-led instruction",
    body: "Learn from seasoned professionals with deep, real-world experience in high-stakes technical fields.",
  },
  {
    icon: Wrench,
    title: "Practical, hands-on learning",
    body: "Theory meets execution through real case studies, simulations and problem-solving frameworks.",
  },
  {
    icon: Users,
    title: "Enterprise-grade focus",
    body: "Not just the technology — the efficiency, safety and operational excellence complex systems demand.",
  },
];

function Academy() {
  return (
    <div className="qa">
      {/* Split intro banner — text on a flat panel, image alongside. No
          full-bleed backdrop, gradient wash or scroll-triggered motion:
          deliberately not the marketing PageHero. */}
      <section className="border-b border-[var(--qa-line)] bg-[var(--qa-surface)]">
        <div className="qa-wrap grid gap-10 py-14 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Tag>Learning portal</Tag>
            <h1 className="mt-4 max-w-xl text-[2rem] leading-[1.1] md:text-[2.75rem]">
              Bridging the knowledge gap in industrial technology
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              As industries evolve, the demand for highly skilled, forward-thinking professionals
              has never been greater. We turn complex technical concepts into practical,
              industry-ready expertise.
            </p>
            <Link
              to="/academy/auth"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
            >
              Sign up for a track <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <img
            src={academyImage}
            alt="Instructor teaching trainees on PLC and SCADA equipment"
            fetchPriority="high"
            width={1408}
            height={912}
            className="w-full rounded object-cover"
          />
        </div>
      </section>

      <section className="qa-wrap py-14 md:py-20">
        <p className="qa-label text-primary">Our core pillars</p>
        <h2 className="mt-3 text-2xl md:text-[1.75rem]">Built for people who run real systems</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }) => (
            <Panel key={title} className="flex gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            </Panel>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--qa-line)] bg-secondary/40">
        <div className="qa-wrap py-14 md:py-20">
          <p className="qa-label text-primary">Training tracks</p>
          <h2 className="mt-3 text-2xl md:text-[1.75rem]">Four primary competency tracks</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            The curriculum mirrors the full scope of solutions Quantum Basics delivers in the
            field.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {academyTracks.map((track) => (
              <Panel key={track.number}>
                <span className="qa-label text-primary">{track.number}</span>
                <h3 className="mt-2 text-lg font-semibold">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {track.scope}
                </p>
                <p className="mt-4 qa-label text-muted-foreground">Key modules</p>
                <ul className="mt-2 space-y-1.5">
                  {track.modules.map((m) => (
                    <li key={m} className="border-l-2 border-primary/40 pl-3 text-sm">
                      {m}
                    </li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </div>
      </section>

      <section className="qa-wrap py-14 md:py-20">
        <p className="qa-label text-primary">Who we serve</p>
        <h2 className="mt-3 text-2xl md:text-[1.75rem]">Learning paths for every stage</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {academyAudience.map((a) => (
            <Panel key={a.title}>
              <h3 className="text-sm font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            </Panel>
          ))}
        </div>
      </section>

      <section className="qa-wrap pb-16 md:pb-24">
        <div className="qa-card px-8 py-12 text-center">
          <h2 className="mx-auto max-w-2xl text-2xl md:text-[1.9rem]">
            Join the future of industry
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Our mission is to equip the next generation of industry leaders with the skills to
            drive efficiency, innovation and sustainable growth.
          </p>
          <Link
            to="/academy/auth"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Sign up now <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
