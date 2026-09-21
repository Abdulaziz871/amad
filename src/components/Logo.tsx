import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";

export function Logo({ locale, dark = true }: { locale: Locale; dark?: boolean }) {
  return (
    <Link
      href={`/${locale}`}
      className="flex items-center gap-2.5"
      aria-label={locale === "ar" ? "" : ""}
    >
      <Image
        src={dark ? "/logos/amad-mark-white.png" : "/logos/amad-mark-color.png"}
        alt=""
        width={2113}
        height={620}
        className="h-7 w-auto shrink-0"
        priority
        unoptimized
      />
      <span className={`text-xl font-extrabold tracking-tight ${dark ? "text-white" : "text-ink"}`}>
        {locale === "ar" ? "" : ""}
      </span>
    </Link>
  );
}
