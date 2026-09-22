import Image from "next/image";
import { ButtonLink } from "./Button";
import { Reveal } from "./Reveal";
import { HighlightText } from "./HighlightWord";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function Hero({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <PatternFan
        className="pointer-events-none absolute top-6 end-6 h-14 w-14 text-ink opacity-25 sm:h-20 sm:w-20"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute left-1/2 top-[74%] h-32 w-32 -translate-x-1/2 -translate-y-1/2 text-copper opacity-[0.09] sm:h-44 sm:w-44"
        aria-hidden
      />
      <div className="container-amad relative grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <Reveal y={20}>
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

        <Reveal delay={0.15} y={24} className="relative mx-auto w-full max-w-md">
          <div className="aspect-[4/5] w-full [clip-path:polygon(8%_0%,100%_0%,92%_100%,0%_100%)] drop-shadow-2xl">
            <Image
              src="/images/main.jpg"
              alt=""
              width={1200}
              height={1500}
              className="h-full w-full object-cover"
              priority
              unoptimized
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
