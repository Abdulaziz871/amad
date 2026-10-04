import Image from "next/image";
import { Check, ArrowLeft, Network, Route, ScanSearch, Target, type LucideIcon } from "lucide-react";
import { ButtonLink } from "./Button";
import { IconBadge, toneForSlug } from "./IconBadge";
import { ProgramApplicationForm } from "./ProgramApplicationForm";
import { Faq } from "./Faq";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { Tilt } from "./ui/tilt";
import { HighlightText } from "./HighlightWord";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { ProgramJourney } from "./ProgramJourney";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import type { BenefitIcon, ProgramDetail, SiteContent } from "@/lib/content";
import { programIcons } from "@/lib/program-icons";
import type { AlfiaForm } from "@/lib/alfia";

const heroGradient: Record<string, string> = {
  ink: "from-ink via-[#16325a] to-ink",
  copper: "from-copper via-[#ffa38b] to-copper",
  accent: "from-accent via-accent-dark to-ink",
};
const toneText: Record<string, string> = {
  ink: "text-ink",
  copper: "text-copper",
  accent: "text-accent",
};
const toneButton: Record<string, string> = {
  ink: "!bg-ink hover:!bg-[#16325a] !shadow-[0_10px_30px_-10px_rgba(12,35,65,0.5)]",
  copper: "!bg-copper hover:!bg-[#b0603f] !shadow-[0_10px_30px_-10px_rgba(198,110,78,0.5)]",
  accent: "!bg-accent hover:!bg-accent-dark !shadow-[0_10px_30px_-10px_rgba(139,132,215,0.6)]",
};
const toneOnDark: Record<string, string> = {
  ink: "!bg-white/10 !text-white",
  copper: "!bg-copper/20 !text-copper",
  accent: "!bg-accent/20 !text-accent",
};
const toneSoft: Record<string, string> = {
  ink: "bg-ink/[0.07] text-ink",
  copper: "bg-copper/10 text-copper",
  accent: "bg-accent/15 text-accent-dark",
};
const benefitIcons: Record<BenefitIcon, LucideIcon> = {
  asset: ScanSearch,
  market: Target,
  route: Route,
  network: Network,
};

