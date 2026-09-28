"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, ArrowLeft, CheckCircle2, Info, Loader2, UserRound } from "lucide-react";
import { localizedPart, type AlfiaField, type AlfiaForm } from "@/lib/alfia";
import type { Locale } from "@/i18n/config";
import type { AlfiaFormUi } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Values = Record<string, string | string[]>;
type Errors = Record<string, string>;

// Copy from Alfia's own landing page for this form (bilingual "English | العربية").
const WELCOME = {
  title: "Your idea deserves a start! 🚀 | فكرتك تستاهل تبدأ! 🚀",
  body: "Five intense days to turn your passion for fintech into a real venture, solo or with your team. Registration takes less than 10 minutes. | خمسة أيام مكثفة تحوّل فيها شغفك بالتقنية المالية إلى مشروع حقيقي، سواء كنت لحالك أو مع فريقك. التسجيل ما ياخذ أكثر من 10 دقائق.",
  note: "Submission does not guarantee admission, and participation requires full attendance of the bootcamp days. | إرسال الطلب لا يعني القبول في المبادرة، والمشاركة تتطلب الحضور الكامل لأيام المعسكر.",
  start: "Start Registration | ابدأ التسجيل",
  success: "Your application has been received! We'll contact you after the initial screening. | تم استلام طلبك بنجاح! بنتواصل معك بعد الفرز الأولي.",
};

// The form asks "are you applying as a team?" twice; we show the select that drives the
// conditional team fields and mirror the answer into the duplicate radio question.
const TEAM_FIELD = "applying_as_team";
const TEAM_MIRROR_FIELD = "are_you_applying_as_a_team";
const MEMBER_RE = /^member(\d+)_/;
const isYes = (v: unknown) => typeof v === "string" && v.startsWith("Yes");

interface Step {
  id: string;
  title: string;
  fields: string[];
  members?: boolean;
  review?: boolean;
}

