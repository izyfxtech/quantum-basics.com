import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SiteLink } from "@/components/site/SiteLink";
import logo from "@/assets/logo.png";

const solutions = [
  { hash: "wages-metering", label: "WAGES Metering", note: "Water, air, gas, electricity, steam" },
  {
    hash: "process-automation",
    label: "Industrial Automation",
    note: "Control systems and robotics",
  },
  {
    hash: "smart-grid",
    label: "Smart Grid & Power",
    note: "Monitoring, fault recovery, renewables",
  },
  { hash: "energy-management", label: "Energy Management", note: "Audits, metering, secure power" },
  { hash: "security", label: "Integrated Security", note: "CCTV, access control, surveillance" },
  {
    hash: "telecommunications",
    label: "Telecom Access Networks",
    note: "Planning, deployment, optimisation",
  },
];

const nav = [
  { to: "/about", label: "Who We Are" },
  { to: "/projects", label: "Project Track Record" },
  { to: "/academy", label: "Engineering Academy" },
  { to: "/blog", label: "Blog" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(true);
  };
  const closeMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(false), 140);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-background"
      }`}
    >
      <div
        className={`section-shell grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 transition-all duration-500 lg:flex lg:justify-between ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <SiteLink
          to="/"
          className="group flex min-w-0 items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <img
            src={logo}
            alt="Quantum Basics Nigeria Limited logo"
            width={40}
            height={40}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-10 w-10 shrink-0 rounded-sm object-contain"
          />
          <span className="min-w-0 font-display text-[0.95rem] font-semibold leading-tight">
            Quantum Basics
            <span className="block font-sans text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              …where Service works
            </span>
          </span>
        </SiteLink>

        <nav className="hidden items-center gap-1 lg:flex">
          <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
            <SiteLink
              to="/services"
              onFocus={openMenu}
              activeProps={{ className: "text-primary" }}
              className="inline-flex items-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              aria-expanded={menu}
            >
              Engineering Solutions
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${menu ? "rotate-180" : ""}`}
              />
            </SiteLink>
            <AnimatePresence>
              {menu && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute left-0 top-full w-[26rem] rounded-md border border-border bg-card p-2 shadow-panel"
                >
                  {solutions.map((s) => (
                    <SiteLink
                      key={s.hash}
                      to="/services"
                      hash={s.hash}
                      onClick={() => setMenu(false)}
                      className="block rounded-sm px-3 py-2.5 transition-colors hover:bg-secondary"
                    >
                      <span className="block text-sm font-medium">{s.label}</span>
                      <span className="block text-xs text-muted-foreground">{s.note}</span>
                    </SiteLink>
                  ))}
                  <SiteLink
                    to="/services"
                    onClick={() => setMenu(false)}
                    className="mt-1 flex items-center gap-2 border-t border-border px-3 py-2.5 text-sm font-medium text-primary"
                  >
                    All eleven solution lines <ArrowRight className="h-3.5 w-3.5" />
                  </SiteLink>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {nav.map((item) => (
            <SiteLink
              key={item.to}
              to={item.to}
              activeProps={{ className: "text-primary" }}
              className="rounded-sm px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
            >
              {item.label}
            </SiteLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <SiteLink
            to="/contact"
            className="group inline-flex h-11 items-center gap-2 rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Talk to an engineer
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </SiteLink>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-secondary lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <nav className="section-shell flex flex-col py-4">
              <p className="eyebrow py-2">Engineering solutions</p>
              {solutions.slice(0, 4).map((s) => (
                <SiteLink
                  key={s.hash}
                  to="/services"
                  hash={s.hash}
                  onClick={() => setOpen(false)}
                  className="rounded-sm px-2 py-2.5 text-[0.95rem] font-medium text-foreground/85"
                >
                  {s.label}
                </SiteLink>
              ))}
              <SiteLink
                to="/services"
                onClick={() => setOpen(false)}
                className="rounded-sm px-2 py-2.5 text-[0.95rem] font-medium text-primary"
              >
                All solutions
              </SiteLink>
              <span className="mt-3 border-t border-border" />
              {nav.map((item) => (
                <SiteLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "text-primary" }}
                  className="rounded-sm px-2 py-3 text-[0.95rem] font-medium text-foreground/85"
                >
                  {item.label}
                </SiteLink>
              ))}
              <SiteLink
                to="/contact"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex h-12 items-center justify-center rounded-sm bg-primary px-5 text-sm font-semibold text-primary-foreground"
              >
                Talk to an engineer
              </SiteLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
