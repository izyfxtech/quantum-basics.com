import { motion, useInView, useScroll, useSpring, useMotionValue, animate } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 22,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const unsub = mv.on("change", (v) => setDisplay(Math.round(v)));
    return unsub;
  }, [mv]);

  useEffect(() => {
    if (!inView) return undefined;
    const controls = animate(mv, value, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

export function Marquee({ items }: { items: { name: string; logo: string }[] }) {
  return <LogoMarquee items={items} />;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-[image:var(--gradient-gold)]"
    />
  );
}

export { motion };

function LogoChip({ item }: { item: { name: string; logo: string } }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <span className="logo-chip">
      {failed ? (
        <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-muted-foreground">
          {item.name}
        </span>
      ) : (
        <img ref={ref} src={item.logo} alt={`${item.name} logo`} onError={() => setFailed(true)} />
      )}
    </span>
  );
}

export function LogoMarquee({
  items,
  reverse = false,
}: {
  items: { name: string; logo: string }[];
  reverse?: boolean;
}) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-mask relative overflow-hidden">
      <div className={`flex w-max gap-3 ${reverse ? "marquee-track-rev" : "marquee-track"}`}>
        {loop.map((item, i) => (
          <LogoChip key={`${item.name}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

/** Thin animated bar-chart glyph used as a "live telemetry" cue. */
export function LiveBars({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex h-4 items-end gap-[3px] ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] origin-bottom rounded-full bg-primary"
          style={{
            height: "100%",
            animation: `qb-ticker-bar ${1.1 + i * 0.22}s ease-in-out ${i * 0.12}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