// Steps follow Alfia's landing page. The team path also collects the leader's skills, style and
// commitment, which the API requires for every applicant.
const START: Step = { id: "start", title: "Start | البداية", fields: ["city", TEAM_FIELD] };
const REVIEW: Step = { id: "review", title: "Review & Submit | مراجعة وإرسال", fields: [], review: true };
const SOLO_STEPS: Step[] = [
  { id: "solo-basic", title: "Basic Information | البيانات الأساسية", fields: ["founder_name", "founder_email", "mobile", "gender", "university", "major", "current_status"] },
  { id: "solo-skills", title: "Skills & Role | المهارات والدور", fields: ["skills", "preferred_role", "team_contribution"] },
  { id: "solo-experience", title: "Experience | الخبرة", fields: ["prior_participation", "prior_experience"] },
  { id: "solo-style", title: "Working Style | أسلوب العمل", fields: ["working_style", "self_description"] },
  { id: "solo-commitment", title: "Commitment | الالتزام", fields: ["attend_all", "weekly_availability", "commitments"] },
];
const TEAM_STEPS: Step[] = [
  { id: "team-info", title: "Team Information | معلومات الفريق", fields: ["startup_name", "team_idea", "team_complete", "team_size"] },
  { id: "team-leader", title: "Team Leader Information | معلومات قائد الفريق", fields: ["founder_name", "founder_email", "mobile", "gender", "university", "major", "current_status", "skills", "preferred_role", "leader_contribution"] },
  { id: "team-members", title: "Team Members | أعضاء الفريق", fields: [], members: true },
  { id: "team-experience", title: "Team Experience | خبرات الفريق", fields: ["worked_together", "team_prior_programs", "team_prior_programs_detail", "prior_participation", "prior_experience"] },
  { id: "team-commitment", title: "Commitment | الالتزام", fields: ["working_style", "self_description", "attend_all", "weekly_availability", "commitments"] },
];

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
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLDivElement>(null);
  const t = (s: string) => localizedPart(s, locale);

  const fields = useMemo(() => {
    const system = form.system_fields
      .filter((f) => ["founder_name", "founder_email", "startup_name"].includes(f.name))
      .map<AlfiaField>((f, i) => ({
        ...f,
        // Alfia's system label for startup_name is mis-set; its landing page labels it "Team Name".
        label: f.name === "startup_name" ? "Team Name | اسم الفريق" : f.label,
        id: -1 - i,
        order: -10 + i,
        options: null,
        condition: null,
      }));
    return [...system, ...form.fields.filter((f) => f.name !== TEAM_MIRROR_FIELD)];
  }, [form]);
  const byName = useMemo(() => new Map(fields.map((f) => [f.name, f])), [fields]);

  const teamOptions = byName.get(TEAM_FIELD)?.options ?? [];
  const isTeam = !!values[TEAM_FIELD] && values[TEAM_FIELD] === teamOptions[0];
  const teamSize = Number.parseInt(String(values.team_size ?? ""), 10) || 2;

  const steps = useMemo(() => {
    const path = isTeam ? TEAM_STEPS : SOLO_STEPS;
    // Any field the client adds in Alfia later lands in the last content step.
    const placed = new Set([...START.fields, ...path.flatMap((s) => s.fields), "startup_name", "team_contribution", "leader_contribution"]);
    const extra = form.fields
      .map((f) => f.name)
      .filter((n) => n !== TEAM_MIRROR_FIELD && !placed.has(n) && !MEMBER_RE.test(n))
      .filter((n) => isTeam || !byName.get(n)?.condition);
    const withExtra = path.map((s, i) => (i === path.length - 1 ? { ...s, fields: [...s.fields, ...extra] } : s));
    return [START, ...withExtra, REVIEW];
  }, [isTeam, form.fields, byName]);
  const step = steps[stepIndex];

  function isVisible(f: AlfiaField): boolean {
    if (f.condition && values[f.condition.field_name] !== f.condition.value) return false;
    const member = f.name.match(MEMBER_RE);
    if (member && Number(member[1]) > teamSize - 1) return false;
    if (f.name === "team_prior_programs_detail" && !isYes(values.team_prior_programs)) return false;
    return true;
  }

  function setValue(name: string, value: string | string[]) {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  const memberNumbers = useMemo(
    () => [...new Set(form.fields.map((f) => f.name.match(MEMBER_RE)?.[1]).filter(Boolean))] as string[],
    [form.fields]
  );

  function stepFieldNames(s: Step): string[] {
    if (s.members) return form.fields.filter((f) => MEMBER_RE.test(f.name)).map((f) => f.name);
    return s.fields;
  }

  function validateStep(): boolean {
    const container = stepRef.current;
    if (!container) return true;
    const missing: Errors = {};
    for (const name of stepFieldNames(step)) {
      const f = byName.get(name);
      if (f?.field_type === "checkbox" && f.is_required && isVisible(f) && !(values[name] as string[] | undefined)?.length) {
        missing[name] = ui.chooseAtLeastOne;
      }
    }
    if (Object.keys(missing).length) {
      setErrors((prev) => ({ ...prev, ...missing }));
      container.querySelector(`[data-field="${Object.keys(missing)[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    const controls = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
    for (const el of controls) {
      if (!el.checkValidity()) {
        el.reportValidity();
        return false;
      }
    }
    return true;
  }

  function goTo(index: number) {
    setBanner(null);
    setStepIndex(index);
    requestAnimationFrame(() => cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function next() {
    if (!validateStep()) return;
    goTo(Math.min(stepIndex + 1, steps.length - 1));
  }

  function cohortIdFor(city: string | undefined): number | undefined {
    const cohorts = form.options.cohorts;
    if (cohorts.length === 1) return cohorts[0].id;
    const en = city ? localizedPart(city, "en").toLowerCase() : "";
    return cohorts.find((c) => en && c.name.toLowerCase().includes(en))?.id;
  }

  function buildPayload() {
    const custom: Record<string, string | string[]> = {};
    const included = new Set(steps.flatMap(stepFieldNames));
    for (const f of form.fields) {
      if (f.name === TEAM_MIRROR_FIELD || !included.has(f.name)) continue;
      const field = byName.get(f.name);
      if (!field || !isVisible(field)) continue;
      const v = values[f.name];
      if (v === undefined || (Array.isArray(v) ? v.length === 0 : v.trim() === "")) continue;
      custom[f.name] = Array.isArray(v) ? v : v.trim();
    }
    // In the team path the leader describes their contribution once; it answers both questions.
    if (isTeam && !custom.team_contribution && typeof values.leader_contribution === "string") {
      custom.team_contribution = values.leader_contribution.trim();
    }
    const mirrorOpts = form.fields.find((f) => f.name === TEAM_MIRROR_FIELD)?.options ?? [];
    const idx = teamOptions.indexOf(values[TEAM_FIELD] as string);
    if (idx >= 0 && mirrorOpts[idx]) custom[TEAM_MIRROR_FIELD] = mirrorOpts[idx];

    const founderName = String(values.founder_name ?? "").trim();
    return {
      incubator_id: form.options.incubators[0]?.id,
      program_id: form.options.programs[0]?.id,
      cohort_id: cohortIdFor(values.city as string | undefined),
      startup_name: isTeam ? String(values.startup_name ?? "").trim() : founderName,
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
        body: JSON.stringify(buildPayload()),
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
      const firstStep = steps.findIndex((s) => stepFieldNames(s).some((n) => next[n]));
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
      <div className="mx-auto max-w-[720px] rounded-2xl bg-white px-6 py-12 text-center shadow-[0_28px_70px_-30px_rgba(12,35,65,0.35)]">
        <AlertCircle className="mx-auto h-12 w-12 text-copper" aria-hidden />
        <p className="mt-4 text-lg font-bold text-ink">{ui.closedTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-brown">{ui.closedBody}</p>
      </div>
    );
  }

  const renderField = (name: string) => {
    const f = byName.get(name);
    if (!f || !isVisible(f)) return null;
    return (
      <FieldControl
        key={f.name}
        field={f}
        value={values[f.name]}
        error={errors[f.name]}
        onChange={(v) => setValue(f.name, v)}
        t={t}
        ui={ui}
      />
    );
  };

  const stepCount = steps.length;
  const progress = Math.round(((stepIndex + 1) / stepCount) * 100);
  const primaryBtn =
    "inline-flex items-center gap-2 rounded-xl border border-[#C0703E] bg-[#C0703E] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(192,112,62,0.2)] transition-all hover:-translate-y-px hover:shadow-[0_11px_24px_rgba(192,112,62,0.28)] disabled:opacity-70";

  return (
    <div
      ref={cardRef}
      className="mx-auto max-w-[720px] scroll-mt-28 overflow-hidden rounded-2xl bg-white text-ink shadow-[0_28px_70px_-30px_rgba(12,35,65,0.35)] ring-1 ring-ink/[0.05]"
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
            <div
              className="mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-[22px] bg-[#FBF3EC] text-[35px] shadow-[0_10px_26px_rgba(192,112,62,0.14)]"
              aria-hidden
            >
              🚀
            </div>
            <h3 className="text-[clamp(1.6rem,4.5vw,2.35rem)] font-black leading-tight text-ink">{t(WELCOME.title)}</h3>
            <p className="mx-auto mt-4 max-w-[610px] text-[15px] leading-[1.8] text-[#626C80]">{t(WELCOME.body)}</p>
            <div className="mx-auto mb-7 mt-6 flex max-w-[610px] items-start gap-3 rounded-xl bg-[#F6F1EA] p-4 text-start">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#C0703E]" aria-hidden />
              <p className="text-[13px] leading-[1.75] text-[#596276]">{t(WELCOME.note)}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setStage("steps");
                goTo(0);
              }}
              className={cn(primaryBtn, "px-7 py-3.5")}
            >
              {t(WELCOME.start)}
              <ArrowLeft className="h-4 w-4 ltr:rotate-180" aria-hidden />
            </button>
          </motion.section>
        )}

        {stage === "steps" && (
          <motion.div key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div className="h-1.5 bg-[#F6F1EA]" aria-hidden>
              <motion.div className="h-full bg-[#C0703E]" animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
            </div>

            <div className="px-6 py-8 sm:px-10 sm:py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  ref={stepRef}
                  initial={{ opacity: 0, x: locale === "ar" ? -16 : 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-7">
                    <p className="text-xs font-bold tracking-wider text-[#C0703E]">
                      {ui.step} {stepIndex + 1} / {stepCount}
                    </p>
                    <h3 className="mt-2 text-2xl font-black text-ink">{t(step.title)}</h3>
                  </div>

                  {step.review ? (
                    <ReviewList
                      hint={ui.reviewHint}
                      rows={steps
                        .filter((s) => !s.review)
                        .flatMap(stepFieldNames)
                        .map((n) => byName.get(n))
                        .filter((f): f is AlfiaField => !!f && isVisible(f) && String(values[f.name] ?? "").trim() !== "")
                        .map((f) => {
                          const v = values[f.name];
                          return {
                            label: t(f.label),
                            value: Array.isArray(v) ? v.map(t).join("، ") : f.options?.length ? t(v) : v,
                          };
                        })}
                    />
                  ) : step.members ? (
                    <div className="flex flex-col gap-4">
                      {memberNumbers.map((n) => {
                        const memberFields = form.fields.filter((f) => f.name.startsWith(`member${n}_`));
                        if (!memberFields.some(isVisible)) return null;
                        return (
                          <div key={n} className="rounded-2xl border border-[#E4D9CC] bg-[#FBF7F3] p-5">
                            <p className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
                              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C0703E] text-white">
                                <UserRound className="h-4 w-4" aria-hidden />
                              </span>
                              {ui.member} {n}
                            </p>
                            <div className="grid gap-5 sm:grid-cols-2">{memberFields.map((f) => renderField(f.name))}</div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="grid gap-5 sm:grid-cols-2">{step.fields.map(renderField)}</div>
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

              <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#EFE7DD] pt-6">
                <button
                  type="button"
                  onClick={() => (stepIndex === 0 ? setStage("welcome") : goTo(stepIndex - 1))}
                  className="rounded-xl border border-[#E4D9CC] bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-[#C0703E]"
                >
                  {ui.back}
                </button>
                {step.review ? (
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
            <div className="mx-auto mb-6 flex h-[78px] w-[78px] items-center justify-center rounded-[22px] bg-[#FBF3EC] text-[#C0703E]">
              <CheckCircle2 className="h-10 w-10" aria-hidden />
            </div>
            <h3 className="mx-auto max-w-md text-[1.6rem] font-black leading-snug text-ink">{t(WELCOME.success)}</h3>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReviewList({ rows, hint }: { rows: { label: string; value: string }[]; hint: string }) {
  return (
    <div>
      <p className="mb-4 text-sm text-[#626C80]">{hint}</p>
      <dl className="grid gap-3">
        {rows.map((r) => (
          <div key={r.label} className="rounded-xl border border-[#EFE7DD] bg-[#FBF7F3] px-4 py-3">
            <dt className="text-xs font-semibold text-[#8A7F73]">{r.label}</dt>
            <dd className="mt-1 whitespace-pre-line text-sm font-medium text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-[#C0703E] focus:ring-2 focus:ring-[#C0703E]/15";

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
  const wide = field.field_type === "textarea" || field.field_type === "checkbox" || options.length > 4;
  const choiceAsCards =
    (field.field_type === "radio" || field.field_type === "select") &&
    options.length > 0 &&
    options.length <= 4 &&
    options.every((o) => t(o).length <= 42);
  const borderCls = error ? "border-red-400" : "border-[#E4D9CC]";
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  const labelEl = (
    <span className="text-sm font-bold text-ink">
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
                checked ? "border-[#C0703E] bg-[#FBF3EC] text-[#A85A2F]" : "border-[#E4D9CC] bg-white text-ink/80 hover:border-[#C0703E]/60"
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
        pattern={isTel ? "[0-9]{10}" : undefined}
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
        <span id={`${id}-help`} className="text-xs text-[#8A7F73]">
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
