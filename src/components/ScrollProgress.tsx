"use client";

import { motion, useScroll, useSpring } from "motion/react";

// A floating vertical track on the page's inline-start side (right in Arabic, left in English),
// starting just below the sticky header and inset from the edge so it sits in the page gutter.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <div
      className="pointer-events-none absolute top-full start-1.5 mt-4 h-[calc(100dvh-100%-2rem)] w-1.5 overflow-hidden rounded-full bg-surface/80 shadow-[0_0_0_1px_rgba(12,35,65,0.08),0_6px_18px_-6px_rgba(12,35,65,0.25)] backdrop-blur-sm sm:start-4"
      aria-hidden
    >
      <motion.div className="h-full w-full origin-top rounded-full bg-copper" style={{ scaleY: progress }} />
    </div>
  );
}
