"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, CalendarDays, Check, CheckCircle2, Info, Loader2, MapPin, Upload, UserRound } from "lucide-react";
import { localizedPart, type AlfiaField, type AlfiaForm } from "@/lib/alfia";
import type { Locale } from "@/i18n/config";
import type { AlfiaFormUi } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Values = Record<string, string | string[]>;
type Errors = Record<string, string>;
type Path = "solo" | "team";

// Mirrors the step layout of Alfia's own landing page for this form. Step titles and descriptions
// come from that page (form.landing.steps); field labels and options come from Alfia's field API.
const PATHS: Record<Path, string[]> = {
  solo: ["step-start", "solo-basic", "solo-skills", "solo-experience", "commitment-screen", "solo-review-screen"],
  team: ["step-start", "team-info", "team-leader", "team-members", "team-experience", "commitment-screen", "team-review-screen"],
};
const BASIC = ["founder_name", "gender", "mobile", "founder_email", "university", "university_other", "major", "current_status"];
const STEP_FIELDS: Record<string, string[]> = {
  "solo-basic": BASIC,
  "solo-skills": ["skills", "skills_other", "preferred_role", "team_contribution"],
  "solo-experience": ["prior_participation", "prior_experience"],
  "team-info": ["startup_name", "team_idea", "team_complete", "needed_members_count", "needed_roles", "needed_roles_other", "team_size"],
  "team-leader": BASIC,
  "team-experience": ["worked_together", "team_prior_programs", "team_prior_programs_detail"],
};
const SYSTEM_NAMES = ["founder_name", "founder_email", "startup_name"];
const MEMBER_PARTS = ["name", "mobile", "email", "city", "university", "major", "status", "skills"];
// The visible team question is a radio; Alfia also keeps a select copy that drives its own conditions.
const TEAM_RADIO = "are_you_applying_as_a_team";
const TEAM_SELECT = "applying_as_team";
const OTHER = "Other | أخرى";
const MAX_SIGNATURE_BYTES = 5 * 1024 * 1024;

const isYes = (v: unknown) => typeof v === "string" && v.startsWith("Yes");
const isNo = (v: unknown) => typeof v === "string" && v.startsWith("No");
const has = (v: unknown, opt: string) => Array.isArray(v) && v.includes(opt);
const filled = (v: unknown) => (Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim() !== "");

