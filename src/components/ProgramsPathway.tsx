"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, Check, Lock, MousePointerClick } from "lucide-react";
import { programIcons } from "@/lib/program-icons";
import type { Locale } from "@/i18n/config";
import type { ProgramSlug, ProgramSummary, SiteContent } from "@/lib/content";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4500;
const ease = [0.21, 0.47, 0.32, 0.98] as const;

// Entry cards sit in a two-column grid, so their centres land at x = 100 / 300 (mirrored in RTL); a feeder's curve meets the gate at x = 200.
const funnelPaths = ["M100 0 C100 60 200 40 200 100", "M300 0 C300 60 200 40 200 100"];
const columnCentres = ["start-1/4", "start-3/4"];

type Labels = SiteContent["programsOverview"];

export function ProgramsPathway({
  locale,
  programs,
  labels,
  images,
}: {
  locale: Locale;
  programs: ProgramSummary[];
  labels: Labels;
  images: Partial<Record<ProgramSlug, string | null>>;
}) {
  const openPrograms = programs.filter((program) => program.access === "open");
  const qualified = programs.find((program) => program.access === "qualified");
  const [selected, setSelected] = useState<ProgramSlug>(programs[0].slug);
  const [autoplay, setAutoplay] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!autoplay || reduceMotion) return;
    const order = programs.map((program) => program.slug);
    const id = window.setInterval(() => {
      setSelected((current) => order[(order.indexOf(current) + 1) % order.length]);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplay, reduceMotion, programs]);

  const choose = (slug: ProgramSlug) => {
    setAutoplay(false);
    setSelected(slug);
  };

  const feeders = qualified?.qualifiesFrom ?? [];
  const clinicSelected = selected === qualified?.slug;
  // The route to the clinic lights up when the clinic or one of the programs feeding it is selected.
  const routeOn = clinicSelected || feeders.includes(selected);
  const current = programs.find((program) => program.slug === selected) ?? programs[0];

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
      {/* The map: open programs on top; only feeder programs connect through the qualification gate to the clinic. */}
      <div className="relative rounded-[2rem] bg-surface/70 p-4 shadow-[0_24px_60px_-35px_rgba(12,35,65,0.35)] ring-1 ring-fg/5 backdrop-blur sm:p-6">
        <StepLabel index={1} text={labels.steps.apply} />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
          {openPrograms.map((program) => (
            <ProgramNode
              key={program.slug}
              program={program}
              image={images[program.slug]}
              status={labels.statusOpen}
              selected={selected === program.slug}
              dimmed={selected !== program.slug && !(clinicSelected && feeders.includes(program.slug))}
              onSelect={() => choose(program.slug)}
            />
          ))}
        </div>

        {qualified && (
          <>
            <div className="relative h-16 sm:h-20" aria-hidden>
              <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full rtl:-scale-x-100">
                {openPrograms.map((program, i) =>
                  feeders.includes(program.slug) ? (
                    <g key={program.slug}>
                      <path
                        d={funnelPaths[i]}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeDasharray="4 8"
                        vectorEffect="non-scaling-stroke"
                        className="text-fg/20"
                      />
                      {/* No non-scaling-stroke here: it breaks the pathLength draw animation in Chrome. */}
                      <motion.path
                        d={funnelPaths[i]}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={4}
                        strokeLinecap="round"
                        className="text-copper"
                        initial={false}
                        animate={{ pathLength: routeOn ? 1 : 0, opacity: routeOn ? 1 : 0 }}
                        transition={{ duration: routeOn ? 0.6 : 0.25, ease }}
                      />
                    </g>
                  ) : null
                )}
              </svg>
              {openPrograms.map((program, i) =>
                feeders.includes(program.slug) ? null : (
                  <span
                    key={program.slug}
                    className={cn(
                      "absolute top-3 whitespace-nowrap rounded-full bg-fg/5 px-3 py-1 text-[0.7rem] font-semibold text-fg/55 ltr:-translate-x-1/2 rtl:translate-x-1/2",
                      columnCentres[i]
                    )}
                  >
                    {labels.standalone}
                  </span>
                )
              )}
            </div>

            <div className="flex flex-col items-center">
              <StepLabel index={2} text={labels.steps.qualify} centered />
              <div className="relative mt-2">
                {routeOn && (
                  <motion.span
                    key={`pulse-${selected}`}
                    className="absolute inset-0 rounded-full bg-copper"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.35, opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
                    aria-hidden
                  />
                )}
                <span
                  className={cn(
                    "relative inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 text-xs font-bold transition-colors duration-300 sm:text-sm",
                    routeOn
                      ? "border-copper bg-copper text-white shadow-lg shadow-copper/30 delay-500"
                      : "border-dashed border-fg/20 bg-surface text-fg/50"
                  )}
                >
                  <Check className="h-4 w-4" aria-hidden />
                  {labels.pathwayNote}
                </span>
              </div>
              <div className="relative h-8 w-1 overflow-hidden rounded-full bg-fg/10 sm:h-10" aria-hidden>
                <motion.span
                  key={routeOn ? selected : "off"}
                  className="absolute inset-0 origin-top rounded-full bg-copper"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: routeOn ? 1 : 0 }}
                  transition={{ duration: 0.35, delay: routeOn ? 0.7 : 0, ease }}
                />
              </div>
            </div>

            <StepLabel index={3} text={labels.steps.grow} centered className="mb-3" />
            <ProgramNode
              program={qualified}
              image={images[qualified.slug]}
              status={labels.statusQualified}
              selected={clinicSelected}
              dimmed={!routeOn}
              glowDelay={1}
              wide
              onSelect={() => choose(qualified.slug)}
            />
          </>
        )}

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs font-medium text-brown/70">
          <MousePointerClick className="h-3.5 w-3.5" aria-hidden />
          {labels.hint}
        </p>
      </div>

      {/* Details of whichever program is selected on the map. */}
      <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-ink text-white shadow-[0_24px_60px_-30px_rgba(12,35,65,0.6)]" aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.slug}
            className="flex h-full flex-col"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease }}
          >
            <ProgramDetail
              program={current}
              locale={locale}
              image={images[current.slug]}
              labels={labels}
            />
          </motion.div>
        </AnimatePresence>
        {autoplay && !reduceMotion && (
          <motion.span
            key={`progress-${selected}`}
            className="absolute inset-x-0 top-0 h-1 origin-left bg-copper rtl:origin-right"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: AUTOPLAY_MS / 1000, ease: "linear" }}
            aria-hidden
          />
        )}
      </div>
    </div>
  );
}

