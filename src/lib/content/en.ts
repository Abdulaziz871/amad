import type { SiteContent } from "./types";

export const en: SiteContent = {
  brandName: "Amad",
  meta: {
    title: "Amad - Innovation & Entrepreneurship Ecosystem by Alinma Bank",
    description: "Amad walks with you from idea to venture — IP protection, founder development, and hands-on venture support, by Alinma Bank and Falak Investment Hub. Register now.",
  },
  nav: {
    home: "Home",
    about: "About",
    programs: "Programs",
    journey: "Journey",
    faq: "FAQ",
    gallery: "Graduates",
    registerInterest: "Register your interest",
    langSwitch: "العربية",
  },
  hero: {
    eyebrow: "In partnership between Alinma Bank and Falak Investment Hub",
    title: "Where an idea begins — and its impact endures.",
    titleHighlight: "impact",
    subtitle: "Amad is an integrated innovation and entrepreneurship ecosystem that walks with you step by step: protecting your idea, building you as a founder, and growing your venture.",
    ctaPrimary: "Register your interest",
    ctaSecondary: "Explore the programs",
    programsStripLabel: "Amad's three programs",
  },
  about: {
    title: "About Amad",
    paragraphs: [
      "Amad is not a one-off competition. It is a year-long innovation and entrepreneurship ecosystem launched by Alinma Bank in partnership with Falak Investment Hub, connecting three programs into one journey: protecting intellectual property, developing future founders, and supporting ventures all the way to the final showcase.",
      "We believe innovation needs more than enthusiasm — it needs trusted knowledge, real enablement, and companionship that doesn't stop at the finish line. Amad is built to be your reference in the field before it is your program in the journey.",
    ],
  },
  whyAmad: {
    eyebrow: "Why Amad",
    title: "Why Amad",
    cards: [
      {
        title: "One connected journey",
        description: "Three linked programs covering the full journey, from protecting the idea to growing the venture.",
      },
      {
        title: "Trusted knowledge",
        description: "Content and expertise from the heart of the sector — innovation, fintech, and enablement — from a source you trust.",
      },
      {
        title: "Enabling partners",
        description: "Alinma's banking depth and Falak's venture-building expertise, in one ecosystem.",
      },
      {
        title: "Measured impact",
        description: "Clear milestones, continuous follow-up, and a final showcase that celebrates outcomes in front of the sector.",
      },
    ],
    stats: [
      { value: "3", label: "Programs" },
      { value: "3", label: "Cities" },
      { value: "500+", label: "Targeted participants" },
      { value: "30+", label: "Mentors & experts" },
      { value: "15+", label: "Partner entities" },
    ],
  },
  programsOverview: {
    learnMore: "Learn more",
  },
  programs: [
    {
      slug: "ip",
      title: "Amad IP",
      englishName: "Amad IP",
      description: "Your idea is an asset worth protecting. Amad IP walks innovators through understanding their rights, protecting their ideas, and turning them into opportunities ready to grow.",
      features: [
        "IP fundamentals workshops",
        "Specialist guidance on registration and protection",
        "Market-readiness assessment",
      ],
      cta: "Protect your idea",
    },
    {
      slug: "bootcamps",
      title: "Future Founders",
      englishName: "Future Founders",
      description: "Talent alone doesn't make a founder — focus and practice do. Future Founders is a hands-on program delivered across three cities, taking young talent from curiosity to a real first step in founding.",
      features: [
        "Intensive bootcamps in your city",
        "Practical founding skills from idea to first prototype",
        "Mentorship from founders and sector experts",
      ],
      cta: "Start your founder journey",
    },
    {
      slug: "venture-clinic",
      title: "Venture Clinic",
      englishName: "Venture Clinic",
      description: "Every startup needs an honest look at its growth. Venture Clinic runs diagnostic sessions and specialist mentorship that pinpoint strengths and gaps, then walks with founders all the way to the final showcase.",
      features: [
        "One-on-one venture diagnostic sessions",
        "Specialist mentorship across product, growth, and funding",
        "Proximity to the partners' banking and investment expertise",
      ],
      cta: "Book your session",
    },
  ],
  programDetails: {
    ip: {
      slug: "ip",
      englishName: "Amad IP",
      title: "Amad IP",
      intro: "Your idea is an asset worth protecting. Amad IP walks innovators through understanding their rights, protecting their ideas, and turning them into opportunities ready to grow.",
      audience: "Who it's for: innovators, researchers, owners of tech ideas, and startups that need to protect their intellectual assets.",
      benefits: {
        title: "What you get",
        items: [
          "IP fundamentals workshops",
          "Specialist guidance on registration and protection",
          "Market-readiness assessment",
          "A direct line into the ecosystem's programs and opportunities",
        ],
      },
      journey: {
        title: "The journey",
        steps: ["Register", "Assess your idea", "Protect it", "Launch"],
      },
      form: {
        title: "Register your interest in Amad IP",
        subtitle: "Complete your details and our team will reach out within a few business days to discuss protecting your innovation.",
        embedUrl:
          "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__56UnJFUMlhQSTdITFpDNU45MU9OT1lPRjVIR1k4Vi4u",
        extraFields: [
          { name: "company", label: "Company or venture name", type: "text", placeholder: "e.g. Innovation Tech Co." },
          {
            name: "assetType",
            label: "Type of intellectual asset",
            type: "select",
            options: ["Trademark", "Patent", "Copyright", "Industrial design", "Not sure yet"],
          },
          {
            name: "summary",
            label: "Brief summary of your innovation",
            type: "textarea",
            placeholder: "Describe the idea or innovation you'd like to protect",
          },
        ],
      },
      cta: "Protect your idea",
    },
    bootcamps: {
      slug: "bootcamps",
      englishName: "Future Founders",
      title: "Future Founders",
      intro: "Talent alone doesn't make a founder — focus and practice do. Future Founders is a hands-on program delivered across three cities, taking young talent from curiosity to a real first step in founding.",
      audience: "Who it's for: students, graduates, and young talent drawn to entrepreneurship and fintech.",
      benefits: {
        title: "What you get",
        items: [
          "Intensive bootcamps in your city",
          "Practical founding skills from idea to first prototype",
          "Mentorship from founders and sector experts",
          "A path to qualify for Venture Clinic and continue the journey",
        ],
      },
      journey: {
        title: "The journey",
        steps: ["Apply", "Join the bootcamp in your city", "Build your pilot project", "Pitch and qualify"],
      },
      form: {
        title: "Apply to Future Founders",
        subtitle: "Complete your details below, and the program team will reach out about the upcoming cohort.",
        extraFields: [
          { name: "city", label: "Preferred city", type: "select", options: ["Riyadh", "Jeddah", "Khobar"] },
          {
            name: "stage",
            label: "Stage of your idea or venture",
            type: "select",
            options: ["Just an idea", "Started planning", "Have a prototype"],
          },
          {
            name: "expectation",
            label: "What do you hope to gain from the program?",
            type: "textarea",
            placeholder: "Share your expectations from the program",
          },
        ],
      },
      cta: "Start your founder journey",
    },
    "venture-clinic": {
      slug: "venture-clinic",
      englishName: "Venture Clinic",
      title: "Venture Clinic",
      intro: "Every startup needs an honest look at its growth. Venture Clinic runs diagnostic sessions and specialist mentorship that pinpoint strengths and gaps, then walks with founders all the way to the final showcase.",
      audience: "Who it's for: early-stage founders, Future Founders graduates, and startups looking for structured growth.",
      benefits: {
        title: "What you get",
        items: [
          "One-on-one venture diagnostic sessions",
          "Specialist mentorship across product, growth, and funding",
          "Proximity to the partners' banking and investment expertise",
          "A clear road to the final showcase in front of the sector",
        ],
      },
      journey: {
        title: "The journey",
        steps: ["Book your diagnostic", "Get a clear growth plan", "Ongoing mentorship", "Pitch at the final showcase"],
      },
      form: {
        title: "Book your session at Venture Clinic",
        subtitle: "Complete your venture details, and the clinic team will reach out to schedule an intro session.",
        extraFields: [
          {
            name: "fundingStage",
            label: "Current funding stage",
            type: "select",
            options: ["Pre-formation", "Seed funding", "Series A round", "No funding yet"],
          },
          {
            name: "pitchDeck",
            label: "Pitch deck (optional)",
            type: "file",
            placeholder: "PDF preferred, up to 5MB",
          },
          {
            name: "summary",
            label: "Brief overview of your venture and goals for the clinic",
            type: "textarea",
            placeholder: "Describe your venture and what you're hoping to achieve",
          },
        ],
      },
      cta: "Book your session",
    },
  },
  journey: {
    eyebrow: "The Journey",
    title: "Amad's journey through the year",
    tagline: "One journey, three programs, an impact that endures.",
    milestones: [
      { title: "Official launch & registration opens", timing: "October" },
      { title: "Future Founders across three cities", timing: "Nov–Jan" },
      { title: "Venture Clinic & Amad IP milestones", timing: "Jan–Apr" },
      { title: "Final showcase & impact report", timing: "August" },
    ],
  },
  gallery: {
    eyebrow: "Moments from Amad",
    title: "Our success stories.. graduates and cohorts of Amad's programs",
    subtitle: "Photos from cohorts, bootcamps, and closing events across Amad's three programs.",
  },
  partners: {
    title: "Partners",
    sponsorshipLine: "A strategic partnership between Alinma Bank and Falak Investment Hub, supporting the innovation and entrepreneurship ecosystem.",
    alinma: {
      name: "Alinma Bank",
      description: "The founding partner of the Amad ecosystem, bringing its banking depth and fintech leadership to serve innovators — in the belief that enabling innovation is a national responsibility before it is an initiative.",
    },
    falak: {
      name: "Falak Investment Hub",
      description: "The delivery arm and venture partner, with deep experience building ecosystems, enabling startups, and finding opportunity — grow, enable, find.",
    },
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "What is Amad?",
        answer: "A year-long innovation and entrepreneurship ecosystem by Alinma and Falak, connecting three programs into one journey.",
      },
      {
        question: "Who is Amad for?",
        answer: "Innovators, young talent, and early-stage founders — each program has its own audience and criteria, listed in its section.",
      },
      {
        question: "Do I need a ready idea to apply?",
        answer: "No — Future Founders welcomes curiosity; the other programs suit those with an idea or an existing venture.",
      },
      {
        question: "Which cities host the activities?",
        answer: "Future Founders runs in three cities; other tracks mix in-person and virtual.",
      },
      {
        question: "Can I join more than one program?",
        answer: "Yes — the programs are built to feed into each other; Future Founders graduates can qualify for Venture Clinic.",
      },
      {
        question: "What about ownership of my idea?",
        answer: "Your idea stays yours. IP protection is a founding principle of Amad — there is a whole program dedicated to it.",
      },
      {
        question: "How do I stay updated?",
        answer: "Register your interest for updates and follow Alinma and Falak channels.",
      },
    ],
  },
  footer: {
    quickLinks: "Quick links",
    registerInterest: "Register your interest",
    legal: "© 2026 Amad Ecosystem — Alinma Bank × Falak Investment Hub",
  },
  finalCta: {
    title: "Your journey starts with one step",
    subtitle: "Register your interest today and be the first to know when registration opens.",
    nameLabel: "Full name",
    emailLabel: "Email address",
    submit: "Register your interest",
    notice: "Your interest has been registered, thank you.",
  },
  applicationForm: {
    nameLabel: "Full name",
    emailLabel: "Email address",
    phoneLabel: "Phone number",
    agreeLabel: "I confirm the information provided is accurate and agree to be contacted by the Amad team about my application.",
    submit: "Submit application",
    successTitle: "Your application has been submitted",
    successBody: "The Amad team will reach out to you shortly to discuss next steps.",
  },
};
