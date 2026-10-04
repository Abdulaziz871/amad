"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SWIPE_PX = 60;

// Bento tiles on sm+ (4 columns, dense flow): big 2x2, small, tall 1x2, small, small, wide 2x1, small.
// Mobile is a plain 2-column grid with the first photo spanning both columns.
const tileSpans = [
  "col-span-2 sm:row-span-2",
  "",
  "sm:row-span-2",
  "",
  "",
  "sm:col-span-2",
  "",
];

type Labels = { previous: string; next: string; close: string; expand: string; viewAll: string };

export function GraduatesShowcase({ images, labels }: { images: string[]; labels: Labels }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const tiles = images.slice(0, tileSpans.length);
  const hidden = images.length - tiles.length;

  return (
    <>
      <div className="mx-auto grid max-w-5xl grid-flow-dense auto-rows-[8.5rem] grid-cols-2 gap-2.5 sm:auto-rows-[10rem] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[11.5rem]">
        {tiles.map((src, i) => {
          const isMore = i === tiles.length - 1 && hidden > 0;
          return (
            <motion.button
              key={src}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={isMore ? labels.viewAll : `${labels.expand} ${i + 1}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl bg-ink outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:rounded-3xl",
                tileSpans[i]
              )}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <Image
                src={src}
                alt=""
                fill
                unoptimized
                className={cn(
                  "object-cover transition-transform duration-700 ease-out group-hover:scale-110",
                  isMore && "scale-110 blur-[2px]"
                )}
              />
              {isMore ? (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/60 text-white transition-colors duration-300 group-hover:bg-copper/80">
                  <span className="font-display text-3xl font-extrabold tabular-nums sm:text-4xl" dir="ltr">
                    +{hidden}
                  </span>
                  <span className="text-xs font-semibold sm:text-sm">{labels.viewAll}</span>
                </span>
              ) : (
                <>
                  <span
                    className="absolute inset-0 bg-linear-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    aria-hidden
                  />
                  <span className="absolute bottom-3 end-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <Expand className="h-4 w-4" aria-hidden />
                  </span>
                </>
              )}
            </motion.button>
          );
        })}
      </div>

      {openIndex !== null && (
        <Lightbox images={images} startIndex={openIndex} labels={labels} onClose={() => setOpenIndex(null)} />
      )}
    </>
  );
}

function Lightbox({
  images,
  startIndex,
  labels,
  onClose,
}: {
  images: string[];
  startIndex: number;
  labels: Labels;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const stripRef = useRef<HTMLDivElement>(null);
  const count = images.length;

  const go = useCallback((delta: number) => setIndex((current) => (current + delta + count) % count), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const rtl = document.dir === "rtl";
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(rtl ? 1 : -1);
      if (e.key === "ArrowRight") go(rtl ? -1 : 1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onClose]);

  // Keep the active thumbnail centred; relative offsets work in both LTR and RTL.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[index] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    strip.scrollBy({
      left: thumbRect.left + thumbRect.width / 2 - (stripRect.left + stripRect.width / 2),
      behavior: "smooth",
    });
  }, [index]);

  // Portalled to <body> so transformed section wrappers cannot break position: fixed.
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex items-center justify-between p-4 sm:p-6">
        <span className="font-display text-sm font-bold text-white tabular-nums" dir="ltr">
          {String(index + 1).padStart(2, "0")}
          <span className="text-white/50"> / {String(count).padStart(2, "0")}</span>
        </span>
        <LightboxButton label={labels.close} onClick={onClose}>
          <X className="h-5 w-5" aria-hidden />
        </LightboxButton>
      </div>

      <div className="relative min-h-0 flex-1" onClick={onClose}>
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={images[index]}
            className="absolute inset-x-4 inset-y-0 cursor-grab active:cursor-grabbing sm:inset-x-24"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => e.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              const rtl = document.dir === "rtl";
              if (info.offset.x < -SWIPE_PX) go(rtl ? -1 : 1);
              else if (info.offset.x > SWIPE_PX) go(rtl ? 1 : -1);
            }}
          >
            <Image
              src={images[index]}
              alt=""
              fill
              unoptimized
              draggable={false}
              className="pointer-events-none object-contain"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-y-0 start-6 hidden items-center sm:flex">
          <LightboxButton
            label={labels.previous}
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <ChevronRight className="h-5 w-5 ltr:rotate-180" aria-hidden />
          </LightboxButton>
        </div>
        <div className="absolute inset-y-0 end-6 hidden items-center sm:flex">
          <LightboxButton
            label={labels.next}
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <ChevronLeft className="h-5 w-5 ltr:rotate-180" aria-hidden />
          </LightboxButton>
        </div>
      </div>

      <div ref={stripRef} className="thumb-strip no-scrollbar flex gap-2 overflow-x-auto px-4 py-4 sm:px-6">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`${i + 1} / ${count}`}
            aria-current={i === index}
            className={cn(
              "relative h-12 w-[4.5rem] shrink-0 overflow-hidden rounded-lg outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-copper sm:h-14 sm:w-20",
              i === index ? "opacity-100 ring-2 ring-copper" : "opacity-40 hover:opacity-80"
            )}
          >
            <Image src={src} alt="" fill unoptimized className="object-cover" />
          </button>
        ))}
      </div>
    </motion.div>,
    document.body
  );
}

function LightboxButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-ink focus-visible:ring-2 focus-visible:ring-copper focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