function StepLabel({
  index,
  text,
  centered,
  className,
}: {
  index: number;
  text: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2 text-xs font-bold text-fg/60", centered && "justify-center", className)}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[0.65rem] text-white tabular-nums">
        {index}
      </span>
      {text}
    </div>
  );
}

function ProgramNode({
  program,
  image,
  status,
  selected,
  dimmed,
  wide,
  glowDelay = 0,
  onSelect,
}: {
  program: ProgramSummary;
  image?: string | null;
  status: string;
  selected: boolean;
  dimmed: boolean;
  wide?: boolean;
  glowDelay?: number;
  onSelect: () => void;
}) {
  const Icon = programIcons[program.slug];
  const open = program.access === "open";

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative isolate flex w-full flex-col justify-end overflow-hidden rounded-2xl p-3 text-start text-white outline-none transition-[filter,opacity] duration-300 focus-visible:ring-2 focus-visible:ring-copper sm:p-4",
        wide ? "h-32 sm:h-36" : "h-36 sm:h-44",
        dimmed && "opacity-60 saturate-50 hover:opacity-90 hover:saturate-100"
      )}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: selected
          ? "0 0 0 3px var(--color-copper), 0 18px 40px -18px rgba(198,110,78,0.75)"
          : "0 0 0 0px rgba(0,0,0,0), 0 12px 30px -20px rgba(12,35,65,0.5)",
      }}
      transition={{ duration: 0.3, delay: selected ? glowDelay : 0 }}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          unoptimized
          className="-z-20 object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 -z-20 bg-linear-to-br from-ink to-[#16325a]" aria-hidden />
      )}
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/60 to-ink/10" aria-hidden />

      <span
        className={cn(
          "absolute top-2.5 end-2.5 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[0.65rem] font-bold backdrop-blur-md sm:top-3 sm:end-3 sm:text-xs",
          open ? "bg-surface/90 text-fg" : "border border-white/25 bg-ink/50 text-white"
        )}
      >
        {open ? (
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
        ) : (
          <Lock className="h-3 w-3" aria-hidden />
        )}
        {status}
      </span>

      <span className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md [&_svg]:h-4 [&_svg]:w-4">
        <Icon aria-hidden />
      </span>
      <span className="text-sm font-bold leading-snug sm:text-base">{program.title}</span>
    </motion.button>
  );
}

function ProgramDetail({
  program,
  locale,
  image,
  labels,
}: {
  program: ProgramSummary;
  locale: Locale;
  image?: string | null;
  labels: Labels;
}) {
  const open = program.access === "open";

  return (
    <>
      <div className="relative h-44 shrink-0 sm:h-52">
        {image && <Image src={image} alt="" fill unoptimized className="object-cover" />}
        <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-transparent" aria-hidden />
      </div>
      <div className="-mt-10 flex flex-1 flex-col p-6 sm:p-7">
        <span
          className={cn(
            "relative inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold",
            open ? "bg-emerald-500/15 text-emerald-300" : "bg-copper/20 text-copper-light"
          )}
        >
          {open ? <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden /> : <Lock className="h-3 w-3" aria-hidden />}
          {open ? labels.statusOpen : labels.pathwayNote}
        </span>
        <h3 className="relative mt-3 text-2xl font-bold leading-snug">{program.title}</h3>
        <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-white/75">{program.description}</p>
        <ul className="mt-4 space-y-1.5">
          {program.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-xs leading-relaxed text-white/85">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-copper-light" aria-hidden />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <Link
            href={`/${locale}/programs/${program.slug}`}
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:gap-2.5",
              open ? "bg-copper text-white" : "bg-surface text-fg"
            )}
          >
            {open ? program.cta : labels.learnMore}
            <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}
