import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";

export function Logo({ locale, dark = true }: { locale: Locale; dark?: boolean }) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-3" aria-label="امد">
      <Image
        src={dark ? "/logos/amad-lockup-white-padded.png" : "/logos/amad-lockup-color-padded.png"}
        alt=""
        width={2643}
        height={1415}
        className="h-11 w-auto shrink-0 sm:h-12"
        priority
        unoptimized
      />
      <span className={`h-6 w-px ${dark ? "bg-white/20" : "bg-ink/15"}`} aria-hidden />
      <Image
        src={dark ? "/logos/partners/falak-white.png" : "/logos/partners/falak-black.png"}
        alt="فلك"
        width={470}
        height={237}
        className="h-6 w-auto shrink-0 object-contain"
        unoptimized
      />
    </Link>
  );
}
