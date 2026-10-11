// Public Alfia "venture application form" for Future Founders. GET returns the form
// definition; POST submits an application. The token is public by design.
export const FUTURE_FOUNDERS_FORM_URL =
  "https://api.venture.alfia.com.sa/api/public/venture-application-forms/onF4riq6wgDq1tM7PeY6yC0mwlk1o0BKGLItN7NdbbhbrBdAZzC6ckWS8dcZRBMz";

export type AlfiaFieldType = "text" | "email" | "tel" | "textarea" | "select" | "radio" | "checkbox" | "file";

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

/**
 * Copy and choices the client edits in Alfia's landing page (not in the field API): step titles,
 * welcome/success text, deadline, university list, city notes, programme dates and the pledge text.
 * Every value is bilingual "English | العربية".
 */
export interface AlfiaLanding {
  deadline: string | null;
  welcome: { title: string; body: string; note: string; start: string };
  success: { title: string; body: string };
  steps: Record<string, { title: string; description: string }>;
  cityNotes: Record<string, string>;
  periods: Record<string, string>;
  universities: string[];
  pledge: { solo: string; team: string };
}

export interface AlfiaForm {
  title: string;
  is_currently_accepting: boolean;
  application_opens_at: string | null;
  application_closes_at: string | null;
  system_fields: { name: string; label: string; field_type: AlfiaFieldType; is_required: boolean }[];
  fields: AlfiaField[];
  options: { incubators: AlfiaOption[]; programs: AlfiaOption[]; cohorts: AlfiaOption[] };
  landing: AlfiaLanding;
}

// Used when Alfia's landing page is missing or a piece of it can't be read.
const FALLBACK_LANDING: AlfiaLanding = {
  deadline: null,
  welcome: {
    title: "Your idea deserves a start! 🚀 | فكرتك تستاهل تبدأ! 🚀",
    body: "Five intense days to turn your passion for fintech into a real venture, solo or with your team. Registration takes less than 10 minutes. | خمسة أيام مكثفة تحوّل فيها شغفك بالتقنية المالية إلى مشروع حقيقي، سواء كنت لحالك أو مع فريقك. التسجيل ما ياخذ أكثر من 10 دقائق.",
    note: "Submission does not guarantee admission, and participation requires full attendance of the bootcamp days. | إرسال الطلب لا يعني القبول في المبادرة، والمشاركة تتطلب الحضور الكامل لأيام المعسكر.",
    start: "Start Registration | ابدأ التسجيل",
  },
  success: {
    title: "Thank you for your interest in Amad Future Founders! | شكرًا لاهتمامكم بمبادرة رواد امد!",
    body: "Your application has been received successfully. Our team will review all applications, and we will contact you by email if you are accepted into the program. | تم استلام طلبكم بنجاح، وسيقوم فريقنا بمراجعة جميع الطلبات، وسنتواصل معكم عبر البريد الإلكتروني في حال قبولكم في البرنامج.",
  },
  steps: {},
  cityNotes: {},
  periods: {},
  universities: [],
  pledge: {
    solo: "I pledge to attend all program activities during the implementation period set for the city I select below. | أتعهد بالالتزام بحضور جميع أنشطة البرنامج خلال فترة التنفيذ المحددة للمدينة التي أختارها أدناه.",
    team: "My team and I pledge to attend all program activities during the implementation period set for the city selected below. | أتعهد أنا وفريقي بالالتزام بحضور جميع أنشطة البرنامج خلال فترة التنفيذ المحددة للمدينة المختارة أدناه.",
  },
};

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** The markup between `<section id="…">` and the next section (or end of form). */
function sectionOf(html: string, id: string): string {
  const start = html.search(new RegExp(`<section[^>]*\\bid="${id}"`));
  if (start < 0) return "";
  const next = html.indexOf("<section", start + 8);
  return html.slice(start, next < 0 ? undefined : next);
}

const first = (html: string, re: RegExp) => {
  const m = html.match(re);
  return m ? decode(m[1]) : "";
};

