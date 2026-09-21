"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { PatternCross, PatternBars } from "./ui/brand-patterns";
import type { SiteContent } from "@/lib/content";

export function FinalCta({ content, backgroundImage }: { content: SiteContent; backgroundImage?: string | null }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="interest" className="scroll-mt-20 py-12 sm:py-16">
      <div className="container-amad">
        <Reveal className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-white sm:px-12 sm:py-16">
          {backgroundImage && (
            <>
              <Image src={backgroundImage} alt="" fill unoptimized className="object-cover" />
              <div className="absolute inset-0 bg-ink/85" aria-hidden />
            </>
          )}
          <PatternBars
            className="pointer-events-none absolute top-6 end-6 h-14 w-14 text-white opacity-20 sm:h-20 sm:w-20"
            aria-hidden
          />
          <PatternCross
            className="pointer-events-none absolute start-6 top-1/2 h-40 w-40 -translate-y-1/2 text-copper opacity-20 sm:h-56 sm:w-56"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">{content.finalCta.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">{content.finalCta.subtitle}</p>
          </div>

          <div className="relative mx-auto mt-9 max-w-xl">
            {submitted ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-6 py-8 text-center backdrop-blur-sm">
                <CheckCircle2 className="h-9 w-9 text-accent" aria-hidden />
                <p className="text-sm font-semibold text-white">{content.finalCta.notice}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="finalcta-name">
                  {content.finalCta.nameLabel}
                </label>
                <input
                  id="finalcta-name"
                  required
                  type="text"
                  placeholder={content.finalCta.nameLabel}
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-accent"
                />
                <label className="sr-only" htmlFor="finalcta-email">
                  {content.finalCta.emailLabel}
                </label>
                <input
                  id="finalcta-email"
                  required
                  type="email"
                  placeholder={content.finalCta.emailLabel}
                  className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-accent"
                />
                <Button type="submit" variant="primary" className="shrink-0">
                  {content.finalCta.submit}
                  <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
