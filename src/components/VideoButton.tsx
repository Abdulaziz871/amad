"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";

export function VideoButton({ label, closeLabel, src }: { label: string; closeLabel: string; src: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group inline-flex items-center gap-3 rounded-full py-1.5 pe-5 ps-1.5 text-sm font-semibold text-ink transition-colors hover:text-copper focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper"
      >
        <span className="relative flex h-10 w-10 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-copper/25 [animation-duration:2.2s] motion-reduce:hidden" aria-hidden />
          <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white text-copper shadow-[0_8px_24px_-10px_rgba(198,110,78,0.6)] ring-1 ring-copper/20 transition-transform duration-300 group-hover:scale-110">
            <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden />
          </span>
        </span>
        {label}
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-ink/85 p-4 backdrop-blur-sm sm:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label={label}
                data-lenis-prevent
              >
                <motion.div
                  className="relative w-full max-w-5xl"
                  initial={{ opacity: 0, scale: 0.94, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={closeLabel}
                    className="absolute -top-12 end-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-copper-light"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                  <div className="overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
                    <video
                      src={src}
                      controls
                      autoPlay
                      playsInline
                      preload="metadata"
                      className="aspect-video w-full bg-black"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