function parseLanding(raw: string | null | undefined): AlfiaLanding {
  if (!raw) return FALLBACK_LANDING;
  const html = raw.replace(/\s+/g, " ");
  const landing: AlfiaLanding = structuredClone(FALLBACK_LANDING);
  try {
    landing.deadline = first(html, /(Applications open until[^<]*)/) || null;

    const welcome = sectionOf(html, "welcome-screen");
    const paragraphs = [...welcome.matchAll(/<p[^>]*>(.*?)<\/p>/g)].map((m) => decode(m[1]));
    landing.welcome = {
      title: first(welcome, /<h2[^>]*>(.*?)<\/h2>/) || landing.welcome.title,
      body: paragraphs[0] || landing.welcome.body,
      note: paragraphs[1] || landing.welcome.note,
      start: first(welcome, /id="welcome-start"[^>]*>\s*<span[^>]*>(.*?)<\/span>/) || landing.welcome.start,
    };

    // The success block holds an English then an Arabic heading/paragraph pair.
    const successStart = html.indexOf('id="form-success"');
    if (successStart >= 0) {
      const block = html.slice(successStart, html.indexOf("</form>", successStart));
      const h = [...block.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => decode(m[1]));
      const p = [...block.matchAll(/<p[^>]*>(.*?)<\/p>/g)].map((m) => decode(m[1]));
      if (h.length >= 2 && p.length >= 2) landing.success = { title: `${h[0]} | ${h[1]}`, body: `${p[0]} | ${p[1]}` };
    }

    for (const m of html.matchAll(/<section[^>]*\bid="([\w-]+)"[^>]*class="[^"]*step-screen/g)) {
      const section = sectionOf(html, m[1]);
      const title = first(section, /class="step-title"[^>]*>(.*?)<\/h2>/);
      if (title) landing.steps[m[1]] = { title, description: first(section, /class="step-description"[^>]*>(.*?)<\/p>/) };
    }

    for (const m of sectionOf(html, "step-start").matchAll(/<strong[^>]*>(.*?)<\/strong>\s*<small[^>]*>(.*?)<\/small>/g)) {
      landing.cityNotes[decode(m[1])] = decode(m[2]);
    }

    const uni = html.match(/<select[^>]*\bid="university"[^>]*>(.*?)<\/select>/);
    if (uni) {
      landing.universities = [...uni[1].matchAll(/<option[^>]*value="([^"]+)"/g)].map((m) => decode(m[1]));
    }

    // Programme dates and pledge text live in the landing page's script.
    const periods = raw.match(/var periods=\{([\s\S]*?)\};/);
    if (periods) {
      for (const m of periods[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)) landing.periods[m[1]] = m[2];
    }
    const solo = raw.match(/solo:\{s:'([^']+)'/);
    const team = raw.match(/team:\{s:'([^']+)'/);
    if (solo) landing.pledge.solo = solo[1];
    if (team) landing.pledge.team = team[1];
  } catch {
    // Keep whatever was parsed so far; the rest stays on the fallback copy.
  }
  return landing;
}

export async function getFutureFoundersForm(): Promise<AlfiaForm | null> {
  try {
    const res = await fetch(FUTURE_FOUNDERS_FORM_URL, {
      headers: { Accept: "application/json" },
      // Short cache so edits made in Alfia reach the site within a minute.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const form = json?.data?.form;
    if (!form?.fields || !form?.options) return null;
    const landing = parseLanding(form.landing_page_html);
    // The raw landing page is large; only the parsed copy is sent to the browser.
    delete form.landing_page_html;
    return { ...form, landing } as AlfiaForm;
  } catch {
    return null;
  }
}

// Public Alfia form for Amad IP. Unlike Future Founders, this one is shown exactly as Alfia designed
// it: we embed its own landing page and only route submissions through our server (Alfia's API
// doesn't send CORS headers for other domains).
export const AMAD_IP_FORM_URL =
  "https://api.venture.alfia.com.sa/api/public/venture-application-forms/xBZelGorII0xZ5WM750tccxpdNPzFV6aszA7p9KEmGLRj5J3ZGtvSbzsZQOk1W7I";
export const AMAD_IP_PROXY_PATH = "/api/apply/amad-ip";

// Injected into the embedded page: reports its content height so the iframe fits each step. Alfia's
// page stretches its wrapper to the viewport (min-height:100vh), so we measure the wrapper's
// children (header, card, footer) plus its bottom padding rather than the document height.
const EMBED_HEIGHT_SCRIPT = `<script>(function(){var last=0;function measure(){var max=0;Array.prototype.forEach.call(document.body.children,function(p){if(p.tagName==="SCRIPT")return;var pad=parseFloat(getComputedStyle(p).paddingBottom)||0;Array.prototype.forEach.call(p.children,function(c){if(c.tagName==="SCRIPT")return;max=Math.max(max,c.getBoundingClientRect().bottom+window.scrollY+pad);});});return Math.ceil(max||document.documentElement.scrollHeight);}function send(){var h=measure();if(Math.abs(h-last)>2){last=h;parent.postMessage({type:"alfia-embed-height",height:h},"*");}}var ro=new ResizeObserver(send);Array.prototype.forEach.call(document.body.children,function(p){Array.prototype.forEach.call(p.children,function(c){ro.observe(c);});});new MutationObserver(send).observe(document.body,{childList:true,subtree:true});window.addEventListener("load",send);send();})();</script>`;

/** Alfia's landing page for Amad IP, unchanged except that it posts to our proxy and reports its height. */
export async function getAmadIpEmbedHtml(): Promise<string | null> {
  try {
    const res = await fetch(AMAD_IP_FORM_URL, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const html: unknown = (await res.json())?.data?.form?.landing_page_html;
    if (typeof html !== "string" || !html.includes(AMAD_IP_FORM_URL)) return null;
    const routed = html.split(AMAD_IP_FORM_URL).join(AMAD_IP_PROXY_PATH);
    return routed.includes("</body>") ? routed.replace("</body>", `${EMBED_HEIGHT_SCRIPT}</body>`) : routed + EMBED_HEIGHT_SCRIPT;
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
