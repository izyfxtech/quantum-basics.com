import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageIntro } from "@/components/site/PageHero";
import { company, services } from "@/data/site";

import { Reveal, Stagger, StaggerItem } from "@/components/site/Motion";
import { motion, AnimatePresence } from "motion/react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Quantum Basics | Request an Engineering Consultation" },
      {
        name: "description",
        content:
          "Talk to the Quantum Basics engineering team about metering, automation, energy, security, telecom or academy training enquiries.",
      },
      { property: "og:title", content: "Contact Quantum Basics Nigeria Limited" },
      {
        property: "og:description",
        content: "Request a consultation for your network, plant, utility or training programme.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Tell us what you're building"
        description="Share the site, network or plant you need supported and our engineers will respond with a scoped approach."
      />

      <section className="section-shell py-20 md:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-2xl font-semibold">Reach the team</h2>
            <Stagger className="mt-8 space-y-6" gap={0.09}>
              {[
                { icon: MapPin, label: "Head office", value: company.address },
                {
                  icon: Mail,
                  label: "Email",
                  value: company.email,
                  href: `mailto:${company.email}`,
                },
                { icon: Phone, label: "Phone", value: company.phone, href: company.phoneHref },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  value: company.whatsapp,
                  href: company.whatsappHref,
                },
                {
                  icon: Globe,
                  label: "Website",
                  value: company.website,
                  href: company.websiteHref,
                },
              ].map(({ icon: Icon, label, value, href }) => (
                <StaggerItem key={label} className="group flex gap-4">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="mt-1 block text-sm text-muted-foreground hover:text-primary"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{value}</p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal
              delay={0.15}
              className="mt-10 rounded-2xl border border-border bg-secondary/60 p-6"
            >
              <p className="text-sm font-semibold">Office hours</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Monday – Friday, 08:00 – 17:00 WAT. Field support arranged by project schedule.
              </p>
            </Reveal>
          </div>

          <Reveal
            y={40}
            className="glow-ring rounded-2xl border border-border bg-card p-8 shadow-panel"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <h2 className="text-2xl font-semibold">Thank you</h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Your enquiry has been captured. A member of the team will be in touch shortly.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -8 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <h2 className="text-2xl font-semibold">Request a consultation</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Full name" name="name" />
                    <Field label="Company" name="company" required={false} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email" name="email" type="email" />
                    <Field label="Phone" name="phone" type="tel" required={false} />
                  </div>
                  <div>
                    <label htmlFor="interest" className="text-sm font-medium">
                      Area of interest
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                    >
                      {services.map((s) => (
                        <option key={s.slug}>{s.title}</option>
                      ))}
                      <option>Academy training</option>
                      <option>Other enquiry</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium">
                      Project details
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-deep hover:shadow-lift"
                  >
                    Send enquiry
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = true,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
    </div>
  );
}
