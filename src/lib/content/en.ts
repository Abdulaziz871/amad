import type { SiteContent } from "./types";

export const en: SiteContent = {
  brandName: "Amad",
  meta: {
    title: "Amad Innovation & Entrepreneurship Ecosystem by Alinma Bank",
    description:
      "Amad is an innovation and entrepreneurship ecosystem by Alinma Bank, in partnership with Falak Holding. Your gateway to protecting your idea, building your founder skills, and growing your venture, through three programs: Amad IP, Future Founders, and Venture Clinic.",
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
    title: "Your gateway to building\na sustainable future",
    titleHighlight: "a sustainable future",
    subtitle: "Amad, the innovation and entrepreneurship ecosystem by Alinma Bank",
    ctaPrimary: "Register your interest",
    ctaSecondary: "Explore the programs",
    ctaVideo: "Watch the video",
    closeVideo: "Close video",
    programsStripLabel: "Amad's three programs",
  },
  about: {
    title: "About Amad",
    paragraphs: [
      "Amad is not a one-off competition. It is a year-long innovation and entrepreneurship ecosystem.",
      "Amad brings people with ideas, innovations and ambition together in one journey, opening up what an idea needs to grow beyond its first limits: from knowledge and expertise, to opportunities and partnerships, all the way to impact that can be seen and built upon.",
      "In partnership with Falak Holding, Amad is designed as an environment where talent, innovators and entrepreneurs meet what expands their potential, giving their ideas the space and resources they need to become real value.",
    ],
    highlights: ["knowledge and expertise", "opportunities and partnerships", "impact that can be seen and built upon", "Falak Holding", "real value"],
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
        title: "Mentorship that drives growth",
        description: "One-on-one mentorship from seasoned experts in product strategy and market expansion.",
      },
      {
        title: "Enabling partners",
        description: "Alinma's banking depth and Falak's venture-building expertise, in one ecosystem.",
      },
      {
        title: "Direct access to investors",
        description: "Pitch your venture to a select group of investors, plus networking sessions to build lasting relationships.",
      },
      {
        title: "Infrastructure services",
        description: "Access to coworking spaces and meeting rooms in Riyadh, and a community of founders and innovators like you.",
      },
      {
        title: "Measured impact",
        description: "Clear milestones, continuous follow-up, and a final showcase that celebrates outcomes in front of the sector.",
      },
    ],
    statsTitle: "Our impact in numbers",
    stats: [
      { value: "53+", label: "New jobs created" },
      { value: "195+", label: "Training & mentorship workshops delivered" },
      { value: "47", label: "Strategic partnerships signed by startups" },
      { value: "756%", label: "Growth in participating companies' customer base" },
      { value: "500+", label: "Targeted beneficiaries across the ecosystem's programs" },
      { value: "260+", label: "Startups applied to the accelerator" },
    ],
  },
  programsOverview: {
    learnMore: "Learn more",
    pathwayNote: "Qualified Future Founders teams",
    subtitle: "Apply directly to Amad IP or Future Founders. Top Future Founders teams then qualify for the Venture Clinic.",
    statusOpen: "Applications open",
    statusQualified: "Qualified teams only",
    hint: "Tap any program to see its path",
    standalone: "Standalone track",
    steps: { apply: "Apply directly", qualify: "Qualify", grow: "Grow your venture" },
    comingSoon: { label: "Coming soon", text: "More programs and tracks on the way", cta: "Register your interest" },
  },
  programs: [
    {
      slug: "ip",
      access: "open",
      title: "Amad IP",
      englishName: "Amad IP",
      description: "Amad IP helps researchers and innovators who hold intellectual property turn their innovations into applicable solutions for the fintech sector, by connecting them to real market challenges and charting a clear commercial path for each.",
      features: [
        "Awareness workshops on IP fundamentals",
        "Aligning innovation with the financial sector's challenges and priorities",
        "Market-feasibility validation and business-model building",
      ],
      cta: "Protect your idea",
    },
    {
      slug: "bootcamps",
      access: "open",
      title: "Future Founders",
      englishName: "Future Founders",
      description: "Future Founders is an intensive, in-person fintech bootcamp held in three cities across the Kingdom. It targets university students and early-stage innovators, taking them on a hands-on journey from discovering the problem to pitching a complete idea to a judging panel. Join solo or as a team — whether you bring an idea or a skill to add to a team.",
      features: [
        "A hands-on journey from discovering the problem to developing and validating the idea",
        "Practical founding skills, from idea to prototype",
        "Mentorship from founders and sector experts",
      ],
      cta: "Start your founder journey",
    },
    {
      slug: "venture-clinic",
      access: "qualified",
      qualifiesFrom: ["bootcamps"],
      title: "Venture Clinic",
      englishName: "Venture Clinic",
      description: "A pre-acceleration program for teams that qualify from Future Founders. It starts with an in-depth diagnosis of each venture, then supports founders as they build the first version of their product and test it with real users, all the way to the final showcase.",
      features: [
        "One-on-one diagnosis and a tailored development plan for each team",
        "Building and refining the product prototype through specialist mentorship sessions",
        "Testing the solution with real users and partners, aligned with the financial sector's priorities",
      ],
      cta: "Book your session",
    },
  ],
  programDetails: {
    ip: {
      slug: "ip",
      englishName: "Amad IP",
      title: "Amad IP",
      tagline: "From innovation, we create impact",
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
      criteria: {
        title: "Admission criteria",
        subtitle: "Key evaluation criteria for joining Amad IP",
        items: [
          {
            title: "Innovation & technical distinction",
            description: "How distinctive the innovation is, in idea or technology, compared with existing solutions.",
          },
          {
            title: "Strength of the IP",
            description: "How clear and strong the intellectual property rights are, and how protectable and commercially usable they are.",
          },
          {
            title: "Commercial potential",
            description: "How readily the innovation can become a viable, marketable product or solution.",
          },
          {
            title: "Strategic fit with fintech",
            description: "How closely the innovation relates to fintech and financial services.",
          },
          {
            title: "Technical & commercial readiness",
            description: "How mature the innovation is and how ready it is to move toward development and commercial application.",
          },
          {
            title: "Team capability & commitment",
            description: "The innovators' ability to develop it, and their commitment to the program journey and to working with mentors and experts.",
          },
        ],
      },
      journey: {
        title: "The journey",
        steps: [
          { title: "Register", description: "Share your details and idea through the interest form, and the team will reach out." },
          { title: "Assess your idea", description: "An expert session that gauges your idea's originality and readiness for protection and market." },
          { title: "Protect it", description: "Hands-on guidance to register your intellectual property and secure your rights, step by step." },
          { title: "Launch", description: "Turn your protected idea into a growth opportunity and connect with the ecosystem." },
        ],
      },
      faq: [
        {
          question: "What is Amad?",
          answer: "Amad is an integrated innovation and entrepreneurship ecosystem launched by Alinma Bank in partnership with Falak Holding. It brings together three connected initiatives — Amad IP, Future Founders, and the Venture Clinic — in one year-long journey, aiming to protect ideas, build founders' skills, and support venture growth, in line with Saudi Vision 2030.",
        },
        {
          question: "Who is Amad IP for?",
          answer: "Idea owners, innovators, and holders of registered patents who want to develop their innovations into applicable solutions for the fintech sector.",
        },
        {
          question: "How long does the program run?",
          answer: "The Amad IP initiative runs for 12 weeks.",
        },
        {
          question: "What about ownership of my idea?",
          answer: "Your idea remains entirely yours. Amad does not take any right or stake in your idea or venture except with your explicit consent as its owner.",
        },
        {
          question: "Is the program in person or remote?",
          answer: "The program follows a hybrid model, combining in-person and virtual sessions.",
        },
        {
          question: "Is funding available?",
          answer: "There is no direct funding, but the program offers opportunities to pitch in front of investors and connects you with funding networks in the sector.",
        },
      ],
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
      cta: "Join us",
    },
    bootcamps: {
      slug: "bootcamps",
      englishName: "Future Founders",
      title: "Future Founders",
      tagline: "Where the idea begins, and the impact endures",
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
      criteria: {
        title: "Admission criteria",
        subtitle: "Key requirements to join Future Founders",
        items: [
          {
            title: "Interest in fintech",
            description: "The startup offers or plans fintech solutions — including payments, lending, insurance, open banking, or related services.",
          },
          {
            title: "Target audience",
            description: "A university student or recent graduate looking to develop their skills and build a path in entrepreneurship.",
          },
          {
            title: "An idea or problem worth solving",
            description: "Has an idea, a problem, or an opportunity that can be developed into an innovative venture.",
          },
          {
            title: "Team commitment",
            description: "The team must have at least one member ready to attend all program activities.",
          },
        ],
      },
      journey: {
        title: "The journey",
        steps: [
          { title: "Apply", description: "Join solo or as a team — with an idea, or just a skill you bring to a team." },
          { title: "Join the bootcamp in your city", description: "An intensive bootcamp in Riyadh, Jeddah, or the Eastern Province." },
          { title: "Build your pilot project", description: "Turn your idea into a prototype with guidance from founders and industry experts." },
          { title: "Pitch and qualify", description: "Pitch your project — the top teams qualify for the Venture Clinic." },
        ],
      },
      faq: [
        {
          question: "What is Amad?",
          answer: "Amad is an integrated innovation and entrepreneurship ecosystem launched by Alinma Bank in partnership with Falak Holding. It brings together three connected initiatives — Amad IP, Future Founders, and the Venture Clinic — in one year-long journey, aiming to protect ideas, build founders' skills, and support venture growth, in line with Saudi Vision 2030.",
        },
        {
          question: "Who is Future Founders for?",
          answer: "University students and recent graduates (within 4 years of graduation) who want to build founding skills — whether joining with an idea or a skill to add to a team.",
        },
        {
          question: "Do I need a ready idea to apply?",
          answer: "No, you don't need a ready idea — you can join solo or as a team, with an idea or even just a skill to contribute, and the program helps you form a team and build your skills from scratch up to a prototype.",
        },
        {
          question: "Which cities host Future Founders activities?",
          answer: "Future Founders activities take place in three cities: Riyadh, Jeddah, and the Eastern Province.",
        },
        {
          question: "How long does the program run?",
          answer: "The Future Founders initiative runs for five days.",
        },
        {
          question: "Is the program in person or remote?",
          answer: "Future Founders is an in-person bootcamp held in three cities: Riyadh, Jeddah, and the Eastern Province.",
        },
        {
          question: "Do I have to apply as a formed team, or can I join alone?",
          answer: "You can join as an individual or as a team, and you don't need a complete idea — it's enough to bring an idea, or even just a skill to contribute, and you'll form your team during the program itself.",
        },
        {
          question: "Is funding available?",
          answer: "There is no direct funding, but the program offers opportunities to pitch in front of investors and connects you with funding networks in the sector.",
        },
      ],
      form: {
        title: "Apply to Future Founders",
        subtitle: "Complete your details below, and the program team will reach out about the upcoming cohort.",
        embedUrl:
          "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__56UnJFUMlhQSTdITFpDNU45MU9OT1lPRjVIR1k4Vi4u",
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
      cta: "Start your journey",
    },
    "venture-clinic": {
      slug: "venture-clinic",
      englishName: "Venture Clinic",
      title: "Venture Clinic",
      tagline: "From a promising venture, to impact that grows",
      intro: "Every startup needs an honest look at its growth. Venture Clinic runs diagnostic sessions and specialist mentorship that pinpoint strengths and gaps, then walks with founders all the way to the final showcase.",
      audience: "Who it's for: teams that qualify from Future Founders.",
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
        steps: [
          { title: "Diagnose your venture", description: "An assessment of your team's position and readiness that reveals strengths and gaps and sets your priorities clearly." },
          { title: "Get a clear growth plan", description: "Practical priorities across product, growth, and funding, built on the diagnosis." },
          { title: "Ongoing mentorship", description: "Regular follow-ups with specialist mentors throughout the clinic." },
          { title: "Pitch at the final showcase", description: "Present your results to the sector and investors on the final showcase stage." },
        ],
      },
      faq: [
        {
          question: "What is Amad?",
          answer: "Amad is an integrated innovation and entrepreneurship ecosystem launched by Alinma Bank in partnership with Falak Holding. It brings together three connected initiatives — Amad IP, Future Founders, and the Venture Clinic — in one year-long journey, aiming to protect ideas, build founders' skills, and support venture growth, in line with Saudi Vision 2030.",
        },
        {
          question: "Who is the Venture Clinic for?",
          answer: "Startup founders looking for diagnostics and growth guidance. It's reserved for teams that qualify through Future Founders: the best 7 teams from each city, 21 teams in total.",
        },
        {
          question: "How long does the program run?",
          answer: "The Venture Clinic initiative runs for 12 weeks, with intensive mentorship and support.",
        },
        {
          question: "Is the program in person or remote?",
          answer: "The program follows a hybrid model, combining in-person and virtual mentorship sessions.",
        },
      ],
      form: {
        title: "Book your session at Venture Clinic",
        subtitle: "Complete your venture details, and the clinic team will reach out to schedule an intro session.",
        embedUrl:
          "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAN__56UnJFUMlhQSTdITFpDNU45MU9OT1lPRjVIR1k4Vi4u",
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
      cta: "Explore more",
      ctaTarget: "criteria",
      showApplicationForm: false,
    },
  },
  journey: {
    eyebrow: "The Journey",
    title: "Amad's journey",
    tagline: "One journey, an impact that endures.",
    milestones: [
      { title: "Launch", timing: "October 4, 2026" },
      { title: "Future Founders across three cities", timing: "November 2026" },
      { title: "Venture Clinic & Amad IP", timing: "Dec 2026 – Apr 2027" },
      { title: "Final showcase day", timing: "May 2027" },
    ],
  },
  gallery: {
    title: "Our Success Stories",
    videoCaption: "Moments from the Amad Tech ceremony",
    viewer: { previous: "Previous photo", next: "Next photo", close: "Close", expand: "View photo", viewAll: "View all photos" },
  },
  partners: {
    title: "Partners",
    sponsorshipLine: "A strategic partnership between Alinma Bank and Falak Holding, supporting the innovation and entrepreneurship ecosystem.",
    alinma: {
      name: "Alinma Bank",
      description: "The founding partner of the Amad ecosystem, bringing its banking depth and fintech leadership to serve innovators — in the belief that enabling innovation is a national responsibility before it is an initiative.",
    },
    falak: {
      name: "Falak Holding",
      description: "The delivery arm and venture partner, with deep experience building ecosystems, enabling startups, and finding opportunity — grow, enable, find.",
    },
  },
  clients: {
    title: "Companies that graduated from our programs",
  },
  faq: {
    title: "FAQ",
    items: [
      {
        question: "What is Amad?",
        answer: "Amad is an integrated innovation and entrepreneurship ecosystem launched by Alinma Bank in partnership with Falak Holding. It brings together three connected initiatives — Amad IP, Future Founders, and the Venture Clinic — in one year-long journey, aiming to protect ideas, build founders' skills, and support venture growth, in line with Saudi Vision 2030.",
      },
      {
        question: "Can I join more than one program?",
        answer: "There are essentially two application tracks: Amad IP (a fully independent track) and Future Founders. The Venture Clinic isn't a separate application track — it's the advanced stage for the top teams from Future Founders: the best 7 teams from each of the three cities are selected, for a total of 21 teams that qualify for the Clinic. So if you join Future Founders and stand out, you qualify for the Clinic automatically, with no separate application. Amad IP, however, is a standalone track you can apply to independently, regardless of your participation in the other track.",
      },
      {
        question: "Is participation in Amad free?",
        answer: "Yes, participation in both Amad tracks — Future Founders and the Venture Clinic, and Amad IP — is free of charge for applicants. The ecosystem is fully funded through the partnership between Alinma Bank and Falak Holding, with no financial contribution required from participants.",
      },
    ],
  },
  footer: {
    followUs: "Follow us",
    quickLinks: "Quick links",
    registerInterest: "Register your interest",
    legal: "© 2026 Falak Holding. All rights reserved.",
  },
  finalCta: {
    title: "Your journey starts with one step",
    subtitle: "Register your interest today and be the first to know when registration opens.",
    nameLabel: "Full name",
    emailLabel: "Email address",
    trackLabel: "Track you're interested in",
    trackPlaceholder: "Choose a track",
    qualifiedNote: "The Venture Clinic has no direct registration. Top Future Founders teams qualify for it.",
    submit: "Register your interest",
    notice: "Your interest has been registered, thank you.",
  },
  alfiaForm: {
    step: "Step",
    next: "Next",
    back: "Back",
    reviewHint: "Review your details before submitting — you can go back to any step to edit.",
    member: "Member",
    selectPlaceholder: "Select",
    submit: "Submit application",
    submitting: "Submitting…",
    errorFields: "Some fields need attention — please review the ones highlighted in red.",
    errorGeneric: "We couldn't submit your application right now. Please try again shortly.",
    chooseAtLeastOne: "Choose at least one option.",
    closedTitle: "Applications are currently closed",
    closedBody: "Future Founders isn't accepting applications right now. Follow us to hear when the next round opens.",
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
