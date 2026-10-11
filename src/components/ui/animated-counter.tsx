"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

// Renders the real number from the start (server render, previews, screenshots) and plays a
// one-time count-up the first time the stat scrolls into view.
export function AnimatedCounter({
  value,
  className,
  affixClassName,
}: {
  value: string;
  className?: string;
  affixClassName?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2], 10) : null;
  const suffix = match?.[3] ?? "";
  const [display, setDisplay] = useState(target ?? 0);

  useEffect(() => {
    if (!inView || target === null) return;
    const controls = animate(0, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, target]);

  if (target === null) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} dir="ltr">
      {prefix && <span className={affixClassName}>{prefix}</span>}
      {display}
      {suffix && <span className={affixClassName}>{suffix}</span>}
    </span>
  );
}
