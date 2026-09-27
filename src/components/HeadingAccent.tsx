"use client";

import clsx from "clsx";
import { motion } from "motion/react";

const bars = [
  { width: "w-10", color: "bg-copper" },
  { width: "w-4", color: "bg-copper-light" },
  { width: "w-2", color: "bg-accent" },
];

export function HeadingAccent({ align = "start", className }: { align?: "start" | "center"; className?: string }) {
  return (
    <span
      className={clsx("mt-5 flex items-center gap-1.5", align === "center" && "justify-center", className)}
      aria-hidden
    >
      {bars.map((bar, i) => (
        <motion.span
          key={bar.color}
          className={clsx("h-1.5 rounded-full", bar.width, bar.color)}
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.21, 0.47, 0.32, 0.98] }}
        />
      ))}
    </span>
  );
}
