import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import type { SiteContent } from "@/lib/content";

export function GraduatesGallery({
  content,
  images,
  alinmaLogo,
  falakLogo,
}: {
  content: SiteContent;
  images: string[];
  alinmaLogo?: string | null;
  falakLogo?: string | null;
}) {
  if (images.length === 0) return null;

  const mid = Math.ceil(images.length / 2);
  const rowA = images.slice(0, mid);
  const rowB = images.length > 1 ? images.slice(mid) : images;
  const trackA = [...rowA, ...rowA];
  const trackB = [...rowB, ...rowB];

  return (
    <section id="gallery" className="relative overflow-hidden scroll-mt-20 bg-cream py-14 sm:py-20">
      <PatternCross
        className="pointer-events-none absolute top-8 start-8 h-14 w-14 rotate-12 text-accent opacity-[0.1] sm:h-20 sm:w-20"
        aria-hidden
      />
      <PatternFan
        className="pointer-events-none absolute bottom-8 end-6 h-12 w-12 -rotate-3 text-ink opacity-[0.1] sm:h-16 sm:w-16"
        aria-hidden
      />
      <div className="container-amad relative">
        <SectionHeading
          eyebrow={content.gallery.eyebrow}
          title={content.gallery.title}
          subtitle={content.gallery.subtitle}
          highlight={content.brandName}
          align="center"
          className="mx-auto"
        />

        <div className="mx-auto mt-6 flex w-fit flex-wrap items-center justify-center gap-5 rounded-full bg-ink px-6 py-3 sm:gap-7">
          <Image
            src="/logos/amad-mark-white-padded.png"
            alt="امد"
            width={2547}
            height={1054}
            unoptimized
            className="h-6 w-auto"
          />
          {alinmaLogo && (
            <>
              <span className="h-5 w-px bg-white/20" aria-hidden />
              <Image
                src={alinmaLogo}
                alt="الإنماء"
                width={180}
                height={69}
                unoptimized
                className="h-5 w-auto object-contain"
              />
            </>
          )}
          {falakLogo && (
            <>
              <span className="h-5 w-px bg-white/20" aria-hidden />
              <Image
                src={falakLogo}
                alt="فلك"
                width={470}
                height={237}
                unoptimized
                className="h-5 w-auto object-contain"
              />
            </>
          )}
        </div>
      </div>

      <div className="relative mt-10 flex flex-col gap-2" dir="ltr">
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee gap-2">
            {trackA.map((src, i) => (
              <div
                key={`a-${src}-${i}`}
                className="relative h-52 w-64 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-64 sm:w-80"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="flex w-max animate-marquee-reverse gap-2">
            {trackB.map((src, i) => (
              <div
                key={`b-${src}-${i}`}
                className="relative h-52 w-64 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-64 sm:w-80"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  unoptimized
                  loading="eager"
                  decoding="sync"
                  fetchPriority="high"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
