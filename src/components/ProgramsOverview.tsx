import { SectionHeading } from "./SectionHeading";
import { ProgramsPathway } from "./ProgramsPathway";
import { Reveal } from "./Reveal";
import { ButtonLink } from "./Button";
import { ArrowLeft, Sparkles } from "lucide-react";
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

        {/* Teaser for upcoming programs. */}
        <Reveal className="mt-6">
          <div className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-[2rem] border-2 border-dashed border-copper/30 bg-white/60 px-5 py-6 text-center backdrop-blur transition-colors duration-300 hover:border-copper/60 sm:flex-row sm:gap-6 sm:px-7 sm:text-start">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="whitespace-nowrap font-display text-3xl font-extrabold leading-tight text-copper sm:text-4xl">
                {content.programsOverview.comingSoon.label}
              </span>
              <span className="hidden h-10 w-px bg-ink/10 sm:block" aria-hidden />
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-copper/10 text-copper transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
            </div>
            <p className="flex-1 text-base font-bold leading-snug text-ink sm:text-lg">
              {content.programsOverview.comingSoon.text}
            </p>
            <ButtonLink href={`/${locale}#interest`} variant="primary" className="shrink-0">
              {content.programsOverview.comingSoon.cta}
              <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

