// Public Alfia "venture application form" for Future Founders. GET returns the form
// definition; POST submits an application. The token is public by design.
export const FUTURE_FOUNDERS_FORM_URL =
  "https://api.venture.alfia.com.sa/api/public/venture-application-forms/onF4riq6wgDq1tM7PeY6yC0mwlk1o0BKGLItN7NdbbhbrBdAZzC6ckWS8dcZRBMz";

export type AlfiaFieldType = "text" | "email" | "tel" | "textarea" | "select" | "radio" | "checkbox";

export interface AlfiaField {
  id: number;
  name: string;
  label: string;
  field_type: AlfiaFieldType;
  is_required: boolean;
  order: number;
  placeholder?: string | null;
  help_text?: string | null;
  options?: string[] | null;
  condition?: { field_name: string; operator: "equals"; value: string } | null;
}

export interface AlfiaOption {
  id: number;
  name: string;
  slug: string;
  incubator_id?: number;
  program_id?: number;
}

export interface AlfiaForm {
  title: string;
  is_currently_accepting: boolean;
  application_opens_at: string | null;
  application_closes_at: string | null;
  system_fields: { name: string; label: string; field_type: AlfiaFieldType; is_required: boolean }[];
  fields: AlfiaField[];
  options: { incubators: AlfiaOption[]; programs: AlfiaOption[]; cohorts: AlfiaOption[] };
}

export async function getFutureFoundersForm(): Promise<AlfiaForm | null> {
  try {
    const res = await fetch(FUTURE_FOUNDERS_FORM_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const form = json?.data?.form;
    if (!form?.fields || !form?.options) return null;
    // The landing page HTML is large and unused by our own form.
    delete form.landing_page_html;
    return form as AlfiaForm;
  } catch {
    return null;
  }
}

/** Alfia labels and options are bilingual: "English | العربية". */
export function localizedPart(value: string, locale: "ar" | "en"): string {
  const parts = value.split(" | ");
  if (parts.length < 2) return value;
  return (locale === "ar" ? parts.slice(1).join(" | ") : parts[0]).trim();
}
