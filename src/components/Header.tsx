"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { ButtonLink } from "./Button";
import type { Locale } from "@/i18n/config";
import type { SiteContent } from "@/lib/content";

export function Header({ locale, content }: { locale: Locale; content: SiteContent }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const otherHref = pathname ? pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}` : `/${otherLocale}`;

  const links = [
    { href: `/${locale}#about`, label: content.nav.about },
    { href: `/${locale}#programs`, label: content.nav.programs },
    { href: `/${locale}#journey`, label: content.nav.journey },
    { href: `/${locale}#faq`, label: content.nav.faq },
    { href: `/${locale}#gallery`, label: content.nav.gallery },
  ];

  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="container-amad flex items-center justify-between py-4">
        <Logo locale={locale} />

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={otherHref}
            className="flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-2 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            <Globe className="h-4 w-4" aria-hidden />
            {content.nav.langSwitch}
          </Link>
          <ButtonLink href={`/${locale}#interest`} variant="primary">
            {content.nav.registerInterest}
          </ButtonLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink lg:hidden">
          <div className="container-amad flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-white/85 hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={otherHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-3 text-sm font-medium text-white/85 hover:bg-white/5"
            >
              <Globe className="h-4 w-4" aria-hidden />
              {content.nav.langSwitch}
            </Link>
            <ButtonLink href={`/${locale}#interest`} variant="primary" className="mt-2 w-full">
              {content.nav.registerInterest}
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
