import Image from "next/image";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";
import { Tilt } from "./ui/tilt";
import { HighlightText } from "./HighlightWord";
import { PatternBars, PatternCross, PatternFan } from "./ui/brand-patterns";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function Hero({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section className="relative overflow-hidden">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternBars
        className="pointer-events-none absolute bottom-8 start-6 h-40 w-40 -rotate-6 text-ink opacity-[0.05] sm:h-56 sm:w-56"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute top-6 end-6 h-11 w-11 rotate-12 text-copper opacity-25 sm:h-16 sm:w-16"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute left-1/2 top-[74%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-12 text-accent opacity-[0.16] sm:h-28 sm:w-28"
        aria-hidden
      />
      <div className="container-amad relative grid items-start gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-10">
        <Reveal y={20} className="lg:pt-10">
          <span className="inline-flex items-center rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-brown">
            {content.hero.eyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] text-ink sm:text-5xl lg:text-[3.25rem]">
            <HighlightText text={content.hero.title} highlight={content.hero.titleHighlight} />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-brown sm:text-lg">
            {content.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href={`/${locale}#interest`} variant="primary">
              {content.hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={`/${locale}#programs`} variant="secondary">
              {content.hero.ctaSecondary}
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={0.15} y={24} className="relative mx-auto w-full max-w-xl">
          <Tilt>
            <div className="animate-float aspect-[4/5] w-full [clip-path:polygon(8%_0%,100%_0%,92%_100%,0%_100%)] drop-shadow-2xl">
              <Image
                src="/images/main/hero.png"
                alt=""
                width={1606}
                height={2768}
                className="h-full w-full object-cover"
                priority
                unoptimized
              />
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
}
