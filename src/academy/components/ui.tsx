import type { ReactNode } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

/** Compact page heading for portal screens: mono label + sans title.
 * No hero, no background image, no reveal animation — intentionally not the
 * marketing site's PageHero/PageIntro. */
export function PortalHeading({
  label,
  title,
  description,
  actions,
}: {
  label?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4 pb-6">
      <div className="min-w-0">
        {label ? <p className="qa-label text-primary">{label}</p> : null}
        <h1 className="mt-2 text-2xl sm:text-[1.75rem]">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`qa-card p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="qa-label rounded border border-primary/25 bg-primary/8 px-2 py-1 text-primary">
      {children}
    </span>
  );
}

export function Meta({ children }: { children: ReactNode }) {
  return <span className="qa-label text-muted-foreground">{children}</span>;
}

export function Meter({ percent }: { percent: number }) {
  return (
    <div
      className="qa-meter"
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
    </div>
  );
}

type BtnProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "solid" | "outline" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
};

const BTN_BASE =
  "inline-flex h-10 items-center justify-center gap-2 rounded px-4 text-sm font-semibold transition-colors disabled:opacity-55";

const BTN_VARIANTS: Record<NonNullable<BtnProps["variant"]>, string> = {
  solid: "bg-primary text-primary-foreground hover:bg-primary-deep",
  outline: "border border-[var(--qa-line)] bg-card hover:bg-secondary",
  ghost: "text-muted-foreground hover:bg-secondary hover:text-foreground",
  danger: "border border-destructive/30 text-destructive hover:bg-destructive/8",
};

export function Btn({
  children,
  onClick,
  type = "button",
  variant = "solid",
  disabled,
  className = "",
}: BtnProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BTN_BASE} ${BTN_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export const FIELD_CLASS =
  "mt-1.5 h-11 w-full rounded border border-[var(--qa-line)] bg-card px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="qa-label text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_CLASS}
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="qa-label text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_CLASS}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label ?? "Loading…"}
    </p>
  );
}

/** Shown in place of (or above) an empty state when a fetch actually
 * failed, so "couldn't load" never looks identical to "there's nothing
 * here" — see the ListResult<T> convention in academy/lib. */
export function ErrorNotice({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="qa-card flex items-start gap-3 border-destructive/30 bg-destructive/5 p-4">
      <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-destructive">Couldn't load this</p>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry ? (
        <Btn variant="outline" onClick={onRetry} className="shrink-0">
          Retry
        </Btn>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="qa-card border-dashed p-8 text-center">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}
