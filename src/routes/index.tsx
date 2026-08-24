import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Gauge,
  Radio,
  ShieldCheck,
  MapPin,
  Plus,
  Minus,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import heroImage from "@/assets/hero-control-room.jpg";
import energyImage from "@/assets/energy.jpg";
import academyImage from "@/assets/academy.jpg";
import telecomImage from "@/assets/telecom-tower.jpg";
import meteringImage from "@/assets/metering.jpg";
import smartFieldImage from "@/assets/smart-field.jpg";
import {
  CountUp,
  LiveBars,
  LogoMarquee,
  Reveal,
  Stagger,
  StaggerItem,
} from "@/components/site/Motion";
import { countries, customers, partners } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Quantum Basics Nigeria Limited | Intelligent Infrastructure Engineering",
      },
      {
        name: "description",
        content:
          "Engineering company delivering WAGES metering, industrial automation, smart grid, energy management, security and telecom network systems across Africa.",
      },
      {
        property: "og:title",
        content: "Quantum Basics Nigeria Limited | Intelligent Infrastructure Engineering",
      },
      {
        property: "og:description",
        content:
          "Designing, deploying and optimising intelligent infrastructure across energy, oil & gas, utilities, industry and connectivity.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const ease = [0.16, 1, 0.3, 1] as const;

const pillars = [
  {
    icon: Gauge,
    hash: "wages-metering",
    title: "WAGES metering",
    body: "Water, air, gas, electricity and steam measurement accurate enough to bill on and granular enough to act on.",
    image: meteringImage,
    metrics: ["Billing-grade accuracy", "Loss detection", "Consumption analytics"],
  },
  {
    icon: Activity,
    hash: "smart-grid",
    title: "Smart grid & energy",
    body: "Real-time monitoring, fault recovery, renewable integration and energy audits that cut recurring cost.",
    image: smartFieldImage,
    metrics: ["Fault recovery", "Renewable integration", "Energy audits"],
  },
  {
    icon: ShieldCheck,
    hash: "security",
    title: "Automation & security",
    body: "Process control, robotics, digital oilfield instrumentation and AI-assisted surveillance across critical sites.",
    image: energyImage,
    metrics: ["PLC & SCADA", "Digital oilfield", "AI surveillance"],
  },
  {
    icon: Radio,
    hash: "telecommunications",
    title: "Telecom access networks",
    body: "Planning, deployment, commissioning and drive-test optimisation for operators building coverage that has to hold.",
    image: telecomImage,
    metrics: ["Link budgeting", "Drive-test optimisation", "Commissioning"],
  },
];

const stats = [
  { n: 5, suffix: "", label: "African countries delivered in" },
  { n: 11, suffix: "+", label: "Years of field engineering" },
  { n: 7, suffix: "", label: "Solution lines under one roof" },
  { n: 15, suffix: "+", label: "Operators & manufacturers served" },
];

const process = [
  {
    step: "01",
    title: "Survey & specify",
    body: "We walk the site, measure what is actually there and write a specification your procurement team can act on.",
  },
  {
    step: "02",
    title: "Design & budget",
    body: "Link budgets, load studies, instrumentation schedules and a bill of materials with no invented line items.",
  },
  {
    step: "03",
    title: "Deploy & commission",
    body: "Our own crews install, integrate and commission — then prove performance against the spec before handover.",
  },
  {
    step: "04",
    title: "Optimise & support",
    body: "Post-commissioning measurement, drive tests, energy audits and maintenance that keep the numbers honest.",
  },
];

const heroTiles = [
  { label: "Grid frequency", value: "50.01 Hz" },
  { label: "Sites monitored", value: "1,240" },
  { label: "Uptime", value: "99.7%" },
];

function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [active, setActive] = useState(0);
  const current = pillars[active] ?? pillars[0]!;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section ref={heroRef} className="relative overflow-hidden bg-ink text-ink-foreground">
        <motion.div style={{ y: imageY }} className="absolute inset-0">
          <img
            src={heroImage}
            alt="Engineers monitoring an energy grid control room"
            width={1920}
            height={1088}
            className="h-full w-full object-cover object-[50%_30%]"
          />
        </motion.div>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent"
        />
        <div className="grid-etch absolute inset-0 opacity-[0.18]" aria-hidden="true" />

        <div className="section-shell relative grid min-h-[70vh] items-center gap-14 py-20 md:min-h-[76vh] md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex w-fit items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm"
            >
              <LiveBars />
              Engineering · Automation · Digital infrastructure
            </motion.div>

            <motion.h1
              className="mt-8 max-w-3xl text-[2.7rem] font-medium leading-[1.02] tracking-tight md:text-[4.25rem]"
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease }}
            >
              Intelligent infrastructure for the industries that keep Africa running.
            </motion.h1>

            <motion.p
              className="mt-7 max-w-xl text-base leading-relaxed text-ink-muted md:text-lg"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
            >
              We design, deploy and optimise connected systems for energy, oil &amp; gas, utilities,
              manufacturing and connectivity — specification through commissioning.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease }}
            >
              <Link
                to="/services"
                className="group inline-flex h-13 items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                See our solutions
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex h-13 items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-ink-foreground backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                Talk to an engineer
              </Link>
            </motion.div>

            <motion.p
              style={{ opacity: fade }}
              className="mt-12 flex items-center gap-2 text-xs tracking-wide text-ink-muted"
            >
              <MapPin className="h-3.5 w-3.5" />
              Lagos, Nigeria — delivering across seven African countries
            </motion.p>
          </div>

          {/* Live telemetry tiles */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            className="hidden gap-3 lg:grid"
          >
            {heroTiles.map((tile, i) => (
              <motion.div
                key={tile.label}
                animate={{ y: [0, -7, 0] }}
                transition={{
                  duration: 6 + i * 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
                className="glass-tile ml-auto flex w-[19rem] items-center justify-between px-5 py-4"
              >
                <span className="text-xs uppercase tracking-[0.18em] text-ink-muted">
                  {tile.label}
                </span>
                <span className="font-display text-2xl">{tile.value}</span>
              </motion.div>
            ))}
            <div className="glass-tile ml-auto flex w-[19rem] items-center gap-3 px-5 py-4">
              <LiveBars />
              <span className="text-xs text-ink-muted">
                Live monitoring across operator &amp; plant sites
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Promo duo ---------- */}
      <section className="section-shell relative z-10 -mt-16 pb-20 md:-mt-20">
        <Stagger className="grid gap-5 md:grid-cols-2">
          <StaggerItem>
            <Link
              to="/services"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-10"
            >
              <div
                aria-hidden="true"
                className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-transform duration-700 group-hover:scale-125"
              />
              <div className="relative">
                <span className="eyebrow text-primary">Capabilities</span>
                <h2 className="mt-5 text-2xl md:text-3xl">Eleven solution lines</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Metering, automation, smart grid, energy, security and telecom — engineered by one
                  accountable team.
                </p>
              </div>

              <span className="relative mt-10 inline-flex items-center gap-2 text-sm font-semibold">
                Explore solutions
                <ArrowUpRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <Link
              to="/projects"
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-8 transition-transform duration-500 hover:-translate-y-1.5 md:p-10"
            >
              <img
                src={telecomImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
              />
              <div className="relative text-ink-foreground">
                <span className="eyebrow text-ink-muted">Track record</span>
                <h2 className="mt-5 text-2xl md:text-3xl">Proven in the field</h2>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
                  Rollouts, plant automation and metering programmes delivered for operators,
                  utilities and manufacturers.
                </p>
              </div>
              <span className="relative mt-10 inline-flex items-center gap-2 text-sm font-semibold text-ink-foreground">
                See the track record
                <ArrowUpRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ---------- Trusted by ---------- */}
      <section className="border-y border-border bg-secondary/50 py-16">
        <div className="section-shell">
          <p className="eyebrow">Trusted by operators, utilities &amp; manufacturers</p>
        </div>
        <div className="mt-9 space-y-3">
          <LogoMarquee items={partners} />
          <LogoMarquee items={customers} reverse />
        </div>
      </section>

      {/* ---------- Interactive capability switcher ---------- */}
      <section className="section-shell py-24 md:py-32">
        <Reveal>
          <p className="eyebrow">What we do</p>
          <h2 className="mt-5 max-w-2xl text-3xl md:text-[2.6rem] md:leading-[1.12]">
            Four disciplines. One accountable engineering team.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:gap-16">
          <Reveal>
            <div className="border-t border-border">
              {pillars.map(({ icon: Icon, title, body, hash, metrics }, i) => {
                const open = active === i;
                return (
                  <div
                    key={title}
                    className="hairline-accent border-b border-border"
                    data-active={open}
                  >
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-expanded={open}
                      className="flex w-full items-center gap-4 py-6 text-left"
                    >
                      <span
                        className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                          open
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="flex-1 text-lg leading-snug font-display">{title}</span>
                      {open ? (
                        <Minus className="h-4 w-4 text-primary" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease }}
                          className="overflow-hidden"
                        >
                          <div className="pb-7 pl-15">
                            <p className="measure text-sm leading-relaxed text-muted-foreground">
                              {body}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {metrics.map((m) => (
                                <span
                                  key={m}
                                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                            <Link
                              to="/services"
                              hash={hash}
                              className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold"
                            >
                              Explore this practice
                              <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-4/3 overflow-hidden rounded-2xl border border-border bg-ink lg:sticky lg:top-28">
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.title}
                  src={current.image}
                  alt={current.title}
                  loading="lazy"
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent"
              />
              <div className="absolute inset-x-5 bottom-5">
                <div className="glass-tile flex items-center justify-between px-5 py-4 text-ink-foreground">
                  <span className="text-sm font-medium">{current.title}</span>
                  <LiveBars />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section className="relative overflow-hidden bg-secondary/70 py-20 md:py-24">
        <div className="dot-grid absolute inset-0 opacity-40" aria-hidden="true" />
        <div className="section-shell relative">
          <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StaggerItem key={s.label}>
                <div className="bento h-full p-7">
                  <p className="font-display text-5xl font-medium text-primary md:text-6xl">
                    <CountUp value={s.n} suffix={s.suffix} />
                  </p>
                  <p className="mt-3 max-w-[14rem] text-sm leading-snug text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- How we work ---------- */}
      <section className="section-shell py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">How we work</p>
            <h2 className="mt-5 text-3xl md:text-4xl">From site walk to signed-off performance</h2>
            <p className="measure mt-5 text-muted-foreground">
              One team owns the whole chain, so nothing is lost between the drawing and the plant
              floor.
            </p>
          </Reveal>

          <Stagger className="relative grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {process.map((p) => (
              <StaggerItem key={p.step} className="h-full">
                <div className="group relative h-full bg-card p-8 transition-colors duration-500 hover:bg-secondary/60">
                  <span className="font-display text-sm tracking-[0.2em] text-muted-foreground transition-colors duration-300 group-hover:text-primary">
                    {p.step}
                  </span>
                  <h3 className="mt-5 text-lg">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ---------- Reach ---------- */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <Reveal>
            <p className="eyebrow">African reach</p>
            <h2 className="mt-5 text-3xl md:text-4xl">Delivered across seven countries</h2>
            <p className="measure mt-5 text-muted-foreground">
              Projects for operators, utilities and manufacturers — from network rollouts to plant
              floor automation.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Stagger className="flex flex-wrap gap-3" gap={0.04}>
              {countries.map((c) => (
                <StaggerItem key={c}>
                  <span className="group inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm transition-colors duration-300 hover:border-primary/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-border transition-colors duration-300 group-hover:bg-primary" />
                    {c}
                  </span>
                </StaggerItem>
              ))}
            </Stagger>
          </Reveal>
        </div>
      </section>

      {/* ---------- Energy split ---------- */}
      <section className="section-shell pb-24 md:pb-32">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-border md:grid-cols-2">
            <div className="flex flex-col justify-center bg-card p-9 md:p-14">
              <p className="eyebrow text-primary">Energy management</p>
              <h2 className="mt-5 text-3xl md:text-4xl">Energy that costs less and stops less</h2>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Audits, lighting control, smart metering, renewable integration and secure power —
                engineered around how your site actually runs, then measured after commissioning.
              </p>
              <Link
                to="/services"
                hash="energy-management"
                className="group mt-9 inline-flex h-12 w-fit items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition-colors hover:border-primary/50 hover:bg-secondary"
              >
                See the energy practice
                <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative min-h-[18rem] overflow-hidden">
              <img
                src={energyImage}
                alt="Solar array and secure power equipment at an industrial facility"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------- Academy ---------- */}
      <section className="section-shell pb-24 md:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <p className="eyebrow">Quantum Basics Academy</p>
            <h2 className="mt-5 text-3xl md:text-4xl">Closing the industrial skills gap</h2>
            <p className="measure mt-5 text-muted-foreground">
              A digital learning hub that turns complex technical concepts into practical,
              industry-ready expertise for engineers, operations teams and graduates.
            </p>
            <Link
              to="/academy"
              className="group mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
            >
              Explore training tracks
              <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-border">
              <img
                src={academyImage}
                alt="Trainees working on a PLC and SCADA training rig"
                loading="lazy"
                className="aspect-4/3 w-full object-cover transition-transform duration-[1200ms] hover:scale-105"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="section-shell pb-28 md:pb-36">
        <Reveal>
          <div className="sheen panel-ink relative overflow-hidden px-8 py-16 text-center md:px-16 md:py-24">
            <div className="grid-etch absolute inset-0 opacity-20" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="orb absolute -right-20 -top-24 h-72 w-72 bg-primary/25"
            />
            <div className="relative">
              <p className="eyebrow text-accent">Start a conversation</p>
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl md:text-[2.75rem] md:leading-tight">
                Let&apos;s engineer your next system
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm text-ink-muted md:text-base">
                Tell us about your site, network or plant and we&apos;ll come back with a scoped
                approach.
              </p>
              <Link
                to="/contact"
                className="group mt-9 inline-flex h-13 items-center gap-2 rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                Request a consultation
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
