import { SectionHeading } from "./SectionHeading";
import { ProgramsPathway } from "./ProgramsPathway";
import { Reveal } from "./Reveal";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { programCardImage } from "@/lib/images";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function ProgramsOverview({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section id="programs" className="relative overflow-hidden scroll-mt-24 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternCross
        className="pointer-events-none absolute top-1/3 end-[8%] h-8 w-8 rotate-12 text-accent opacity-[0.16] sm:h-12 sm:w-12"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute bottom-10 end-8 h-11 w-11 -rotate-6 text-copper opacity-[0.22] sm:h-16 sm:w-16"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading
            title={content.nav.programs}
            subtitle={content.programsOverview.subtitle}
            align="center"
            className="mx-auto"
          />
        </Reveal>

        <ProgramsPathway
          locale={locale}
          programs={content.programs}
          labels={content.programsOverview}
          images={Object.fromEntries(content.programs.map((program) => [program.slug, programCardImage(program.slug)]))}
        />
      </div>
    </section>
  );
}

