import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternFan, PatternCross } from "./ui/brand-patterns";
import { journeyImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

const stageColors = ["bg-accent", "bg-copper", "bg-ink", "bg-accent-dark"];

export function JourneyTimeline({ content }: { content: SiteContent }) {
  const milestones = content.journey.milestones;

  return (
    <section id="journey" className="relative overflow-hidden scroll-mt-24 bg-white py-16 sm:py-20">
      <PatternFan
        className="pointer-events-none absolute top-6 start-6 h-14 w-14 text-ink opacity-[0.12] sm:h-20 sm:w-20"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute bottom-10 end-8 h-16 w-16 rotate-12 text-copper opacity-[0.1] sm:h-24 sm:w-24"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading
            eyebrow={content.journey.eyebrow}
            title={content.journey.title}
            highlight={content.brandName}
            align="center"
            className="mx-auto pb-12"
          />
        </Reveal>

        <div className="relative">
          <div
            className="absolute top-7 start-[12.5%] end-[12.5%] hidden h-1 -translate-y-1/2 rounded-full bg-accent/30 lg:block"
            aria-hidden
          />
          <RevealGroup className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone, i) => {
              const image = journeyImage(i);
              return (
                <RevealItem key={milestone.title} className="relative flex flex-col items-center text-center">
                  <span
                    className={cn(
                      "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-extrabold text-white shadow-lg ring-4 ring-white",
                      stageColors[i % stageColors.length]
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative mt-5 h-56 w-full overflow-hidden rounded-2xl shadow-md sm:h-64">
                    {image ? (
                      <Image
                        src={image}
                        alt=""
                        fill
                        unoptimized
                        className="animate-kenburns object-cover"
                      />
                    ) : (
                      <div className={cn("h-full w-full", stageColors[i % stageColors.length])} aria-hidden />
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-ink/0 to-ink/0" aria-hidden />
                  </div>

                  <h3 className="mt-4 text-base font-bold text-ink sm:text-lg">{milestone.title}</h3>
                  <p className="mt-1 text-sm text-brown">{milestone.timing}</p>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg font-bold text-ink sm:text-xl">{content.journey.tagline}</p>
        </div>
      </div>
    </section>
  );
}
