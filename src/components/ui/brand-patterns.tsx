import type { HTMLAttributes } from "react";

function driftStyle(seed: string): React.CSSProperties {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const n = Math.abs(h);
  return {
    ["--drift-duration" as string]: `${11 + (n % 8)}s`,
    ["--drift-delay" as string]: `-${n % 9}s`,
  };
}

function maskStyle(src: string): React.CSSProperties {
  return {
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  };
}

/** Lavender fan pattern glyph, from the official Amad brand guideline artwork. */
export function PatternFan({ className = "", style, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={`pattern-drift inline-block bg-current ${className}`}
      style={{ ...maskStyle("/images/patterns/pattern-fan.png"), ...driftStyle(className), ...style }}
      {...rest}
    />
  );
}

/** Copper woven-cross pattern glyph, from the official Amad brand guideline artwork. */
export function PatternCross({ className = "", style, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={`pattern-drift inline-block bg-current ${className}`}
      style={{ ...maskStyle("/images/patterns/pattern-cross.png"), ...driftStyle(className), ...style }}
      {...rest}
    />
  );
}

/** Stacked-bars pattern glyph, from the official Amad brand guideline artwork. */
export function PatternBars({ className = "", style, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden
      className={`pattern-drift inline-block bg-current ${className}`}
      style={{ ...maskStyle("/images/patterns/pattern-bars.png"), ...driftStyle(className), ...style }}
      {...rest}
    />
  );
}

/**
 * Decorative scatter of the brand pattern glyphs —
 * used as a section watermark, matching the guideline's tinted-panel usage.
 */
export function BrandPatternDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="flex items-center gap-6 opacity-20">
        <PatternCross className="h-12 w-12 text-copper" />
        <PatternFan className="h-12 w-12 text-accent" />
      </div>
    </div>
  );
}
