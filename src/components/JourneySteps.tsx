import { Flag, Rocket, ShieldCheck, Trophy } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ScrollRevealContentA, type ScrollRevealItem } from "./ui/scroll-reveal-content-a";
import { PatternFan, PatternCross } from "./ui/brand-patterns";
import { journeyImage } from "@/lib/images";
import type { SiteContent } from "@/lib/content";

const icons = [Flag, Rocket, ShieldCheck, Trophy];
const gradients = [
  "bg-linear-to-br from-accent to-accent-dark",
  "bg-linear-to-br from-copper to-[#e0b0a1]",
  "bg-linear-to-br from-ink to-[#0a3a54]",
  "bg-linear-to-br from-accent-dark to-ink",
];
const tones = [
  {
    text: "text-accent",
    ghost: "text-accent/[0.12]",
    frameGhost: "text-accent/25",
    badge: "bg-accent/15 text-accent-dark border-accent/30",
  },
  {
    text: "text-copper",
    ghost: "text-copper/[0.14]",
    frameGhost: "text-copper/25",
    badge: "bg-copper/15 text-copper border-copper/40",
  },
  {
    text: "text-ink",
    ghost: "text-ink/[0.1]",
    frameGhost: "text-ink/20",
    badge: "bg-ink/10 text-ink border-ink/25",
  },
  {
    text: "text-accent-dark",
    ghost: "text-accent-dark/[0.12]",
    frameGhost: "text-accent-dark/25",
    badge: "bg-accent-dark/15 text-accent-dark border-accent-dark/35",
  },
];

const taglineTones = ["text-ink", "text-copper", "text-accent-dark"];

function ColorfulTagline({ text }: { text: string }) {
  const parts = text.split(/([,،])/).filter((part) => part !== "");
  let clauseIndex = -1;

  return (
    <p className="text-xl font-bold leading-snug sm:text-2xl">
      {parts.map((part, i) => {
        if (part === "," || part === "،") {
          return (
            <span key={i} className="text-brown">
              {part}{" "}
            </span>
          );
        }
        clauseIndex += 1;
        return (
          <span key={i} className={taglineTones[clauseIndex % taglineTones.length]}>
            {part.trim()}
          </span>
        );
      })}
    </p>
  );
}

export function JourneySteps({ content }: { content: SiteContent }) {
  const items: ScrollRevealItem[] = content.journey.milestones.map((milestone, i) => {
    const Icon = icons[i % icons.length];
    return {
      number: String(i + 1).padStart(2, "0"),
      title: milestone.title,
      description: milestone.timing,
      icon: <Icon className="h-28 w-28 text-white/25" strokeWidth={1.25} aria-hidden />,
      gradientClass: gradients[i % gradients.length],
      tone: tones[i % tones.length],
      image: journeyImage(i),
    };
  });

  return (
    <section id="journey" className="relative scroll-mt-24 bg-white pt-16 sm:pt-20">
      <div className="container-amad relative overflow-hidden">
        <PatternFan
          className="pointer-events-none absolute top-4 start-6 h-12 w-12 text-ink opacity-[0.1] sm:h-16 sm:w-16 sm:start-10"
          aria-hidden
        />
        <Reveal>
          <SectionHeading
            eyebrow={content.journey.eyebrow}
            title={content.journey.title}
            highlight={content.brandName}
            align="center"
            className="mx-auto pb-12"
          />
        </Reveal>
      </div>
      <ScrollRevealContentA items={items} />
      <div className="container-amad relative overflow-hidden py-12 text-center">
        <PatternCross
          className="pointer-events-none absolute bottom-2 end-6 h-14 w-14 rotate-6 text-copper opacity-[0.12] sm:h-20 sm:w-20 sm:end-10"
          aria-hidden
        />
        <ColorfulTagline text={content.journey.tagline} />
      </div>
    </section>
  );
}
