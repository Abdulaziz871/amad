"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, animate, type PanInfo } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { PatternCross, PatternBars } from "./ui/brand-patterns";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/content";

const FULL_WIDTH = 120;
const COLLAPSED_WIDTH = 35;
const GAP = 2;
const MARGIN = 2;

function Thumbnails({
  images,
  index,
  setIndex,
}: {
  images: string[];
  index: number;
  setIndex: (i: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trackRef.current) return;
    let scrollPosition = index * (COLLAPSED_WIDTH + GAP) + MARGIN;
    const containerWidth = trackRef.current.offsetWidth;
    scrollPosition -= containerWidth / 2 - FULL_WIDTH / 2;
    trackRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" });
  }, [index]);

  return (
    <div ref={trackRef} className="no-scrollbar overflow-x-auto">
      <div className="flex h-20 gap-0.5 pb-2" style={{ width: "fit-content" }}>
        {images.map((src, i) => (
          <motion.button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? "active" : "inactive"}
            variants={{
              active: { width: FULL_WIDTH, marginInline: MARGIN },
              inactive: { width: COLLAPSED_WIDTH, marginInline: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative h-full shrink-0 overflow-hidden rounded-lg"
            aria-label={`${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              unoptimized
              draggable={false}
              className="pointer-events-none select-none object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function GraduatesGallery({ content, images }: { content: SiteContent; images: string[] }) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (isDragging || !containerRef.current) return;
    const containerWidth = containerRef.current.offsetWidth || 1;
    animate(x, -index * containerWidth, { type: "spring", stiffness: 300, damping: 30 });
  }, [index, x, isDragging]);

  function onDragEnd(_: unknown, info: PanInfo) {
    setIsDragging(false);
    const containerWidth = containerRef.current?.offsetWidth || 1;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    let next = index;
    if (Math.abs(velocity) > 500) {
      next = velocity > 0 ? index - 1 : index + 1;
    } else if (Math.abs(offset) > containerWidth * 0.3) {
      next = offset > 0 ? index - 1 : index + 1;
    }
    setIndex(Math.max(0, Math.min(images.length - 1, next)));
  }

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="relative overflow-hidden scroll-mt-20 bg-cream py-14 sm:py-20">
      <PatternCross
        className="pointer-events-none absolute top-8 start-8 h-14 w-14 rotate-12 text-accent opacity-[0.1] sm:h-20 sm:w-20"
        aria-hidden
      />
      <PatternBars
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
      </div>

      {/* Kept LTR regardless of page direction: the slide track is a physical
          left-to-right transform, and forcing it avoids fighting the page's RTL flow. */}
      <div dir="ltr" className="container-amad relative mt-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-3">
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <motion.div
              className="flex"
              drag="x"
              dragElastic={0.2}
              dragMomentum={false}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={onDragEnd}
              style={{ x }}
            >
              {images.map((src) => (
                <div key={src} className="relative h-[320px] w-full shrink-0 sm:h-[440px] md:h-[520px] lg:h-[580px]">
                  <Image
                    src={src}
                    alt=""
                    fill
                    unoptimized
                    draggable={false}
                    className="pointer-events-none select-none object-cover"
                  />
                </div>
              ))}
            </motion.div>

            <button
              type="button"
              disabled={index === 0}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className={cn(
                "absolute left-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-transform",
                index === 0 ? "cursor-not-allowed opacity-40" : "opacity-80 hover:scale-110 hover:opacity-100"
              )}
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5 text-ink" />
            </button>
            <button
              type="button"
              disabled={index === images.length - 1}
              onClick={() => setIndex((i) => Math.min(images.length - 1, i + 1))}
              className={cn(
                "absolute right-4 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg transition-transform",
                index === images.length - 1
                  ? "cursor-not-allowed opacity-40"
                  : "opacity-80 hover:scale-110 hover:opacity-100"
              )}
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5 text-ink" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
              {index + 1} / {images.length}
            </div>
          </div>

          <Thumbnails images={images} index={index} setIndex={setIndex} />
        </div>
      </div>
    </section>
  );
}
