import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternCross, PatternFan, PatternBars } from "./ui/brand-patterns";
import { journeyImage, partnerLogo } from "@/lib/images";
import type { SiteContent } from "@/lib/content";

export function PartnersSection({ content }: { content: SiteContent }) {
  const partners = [
    { key: "alinma", ...content.partners.alinma },
    { key: "falak", ...content.partners.falak },
  ];
  const bannerImage = journeyImage(0);

  return (
    <section id="partners" className="relative overflow-hidden py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternBars
        className="pointer-events-none absolute top-8 end-[10%] h-32 w-32 rotate-12 text-ink opacity-[0.05] sm:h-44 sm:w-44"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute top-8 start-6 h-9 w-9 -rotate-12 text-copper opacity-[0.22] sm:h-14 sm:w-14"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute bottom-8 end-6 h-16 w-16 rotate-6 text-accent opacity-[0.1] sm:h-24 sm:w-24"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal>
          <SectionHeading title={content.partners.title} align="center" className="mx-auto" />
        </Reveal>

        <Reveal delay={0.05} className="mt-10 rounded-[1.75rem] bg-linear-to-l from-accent via-copper to-accent-dark p-[2px]">
          <div className="relative min-h-[16rem] overflow-hidden rounded-[calc(1.75rem-2px)] sm:min-h-[19rem]">
            {bannerImage && <Image src={bannerImage} alt="" fill unoptimized className="object-cover" />}
            <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/60 to-ink/20" aria-hidden />

            <div className="absolute inset-0 flex flex-col items-center justify-end gap-8 px-6 py-12 sm:py-16">
              <div className="flex flex-wrap items-center justify-center gap-5 border-y border-white/25 py-2.5 sm:gap-6">
                {partners.flatMap((partner, i) => {
                  const logo = partnerLogo(partner.key, "white");
                  const mark = logo ? (
                    <Image
                      key={partner.name}
                      src={logo}
                      alt={partner.name}
                      width={160}
                      height={48}
                      unoptimized
                      className="h-7 w-auto object-contain sm:h-8"
                    />
                  ) : (
                    <span key={partner.name} className="text-base font-bold text-white/90 sm:text-lg">
                      {partner.name}
                    </span>
                  );
                  return i > 0
                    ? [<span key={`${partner.name}-divider`} className="h-6 w-px bg-white/25" aria-hidden />, mark]
                    : [mark];
                })}
              </div>
              <p className="max-w-xl text-center text-sm leading-relaxed text-white/70 sm:text-base">
                {content.partners.sponsorshipLine}
              </p>
            </div>
          </div>
        </Reveal>

        <RevealGroup className="mt-6 grid gap-6 sm:grid-cols-2">
          {partners.map((partner) => {
            const logo = partnerLogo(partner.key, "white");
            return (
              <RevealItem
                key={partner.name}
                className="spotlight relative rounded-2xl border border-ink/8 bg-cream p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-26px_rgba(12,35,65,0.35)]"
              >
                {logo ? (
                  <>
                    <span className="inline-flex items-center rounded-xl bg-ink px-4 py-2.5">
                      <Image
                        src={logo}
                        alt={partner.name}
                        width={160}
                        height={48}
                        unoptimized
                        className="h-7 w-auto object-contain"
                      />
                    </span>
                    <h3 className="sr-only">{partner.name}</h3>
                  </>
                ) : (
                  <h3 className="text-lg font-bold text-ink">{partner.name}</h3>
                )}
                <p className="mt-3 text-sm leading-relaxed text-brown">{partner.description}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
