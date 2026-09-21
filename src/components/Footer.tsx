import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";
import { PatternBars, PatternCross } from "./ui/brand-patterns";

export function Footer({ locale, content }: { locale: Locale; content: SiteContent }) {
  const links = [
    { href: `/${locale}#about`, label: content.nav.about },
    { href: `/${locale}#programs`, label: content.nav.programs },
    { href: `/${locale}#journey`, label: content.nav.journey },
    { href: `/${locale}#faq`, label: content.nav.faq },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-ink text-white">
      <PatternCross
        className="pointer-events-none absolute -end-6 -top-6 h-28 w-28 rotate-6 text-white opacity-[0.06] sm:h-36 sm:w-36"
        aria-hidden
      />
      <PatternBars
        className="pointer-events-none absolute bottom-8 start-6 h-10 w-10 text-white opacity-[0.08] sm:h-14 sm:w-14"
        aria-hidden
      />
      <div className="container-amad relative grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Image
            src="/logos/amad-lockup-white.png"
            alt={locale === "ar" ? "أمد — من الإنماء" : "Amad — by Alinma"}
            width={2113}
            height={885}
            className="h-14 w-auto"
            unoptimized
          />
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/50">
            {content.footer.quickLinks}
          </p>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/75 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/50">
            {content.footer.registerInterest}
          </p>
          <Link
            href={`/${locale}#interest`}
            className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            {content.footer.registerInterest}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-amad flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/50 sm:flex-row">
          <p>{content.footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
