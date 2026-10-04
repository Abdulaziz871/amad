import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { ClientLogoMarquee } from "./ClientLogoMarquee";
import { GraduatesShowcase } from "./GraduatesShowcase";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import type { SiteContent } from "@/lib/content";

// Shared label for the section's two blocks (logos, photos) so they read with the same rhythm.
function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-amad flex items-center gap-4">
      <span className="h-px flex-1 bg-linear-to-l from-ink/15 to-transparent" aria-hidden />
      <h3 className="text-center text-lg font-bold text-fg sm:text-xl">{children}</h3>
      <span className="h-px flex-1 bg-linear-to-r from-ink/15 to-transparent" aria-hidden />
    </div>
  );
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

  return (
    <section id="gallery" className="relative overflow-hidden scroll-mt-20 py-14 sm:py-20">
      <div className="section-glow section-glow--light" aria-hidden />
      <PatternFan
        className="pointer-events-none absolute bottom-8 start-6 h-12 w-12 -rotate-3 text-fg opacity-[0.12] sm:h-16 sm:w-16"
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
        <Reveal className="relative mt-10 sm:mt-12">
          <BlockLabel>{content.clients.title}</BlockLabel>
          <div className="mt-5">
            <ClientLogoMarquee logos={logos} />
          </div>
        </Reveal>
      )}

      {images.length > 0 && (
        <Reveal className="relative mt-10 sm:mt-12">
          <BlockLabel>{content.gallery.videoCaption}</BlockLabel>
          <div className="mt-2">
            <GraduatesShowcase images={images} labels={content.gallery.viewer} />
          </div>
        </Reveal>
      )}
    </section>
  );
}
