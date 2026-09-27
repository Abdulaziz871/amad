"use client";

import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-linear-to-r from-copper via-copper-light to-accent rtl:origin-right"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
