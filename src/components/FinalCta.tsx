"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, ArrowLeft, Check } from "lucide-react";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { PatternCross, PatternFan } from "./ui/brand-patterns";
import { programIcons } from "@/lib/program-icons";
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
          <div className="section-glow section-glow--dark" aria-hidden />
          <PatternFan
            className="pointer-events-none absolute top-6 end-6 h-10 w-10 rotate-6 text-accent opacity-[0.28] sm:h-14 sm:w-14"
            aria-hidden
          />
          <PatternCross
            className="pointer-events-none absolute start-6 top-1/2 h-40 w-40 -translate-y-1/2 text-copper opacity-20 sm:h-56 sm:w-56"
            aria-hidden
          />
          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">{content.finalCta.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">{content.finalCta.subtitle}</p>
          </div>

          <div className="relative mx-auto mt-9 max-w-xl">
            {submitted ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-white/5 px-6 py-8 text-center backdrop-blur-sm">
                <CheckCircle2 className="h-9 w-9 text-copper-light" aria-hidden />
                <p className="text-sm font-semibold text-white">{content.finalCta.notice}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
                <label className="sr-only" htmlFor="finalcta-name">
                  {content.finalCta.nameLabel}
                </label>
                <input
                  id="finalcta-name"
                  required
                  type="text"
                  placeholder={content.finalCta.nameLabel}
                  className="min-w-0 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-copper-light"
                />
                <label className="sr-only" htmlFor="finalcta-email">
                  {content.finalCta.emailLabel}
                </label>
                <input
                  id="finalcta-email"
                  required
                  type="email"
                  placeholder={content.finalCta.emailLabel}
                  className="min-w-0 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur-sm focus:border-copper-light"
                />
                <fieldset className="sm:col-span-2">
                  <legend className="mb-2.5 text-sm font-semibold text-white/80">
                    {content.finalCta.trackPlaceholder}
                  </legend>
                  <div className="grid gap-2.5 sm:grid-cols-3">
                    {content.programs.map((program) => {
                      const Icon = programIcons[program.slug];
                      return (
                        <label
                          key={program.slug}
                          className="group relative flex cursor-pointer items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3.5 text-start backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10 has-[:checked]:border-copper-light has-[:checked]:bg-copper-light/15 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper-light/60 sm:flex-col sm:items-start sm:gap-2.5 sm:p-4"
                        >
                          <input type="radio" name="track" value={program.slug} required className="peer sr-only" />
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/80 transition-colors group-has-[:checked]:bg-copper-light group-has-[:checked]:text-ink [&_svg]:h-4.5 [&_svg]:w-4.5">
                            <Icon aria-hidden />
                          </span>
                          <span className="text-sm font-semibold leading-snug text-white/85 group-has-[:checked]:text-white">
                            {program.title}
                          </span>
                          <span
                            className="absolute top-3 end-3 flex h-5 w-5 scale-50 items-center justify-center rounded-full bg-copper-light text-ink opacity-0 transition-all duration-300 group-has-[:checked]:scale-100 group-has-[:checked]:opacity-100"
                            aria-hidden
                          >
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <Button type="submit" variant="light" className="w-full sm:col-span-2">
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
