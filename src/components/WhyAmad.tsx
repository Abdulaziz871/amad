import { Link2, BookOpen, Handshake, LineChart, LayoutGrid, MapPin, Users, GraduationCap, Building2 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { IconBadge, toneForIndex } from "./IconBadge";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { AnimatedCounter } from "./ui/animated-counter";
import type { SiteContent } from "@/lib/content";

const cardIcons = [Link2, BookOpen, Handshake, LineChart];
const statIcons = [LayoutGrid, MapPin, Users, GraduationCap, Building2];

export function WhyAmad({ content }: { content: SiteContent }) {
  return (
    <section id="why-amad" className="relative overflow-hidden bg-white py-14 sm:py-20">
      <PatternFan
        className="pointer-events-none absolute top-6 end-6 h-14 w-14 text-ink opacity-[0.15] sm:h-20 sm:w-20"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 text-copper opacity-[0.06] sm:h-80 sm:w-80"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading
            eyebrow={content.whyAmad.eyebrow}
            title={content.whyAmad.title}
            highlight={content.brandName}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.whyAmad.cards.map((card, i) => (
            <RevealItem
              key={card.title}
              className="group flex flex-col rounded-2xl border border-ink/8 bg-cream p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-ink/0 hover:bg-white hover:shadow-[0_24px_50px_-28px_rgba(0,33,52,0.35)]"
            >
              <IconBadge
                icon={cardIcons[i % cardIcons.length]}
                tone={toneForIndex(i)}
                className="transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
              />
              <h3 className="mt-5 text-base font-bold text-ink transition-colors group-hover:text-accent-dark">
                {card.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brown">{card.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1} className="relative mt-6 overflow-hidden rounded-2xl bg-ink">
          <div className="relative grid sm:grid-cols-5">
            {content.whyAmad.stats.map((stat, i) => {
              const StatIcon = statIcons[i % statIcons.length];
              return (
                <div
                  key={stat.label}
                  className="group flex flex-col items-center gap-2 border-t border-ink/15 px-4 py-7 text-center first:border-t-0 sm:border-t-0 sm:[&:not(:last-child)]:border-e sm:border-ink/15"
                >
                  <StatIcon className="h-5 w-5 text-accent" aria-hidden />
                  <AnimatedCounter
                    value={stat.value}
                    className="font-display text-3xl font-extrabold text-white tabular-nums sm:text-4xl"
                  />
                  <span className="h-0.5 w-6 rounded-full bg-accent/60 transition-all duration-300 group-hover:w-10" aria-hidden />
                  <div className="text-xs leading-snug text-white/60">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
