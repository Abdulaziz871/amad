import type { SVGProps } from "react";

/** مساهمة — Copper woven-cross pattern, from the official Amad brand guideline. */
export function PatternCross(props: SVGProps<SVGSVGElement>) {
  const cells = [
    [2, 2], [7, 2], [2, 7], [7, 7],
    [13, 2], [18, 2], [13, 7], [18, 7],
    [2, 13], [7, 13], [2, 18], [7, 18],
    [13, 13], [18, 13], [13, 18], [18, 18],
  ];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1.5" />
      ))}
    </svg>
  );
}

/** ادراك — Deep Blue bars pattern, from the official Amad brand guideline. */
export function PatternBars(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <rect x="2" y="2.75" width="20" height="4.5" rx="2.25" />
      <rect x="2" y="9.75" width="20" height="4.5" rx="2.25" />
      <rect x="2" y="16.75" width="20" height="4.5" rx="2.25" />
    </svg>
  );
}

/**
 * Decorative scatter of the two brand pattern glyphs —
 * used as a section watermark, matching the guideline's tinted-panel usage.
 */
export function BrandPatternDecor({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <div className="flex items-center gap-6 opacity-20">
        <PatternCross className="h-12 w-12 text-copper" />
        <PatternBars className="h-12 w-12 text-ink" />
      </div>
    </div>
  );
}
