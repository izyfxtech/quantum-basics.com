import type { ReactNode } from "react";
import { motion } from "motion/react";

const ease = [0.16, 1, 0.3, 1] as const;

export type HeroVariant = "grid" | "beam" | "ledger" | "spotlight" | "signal";

function HeroBackdrop({ variant, image }: { variant: HeroVariant; image?: string | undefined }) {
  return (
    <>
      <div className="surface-forest absolute inset-0" aria-hidden="true" />

      {image ? (
        <>
          <motion.img
            src={image}
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            transition={{ duration: 1.6, ease }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[oklch(0.26_0.05_165)] via-[oklch(0.28_0.05_165)]/85 to-transparent"
          />
        </>
      ) : null}

      {variant === "grid" && (
        <div className="grid-etch absolute inset-0 opacity-30" aria-hidden="true" />
      )}

      {variant === "beam" && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0, x: "-20%" }}
          animate={{ opacity: 1, x: "0%" }}
          transition={{ duration: 1.4, ease }}
          className="absolute inset-y-0 left-0 w-2/3 skew-x-[-14deg] bg-gradient-to-r from-primary/10 via-primary/4 to-transparent"
        />
      )}

      {variant === "ledger" && (
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.08] [background-image:repeating-linear-gradient(180deg,transparent_0_47px,color-mix(in_oklab,black_50%,transparent)_47px_48px)]"
        />
      )}

      {variant === "spotlight" && (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/12 blur-[130px]"
        />
      )}

      {variant === "signal" && (
        <div aria-hidden="true" className="absolute inset-0">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute left-[10%] top-1/2 rounded-full border border-primary/20"
              style={{
                width: 260 + i * 240,
                height: 260 + i * 240,
                marginLeft: -(130 + i * 120),
                marginTop: -(130 + i * 120),
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: [0.05, 0.28, 0.05], scale: [0.92, 1.04, 0.92] }}
              transition={{ duration: 9, delay: i * 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  variant = "grid",
  image,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
  variant?: HeroVariant;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden text-ink-foreground">
      <HeroBackdrop variant={variant} image={image} />

      <div className="section-shell relative py-24 md:py-32">
        <motion.p
          className="eyebrow text-[oklch(0.82_0.09_155)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          className="mt-6 max-w-3xl text-[2.4rem] leading-[1.08] md:text-[3.6rem]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.08, ease }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="measure mt-7 text-base leading-relaxed text-ink-muted md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease }}
        >
          {description}
        </motion.p>

        {children ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.34, ease }}
          >
            {children}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Compact, image-free page header for interior marketing pages that don't
 * need a full hero (About, Contact, Projects). The Academy portal has its
 * own header components in src/academy/ and never renders this.
 */
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-background">
      <div className="section-shell py-12 md:py-16">
        <motion.p
          className="eyebrow text-primary"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          className="mt-4 max-w-3xl text-[2rem] leading-[1.12] md:text-[2.9rem]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease }}
        >
          {title}
        </motion.h1>
        {description ? (
          <motion.p
            className="measure mt-5 text-base leading-relaxed text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease }}
          >
            {description}
          </motion.p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease }}
      className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 className="mt-5 text-3xl md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </motion.div>
  );
}
