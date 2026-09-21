import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { programHeroImage } from "@/lib/images";
import { ProgramDetailView } from "@/components/ProgramDetailView";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const detail = getContent(locale).programDetails.ip;
  return { title: `${detail.title} | Amad`, description: detail.intro };
}

export default async function IpProgramPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const content = getContent(locale);

  return (
    <ProgramDetailView
      locale={locale}
      content={content}
      detail={content.programDetails.ip}
      heroImage={programHeroImage("ip")}
    />
  );
}
