import { isLocale, locales, type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { galleryImages, ctaImage, partnerLogo } from "@/lib/images";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { WhyAmad } from "@/components/WhyAmad";
import { ProgramsOverview } from "@/components/ProgramsOverview";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { GraduatesGallery } from "@/components/GraduatesGallery";
import { PartnersSection } from "@/components/PartnersSection";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Alternate homepage (design B): same sections as the main homepage, but the
 * journey is shown as a single horizontal timeline with all stages visible at
 * once, instead of the sticky scroll-reveal used on the main homepage.
 */
export default async function HomePageV2({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const content = getContent(locale);

  return (
    <>
      <Hero locale={locale} content={content} />
      <AboutSection content={content} />
      <WhyAmad content={content} />
      <ProgramsOverview locale={locale} content={content} />
      <JourneyTimeline content={content} />
      <GraduatesGallery
        content={content}
        images={galleryImages()}
        alinmaLogo={partnerLogo("alinma", "white")}
        falakLogo={partnerLogo("falak", "white")}
      />
      <PartnersSection content={content} />
      <Faq title={content.faq.title} items={content.faq.items} />
      <FinalCta content={content} backgroundImage={ctaImage("final")} />
    </>
  );
}
