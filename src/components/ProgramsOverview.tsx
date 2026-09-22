import { SectionHeading } from "./SectionHeading";
import { ProgramCard } from "./ProgramCard";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { programHeroImage } from "@/lib/images";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function ProgramsOverview({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section id="programs" className="relative overflow-hidden scroll-mt-24 bg-cream py-14 sm:py-20">
      <PatternCross
        className="pointer-events-none absolute -top-8 start-1/4 h-24 w-24 rotate-12 text-accent opacity-[0.08] sm:h-32 sm:w-32"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute bottom-10 end-8 h-14 w-14 text-ink opacity-[0.12] sm:h-20 sm:w-20"
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
                image={programHeroImage(program.slug)}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
