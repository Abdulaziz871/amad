import { SectionHeading } from "./SectionHeading";
import { ProgramCard } from "./ProgramCard";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternCross, PatternFan, PatternBars } from "./ui/brand-patterns";
import { programCardImage } from "@/lib/images";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function ProgramsOverview({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section id="programs" className="relative overflow-hidden scroll-mt-24 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternBars
        className="pointer-events-none absolute top-6 start-1/4 h-24 w-24 rotate-12 text-ink opacity-[0.05] sm:h-32 sm:w-32"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute bottom-10 end-8 h-11 w-11 -rotate-6 text-copper opacity-[0.22] sm:h-16 sm:w-16"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute top-1/3 end-[8%] h-8 w-8 rotate-12 text-accent opacity-[0.16] sm:h-12 sm:w-12"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading title={content.nav.programs} align="center" className="mx-auto" />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-6 md:grid-cols-3">
          {content.programs.map((program) => (
            <RevealItem key={program.slug} className="h-full">
              <ProgramCard
                program={program}
                locale={locale}
                learnMore={content.programsOverview.learnMore}
                image={programCardImage(program.slug)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
