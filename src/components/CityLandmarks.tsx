"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CityPlace, LandmarkIcon } from "@/lib/content";

const ease = [0.21, 0.47, 0.32, 0.98] as const;

// Simple line drawings (64×64) of each city's landmark; every path draws itself in.
const landmarkPaths: Record<LandmarkIcon, string[]> = {
  // Kingdom Centre: tapering tower, parabolic opening at the top and the sky bridge.
  riyadh: [
    "M16 60 H48",
    "M23 60 L27.5 6",
    "M41 60 L36.5 6",
    "M27.5 6 Q32 30 36.5 6",
    "M28.6 13 H35.4",
    "M27 22 L37 22",
  ],
  // King Fahd's Fountain: a tall jet with spray falling either side, over the sea.
  jeddah: [
    "M12 58 Q18 54 24 58 T36 58 T48 58 T56 58",
    "M32 56 V12",
    "M32 12 Q22 4 16 22",
    "M32 12 Q42 4 48 22",
    "M32 18 Q25 14 21 30",
    "M32 18 Q39 14 43 30",
  ],
  // Al Khobar Water Tower: slender stem crowned by a sphere and disc, on the corniche.
  eastern: [
    "M12 58 Q18 54 24 58 T36 58 T48 58 T56 58",
    "M29.5 54 L30.5 30",
    "M34.5 54 L33.5 30",
    "M22 24 A10 7 0 0 0 42 24 A10 7 0 0 0 22 24",
    "M25 18 H39",
    "M32 18 V7",
  ],
};

export function CityLandmarks({ places, active }: { places: CityPlace[]; active: boolean }) {
  return (
    <ul className="relative flex items-stretch gap-2.5 pt-3 sm:gap-3">
      {/* Dashed route behind the cards, drawing across as the step opens. */}
      <motion.span
        className="pointer-events-none absolute inset-x-6 top-[58%] h-0 border-t-2 border-dashed border-copper/40 ltr:origin-left rtl:origin-right"
        initial={false}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.9, delay: active ? 0.1 : 0, ease }}
        aria-hidden
      />
      {places.map((place, i) => (
        <CityCard key={place.name} place={place} index={i} active={active} />
      ))}
    </ul>
  );
}

function CityCard({ place, index, active }: { place: CityPlace; index: number; active: boolean }) {
  const [hovered, setHovered] = useState(false);
  // Bumping the key replays the line-drawing whenever the card is hovered.
  const [drawKey, setDrawKey] = useState(0);
  const delay = active ? 0.15 + index * 0.22 : 0;

  return (
    <motion.li
      className="relative flex-1"
      initial={false}
      animate={{ opacity: active ? 1 : 0, y: active ? 0 : 16 }}
      transition={{ duration: 0.5, delay, ease }}
    >
      <motion.div
        tabIndex={0}
        onHoverStart={() => {
          setHovered(true);
          setDrawKey((k) => k + 1);
        }}
        onHoverEnd={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className={cn(
          "group relative flex h-full flex-col items-center rounded-2xl border bg-surface px-2 pb-3 pt-4 text-center outline-none transition-[border-color,box-shadow] duration-300 focus-visible:ring-2 focus-visible:ring-copper sm:px-3",
          hovered
            ? "border-copper/50 shadow-[0_18px_40px_-22px_rgba(198,110,78,0.6)]"
            : "border-fg/[0.08] shadow-[0_12px_30px_-24px_rgba(12,35,65,0.45)]"
        )}
      >
        {/* Pin drops onto the card when the step opens and bounces on hover. */}
        <motion.span
          className="absolute -top-3 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-copper text-white shadow-md"
          initial={false}
          animate={
            active
              ? { y: hovered ? [0, -5, 0] : 0, opacity: 1, scale: 1 }
              : { y: -14, opacity: 0, scale: 0.6 }
          }
          transition={
            hovered
              ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.45, delay: active ? delay + 0.35 : 0, type: "spring", stiffness: 380, damping: 18 }
          }
          aria-hidden
        >
          <MapPin className="h-3.5 w-3.5" />
        </motion.span>

        <svg
          key={drawKey}
          viewBox="0 0 64 64"
          className={cn(
            "h-14 w-14 transition-colors duration-300 sm:h-16 sm:w-16",
            hovered ? "text-copper" : "text-fg/70"
          )}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label={place.landmark}
        >
          {landmarkPaths[place.icon].map((d, p) => (
            <motion.path
              key={d}
              d={d}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: active ? 1 : 0 }}
              transition={{ duration: 0.7, delay: (drawKey ? 0 : delay) + p * 0.08, ease: "easeInOut" }}
            />
          ))}
        </svg>

        <span
          className={cn(
            "mt-1.5 text-sm font-bold transition-colors duration-300 sm:text-base",
            hovered ? "text-copper" : "text-fg"
          )}
        >
          {place.name}
        </span>
      </motion.div>
    </motion.li>
  );
}
