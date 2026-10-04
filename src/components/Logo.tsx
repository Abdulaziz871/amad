import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";

/**
 * Amad × Falak lockup.
 * - dark (default): white marks, for navy backgrounds.
 * - adaptive: white marks in light mode, colour marks in dark mode (for the header, which flips to white).
 */
export function Logo({
  locale,
  dark = true,
  adaptive = false,
}: {
  locale: Locale;
  dark?: boolean;
  adaptive?: boolean;
}) {
  return (
    <Link href={`/${locale}`} className="flex items-center gap-3" aria-label="امد">
      {adaptive ? (
        <>
          <LogoMarks white className="flex items-center gap-3 dark:hidden" />
          <LogoMarks white={false} className="hidden items-center gap-3 dark:flex" />
        </>
      ) : (
        <LogoMarks white={dark} className="flex items-center gap-3" />
      )}
    </Link>
  );
}

function LogoMarks({ white, className }: { white: boolean; className: string }) {
  return (
    <span className={className}>
      <Image
        src={white ? "/logos/amad-lockup-white-padded.png" : "/logos/amad-lockup-color-padded.png"}
        alt=""
        width={2643}
        height={1415}
        className="h-11 w-auto shrink-0 sm:h-12"
        priority
        unoptimized
      />
      <span className={`h-6 w-px ${white ? "bg-white/20" : "bg-ink/15"}`} aria-hidden />
      <Image
        src={white ? "/logos/partners/falak-white.png" : "/logos/partners/falak-black.png"}
        alt="فلك"
        width={470}
        height={237}
        className="h-6 w-auto shrink-0 object-contain"
        unoptimized
      />
    </span>
  );
}
