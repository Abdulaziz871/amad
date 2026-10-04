"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";

// A floating vertical track on the page's inline-start side (right in Arabic, left in English),
// starting just below the sticky header and inset from the edge so it sits in the page gutter.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  const height = useTransform(progress, (v) => `${Math.max(v, 0) * 100}%`);

  return (
    <div
      className="pointer-events-none absolute top-full start-1.5 mt-4 h-[calc(100dvh-100%-2rem)] w-1.5 rounded-full bg-white/80 shadow-[0_0_0_1px_rgba(12,35,65,0.08),0_6px_18px_-6px_rgba(12,35,65,0.25)] backdrop-blur-sm sm:start-4"
      aria-hidden
    >
      <motion.div
        className="relative w-full rounded-full bg-copper"
        style={{ height }}
      >
        <span className="absolute -bottom-1.5 start-1/2 h-3 w-3 rounded-full bg-copper shadow-[0_0_0_3px_rgba(255,255,255,0.9),0_0_10px_rgba(198,110,78,0.6)] ltr:-translate-x-1/2 rtl:translate-x-1/2" />
      </motion.div>
    </div>
  );
}
