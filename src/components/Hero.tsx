import Image from "next/image";
import { ButtonLink } from "./Button";
import { VideoButton } from "./VideoButton";
import { Reveal } from "./Reveal";
import { Tilt } from "./ui/tilt";
import { HighlightText } from "./HighlightWord";
import { TonedText } from "./TonedText";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function Hero({ locale, content }: { locale: Locale; content: SiteContent }) {
  return (
    <section className="relative overflow-hidden">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternCross
        className="pointer-events-none absolute left-1/2 top-[74%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rotate-12 text-accent opacity-[0.16] sm:h-28 sm:w-28"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute top-6 end-6 h-11 w-11 rotate-12 text-copper opacity-25 sm:h-16 sm:w-16"
        aria-hidden
      />
      <div className="container-amad relative grid items-start gap-10 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-10">
        <Reveal y={20}>
          <h1 className="text-3xl font-extrabold leading-[1.2] text-fg sm:text-4xl lg:text-5xl">
            <HighlightText text={content.hero.title} highlight={content.hero.titleHighlight} />
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-brown sm:text-lg">
            <TonedText text={content.hero.subtitle} highlights={content.hero.subtitleHighlights} />
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <ButtonLink href={`/${locale}/programs/bootcamps#apply`} variant="primary">
              {content.hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={`/${locale}#programs`} variant="secondary">
              {content.hero.ctaSecondary}
            </ButtonLink>
            <VideoButton
              label={content.hero.ctaVideo}
              closeLabel={content.hero.closeVideo}
              src="/images/vid/amad-tech-ceremony.mp4"
              className="border border-fg/20 bg-surface/60 py-0.5 ps-0.5 transition-all hover:border-fg/40 hover:bg-surface"
            />
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
