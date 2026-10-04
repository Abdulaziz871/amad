"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FileEdit,
  ScanSearch,
  ShieldCheck,
  Rocket,
  Send,
  MapPin,
  Hammer,
  Trophy,
  ClipboardCheck,
  LineChart,
  Users,
  Award,
  ArrowLeft,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { JourneyStep, ProgramSlug } from "@/lib/content";

const stageLabels: Record<Locale, string[]> = {
  ar: ["المرحلة الأولى", "المرحلة الثانية", "المرحلة الثالثة", "المرحلة الرابعة"],
  en: ["Stage one", "Stage two", "Stage three", "Stage four"],
};

function stageLabel(locale: Locale, i: number) {
  const labels = stageLabels[locale];
  return labels[i] ?? labels[labels.length - 1];
}

interface JourneyProps {
  steps: JourneyStep[];
  locale: Locale;
}

/* ---------------------------------------------------------------------------------------------
 * Amad IP — horizontal expanding panels. The chosen stage widens to reveal its details.
 * ------------------------------------------------------------------------------------------- */
const ipIcons: LucideIcon[] = [FileEdit, ScanSearch, ShieldCheck, Rocket];

function IPJourney({ steps, locale }: JourneyProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-10">
      <div className="mb-5 grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
        {steps.map((step, i) => (
          <div key={step.title} className="h-1 overflow-hidden rounded-full bg-fg/10">
            <motion.div
              className="h-full rounded-full bg-ink"
              initial={false}
              animate={{ width: i <= active ? "100%" : "0%" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:h-[19rem] lg:flex-row">
        {steps.map((step, i) => {
          const Icon = ipIcons[i % ipIcons.length];
          const isActive = i === active;
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              aria-expanded={isActive}
              className={cn(
                "group relative flex flex-col overflow-hidden rounded-3xl border p-6 text-start outline-none transition-all duration-500 ease-out sm:p-7",
                isActive
                  ? "border-transparent bg-ink text-white lg:flex-[3]"
                  : "border-fg/8 bg-surface text-fg hover:border-fg/30 lg:flex-1"
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500",
                  isActive ? "bg-white/12 text-white" : "bg-fg/8 text-fg"
                )}
              >
                <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>

              <span className="mt-6 flex flex-col lg:mt-auto">
                <span className={cn("text-xs font-semibold", isActive ? "text-copper" : "text-fg/45")}>
                  {stageLabel(locale, i)}
                </span>
                <span className="mt-1.5 text-lg font-bold leading-snug sm:text-xl">{step.title}</span>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      key="description"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.15, duration: 0.35 } }}
                      exit={{ opacity: 0, transition: { duration: 0.1 } }}
                      className="mt-3 block max-w-md text-sm leading-relaxed text-white/75 sm:text-base"
                    >
                      {step.description}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Ruwad Amad — vertical alternating timeline. The road fills up to the chosen stage.
 * Connector segments live in the gaps between nodes, never behind them.
 * ------------------------------------------------------------------------------------------- */
const ruwadIcons: LucideIcon[] = [Send, MapPin, Hammer, Trophy];

function RuwadJourney({ steps, locale }: JourneyProps) {
  const [active, setActive] = useState(0);

  return (
    <ol className="mx-auto mt-12 max-w-4xl">
      {steps.map((step, i) => {
        const Icon = ruwadIcons[i % ruwadIcons.length];
        const isActive = i === active;
        const reached = i <= active;
        const isLast = i === steps.length - 1;
        const onEnd = i % 2 === 1;
        return (
          <li
            key={step.title}
            className="grid grid-cols-[3rem_minmax(0,1fr)] gap-x-5 pb-10 last:pb-0 lg:grid-cols-[minmax(0,1fr)_4rem_minmax(0,1fr)] lg:gap-x-8"
          >
            <div className="relative col-start-1 row-start-1 flex justify-center lg:col-start-2">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={step.title}
                className={cn(
                  "relative z-10 flex h-12 w-12 items-center justify-center rounded-full outline-none transition-all duration-300",
                  reached ? "bg-copper text-white" : "bg-copper/12 text-copper",
                  isActive && "scale-110 ring-4 ring-copper/25"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
              </button>
              {!isLast && (
                <span className="absolute top-[3.75rem] -bottom-8 w-[3px] overflow-hidden rounded-full bg-copper/15" aria-hidden>
                  <motion.span
                    className="absolute inset-x-0 top-0 block rounded-full bg-copper"
                    initial={false}
                    animate={{ height: i < active ? "100%" : "0%" }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                  />
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "col-start-2 row-start-1 rounded-2xl border p-5 text-start outline-none transition-all duration-300 sm:p-6",
                onEnd ? "lg:col-start-3" : "lg:col-start-1 lg:text-end",
                isActive ? "border-transparent bg-copper text-white shadow-lg" : "border-fg/8 bg-surface hover:border-copper/50"
              )}
            >
              <span className={cn("block text-xs font-semibold", isActive ? "text-white/75" : "text-copper")}>
                {stageLabel(locale, i)}
              </span>
              <span className={cn("mt-1.5 block text-lg font-bold leading-snug", isActive ? "text-white" : "text-fg")}>
                {step.title}
              </span>
              <span className={cn("mt-2 block text-sm leading-relaxed", isActive ? "text-white/85" : "text-brown")}>
                {step.description}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------------------------------------------------------------------------
 * Venture Clinic — stage list beside a large showcase panel, with previous / next controls.
 * ------------------------------------------------------------------------------------------- */
const clinicIcons: LucideIcon[] = [ClipboardCheck, LineChart, Users, Award];

function ClinicJourney({ steps, locale }: JourneyProps) {
  const [active, setActive] = useState(0);
  const n = steps.length;
  const current = steps[active];
  const CurrentIcon = clinicIcons[active % clinicIcons.length];
  const prevLabel = locale === "ar" ? "المرحلة السابقة" : "Previous stage";
  const nextLabel = locale === "ar" ? "المرحلة التالية" : "Next stage";

  return (
    <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-stretch">
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const Icon = clinicIcons[i % clinicIcons.length];
          const isActive = i === active;
          return (
            <button
              key={step.title}
              type="button"
              onClick={() => setActive(i)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-4 rounded-2xl border p-4 text-start outline-none transition-all duration-300",
                isActive ? "border-accent/50 bg-surface shadow-md" : "border-transparent hover:bg-surface/70"
              )}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 rotate-45 items-center justify-center rounded-xl transition-colors duration-300",
                  isActive ? "bg-accent text-white" : "bg-accent/12 text-accent-dark"
                )}
              >
                <Icon className="h-5 w-5 -rotate-45" strokeWidth={1.8} aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={cn("block text-xs font-semibold", isActive ? "text-accent-dark" : "text-fg/40")}>
                  {stageLabel(locale, i)}
                </span>
                <span className={cn("block text-base font-bold leading-snug", isActive ? "text-fg" : "text-fg/60")}>
                  {step.title}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative flex min-h-[20rem] flex-col overflow-hidden rounded-3xl bg-accent p-8 text-white sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1"
          >
            <span className="flex h-14 w-14 rotate-45 items-center justify-center rounded-2xl bg-white/15">
              <CurrentIcon className="h-7 w-7 -rotate-45" strokeWidth={1.75} aria-hidden />
            </span>
            <p className="mt-8 text-sm font-semibold text-white/70">{stageLabel(locale, active)}</p>
            <h3 className="mt-2 text-2xl font-bold leading-snug sm:text-3xl">{current.title}</h3>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">{current.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActive((a) => Math.max(0, a - 1))}
            disabled={active === 0}
            aria-label={prevLabel}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white/15 disabled:opacity-35"
          >
            <ArrowRight className="h-5 w-5 ltr:rotate-180" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setActive((a) => Math.min(n - 1, a + 1))}
            disabled={active === n - 1}
            aria-label={nextLabel}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-accent-dark transition-colors hover:bg-surface/90 disabled:opacity-35"
          >
            <ArrowLeft className="h-5 w-5 ltr:rotate-180" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProgramJourney({ slug, steps, locale }: { slug: ProgramSlug; steps: JourneyStep[]; locale: Locale }) {
  if (slug === "ip") return <IPJourney steps={steps} locale={locale} />;
  if (slug === "bootcamps") return <RuwadJourney steps={steps} locale={locale} />;
  return <ClinicJourney steps={steps} locale={locale} />;
}
