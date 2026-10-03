import { Briefcase, Presentation, Handshake, TrendingUp, Users, Rocket } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { ProcessShowcase } from "./ProcessShowcase";
import { PatternBars, PatternCross, PatternFan } from "./ui/brand-patterns";
import { AnimatedCounter } from "./ui/animated-counter";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

const statIcons = [Briefcase, Presentation, Handshake, TrendingUp, Users, Rocket];
const statTones = [
  { text: "text-accent", icon: "bg-accent/10 text-accent-dark" },
  { text: "text-copper", icon: "bg-copper-light/20 text-copper" },
];
// 756% customer growth is the headline number, so it leads the panel.
const FEATURED_STAT = 3;

export function WhyAmad({ content }: { content: SiteContent }) {
  const stats = content.whyAmad.stats;
  const featured = stats[FEATURED_STAT] ?? stats[0];
  const rest = stats.map((stat, index) => ({ stat, index })).filter(({ stat }) => stat !== featured);

  return (
    <section id="why-amad" className="relative overflow-hidden py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternFan
        className="pointer-events-none absolute top-6 end-6 h-10 w-10 rotate-12 text-accent opacity-[0.2] sm:h-14 sm:w-14"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute top-10 start-8 h-28 w-28 -rotate-6 text-ink opacity-[0.06] sm:h-40 sm:w-40"
        aria-hidden
      />
      <PatternBars
        className="pointer-events-none absolute bottom-6 start-6 h-8 w-8 rotate-6 text-copper opacity-[0.14] sm:h-10 sm:w-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading
            title={content.whyAmad.title}
            highlight={content.brandName}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <Reveal delay={0.05} className="mt-10">
          <ProcessShowcase items={content.whyAmad.cards} />
        </Reveal>

        <Reveal className="mt-14 sm:mt-16">
          <div className="grid overflow-hidden rounded-[2.5rem] border border-ink/[0.06] bg-white shadow-[0_24px_60px_-45px_rgba(12,35,65,0.3)] lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative isolate flex flex-col overflow-hidden bg-linear-to-br from-accent/[0.04] via-white to-copper-light/[0.07] p-8 sm:p-10 lg:p-12">
              <PatternCross
                className="pointer-events-none absolute bottom-8 end-8 h-16 w-16 rotate-12 text-accent opacity-[0.14] sm:h-20 sm:w-20"
                aria-hidden
              />
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink/70 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-copper" aria-hidden />
                {content.whyAmad.statsTitle}
              </span>

              <div className="mt-auto pt-12">
                <AnimatedCounter
                  value={featured.value}
                  className="block font-display text-6xl font-extrabold leading-none text-ink tabular-nums sm:text-7xl rtl:text-right ltr:text-left"
                  affixClassName="text-copper"
                />
                <p className="mt-5 max-w-xs text-lg font-bold leading-snug text-ink/80 sm:text-xl">{featured.label}</p>
                <span className="mt-6 flex items-center gap-1.5" aria-hidden>
                  <span className="h-1.5 w-12 rounded-full bg-copper" />
                  <span className="h-1.5 w-5 rounded-full bg-accent" />
                  <span className="h-1.5 w-2 rounded-full bg-ink/15" />
                </span>
              </div>
            </div>

            <RevealGroup stagger={0.07} className="flex flex-col divide-y divide-ink/[0.07] p-6 sm:p-8 lg:p-10">
              {rest.map(({ stat, index }) => {
                const StatIcon = statIcons[index % statIcons.length];
                const tone = statTones[index % statTones.length];
                return (
                  <RevealItem key={stat.label} className="group flex items-center gap-5 py-5 first:pt-0 last:pb-0 sm:gap-7">
                    <AnimatedCounter
                      value={stat.value}
                      className="w-24 shrink-0 font-display text-3xl font-extrabold leading-none text-ink tabular-nums sm:w-32 sm:text-4xl rtl:text-right ltr:text-left"
                      affixClassName={tone.text}
                    />
                    <p className="flex-1 text-sm font-medium leading-relaxed text-ink/70 sm:text-base">{stat.label}</p>
                    <span
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:scale-110",
                        tone.icon
                      )}
                    >
                      <StatIcon className="h-5 w-5" aria-hidden />
                    </span>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
