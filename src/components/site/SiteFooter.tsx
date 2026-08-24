import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SiteLink } from "@/components/site/SiteLink";
import { company } from "@/data/site";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/about", label: "About us" },
      { to: "/projects", label: "Projects & clients" },
      { to: "/academy", label: "Academy" },
      { to: "/blog", label: "Blog" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { to: "/services", label: "WAGES metering" },
      { to: "/services", label: "Industrial automation" },
      { to: "/services", label: "Smart grid & energy" },
      { to: "/services", label: "Security systems" },
      { to: "/services", label: "Telecom access networks" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="section-shell grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="font-display text-xl font-semibold">{company.name}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">
            {company.rc} · {company.tagline}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-muted">
            Engineering intelligent infrastructure across energy, oil &amp; gas, utilities, industry
            and connectivity — designed, deployed and optimised end to end.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-ink-muted">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              {company.address}
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={`mailto:${company.email}`} className="hover:text-accent">
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={company.phoneHref} className="hover:text-accent">
                {company.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={company.whatsappHref} className="hover:text-accent">
                WhatsApp {company.whatsapp}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Globe className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href={company.websiteHref} className="hover:text-accent">
                {company.website}
              </a>
            </li>
          </ul>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ink-foreground">
              {col.title}
            </p>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <SiteLink
                    to={link.to}
                    className="text-sm text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </SiteLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-3 py-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Quantum Basics Nigeria Limited. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <SiteLink to="/privacy" className="transition-colors hover:text-accent">
              Privacy Policy
            </SiteLink>
            <SiteLink to="/cookies" className="transition-colors hover:text-accent">
              Cookie Policy
            </SiteLink>
            <p>Partnership · Relationship · Commitment to Excellence</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
