export const plugCards = [
  {
    code: "OPS",
    title: "Operations",
    text: "Execution workflows, scheduling, fulfillment, inventory, and process control across day-to-day operations.",
    accent: "from-sky-500 to-cyan-400",
  },
  {
    code: "MGT",
    title: "Management",
    text: "KPIs, planning, forecasting, risk, oversight, and strategic decisions across business units.",
    accent: "from-teal-500 to-emerald-400",
  },
  {
    code: "ADM",
    title: "Administration",
    text: "Finance, HR, records, compliance, governance, and administrative support systems.",
    accent: "from-indigo-500 to-sky-400",
  },
];

export const featureRows = [
  {
    eyebrow: "Platform Runtime",
    title: "One platform, selective bundles, tenant-aware activation",
    body:
      "3plug keeps the platform runtime separate from app bundles so organizations activate only what they need, then expand over time with industry packs and marketplace apps.",
    bullets: [
      "Platform bundle handles tenancy, security, lifecycle, and control-plane operations",
      "App bundles activate per tenant using entitlement + compatibility checks",
      "Cloud-native primary with local/on-prem support",
    ],
    reverse: false,
    tint: "from-sky-500/10 via-cyan-400/10 to-emerald-400/10",
  },
  {
    eyebrow: "Marketplace + Publisher",
    title: "Publisher ecosystem and tenant-safe app lifecycle management",
    body:
      "Business accounts discover and activate apps by tenant. Publisher accounts register apps, manage releases, and support client deployments in a structured ecosystem.",
    bullets: [
      "Publisher release -> catalog -> entitlement -> tenant activation flow",
      "Upgrade and rollback lifecycle managed by platform controls",
      "Compatibility and policy checks before installation",
    ],
    reverse: true,
    tint: "from-indigo-500/10 via-sky-400/10 to-cyan-400/10",
  },
];

export const testimonials = [
  {
    quote:
      "We can start with Operations and Administration for one site, then add Management and industry packs later without reworking users, roles, or deployment.",
    name: "Business Account Pilot",
    role: "Operations Lead",
    avatar: "https://shreethemes.in/techwind/landing/assets/images/client/01.jpg",
  },
  {
    quote:
      "The publisher flow is clear: release app versions, manage compatibility, and let tenant activation remain controlled by platform entitlement rules.",
    name: "Publisher Onboarding Group",
    role: "Publisher / Contributor",
    avatar: "https://shreethemes.in/techwind/landing/assets/images/client/02.jpg",
  },
  {
    quote:
      "The portal-first model makes cloud-native and local deployment feel like one product, with the same account and bundle logic in both modes.",
    name: "Platform Architecture Review",
    role: "Delivery & Architecture",
    avatar: "https://shreethemes.in/techwind/landing/assets/images/client/03.jpg",
  },
];

export const benchmarkMedia = {
  logoIcon: "https://shreethemes.in/techwind/landing/assets/images/logo-icon-40.png",
  heroVideo: "https://shreethemes.in/techwind/landing/assets/images/modern.mp4",
  heroBackdrop: "https://shreethemes.in/techwind/landing/assets/images/saas/home.jpg",
  heroVisual: "https://shreethemes.in/techwind/landing/assets/images/saas/classic02.png",
  featureVisualA: "https://shreethemes.in/techwind/landing/assets/images/saas/classic02.png",
  featureVisualB: "https://shreethemes.in/techwind/landing/assets/images/saas/classic03.png",
};

export const pricingCards = [
  {
    name: "Starter",
    tag: "Pilot",
    price: "Custom",
    desc: "For first rollout of the platform bundle with selected core apps for one business site.",
    items: [
      "Portal + platform bundle setup",
      "Operations, Management, and Administration activation as needed",
      "Business account and site provisioning",
      "Cloud or local deployment onboarding",
    ],
    featured: false,
    cta: "Get Started",
  },
  {
    name: "Growth",
    tag: "Recommended",
    price: "Custom",
    desc: "For organizations adding industry packs, more sites, and marketplace-based app adoption.",
    items: [
      "Core apps + industry-specific packs",
      "Marketplace discovery and entitlement flows",
      "Tenant upgrade/rollback operations",
      "Publisher ecosystem readiness",
    ],
    featured: true,
    cta: "Talk to Us",
  },
  {
    name: "Enterprise",
    tag: "Scale",
    price: "Custom",
    desc: "For multi-tenant scale, governance controls, and mature cloud-native platform operations.",
    items: [
      "Advanced runtime topology options",
      "Governance and compliance controls",
      "Publisher ecosystem operations support",
      "Production rollout and support planning",
    ],
    featured: false,
    cta: "Plan Deployment",
  },
];

export const faqs = [
  {
    q: "What is 3plug?",
    a: "3plug is a portal-first modular business platform built around Operations, Management, and Administration, with separate platform and app bundles, industry packs, and a publisher marketplace ecosystem.",
  },
  {
    q: "Is 3plug cloud-only?",
    a: "No. Cloud-native is the primary direction, but local/on-prem deployment is also supported using the same portal-first product model.",
  },
  {
    q: "Can I install only what I need?",
    a: "Yes. The platform bundle runs the portal and lifecycle controls, while each tenant/site activates only the app bundles and packs it needs.",
  },
  {
    q: "What is the difference between platform and app bundles?",
    a: "The platform bundle runs core capabilities like tenancy, security, lifecycle, and control services. App bundles deliver business workflows and industry functionality.",
  },
  {
    q: "Is /home the portal entry after login?",
    a: "Yes. `/` is the public website and `/home` is the authenticated portal landing desk.",
  },
];
