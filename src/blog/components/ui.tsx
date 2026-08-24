import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

export const FIELD_CLASS =
  "mt-1.5 w-full rounded border border-[var(--bs-line)] bg-card px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/25";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bs-card p-5 md:p-6 ${className}`}>{children}</div>;
}

type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "solid" | "outline" | "ghost";
};

export function Btn({ variant = "solid", className = "", children, ...rest }: BtnProps) {
  const base =
    "inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors disabled:opacity-60";
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : variant === "outline"
        ? "border border-[var(--bs-line)] text-foreground hover:bg-secondary"
        : "text-foreground hover:bg-secondary";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
};

export function TextField({ label, value, onChange, hint, ...rest }: TextFieldProps) {
  return (
    <label className="block">
      <span className="bs-label">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_CLASS}
        {...rest}
      />
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="bs-label">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={FIELD_CLASS}
      />
      {hint ? <span className="mt-1 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
      {children}
    </span>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" /> {label}
    </p>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="bs-card p-10 text-center">
      <p className="font-semibold">{title}</p>
      <p className="mt-1.5 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

/** Distinguishes "the fetch failed" from "there's nothing here" — see the
 * ListResult<T> convention in blog/lib/posts.ts. */
export function ErrorNotice({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="bs-card flex items-start gap-3 border-destructive/30 bg-destructive/5 p-5">
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

export function StudioHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="bs-label text-primary">{label}</p>
      <h1 className="mt-2 text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-2xl text-muted-foreground">{description}</p> : null}
    </div>
  );
}
