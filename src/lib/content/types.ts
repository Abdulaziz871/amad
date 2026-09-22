export type ProgramSlug = "ip" | "bootcamps" | "venture-clinic";

export interface Stat {
  value: string;
  label: string;
}

export interface FormField {
  name: string;
  label: string;
  type: "text" | "select" | "textarea" | "file";
  placeholder?: string;
  options?: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ProgramSummary {
  slug: ProgramSlug;
  title: string;
  englishName: string;
  description: string;
  features: string[];
  cta: string;
}

export interface ProgramDetail {
  slug: ProgramSlug;
  englishName: string;
  title: string;
  intro: string;
  audience: string;
  benefits: {
    title: string;
    items: string[];
  };
  journey: {
    title: string;
    steps: string[];
  };
  form: {
    title: string;
    subtitle: string;
    extraFields: FormField[];
    embedUrl?: string;
  };
  cta: string;
}

export interface JourneyMilestone {
  title: string;
  timing: string;
}

export interface WhyAmadCard {
  title: string;
  description: string;
}

export interface SiteContent {
  brandName: string;
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    about: string;
    programs: string;
    journey: string;
    faq: string;
    gallery: string;
    registerInterest: string;
    langSwitch: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    programsStripLabel: string;
  };
  about: {
    title: string;
    paragraphs: string[];
  };
  whyAmad: {
    eyebrow: string;
    title: string;
    cards: WhyAmadCard[];
    stats: Stat[];
  };
  programsOverview: {
    learnMore: string;
    pathwayNote: string;
  };
  programs: ProgramSummary[];
  programDetails: Record<ProgramSlug, ProgramDetail>;
  journey: {
    eyebrow: string;
    title: string;
    tagline: string;
    milestones: JourneyMilestone[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  partners: {
    title: string;
    sponsorshipLine: string;
    alinma: { name: string; description: string };
    falak: { name: string; description: string };
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  footer: {
    quickLinks: string;
    registerInterest: string;
    legal: string;
  };
  finalCta: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    trackLabel: string;
    trackPlaceholder: string;
    submit: string;
    notice: string;
  };
  applicationForm: {
    nameLabel: string;
    emailLabel: string;
    phoneLabel: string;
    agreeLabel: string;
    submit: string;
    successTitle: string;
    successBody: string;
  };
}

