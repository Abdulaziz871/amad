"use client";

import { useState } from "react";
import { CheckCircle2, Upload } from "lucide-react";
import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { PatternFan } from "./ui/brand-patterns";
import { cn } from "@/lib/utils";
import type { ProgramDetail, SiteContent } from "@/lib/content";
import type { IconTone } from "./IconBadge";

const fieldFocus: Record<string, string> = {
  ink: "focus:border-ink",
  copper: "focus:border-copper",
  accent: "focus:border-accent",
};
const toneText: Record<string, string> = {
  ink: "text-ink",
  copper: "text-copper",
  accent: "text-accent",
};
const toneAccentInput: Record<string, string> = {
  ink: "accent-ink",
  copper: "accent-copper",
  accent: "accent-accent",
};
const toneButton: Record<string, string> = {
  ink: "!bg-ink hover:!bg-[#0a3a54]",
  copper: "!bg-copper hover:!bg-[#b87c6b]",
  accent: "!bg-accent hover:!bg-accent-dark",
};

export function ProgramApplicationForm({
  detail,
  content,
  tone = "accent",
}: {
  detail: ProgramDetail;
  content: SiteContent;
  tone?: IconTone;
}) {
  const [submitted, setSubmitted] = useState(false);
  const labels = content.applicationForm;
  const fieldClass = cn(
    "rounded-xl border border-ink/15 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors",
    fieldFocus[tone]
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section id="apply" className="relative overflow-hidden scroll-mt-20 py-12 sm:py-16">
      <PatternFan
        className="pointer-events-none absolute bottom-6 start-6 h-12 w-12 -rotate-3 text-ink opacity-[0.1] sm:h-16 sm:w-16"
        aria-hidden
      />
      <div className="container-amad relative">
        <Reveal
          className={`relative mx-auto max-w-3xl rounded-3xl border border-ink/8 bg-white ${
            detail.form.embedUrl ? "p-6 sm:p-8" : "p-6 sm:p-10"
          }`}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ink sm:text-3xl">{detail.form.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-brown sm:text-base">{detail.form.subtitle}</p>
          </div>

          {detail.form.embedUrl ? (
            <div className="relative mt-8 h-[820px] w-full overflow-hidden rounded-2xl border border-ink/10 bg-cream">
              <iframe
                src={detail.form.embedUrl}
                title={detail.form.title}
                className="absolute inset-x-0 top-0 w-full border-0"
                style={{ height: 970 }}
                loading="lazy"
              >
                {content.meta.title}
              </iframe>
            </div>
          ) : submitted ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className={cn("h-12 w-12", toneText[tone])} aria-hidden />
              <p className="mt-4 text-lg font-bold text-ink">{labels.successTitle}</p>
              <p className="mt-2 text-sm text-brown">{labels.successBody}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                {labels.nameLabel}
                <input required type="text" name="name" className={fieldClass} />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                {labels.emailLabel}
                <input required type="email" name="email" className={fieldClass} />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                {labels.phoneLabel}
                <input required type="tel" name="phone" className={fieldClass} dir="ltr" />
              </label>

              {detail.form.extraFields.map((field) => {
                if (field.type === "select") {
                  return (
                    <label key={field.name} className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                      {field.label}
                      <select name={field.name} className={fieldClass}>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  );
                }

                if (field.type === "textarea") {
                  return (
                    <label
                      key={field.name}
                      className="flex flex-col gap-1.5 text-sm font-semibold text-ink sm:col-span-2"
                    >
                      {field.label}
                      <textarea
                        name={field.name}
                        rows={3}
                        placeholder={field.placeholder}
                        className={`${fieldClass} resize-none`}
                      />
                    </label>
                  );
                }

                if (field.type === "file") {
                  return (
                    <label
                      key={field.name}
                      className="flex flex-col gap-1.5 text-sm font-semibold text-ink sm:col-span-2"
                    >
                      {field.label}
                      <span className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 bg-cream px-4 py-6 text-center">
                        <Upload className="h-5 w-5 text-brown/60" aria-hidden />
                        <input type="file" name={field.name} className="hidden" />
                        <span className="text-xs font-normal text-brown">{field.placeholder}</span>
                      </span>
                    </label>
                  );
                }

                return (
                  <label key={field.name} className="flex flex-col gap-1.5 text-sm font-semibold text-ink">
                    {field.label}
                    <input
                      type="text"
                      name={field.name}
                      placeholder={field.placeholder}
                      className={fieldClass}
                    />
                  </label>
                );
              })}

              <div className="sm:col-span-2">
                <label className="flex items-start gap-2.5 text-xs leading-relaxed text-brown">
                  <input
                    required
                    type="checkbox"
                    name="agree"
                    className={cn("mt-0.5 h-4 w-4 shrink-0", toneAccentInput[tone])}
                  />
                  {labels.agreeLabel}
                </label>
              </div>

              <div className="sm:col-span-2">
                <Button type="submit" variant="primary" className={cn("w-full sm:w-auto", toneButton[tone])}>
                  {labels.submit}
                </Button>
              </div>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
