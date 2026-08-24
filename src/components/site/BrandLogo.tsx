import { useEffect, useRef, useState } from "react";

/**
 * Renders a brand/partner logo image, falling back to the plain company
 * name if the image fails to load (e.g. a missing asset). Use this instead
 * of a bare <img> anywhere a logo comes from data rather than a bundled,
 * known-good asset.
 */
export function BrandLogo({
  name,
  src,
  className = "max-h-10 w-auto max-w-full object-contain",
}: {
  name: string;
  src: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span className="whitespace-nowrap text-sm font-semibold tracking-tight text-muted-foreground">
        {name}
      </span>
    );
  }

  return (
    <img
      ref={ref}
      src={src}
      alt={`${name} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
