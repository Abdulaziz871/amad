"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, Loader2, AlertCircle, UserRound, Users } from "lucide-react";
import { localizedPart, type AlfiaField, type AlfiaForm } from "@/lib/alfia";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";
import type { AlfiaFormUi } from "@/lib/content/types";

type Values = Record<string, string | string[]>;
type Errors = Record<string, string>;

// The form asks "are you applying as a team?" twice (a radio and a select); we show the select,
// which drives the conditional team fields, and mirror the answer into the radio and startup_name.
const TEAM_FIELD = "applying_as_team";
const TEAM_MIRROR_FIELD = "are_you_applying_as_a_team";

const SECTIONS: { key: keyof AlfiaFormUi; fields: string[] }[] = [
  { key: "sectionPersonal", fields: ["founder_name", "founder_email", "mobile", "city", "gender", "university", "major", "current_status"] },
  { key: "sectionSkills", fields: ["skills", "preferred_role", "team_contribution", "prior_participation", "prior_experience", "working_style", "self_description"] },
  { key: "sectionCommitment", fields: ["attend_all", "weekly_availability", "commitments"] },
];

const MEMBER_RE = /^member(\d+)_/;
const isYes = (v: unknown) => typeof v === "string" && v.startsWith("Yes");

export function AlfiaApplicationForm({
  form,
  locale,
  ui,
  tone,
}: {
  form: AlfiaForm;
  locale: Locale;
  ui: AlfiaFormUi;
  tone: { text: string; bg: string; border: string; ring: string };
}) {
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [banner, setBanner] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const t = (s: string) => localizedPart(s, locale);

  const fields = useMemo(() => {
    const system = form.system_fields
      .filter((f) => f.name === "founder_name" || f.name === "founder_email")
      .map<AlfiaField>((f, i) => ({ ...f, id: -1 - i, order: -10 + i, options: null, condition: null }));
    return [...system, ...form.fields.filter((f) => f.name !== TEAM_MIRROR_FIELD)].sort((a, b) => a.order - b.order);
  }, [form]);
  const byName = useMemo(() => new Map(fields.map((f) => [f.name, f])), [fields]);

  const teamSize = Number.parseInt(String(values.team_size ?? ""), 10) || 2;

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

  const sectioned = new Set(SECTIONS.flatMap((s) => s.fields));
  const teamFields = fields.filter((f) => !sectioned.has(f.name));
  const memberNumbers = [...new Set(teamFields.map((f) => f.name.match(MEMBER_RE)?.[1]).filter(Boolean))] as string[];

  function cohortIdFor(city: string | undefined): number | undefined {
    const cohorts = form.options.cohorts;
    if (cohorts.length === 1) return cohorts[0].id;
    const en = city ? localizedPart(city, "en").toLowerCase() : "";
    return cohorts.find((c) => en && c.name.toLowerCase().includes(en))?.id;
  }

  function buildPayload() {
    const custom: Record<string, string | string[]> = {};
    for (const f of form.fields) {
      if (f.name === TEAM_MIRROR_FIELD) continue;
      const field = byName.get(f.name);
      if (!field || !isVisible(field)) continue;
      const v = values[f.name];
      if (v === undefined || (Array.isArray(v) ? v.length === 0 : v.trim() === "")) continue;
      custom[f.name] = Array.isArray(v) ? v : v.trim();
    }
    // Mirror the team answer into the duplicate radio question, matching by option position.
    const selectOpts = byName.get(TEAM_FIELD)?.options ?? [];
    const mirrorOpts = form.fields.find((f) => f.name === TEAM_MIRROR_FIELD)?.options ?? [];
    const teamAnswer = values[TEAM_FIELD] as string | undefined;
    const idx = teamAnswer ? selectOpts.indexOf(teamAnswer) : -1;
    if (idx >= 0 && mirrorOpts[idx]) custom[TEAM_MIRROR_FIELD] = mirrorOpts[idx];

    return {
      incubator_id: form.options.incubators[0]?.id,
      program_id: form.options.programs[0]?.id,
      cohort_id: cohortIdFor(values.city as string | undefined),
      // The form maps its "startup name" system field to the team question.
      startup_name: teamAnswer ?? String(values.founder_name ?? ""),
      founder_name: String(values.founder_name ?? "").trim(),
      founder_email: String(values.founder_email ?? "").trim(),
      custom_fields: custom,
    };
  }

  function scrollToFirstError(names: string[]) {
    const first = names.map((n) => formRef.current?.querySelector(`[data-field="${n}"]`)).find(Boolean);
    first?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBanner(null);
    const missing: Errors = {};
    for (const f of fields) {
      if (f.field_type === "checkbox" && f.is_required && isVisible(f) && !(values[f.name] as string[] | undefined)?.length) {
        missing[f.name] = ui.chooseAtLeastOne;
      }
    }
    if (Object.keys(missing).length) {
      setErrors(missing);
      scrollToFirstError(Object.keys(missing));
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/apply/future-founders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) {
        setStatus("success");
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const data = await res.json().catch(() => ({}));
      const next: Errors = {};
      for (const [key, messages] of Object.entries((data?.errors ?? {}) as Record<string, string[]>)) {
        const name = key.replace(/^custom_fields\./, "");
        next[byName.has(name) ? name : "_form"] = messages[0];
      }
      setErrors(next);
      setBanner(Object.keys(next).length ? ui.errorFields : data?.message || ui.errorGeneric);
      setStatus("idle");
      scrollToFirstError(Object.keys(next));
    } catch {
      setBanner(ui.errorGeneric);
      setStatus("idle");
    }
  }

  if (!form.is_currently_accepting) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <AlertCircle className={cn("h-12 w-12", tone.text)} aria-hidden />
        <p className="mt-4 text-lg font-bold text-ink">{ui.closedTitle}</p>
        <p className="mt-2 max-w-md text-sm text-brown">{ui.closedBody}</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center py-12 text-center" role="status">
        <CheckCircle2 className={cn("h-14 w-14", tone.text)} aria-hidden />
        <p className="mt-4 text-xl font-bold text-ink">{ui.successTitle}</p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-brown sm:text-base">{ui.successBody}</p>
      </div>
    );
  }

  const renderField = (f: AlfiaField) =>
    isVisible(f) ? (
      <FieldControl
        key={f.name}
        field={f}
        value={values[f.name]}
        error={errors[f.name]}
        onChange={(v) => setValue(f.name, v)}
        t={t}
        ui={ui}
        tone={tone}
      />
    ) : null;

  const isTeam = values[TEAM_FIELD] === byName.get(TEAM_FIELD)?.options?.[0];
  const teamGeneral = teamFields.filter((f) => !MEMBER_RE.test(f.name));

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
      {SECTIONS.map((section, i) => (
        <FormSection key={section.key} index={i + 1} title={ui[section.key]} tone={tone}>
          {section.fields.map((n) => byName.get(n)).filter(Boolean).map((f) => renderField(f!))}
        </FormSection>
      ))}

      <FormSection index={SECTIONS.length + 1} title={ui.sectionTeam} tone={tone}>
        {teamGeneral.filter((f) => ["applying_as_team", "team_idea", "team_complete", "team_size", "leader_contribution"].includes(f.name)).map(renderField)}

        {isTeam &&
          memberNumbers.map((n) => {
            const memberFields = teamFields.filter((f) => f.name.startsWith(`member${n}_`));
            if (!memberFields.some(isVisible)) return null;
            return (
              <div key={n} className="sm:col-span-2 rounded-2xl border border-ink/[0.07] bg-cream/60 p-5 sm:p-6">
                <p className="mb-4 flex items-center gap-2 text-sm font-bold text-ink">
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg text-white", tone.bg)}>
                    <UserRound className="h-4 w-4" aria-hidden />
                  </span>
                  {ui.member} {n}
                </p>
                <div className="grid gap-5 sm:grid-cols-2">{memberFields.map(renderField)}</div>
              </div>
            );
          })}

        {teamGeneral.filter((f) => !["applying_as_team", "team_idea", "team_complete", "team_size", "leader_contribution"].includes(f.name)).map(renderField)}
      </FormSection>

      {banner && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <span>
            {banner}
            {errors._form && <span className="mt-1 block">{errors._form}</span>}
          </span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-semibold text-white transition-all disabled:opacity-70",
          tone.bg
        )}
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            {ui.submitting}
          </>
        ) : (
          <>
            <Users className="h-5 w-5" aria-hidden />
            {ui.submit}
          </>
        )}
      </button>
    </form>
  );
}

