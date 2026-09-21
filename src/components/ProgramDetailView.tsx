import Image from "next/image";
import { Check, ArrowLeft } from "lucide-react";
import { ButtonLink } from "./Button";
import { IconBadge } from "./IconBadge";
import { ProgramApplicationForm } from "./ProgramApplicationForm";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { HighlightText } from "./HighlightWord";
import { PatternBars, PatternCross } from "./ui/brand-patterns";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { ProgramDetail, SiteContent } from "@/lib/content";
import { programIcons } from "@/lib/program-icons";

const stepColors = ["bg-accent", "bg-copper", "bg-ink", "bg-accent-dark"];

export function ProgramDetailView({
  locale,
  content,
  detail,
  heroImage,
}: {
  locale: Locale;
  content: SiteContent;
  detail: ProgramDetail;
  heroImage?: string | null;
}) {
  const Icon = programIcons[detail.slug];
  const [audienceLabel, ...audienceRest] = detail.audience.split(":");
  const audienceText = audienceRest.join(":").trim();

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <PatternBars
          className="pointer-events-none absolute top-6 end-6 h-14 w-14 text-ink opacity-[0.14] sm:h-20 sm:w-20"
          aria-hidden
        />
        <PatternCross
          className="pointer-events-none absolute -bottom-8 start-[38%] h-32 w-32 -translate-x-1/2 rotate-6 text-copper opacity-[0.08] sm:h-44 sm:w-44"
          aria-hidden
        />
        <div className="container-amad relative grid gap-10 py-10 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal y={20}>
            <ButtonLink
              href={`/${locale}#programs`}
              variant="secondary"
              className="mb-8 px-4 py-2 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5 ltr:rotate-180" aria-hidden />
              {content.nav.programs}
            </ButtonLink>

            <IconBadge icon={Icon} tone="accent" size="lg" />

            <h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              <HighlightText text={detail.title} highlight={content.brandName} />
            </h1>
            <p className="mt-1.5 text-sm font-medium text-brown/70 rtl:text-right ltr:text-left" dir="ltr">
              {detail.englishName}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-brown sm:text-lg">{detail.intro}</p>

            <ButtonLink href="#apply" variant="primary" className="mt-9">
              {detail.cta}
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.15} y={24} className="relative mx-auto hidden w-full max-w-sm lg:block">
            <div className="relative aspect-[4/5] w-full [clip-path:polygon(8%_0%,100%_0%,92%_100%,0%_100%)] bg-linear-to-br from-accent via-accent-dark to-ink drop-shadow-2xl">
              {heroImage ? (
                <Image src={heroImage} alt="" fill unoptimized className="object-cover" />
              ) : (
                <div
                  className="h-full w-full opacity-70"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 75% 70%, rgba(205,144,126,0.5), transparent 40%)",
                  }}
                  aria-hidden
                />
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-12 sm:py-16">
        <div className="container-amad grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <Reveal className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
            <PatternBars
              className="pointer-events-none absolute -end-4 -top-4 h-24 w-24 text-white opacity-[0.1] sm:h-32 sm:w-32"
              aria-hidden
            />
            <IconBadge icon={Icon} tone="accent" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/50">
              {audienceLabel}
            </p>
            <p className="mt-3 text-xl font-semibold leading-relaxed sm:text-2xl">{audienceText}</p>
          </Reveal>

          <Reveal delay={0.1} className="relative flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-cream p-8 sm:p-10">
            <PatternCross
              className="pointer-events-none absolute -bottom-6 -start-6 h-24 w-24 -rotate-6 text-copper opacity-[0.1] sm:h-32 sm:w-32"
              aria-hidden
            />
            <h2 className="relative text-xl font-bold text-ink sm:text-2xl">{detail.benefits.title}</h2>
            <ul className="relative mt-5 divide-y divide-ink/8">
              {detail.benefits.items.map((item) => (
                <li key={item} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden />
                  <span className="text-sm leading-relaxed text-ink sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-12 sm:py-16">
        <PatternCross
          className="pointer-events-none absolute top-4 end-6 h-12 w-12 rotate-12 text-accent opacity-[0.12] sm:h-16 sm:w-16 sm:end-10"
          aria-hidden
        />
        <div className="container-amad relative">
          <Reveal>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">{detail.journey.title}</h2>
          </Reveal>

          <div className="relative mt-12">
            <div
              className="absolute top-6 start-[12.5%] end-[12.5%] hidden h-px bg-ink/12 sm:block"
              aria-hidden
            />
            <RevealGroup className="relative grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4 sm:gap-x-6">
              {detail.journey.steps.map((step, i) => (
                <RevealItem key={step} className="flex flex-col items-center gap-4 text-center">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-extrabold text-white shadow-lg ring-4 ring-cream transition-transform duration-300 hover:scale-110",
                      stepColors[i % stepColors.length]
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold leading-snug text-ink sm:text-base">{step}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <ProgramApplicationForm detail={detail} content={content} />
    </>
  );
}
