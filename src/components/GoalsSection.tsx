import { BookOpenCheck, Coins, Cpu, Flag, Network, UsersRound, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternCross } from "./ui/brand-patterns";
import { cn } from "@/lib/utils";
import type { GoalIcon, SiteContent } from "@/lib/content";

const goalIcons: Record<GoalIcon, LucideIcon> = {
  ecosystem: Network,
  nation: Flag,
  value: Coins,
  solutions: Cpu,
  people: UsersRound,
  culture: BookOpenCheck,
};

// Tones rotate navy → copper → violet across the cards.
const tones = [
  { badge: "bg-fg/[0.07] text-fg group-hover:bg-ink group-hover:text-white", bar: "bg-fg", number: "text-fg/15" },
  { badge: "bg-copper/10 text-copper group-hover:bg-copper group-hover:text-white", bar: "bg-copper", number: "text-copper/25" },
  {
    badge: "bg-accent/15 text-accent-dark group-hover:bg-accent group-hover:text-white",
    bar: "bg-accent",
    number: "text-accent/30",
  },
];

export function GoalsSection({ content }: { content: SiteContent }) {
  return (
    <section id="goals" className="relative overflow-hidden scroll-mt-24 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternCross
        className="pointer-events-none absolute top-12 end-6 h-12 w-12 rotate-12 text-copper opacity-[0.16] sm:h-16 sm:w-16 sm:end-10"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading title={content.goals.title} highlight={content.brandName} align="center" className="mx-auto" />
        </Reveal>

        <RevealGroup stagger={0.07} className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {content.goals.items.map((goal, i) => {
            const Icon = goalIcons[goal.icon];
            const tone = tones[i % tones.length];
            return (
              <RevealItem
                key={goal.text}
                className="group relative flex items-start gap-4 overflow-hidden rounded-3xl border border-fg/[0.06] bg-surface p-6 shadow-[0_16px_40px_-32px_rgba(12,35,65,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgba(12,35,65,0.4)] sm:p-7"
              >
                <span
                  className={cn("absolute inset-x-0 top-0 h-1 scale-x-0 ltr:origin-left rtl:origin-right transition-transform duration-500 group-hover:scale-x-100", tone.bar)}
                  aria-hidden
                />
                <span
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-300",
                    tone.badge
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="flex-1 pt-1 text-base font-bold leading-relaxed text-fg sm:text-[1.05rem]">{goal.text}</p>
                <span
                  className={cn("font-display text-3xl font-extrabold leading-none tabular-nums", tone.number)}
                  dir="ltr"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