function FormSection({
  index,
  title,
  tone,
  children,
}: {
  index: number;
  title: string;
  tone: { text: string; bg: string };
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-3xl border border-ink/[0.07] bg-white p-5 sm:p-7">
      <legend className="sr-only">{title}</legend>
      <div className="mb-6 flex items-center gap-3" aria-hidden>
        <span className={cn("flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold text-white", tone.bg)}>
          {index}
        </span>
        <span className="text-lg font-bold text-ink">{title}</span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

const inputBase =
  "w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35";

function FieldControl({
  field,
  value,
  error,
  onChange,
  t,
  ui,
  tone,
}: {
  field: AlfiaField;
  value: string | string[] | undefined;
  error?: string;
  onChange: (v: string | string[]) => void;
  t: (s: string) => string;
  ui: AlfiaFormUi;
  tone: { text: string; bg: string; border: string; ring: string };
}) {
  const id = `alfia-${field.name}`;
  const label = t(field.label);
  const help = field.help_text ? t(field.help_text) : null;
  const options = field.options ?? [];
  const wide = field.field_type === "textarea" || field.field_type === "checkbox" || options.length > 4;
  const choiceAsPills =
    (field.field_type === "radio" || field.field_type === "select") &&
    options.length > 0 &&
    options.length <= 4 &&
    options.every((o) => t(o).length <= 42);
  const borderCls = error ? "border-red-400" : cn("border-ink/15", tone.border);
  const describedBy = [help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  const labelEl = (
    <span className="text-sm font-semibold text-ink">
      {label}
      {field.is_required && <span className={cn("ms-1", tone.text)} aria-hidden>*</span>}
    </span>
  );

  let control: React.ReactNode;
  if (field.field_type === "checkbox" || choiceAsPills) {
    const multi = field.field_type === "checkbox";
    const selected = multi ? ((value as string[] | undefined) ?? []) : value;
    control = (
      <div role={multi ? "group" : "radiogroup"} aria-labelledby={`${id}-label`} aria-describedby={describedBy} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const checked = multi ? (selected as string[]).includes(opt) : selected === opt;
          return (
            <label
              key={opt}
              className={cn(
                "cursor-pointer rounded-full border px-4 py-2 text-sm transition-all has-[:focus-visible]:ring-2",
                tone.ring,
                checked ? cn("border-transparent text-white", tone.bg) : "border-ink/15 bg-cream text-ink/80 hover:border-ink/30"
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
      <div className="relative">
        <select
          id={id}
          name={field.name}
          required={field.is_required}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={describedBy}
          className={cn(inputBase, borderCls, "appearance-none pe-10")}
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
        <ChevronDown className="pointer-events-none absolute top-1/2 end-3.5 h-4 w-4 -translate-y-1/2 text-ink/50" aria-hidden />
      </div>
    );
  } else if (field.field_type === "textarea") {
    control = (
      <textarea
        id={id}
        name={field.name}
        required={field.is_required}
        rows={3}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(e.target.value)}
        aria-describedby={describedBy}
        className={cn(inputBase, borderCls, "resize-y")}
      />
    );
  } else {
    const isTel = field.field_type === "tel";
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
        dir={isTel || field.field_type === "email" ? "ltr" : undefined}
        placeholder={isTel ? "05XXXXXXXX" : undefined}
        aria-describedby={describedBy}
        className={cn(inputBase, borderCls, (isTel || field.field_type === "email") && "rtl:text-right")}
      />
    );
  }

  const isGroup = field.field_type === "checkbox" || choiceAsPills;
  return (
    <div data-field={field.name} className={cn("flex flex-col gap-2", wide && "sm:col-span-2")}>
      {isGroup ? (
        <span id={`${id}-label`}>{labelEl}</span>
      ) : (
        <label htmlFor={id}>{labelEl}</label>
      )}
      {control}
      {help && (
        <span id={`${id}-help`} className="text-xs text-ink/50">
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
