"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

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
  const inView = useInView(ref, { once: false, margin: "-10% 0px" });
  const [display, setDisplay] = useState(0);

  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? parseInt(match[2], 10) : null;
  const suffix = match?.[3] ?? "";

  useEffect(() => {
    if (target === null) return;
    const to = inView ? target : 0;
    const controls = animate(inView ? 0 : display, to, {
      duration: inView ? 2.8 : 0.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