export function ProgramDetailView({
  locale,
  content,
  detail,
  heroImage,
  alfiaForm,
}: {
  locale: Locale;
  content: SiteContent;
  detail: ProgramDetail;
  heroImage?: string | null;
  alfiaForm?: AlfiaForm | null;
}) {
  const Icon = programIcons[detail.slug];
  const tone = toneForSlug(detail.slug);
  const [audienceLabel, ...audienceRest] = detail.audience.split(":");
  const audienceText = audienceRest.join(":").trim();
  // Programs without admission criteria scroll to their details section instead.
  const ctaHref =
    detail.ctaTarget === "criteria" ? (detail.criteria ? "#criteria" : "#details") : "#apply";

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="section-glow section-glow--light" aria-hidden />
        <PatternCross
          className="pointer-events-none absolute bottom-6 start-[38%] h-24 w-24 -translate-x-1/2 rotate-6 text-copper opacity-[0.08] sm:h-32 sm:w-32"
          aria-hidden
        />
        <PatternFan
          className={cn(
            "pointer-events-none absolute top-6 end-6 h-10 w-10 rotate-6 opacity-[0.24] sm:h-14 sm:w-14",
            toneText[tone]
          )}
          aria-hidden
        />
        <div className="container-amad relative grid items-start gap-10 py-8 sm:py-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal y={20} className="lg:pt-8">
            <div className="flex items-center gap-3">
              <IconBadge icon={Icon} tone={tone} />
              <ButtonLink
                href={`/${locale}#programs`}
                variant="secondary"
                className="px-4 py-2 text-xs"
              >
                <ArrowLeft className="h-3.5 w-3.5 ltr:rotate-180" aria-hidden />
                {content.nav.programs}
              </ButtonLink>
            </div>

            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl">
              <HighlightText text={detail.title} highlight={content.brandName} />
            </h1>
            {detail.tagline && (
              <p className={cn("mt-3 text-xl font-bold leading-snug sm:text-2xl", toneText[tone])}>{detail.tagline}</p>
            )}
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-brown sm:text-lg">{detail.intro}</p>
            {locale !== "ar" && (
              <p className="mt-1.5 text-sm font-medium text-brown/70 rtl:text-right ltr:text-left" dir="ltr">
                {detail.englishName}
              </p>
            )}

            <ButtonLink href={ctaHref} variant="primary" className={cn("mt-8", toneButton[tone])}>
              {detail.cta}
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.15} y={24} className="relative mx-auto hidden w-full max-w-lg lg:block">
            <Tilt>
              <div
                className={cn(
                  "animate-float relative aspect-[4/5] w-full [clip-path:polygon(8%_0%,100%_0%,92%_100%,0%_100%)] drop-shadow-2xl",
                  !heroImage && cn("bg-linear-to-br", heroGradient[tone] ?? heroGradient.accent)
                )}
              >
                {heroImage ? (
                  <Image src={heroImage} alt="" fill unoptimized className="object-cover" />
                ) : (
                  <div
                    className="h-full w-full opacity-70"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.35), transparent 35%), radial-gradient(circle at 75% 70%, rgba(198,110,78,0.5), transparent 40%)",
                    }}
                    aria-hidden
                  />
                )}
              </div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      <section id="details" className="relative scroll-mt-24 py-12 sm:py-16">
        <div className="container-amad grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <Reveal className="relative flex flex-col justify-center overflow-hidden rounded-3xl bg-ink p-8 text-white sm:p-10">
            <div className="section-glow section-glow--dark" aria-hidden />
            <PatternFan
              className="pointer-events-none absolute end-5 top-5 h-20 w-20 text-white opacity-[0.08] sm:h-24 sm:w-24"
              aria-hidden
            />
            <PatternCross
              className="pointer-events-none absolute bottom-4 start-4 h-9 w-9 -rotate-6 text-copper opacity-[0.25] sm:h-12 sm:w-12"
              aria-hidden
            />
            <IconBadge icon={Icon} tone={tone} className={toneOnDark[tone]} />
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-white/50">
              {audienceLabel}
            </p>
            <p className="mt-3 text-xl font-semibold leading-relaxed sm:text-2xl">{audienceText}</p>
          </Reveal>

          <Reveal delay={0.1} className="spotlight relative flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-cream p-8 sm:p-10">
            <PatternCross
              className={cn(
                "pointer-events-none absolute bottom-5 end-5 h-16 w-16 -rotate-6 opacity-[0.12] sm:h-20 sm:w-20",
                toneText[tone]
              )}
              aria-hidden
            />
            <h2 className="relative text-xl font-bold text-ink sm:text-2xl">{detail.benefits.title}</h2>
            {detail.benefits.cards ? (
              <ul className="relative mt-5 grid gap-3 sm:grid-cols-2">
                {detail.benefits.cards.map((card) => {
                  const CardIcon = benefitIcons[card.icon];
                  return (
                    <li
                      key={card.title}
                      className="group flex flex-col rounded-2xl border border-ink/[0.06] bg-white p-5 shadow-[0_12px_30px_-26px_rgba(12,35,65,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgba(12,35,65,0.45)]"
                    >
                      <span
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                          toneSoft[tone]
                        )}
                      >
                        <CardIcon className="h-5 w-5" aria-hidden />
                      </span>
                      <h3 className="mt-3.5 text-base font-bold leading-snug text-ink">{card.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-brown">{card.description}</p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="relative mt-5 divide-y divide-ink/8">
                {detail.benefits.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                    <Check className={cn("mt-0.5 h-5 w-5 shrink-0", toneText[tone])} aria-hidden />
                    <span className="text-sm leading-relaxed text-ink sm:text-base">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
        </div>
      </section>

      {detail.criteria && (
        <section id="criteria" className="relative scroll-mt-24 py-12 sm:py-16">
          <div className="container-amad">
            <Reveal>
              <SectionHeading
                title={detail.criteria.title}
                subtitle={detail.criteria.subtitle}
                align="center"
                className="mx-auto"
              />
            </Reveal>

            <RevealGroup
              stagger={0.07}
              className={cn(
                "mt-10 grid gap-4 sm:gap-5 md:grid-cols-2",
                detail.criteria.items.length % 3 === 0 && "lg:grid-cols-3"
              )}
            >
              {detail.criteria.items.map((item, i) => (
                <RevealItem
                  key={item.title}
                  className="spotlight group relative flex flex-col rounded-3xl border border-ink/[0.06] bg-white p-7 shadow-[0_16px_40px_-32px_rgba(12,35,65,0.3)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-32px_rgba(12,35,65,0.4)] sm:p-8"
                >
                  <span
                    className={cn("font-display text-4xl font-extrabold leading-none opacity-80", toneText[tone])}
                    dir="ltr"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-lg font-bold leading-snug text-ink sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brown sm:text-base">{item.description}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        </section>
      )}

      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="section-glow section-glow--light" aria-hidden />
        <PatternCross
          className={cn(
            "pointer-events-none absolute top-4 end-6 h-9 w-9 rotate-12 opacity-[0.2] sm:h-14 sm:w-14 sm:end-10",
            toneText[tone]
          )}
          aria-hidden
        />
        <div className="container-amad relative">
          <Reveal>
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">{detail.journey.title}</h2>
          </Reveal>

          <ProgramJourney slug={detail.slug} steps={detail.journey.steps} locale={locale} />
        </div>
      </section>

      {detail.faq && detail.faq.length > 0 && <Faq title={content.faq.title} items={detail.faq} />}

      {detail.showApplicationForm !== false && (
        <ProgramApplicationForm detail={detail} content={content} tone={tone} locale={locale} alfiaForm={alfiaForm} />
      )}
    </>
  );
}
