"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { Route, Compass, Handshake, Presentation, Building2, LineChart, type LucideIcon } from "lucide-react";
import { PatternFan } from "./ui/brand-patterns";
import { cn } from "@/lib/utils";

const icons: LucideIcon[] = [Route, Compass, Handshake, Presentation, Building2, LineChart];
const tones = [
  { chip: "bg-copper text-white", glow: "rgba(198,110,78,0.22)" },
  { chip: "bg-copper-light text-ink", glow: "rgba(255,163,139,0.18)" },
  { chip: "bg-accent text-white", glow: "rgba(139,132,215,0.18)" },
  { chip: "bg-white text-ink", glow: "rgba(255,255,255,0.08)" },
  { chip: "bg-copper text-white", glow: "rgba(198,110,78,0.22)" },
  { chip: "bg-copper-light text-ink", glow: "rgba(255,163,139,0.18)" },
];
const STEP_MS = 5500;
const pad = (n: number) => String(n).padStart(2, "0");

export function ProcessShowcase({ items }: { items: { title: string; description: string }[] }) {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: "-20% 0px" });
  const reduceMotion = useReducedMotion();
  const playing = inView && !hovered && !reduceMotion;

  const item = items[active];
  const Icon = icons[active % icons.length];
  const tone = tones[active % tones.length];

  return (
    <div
      ref={rootRef}
      className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ol className="relative flex flex-col gap-2.5" role="tablist" aria-orientation="vertical">
        {items.map((step, i) => {
          const StepIcon = icons[i % icons.length];
          const isActive = i === active;
          return (
            <li key={step.title} role="presentation">
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls="process-panel"
                onClick={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "spotlight group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-3.5 text-start transition-all duration-500",
                  isActive
                    ? "border-copper/30 bg-white shadow-[0_18px_40px_-26px_rgba(12,35,65,0.45)]"
                    : "border-ink/[0.06] bg-white/55 hover:bg-white"
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-500 [&_svg]:h-5 [&_svg]:w-5",
                    isActive ? "scale-110 bg-copper text-white" : "bg-ink/[0.06] text-ink/70 group-hover:bg-ink/10"
                  )}
                >
                  <StepIcon aria-hidden />
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-xs font-bold tracking-wider transition-colors",
                      isActive ? "text-copper" : "text-ink/40"
                    )}
                    dir="ltr"
                  >
                    {pad(i + 1)}
                  </span>
                  <span
                    className={cn(
                      "block text-base font-bold leading-snug transition-colors sm:text-lg",
                      isActive ? "text-ink" : "text-ink/70"
                    )}
                  >
                    {step.title}
                  </span>
                </span>
                <span
                  className={cn(
                    "h-2 w-2 shrink-0 rounded-full transition-all duration-500",
                    isActive ? "scale-100 bg-copper" : "scale-0 bg-ink/20"
                  )}
                  aria-hidden
                />

                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-[3px] bg-ink/[0.05]" aria-hidden>
                    <span
                      key={active}
                      className="block h-full origin-left bg-linear-to-r from-copper to-copper-light rtl:origin-right"
                      style={{
                        animation: `benefit-progress ${STEP_MS}ms linear forwards`,
                        animationPlayState: playing ? "running" : "paused",
                      }}
                      onAnimationEnd={() => setActive((a) => (a + 1) % items.length)}
                    />
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <div
        id="process-panel"
        role="tabpanel"
        className="relative isolate min-h-[22rem] overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-10"
      >
        <motion.div
          className="pointer-events-none absolute -z-10 h-64 w-64 rounded-full blur-3xl"
          animate={{
            background: tone.glow,
            x: active % 2 === 0 ? "10%" : "70%",
            y: active % 2 === 0 ? "5%" : "35%",
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          aria-hidden
        />
        <PatternFan
          className="pointer-events-none absolute bottom-6 start-6 h-16 w-16 text-white opacity-[0.07] sm:h-20 sm:w-20"
          aria-hidden
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] } }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.18, ease: "easeIn" } }}
            className="relative flex h-full flex-col"
          >
            <span
              className="pointer-events-none absolute -top-4 end-0 select-none font-display text-[8rem] font-black leading-none text-white/[0.06] sm:text-[10rem]"
              dir="ltr"
              aria-hidden
            >
              {pad(active + 1)}
            </span>

            <motion.span
              initial={{ scale: 0.6, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg [&_svg]:h-8 [&_svg]:w-8",
                tone.chip
              )}
            >
              <Icon aria-hidden />
            </motion.span>

            <span className="mt-8 text-sm font-semibold tracking-wider text-white/50" dir="ltr">
              {pad(active + 1)} / {pad(items.length)}
            </span>
            <h3 className="mt-2 text-2xl font-extrabold leading-snug sm:text-3xl lg:text-4xl">{item.title}</h3>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/75 sm:text-lg">{item.description}</p>

            <div className="mt-auto flex items-center gap-2 pt-10" aria-hidden>
              {items.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    i === active ? "w-8 bg-white" : "w-1.5 bg-white/25"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