/** Alfia's landing page stores the signature as a JPEG data URL, at most 900px wide on a white background. */
function signatureDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(String(reader.result));
      img.onload = () => {
        const scale = Math.min(1, 900 / img.naturalWidth);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(String(reader.result));
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function AlfiaApplicationForm({
  form,
  locale,
  ui,
}: {
  form: AlfiaForm;
  locale: Locale;
  ui: AlfiaFormUi;
}) {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [stage, setStage] = useState<"welcome" | "steps" | "success">("welcome");
  const [path, setPath] = useState<Path | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [signature, setSignature] = useState<{ file: File; preview: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const t = (s: string) => localizedPart(s, locale);
  const landing = form.landing;

  useEffect(
    () => () => {
      if (signature) URL.revokeObjectURL(signature.preview);
    },
    [signature]
  );

  // System fields first (with the landing page's own labels), then the custom fields.
  const byName = useMemo(() => {
    const system = form.system_fields
      .filter((f) => SYSTEM_NAMES.includes(f.name))
      .map<AlfiaField>((f, i) => ({
        ...f,
        // Alfia's system label for startup_name is mis-set; its landing page labels it "Team Name".
        label: f.name === "startup_name" ? "Team Name | اسم الفريق" : f.label,
        id: -1 - i,
        order: -10 + i,
        options: null,
        condition: null,
      }));
    const map = new Map([...system, ...form.fields].map((f) => [f.name, f]));
    // The landing page turns the university into a list; keep Alfia's free text as a fallback.
    const uni = map.get("university");
    if (uni && landing.universities.length) map.set("university", { ...uni, field_type: "select", options: landing.universities });
    return map;
  }, [form, landing.universities]);

  const steps = path ? PATHS[path] : PATHS.solo.slice(0, 1);
  const stepId = steps[stepIndex];
  const isReview = stepId.endsWith("review-screen");
  const teamSize = Number.parseInt(String(values.team_size ?? ""), 10) || 0;
  const memberCount = path === "team" ? Math.max(teamSize - 1, 0) : 0;
  const city = (values.city as string) ?? "";
  const period = landing.periods[city] ?? "";

  /** Fields that only apply after a specific answer; once shown they are required. */
  function conditionalShown(name: string): boolean | null {
    switch (name) {
      case "university_other":
        return values.university === OTHER;
      case "skills_other":
        return path === "solo" && has(values.skills, OTHER);
      case "prior_experience":
        return path === "solo" && isYes(values.prior_participation);
      case "team_prior_programs_detail":
        return isYes(values.team_prior_programs);
      case "needed_members_count":
      case "needed_roles":
        return isNo(values.team_complete);
      case "needed_roles_other":
        return isNo(values.team_complete) && has(values.needed_roles, OTHER);
      default:
        return null;
    }
  }

  function isShown(name: string): boolean {
    const member = name.match(/^member(\d+)_/);
    if (member) return Number(member[1]) <= memberCount;
    return conditionalShown(name) ?? true;
  }

  function isRequired(name: string): boolean {
    if (conditionalShown(name) !== null || /^member\d+_/.test(name)) return true;
    return byName.get(name)?.is_required ?? false;
  }

  function fieldsOf(id: string): string[] {
    if (id === "team-members") {
      return Array.from({ length: memberCount }, (_, i) => MEMBER_PARTS.map((p) => `member${i + 1}_${p}`)).flat();
    }
    return STEP_FIELDS[id] ?? [];
  }

  function setValue(name: string, value: string | string[]) {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((prev) => {
      if (!prev[name] && !prev._step) return prev;
      const next = { ...prev };
      delete next[name];
      delete next._step;
      return next;
    });
  }

  function choosePath(radioValue: string) {
    const nextPath: Path = isYes(radioValue) ? "team" : "solo";
    setValue(TEAM_RADIO, radioValue);
    if (path && path !== nextPath) {
      // Switching paths clears the answers that belonged to the other path (as Alfia's page does).
      const keep = new Set(["city", "city_other", TEAM_RADIO]);
      setValues((v) => Object.fromEntries(Object.entries(v).filter(([k]) => keep.has(k))));
      setSignature(null);
    }
    setPath(nextPath);
  }

  function goTo(index: number) {
    setBanner(null);
    setStepIndex(index);
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function fail(name: string, message: string): false {
    setErrors((prev) => ({ ...prev, [name]: message }));
    requestAnimationFrame(() =>
      stepRef.current?.querySelector(`[data-field="${name}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" })
    );
    return false;
  }

  function validateStep(): boolean {
    if (stepId === "step-start") {
      if (!city) return fail("city", ui.chooseCity);
      if (city === OTHER && !String(values.city_other ?? "").trim()) return fail("city_other", ui.chooseCity);
      if (!path) return fail(TEAM_RADIO, ui.choosePath);
      return true;
    }
    if (stepId === "commitment-screen") {
      if (!filled(values.commitment_agree)) return fail("commitment_agree", ui.confirmCommitment);
      const mode = String(values.signature_mode ?? "");
      if (!mode) return fail("signature_mode", ui.chooseOption);
      if (mode.startsWith("Typed")) {
        if (String(values.signature_name ?? "").trim().length < 3) return fail("signature_name", ui.signatureTooShort);
      } else if (!signature) return fail("signature_image", ui.signatureTooShort);
      return true;
    }
    for (const name of fieldsOf(stepId)) {
      const f = byName.get(name);
      if (f?.field_type === "checkbox" && isShown(name) && isRequired(name) && !filled(values[name])) {
        return fail(name, ui.chooseAtLeastOne);
      }
    }
    const controls = stepRef.current?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input:not([type=file]):not([type=checkbox]), select, textarea"
    );
    for (const el of controls ?? []) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    goTo(Math.min(stepIndex + 1, steps.length - 1));
  }

  function pickSignature(file: File | undefined) {
    if (!file) return;
    if (!/^image\/(png|jpeg)$/.test(file.type)) return void fail("signature_image", ui.signatureType);
    if (file.size > MAX_SIGNATURE_BYTES) return void fail("signature_image", ui.signatureSize);
    setSignature({ file, preview: URL.createObjectURL(file) });
    setValue("signature_image", file.name);
  }

  async function buildPayload() {
    const custom: Record<string, string | string[]> = {};
    const names = new Set<string>(["city", "city_other", ...steps.flatMap(fieldsOf)]);
    for (const name of names) {
      if (SYSTEM_NAMES.includes(name) || !isShown(name)) continue;
      if (name === "city_other" && city !== OTHER) continue;
      const v = values[name];
      if (!filled(v)) continue;
      custom[name] = Array.isArray(v) ? v : (v as string).trim();
    }
    custom[TEAM_RADIO] = values[TEAM_RADIO] as string;
    const radioOpts = byName.get(TEAM_RADIO)?.options ?? [];
    const selectOpts = byName.get(TEAM_SELECT)?.options ?? [];
    const pathIdx = radioOpts.indexOf(values[TEAM_RADIO] as string);
    custom[TEAM_SELECT] = selectOpts[pathIdx] ?? (values[TEAM_RADIO] as string);
    if (period) custom.program_period = period;
    if (filled(values.commitment_agree)) custom.commitment_agree = values.commitment_agree as string[];
    custom.signature_mode = values.signature_mode as string;
    if (String(values.signature_mode).startsWith("Typed")) custom.signature_name = String(values.signature_name).trim();
    else if (signature) custom.signature_image = await signatureDataUrl(signature.file);

    const founderName = String(values.founder_name ?? "").trim();
    return {
      incubator_id: form.options.incubators[0]?.id,
      program_id: form.options.programs[0]?.id,
      cohort_id: form.options.cohorts[0]?.id,
      startup_name: path === "team" ? String(values.startup_name ?? "").trim() : founderName,
      founder_name: founderName,
      founder_email: String(values.founder_email ?? "").trim(),
      custom_fields: custom,
    };
  }

  async function submit() {
    setBanner(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/apply/future-founders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(await buildPayload()),
      });
      if (res.ok) {
        setStage("success");
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const data = await res.json().catch(() => ({}));
      const next: Errors = {};
      for (const [key, messages] of Object.entries((data?.errors ?? {}) as Record<string, string[]>)) {
        const name = key.replace(/^custom_fields\./, "");
        next[byName.has(name) ? name : "_form"] = messages[0];
      }
      setErrors(next);
      const firstStep = steps.findIndex((s) => fieldsOf(s).some((n) => next[n]));
      if (firstStep >= 0) goTo(firstStep);
      setBanner(Object.keys(next).length ? ui.errorFields : data?.message || ui.errorGeneric);
    } catch {
      setBanner(ui.errorGeneric);
    } finally {
      setSubmitting(false);
    }
  }

  if (!form.is_currently_accepting) {
    return (
      <div className="mx-auto max-w-[720px] rounded-2xl bg-surface px-6 py-12 text-center shadow-[0_28px_70px_-30px_rgba(12,35,65,0.35)]">
        <AlertCircle className="mx-auto h-12 w-12 text-copper" aria-hidden />
        <p className="mt-4 text-lg font-bold text-fg">{ui.closedTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brown">{ui.closedBody}</p>
      </div>
    );
  }

  const renderField = (name: string, overrides?: Partial<AlfiaField>) => {
    const base = byName.get(name) ?? (name.match(/^member\d+_/) ? memberFieldFallback(name) : undefined);
    if (!base || !isShown(name)) return null;
    const f = { ...base, ...overrides, is_required: isRequired(name) };
    return (
      <FieldControl
        key={name}
        field={f}
        value={values[name]}
        error={errors[name]}
        onChange={(v) => setValue(name, v)}
        t={t}
        ui={ui}
      />
    );
  };

  const meta = landing.steps[stepId];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const primaryBtn =
    "inline-flex items-center gap-2 rounded-xl border border-[#C0703E] bg-[#C0703E] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(192,112,62,0.2)] transition-all hover:-translate-y-px hover:shadow-[0_11px_24px_rgba(192,112,62,0.28)] disabled:opacity-70";

  const cityOptions = byName.get("city")?.options ?? [];
  const pathOptions = byName.get(TEAM_RADIO)?.options ?? [];
  const pledge = t(path === "team" ? landing.pledge.team : landing.pledge.solo);
  const commitOptions = byName.get("commitment_agree")?.options ?? [];
  const commitOption = commitOptions[path === "team" ? 1 : 0] ?? commitOptions[0];
  const sigOptions = byName.get("signature_mode")?.options ?? [];
  const sigMode = String(values.signature_mode ?? "");

  return (
    <div
      ref={cardRef}
      className="mx-auto max-w-[720px] scroll-mt-28 overflow-hidden rounded-2xl bg-surface text-fg shadow-[0_28px_70px_-30px_rgba(12,35,65,0.35)] ring-1 ring-fg/[0.05]"
    >
      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.section
            key="welcome"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-10 text-center sm:px-12 sm:py-14"
          >
            {landing.deadline && (
              <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-[#C0703E]/40 bg-[#C0703E]/10 px-3.5 py-1.5 text-xs font-bold text-[#C0703E]">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {t(landing.deadline)}
              </span>
            )}
            <div
              className="mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-[22px] bg-[#FBF3EC] text-[35px] shadow-[0_10px_26px_rgba(192,112,62,0.14)]"
              aria-hidden
            >
              🚀
            </div>
            <h3 className="text-[clamp(1.6rem,4.5vw,2.35rem)] font-black leading-tight text-fg">{t(landing.welcome.title)}</h3>
            <p className="mx-auto mt-4 max-w-[610px] text-[15px] leading-[1.8] text-brown">{t(landing.welcome.body)}</p>
            <div className="mx-auto mb-7 mt-6 flex max-w-[610px] items-start gap-3 rounded-xl bg-[#F6F1EA] p-4 text-start dark:bg-fg/[0.06]">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#C0703E]" aria-hidden />
              <p className="text-[13px] leading-[1.75] text-brown">{t(landing.welcome.note)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStage("steps");
                goTo(0);
              }}
              className={cn(primaryBtn, "px-7 py-3.5")}
            >
              {t(landing.welcome.start)}
              <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
            </button>
          </motion.section>
        )}

        {stage === "steps" && (
          <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="h-1.5 bg-[#F6F1EA] dark:bg-fg/[0.08]" aria-hidden>
              <motion.div className="h-full bg-[#C0703E]" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stepId}
                  ref={stepRef}
                  initial={{ opacity: 0, x: locale === "ar" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-7">
                    <p className="text-xs font-bold tracking-wider text-[#C0703E]">
                      {ui.step} {stepIndex + 1} / {steps.length}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-fg">{meta ? t(meta.title) : ""}</h3>
                    {meta?.description && <p className="mt-1.5 text-sm text-brown">{t(meta.description)}</p>}
                  </div>

                  {stepId === "step-start" ? (
                    <div className="flex flex-col gap-7">
                      <ChoiceCards
                        name="city"
                        label={t(byName.get("city")?.label ?? "City | المدينة")}
                        options={cityOptions}
                        value={city}
                        notes={landing.cityNotes}
                        onChange={(v) => {
                          setValue("city", v);
                          if (v !== OTHER) setValue("city_other", "");
                        }}
                        error={errors.city}
                        t={t}
                        icon
                      />
                      {city === OTHER && renderField("city_other", { is_required: true })}
                      {period && <PeriodCard label={ui.programPeriod} dates={t(period)} />}
                      <ChoiceCards
                        name={TEAM_RADIO}
                        label={t(byName.get(TEAM_RADIO)?.label ?? "")}
                        options={pathOptions}
                        value={(values[TEAM_RADIO] as string) ?? ""}
                        onChange={choosePath}
                        error={errors[TEAM_RADIO]}
                        t={t}
                      />
                    </div>
                  ) : stepId === "team-members" ? (
                    <div className="flex flex-col gap-4">
                      {Array.from({ length: memberCount }, (_, i) => i + 1).map((n) => (
                        <div key={n} className="rounded-2xl border border-[#E4D9CC] bg-[#FBF7F3] p-5 dark:border-fg/10 dark:bg-fg/[0.04]">
                          <p className="mb-4 flex items-center gap-2 text-sm font-bold text-fg">
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C0703E] text-white">
                              <UserRound className="h-4 w-4" aria-hidden />
                            </span>
                            {ui.member} {n}
                          </p>
                          <div className="grid gap-5 sm:grid-cols-2">{MEMBER_PARTS.map((p) => renderField(`member${n}_${p}`))}</div>
                        </div>
                      ))}
                    </div>
                  ) : stepId === "commitment-screen" ? (
                    <div className="flex flex-col gap-6">
                      <p className="rounded-xl bg-[#F6F1EA] p-4 text-sm leading-relaxed text-fg dark:bg-fg/[0.06]">{pledge}</p>
                      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E4D9CC] px-4 py-3 text-sm dark:border-fg/10">
                        <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-[#C0703E]" aria-hidden />
                            <b>{ui.cityLabel}:</b> {city === OTHER ? `${t(OTHER)} — ${values.city_other ?? ""}` : t(city)}
                          </span>
                          {period && (
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="h-4 w-4 text-[#C0703E]" aria-hidden />
                              <b>{ui.programPeriod}:</b> {t(period)}
                            </span>
                          )}
                        </span>
                        <button type="button" onClick={() => goTo(0)} className="text-xs font-bold text-[#C0703E] hover:underline">
                          {ui.change}
                        </button>
                      </div>
                      {commitOption && (
                        <FieldControl
                          // The pledge is already shown above, so Alfia's help text (the same pledge) is dropped here.
                          field={{ ...(byName.get("commitment_agree") as AlfiaField), options: [commitOption], is_required: true, help_text: null }}
                          value={values.commitment_agree}
                          error={errors.commitment_agree}
                          onChange={(v) => setValue("commitment_agree", v)}
                          t={t}
                          ui={ui}
                        />
                      )}
                      <ChoiceCards
                        name="signature_mode"
                        label={t(byName.get("signature_mode")?.label ?? "Signature | التوقيع")}
                        options={sigOptions}
                        value={sigMode}
                        onChange={(v) => setValue("signature_mode", v)}
                        error={errors.signature_mode}
                        t={t}
                      />
                      {sigMode.startsWith("Typed") &&
                        renderField("signature_name", { is_required: true, label: `${ui.signatureName} | ${ui.signatureName}` })}
                      {sigMode && !sigMode.startsWith("Typed") && (
                        <SignatureUpload
                          label={ui.signatureImage}
                          hint={ui.signatureHint}
                          preview={signature?.preview}
                          fileName={signature?.file.name}
                          error={errors.signature_image}
                          onPick={pickSignature}
                        />
                      )}
                    </div>
                  ) : isReview ? (
                    <Review
                      hint={ui.reviewHint}
                      editLabel={ui.edit}
                      sections={steps
                        .map((id, index) => ({ id, index }))
                        .filter(({ id }) => !id.endsWith("review-screen"))
                        .map(({ id, index }) => {
                          let rows: { label: string; value: string }[];
                          if (id === "step-start") {
                            rows = [
                              { label: ui.cityLabel, value: city === OTHER ? `${t(OTHER)} — ${values.city_other ?? ""}` : t(city) },
                              { label: t(byName.get(TEAM_RADIO)?.label ?? ""), value: t(String(values[TEAM_RADIO] ?? "")) },
                            ];
                          } else if (id === "commitment-screen") {
                            rows = [
                              { label: ui.programPeriod, value: period ? t(period) : "—" },
                              { label: t(byName.get("commitment_agree")?.label ?? ""), value: filled(values.commitment_agree) ? "✓" : "—" },
                              {
                                label: t(byName.get("signature_mode")?.label ?? ""),
                                value: sigMode.startsWith("Typed") ? String(values.signature_name ?? "") : signature?.file.name ?? "—",
                              },
                            ];
                          } else {
                            rows = fieldsOf(id)
                              .filter((n) => isShown(n) && filled(values[n]))
                              .map((n) => {
                                const f = byName.get(n) ?? memberFieldFallback(n);
                                const v = values[n];
                                return {
                                  label: t(f?.label ?? n),
                                  value: Array.isArray(v) ? v.map(t).join("، ") : f?.options?.length ? t(v) : v,
                                };
                              });
                          }
                          return { title: t(landing.steps[id]?.title ?? id), index, rows };
                        })}
                      onEdit={goTo}
                    />
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">{fieldsOf(stepId).map((n) => renderField(n))}</div>
                  )}
                </motion.div>
              </AnimatePresence>

              {banner && (
                <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
                  <span>
                    {banner}
                    {errors._form && <span className="mt-1 block">{errors._form}</span>}
                  </span>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#EFE7DD] pt-6 dark:border-fg/10">
                <button
                  type="button"
                  onClick={() => (stepIndex === 0 ? setStage("welcome") : goTo(stepIndex - 1))}
                  className="rounded-xl border border-[#E4D9CC] bg-surface px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-[#C0703E] dark:border-fg/15"
                >
                  {ui.back}
                </button>
                {isReview ? (
                  <button type="button" onClick={submit} disabled={submitting} className={primaryBtn}>
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                    {submitting ? ui.submitting : ui.submit}
                  </button>
                ) : (
                  <button type="button" onClick={next} className={primaryBtn}>
                    {ui.next}
                    <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.section
            key="success"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-6 py-14 text-center sm:px-12"
            role="status"
          >
            <div className="mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-full border-[3px] border-[#C0703E] text-[#C0703E]">
              <CheckCircle2 className="h-10 w-10" aria-hidden />
            </div>
            <h3 className="mx-auto max-w-md text-[1.6rem] font-black leading-snug text-fg">{t(landing.success.title)}</h3>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.8] text-brown">{t(landing.success.body)}</p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Member fields keep Alfia's definitions; this covers members beyond the ones the API declares. */
function memberFieldFallback(name: string): AlfiaField | undefined {
  const m = name.match(/^member(\d+)_(\w+)$/);
  if (!m) return undefined;
  const labels: Record<string, [string, AlfiaField["field_type"]]> = {
    name: ["Full Name | الاسم الكامل", "text"],
    mobile: ["Mobile Number | رقم الجوال", "tel"],
    email: ["Email | البريد الإلكتروني", "email"],
    city: ["City | المدينة", "text"],
    university: ["University | الجامعة", "text"],
    major: ["Major | التخصص", "text"],
    status: ["Current Status | الحالة الحالية", "select"],
    skills: ["Skills | المهارات", "checkbox"],
  };
  const [label, type] = labels[m[2]] ?? [m[2], "text"];
  return { id: 0, name, label, field_type: type, is_required: true, order: 0, options: null, condition: null };
}

function PeriodCard({ label, dates }: { label: string; dates: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#C0703E]/30 bg-[#FBF3EC] px-4 py-3 dark:bg-[#C0703E]/10">
      <CalendarDays className="h-5 w-5 shrink-0 text-[#C0703E]" aria-hidden />
      <span className="text-sm">
        <b className="text-fg">{label}:</b> <span className="text-fg/80">{dates}</span>
      </span>
    </div>
  );
}

function ChoiceCards({
  name,
  label,
  options,
  value,
  notes,
  onChange,
  error,
  t,
  icon,
}: {
  name: string;
  label: string;
  options: string[];
  value: string;
  notes?: Record<string, string>;
  onChange: (v: string) => void;
  error?: string;
  t: (s: string) => string;
  icon?: boolean;
}) {
  return (
    <fieldset data-field={name} className="flex flex-col gap-3">
      <legend className="mb-3 text-sm font-bold text-fg">
        {label}
        <span className="ms-1 text-[#C44B4B]" aria-hidden>
          *
        </span>
      </legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = value === opt;
          const note = notes?.[opt];
          return (
            <label
              key={opt}
              className={cn(
                "relative flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#C0703E]/40",
                checked
                  ? "border-[#C0703E] bg-[#FBF3EC] dark:bg-[#C0703E]/10"
                  : "border-[#E4D9CC] bg-surface hover:border-[#C0703E]/60 dark:border-fg/15"
              )}
            >
              <input type="radio" name={name} value={opt} checked={checked} onChange={() => onChange(opt)} className="sr-only" />
              {icon && <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#C0703E]" aria-hidden />}
              <span className="flex flex-1 flex-col gap-1 pe-6">
                <strong className="text-sm text-fg sm:text-base">{t(opt)}</strong>
                {note && <small className="text-xs leading-relaxed text-brown">{t(note)}</small>}
              </span>
              <span
                className={cn(
                  "absolute top-3 end-3 flex h-5 w-5 items-center justify-center rounded-full border transition-colors",
                  checked ? "border-[#C0703E] bg-[#C0703E] text-white" : "border-[#E4D9CC] dark:border-fg/20"
                )}
                aria-hidden
              >
                {checked && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </label>
          );
        })}
      </div>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </fieldset>
  );
}

function SignatureUpload({
  label,
  hint,
  preview,
  fileName,
  error,
  onPick,
}: {
  label: string;
  hint: string;
  preview?: string;
  fileName?: string;
  error?: string;
  onPick: (file: File | undefined) => void;
}) {
  return (
    <div data-field="signature_image" className="flex flex-col gap-2">
      <span className="text-sm font-bold text-fg">
        {label}
        <span className="ms-1 text-[#C44B4B]" aria-hidden>
          *
        </span>
      </span>
      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-6 text-center transition-colors hover:border-[#C0703E]",
          error ? "border-red-400" : "border-[#E4D9CC] dark:border-fg/15"
        )}
      >
        <input
          type="file"
          accept="image/png,image/jpeg"
          className="sr-only"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element -- local object URL preview of the picked file
          <img src={preview} alt="" className="max-h-28 rounded-lg bg-white object-contain p-2" />
        ) : (
          <Upload className="h-6 w-6 text-[#C0703E]" aria-hidden />
        )}
        <span className="text-sm font-semibold text-fg">{fileName ?? label}</span>
        <span className="text-xs text-brown">{hint}</span>
      </label>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </div>
  );
}

function Review({
  sections,
  hint,
  editLabel,
  onEdit,
}: {
  sections: { title: string; index: number; rows: { label: string; value: string }[] }[];
  hint: string;
  editLabel: string;
  onEdit: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-brown">{hint}</p>
      {sections.map((s) => (
        <div key={s.title} className="rounded-xl border border-[#EFE7DD] bg-[#FBF7F3] px-4 py-3 dark:border-fg/10 dark:bg-fg/[0.04]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="text-sm font-black text-fg">{s.title}</h4>
            <button type="button" onClick={() => onEdit(s.index)} className="text-xs font-bold text-[#C0703E] hover:underline">
              {editLabel}
            </button>
          </div>
          <dl className="grid gap-2">
            {s.rows.map((r) => (
              <div key={r.label} className="grid gap-0.5 sm:grid-cols-[minmax(0,12rem)_1fr] sm:gap-3">
                <dt className="text-xs font-semibold text-brown">{r.label}</dt>
                <dd className="whitespace-pre-line text-sm font-medium text-fg [overflow-wrap:anywhere]">{r.value || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-surface px-4 py-3 text-sm text-fg outline-none transition-colors placeholder:text-fg/35 focus:border-[#C0703E] focus:ring-2 focus:ring-[#C0703E]/15";

function FieldControl({
  field,
  value,
  error,
  onChange,
  t,
  ui,
}: {
  field: AlfiaField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (v: string | string[]) => void;
  t: (s: string) => string;
  ui: AlfiaFormUi;
}) {
  const id = `alfia-${field.name}`;
  const label = t(field.label);
  const help = field.help_text ? t(field.help_text) : null;
  const options = field.options ?? [];
  const wide = field.field_type === "textarea" || field.field_type === "checkbox" || options.length > 4 && field.field_type !== "select";
  const choiceAsCards =
    (field.field_type === "radio" || field.field_type === "select") &&
    options.length > 0 &&
    options.length <= 4 &&
    options.every((o) => t(o).length <= 42);
  const borderCls = error ? "border-red-400" : "border-[#E4D9CC] dark:border-fg/15";
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  const labelEl = (
    <span className="text-sm font-bold text-fg">
      {label}
      {field.is_required && (
        <span className="ms-1 text-[#C44B4B]" aria-hidden>
          *
        </span>
      )}
    </span>
  );

  let control: React.ReactNode;
  if (field.field_type === "checkbox" || choiceAsCards) {
    const multi = field.field_type === "checkbox";
    const selected = multi ? ((value as string[] | undefined) ?? []) : value;
    control = (
      <div
        role={multi ? "group" : "radiogroup"}
        aria-labelledby={`${id}-label`}
        aria-describedby={describedBy}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => {
          const checked = multi ? (selected as string[]).includes(opt) : selected === opt;
          return (
            <label
              key={opt}
              className={cn(
                "cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#C0703E]/40",
                checked
                  ? "border-[#C0703E] bg-[#FBF3EC] text-[#A85A2F] dark:bg-[#C0703E]/15 dark:text-[#f0b89a]"
                  : "border-[#E4D9CC] bg-surface text-fg/80 hover:border-[#C0703E]/60 dark:border-fg/15"
              )}
            >
              <input
                type={multi ? "checkbox" : "radio"}
                name={field.name}
                value={opt}
                checked={checked}
                required={!multi && field.is_required}
                onChange={(e) => {
                  if (multi) {
                    const cur = (selected as string[]) ?? [];
                    onChange(e.target.checked ? [...cur, opt] : cur.filter((x) => x !== opt));
                  } else onChange(opt);
                }}
                className="sr-only"
              />
              {t(opt)}
            </label>
          );
        })}
      </div>
    );
  } else if (field.field_type === "select") {
    control = (
      <select
        id={id}
        name={field.name}
        required={field.is_required}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        className={cn(inputBase, borderCls)}
      >
        <option value="" disabled>
          {ui.selectPlaceholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {t(opt)}
          </option>
        ))}
      </select>
    );
  } else if (field.field_type === "textarea") {
    control = (
      <textarea
        id={id}
        name={field.name}
        required={field.is_required}
        rows={4}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        className={cn(inputBase, borderCls, "resize-y")}
      />
    );
  } else {
    const isTel = field.field_type === "tel";
    const ltr = isTel || field.field_type === "email";
    control = (
      <input
        id={id}
        name={field.name}
        type={field.field_type === "email" ? "email" : isTel ? "tel" : "text"}
        required={field.is_required}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        inputMode={isTel ? "numeric" : undefined}
        pattern={isTel ? "05[0-9]{8}" : undefined}
        maxLength={isTel ? 10 : undefined}
        dir={ltr ? "ltr" : undefined}
        placeholder={isTel ? "05XXXXXXXX" : undefined}
        aria-describedby={describedBy}
        className={cn(inputBase, borderCls, ltr && "rtl:text-right")}
      />
    );
  }

  const isGroup = field.field_type === "checkbox" || choiceAsCards;
  return (
    <div data-field={field.name} className={cn("flex flex-col gap-2", wide && "sm:col-span-2")}>
      {isGroup ? <span id={`${id}-label`}>{labelEl}</span> : <label htmlFor={id}>{labelEl}</label>}
      {control}
      {help && (
        <span id={`${id}-help`} className="text-xs text-brown">
          {help}
        </span>
      )}
      {error && (
        <span id={`${id}-error`} className="text-xs font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
