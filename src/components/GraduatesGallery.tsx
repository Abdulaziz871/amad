import Image from "next/image";
import { SectionHeading } from "./SectionHeading";
import { VideoButton } from "./VideoButton";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import type { SiteContent } from "@/lib/content";

function logoName(src: string) {
  const file = decodeURIComponent(src.split("/").pop() ?? "");
  return file.replace(/\.[^.]+$/, "").replace(/[_-]?logo$/i, "").trim();
}

export function GraduatesGallery({
  content,
  images,
  logos,
}: {
  content: SiteContent;
  images: string[];
  logos: string[];
}) {
  if (images.length === 0 && logos.length === 0) return null;

  const mid = Math.ceil(images.length / 2);
  const rowA = images.slice(0, mid);
  const rowB = images.length > 1 ? images.slice(mid) : images;
  const trackA = [...rowA, ...rowA];
  const trackB = [...rowB, ...rowB];

  return (
    <section id="gallery" className="relative overflow-hidden scroll-mt-20 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternFan
        className="pointer-events-none absolute bottom-8 start-6 h-12 w-12 -rotate-3 text-ink opacity-[0.12] sm:h-16 sm:w-16"
        aria-hidden
      />
      <PatternCross
        className="pointer-events-none absolute top-10 end-8 h-9 w-9 rotate-12 text-copper opacity-[0.2] sm:h-14 sm:w-14"
        aria-hidden
      />

      <div className="container-amad relative">
        <Reveal>
          <SectionHeading title={content.gallery.title} align="center" className="mx-auto" />
        </Reveal>
      </div>

      {logos.length > 0 && (
        <div className="container-amad relative mt-10">
          <Reveal className="flex items-center gap-4">
            <span className="h-px flex-1 bg-linear-to-l from-ink/15 to-transparent" aria-hidden />
            <h3 className="text-center text-xl font-bold text-ink sm:text-2xl">{content.clients.title}</h3>
            <span className="h-px flex-1 bg-linear-to-r from-ink/15 to-transparent" aria-hidden />
          </Reveal>

          <RevealGroup
            stagger={0.04}
            className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7"
          >
            {logos.map((src) => (
              <RevealItem
                key={src}
                className="spotlight group relative flex aspect-[4/3] items-center justify-center rounded-2xl border border-ink/[0.06] bg-white p-5 shadow-[0_10px_30px_-22px_rgba(12,35,65,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-[0_20px_40px_-24px_rgba(139,132,215,0.55)]"
              >
                <Image
                  src={src}
                  alt={logoName(src)}
                  width={200}
                  height={150}
                  unoptimized
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      )}
      <Reveal className="relative mt-12 flex justify-center sm:mt-14">
        <div className="flex items-center gap-4 rounded-full border border-ink/[0.06] bg-white/80 py-2 pe-2 ps-6 shadow-[0_16px_40px_-28px_rgba(12,35,65,0.35)] backdrop-blur-sm">
          <span className="text-sm font-medium text-ink/60">{content.gallery.videoCaption}</span>
          <span className="h-6 w-px bg-ink/10" aria-hidden />
          <VideoButton
            label={content.hero.ctaVideo}
            closeLabel={content.hero.closeVideo}
            src="/images/vid/amad-tech-ceremony.mp4"
          />
        </div>
      </Reveal>

      {images.length > 0 && (
        <div className="relative mt-10 flex flex-col gap-2 sm:mt-12" dir="ltr">
          <div className="overflow-hidden">
            <div className="flex w-max animate-marquee gap-2">
              {trackA.map((src, i) => (
                <div
                  key={`a-${src}-${i}`}
                  className="relative h-52 w-64 shrink-0 overflow-hidden rounded-2xl shadow-md sm:h-64 sm:w-80"
                >
                  <Image src={src} alt="" fill unoptimized loading="eager" decoding="sync" className="object-cover" />
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
                  <Image src={src} alt="" fill unoptimized loading="eager" decoding="sync" className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
