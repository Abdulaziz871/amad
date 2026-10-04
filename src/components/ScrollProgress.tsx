"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";

const MARK_ROOM_PX = 72;

// A floating vertical track on the page's inline-start side (right in Arabic, left in English),
// starting just below the sticky header and inset from the edge so it sits in the page gutter.
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  // Leave room below the fill for the mark, so it never runs off the bottom of the screen.
  const height = useTransform(progress, (v) => `calc((100% - ${MARK_ROOM_PX}px) * ${Math.max(v, 0)})`);

  return (
    <div
      className="pointer-events-none absolute top-full start-1.5 mt-4 h-[calc(100dvh-100%-2rem)] w-1.5 rounded-full bg-surface/80 shadow-[0_0_0_1px_rgba(12,35,65,0.08),0_6px_18px_-6px_rgba(12,35,65,0.25)] backdrop-blur-sm sm:start-4"
      aria-hidden
    >
      <motion.div
        className="relative w-full rounded-full bg-copper"
        style={{ height }}
      >
        {/* The امد mark (tiles stacked ا / م / د) rides the tip of the fill: colour in light mode, white in dark. */}
        <Image
          src="/logos/amad-mark-vertical.png"
          alt=""
          width={240}
          height={777}
          unoptimized
          className="absolute top-full dark:hidden start-1/2 mt-1 h-auto w-4 max-w-none drop-shadow-[0_4px_8px_rgba(12,35,65,0.25)] ltr:-translate-x-1/2 rtl:translate-x-1/2 sm:w-5"
        />
        <Image
          src="/logos/amad-mark-vertical-white.png"
          alt=""
          width={240}
          height={777}
          unoptimized
          className="absolute top-full hidden dark:block start-1/2 mt-1 h-auto w-4 max-w-none drop-shadow-[0_4px_8px_rgba(12,35,65,0.25)] ltr:-translate-x-1/2 rtl:translate-x-1/2 sm:w-5"
        />
      </motion.div>
    </div>
  );
}
