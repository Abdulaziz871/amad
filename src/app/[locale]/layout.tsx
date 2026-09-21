import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, isLocale, dirFor, type Locale } from "@/i18n/config";
import { getContent } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SplashScreen } from "@/components/SplashScreen";
import { SmoothScroll } from "@/components/SmoothScroll";
import "../globals.css";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-ibm-plex-sans-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

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
  const content = getContent(locale);
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      languages: { ar: "/ar", en: "/en" },
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      siteName: content.brandName,
    },
    twitter: {
      card: "summary_large_image",
      title: content.meta.title,
      description: content.meta.description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const content = getContent(locale);

  return (
    <html
      lang={locale}
      dir={dirFor(locale)}
      className={`${ibmPlexSansArabic.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink" suppressHydrationWarning>
        <SmoothScroll />
        <SplashScreen />
        <Header locale={locale} content={content} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} content={content} />
      </body>
    </html>
  );
}
