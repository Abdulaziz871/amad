import { isLocale, locales, type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { galleryImages, ctaImage } from "@/lib/images";
import { Hero } from "@/components/Hero";
import { ProgramsQuickLinks } from "@/components/ProgramsQuickLinks";
import { AboutSection } from "@/components/AboutSection";
import { WhyAmad } from "@/components/WhyAmad";
import { ProgramsOverview } from "@/components/ProgramsOverview";
import { JourneySteps } from "@/components/JourneySteps";
import { GraduatesGallery } from "@/components/GraduatesGallery";
import { PartnersSection } from "@/components/PartnersSection";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function HomePage({
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
      <ProgramsQuickLinks locale={locale} content={content} />
      <AboutSection content={content} />
      <WhyAmad content={content} />
      <ProgramsOverview locale={locale} content={content} />
      <JourneySteps content={content} />
      <GraduatesGallery content={content} images={galleryImages()} />
      <PartnersSection content={content} />
      <Faq title={content.faq.title} items={content.faq.items} />
      <FinalCta content={content} backgroundImage={ctaImage("final")} />
    </>
  );
}
