import Link from "next/link";

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const list = (items) => (
  <div className="grid grid-cols-1 gap-2 text-sm text-slate-700">
    {items.map((item, idx) => (
      <div
        key={item}
        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 px-3.5 py-3 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)] backdrop-blur transition hover:border-sky-200 hover:bg-sky-50/60"
      >
        <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-sky-200" />
        <div className="flex items-start gap-2.5">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold text-slate-600 group-hover:bg-sky-100 group-hover:text-sky-700">
            {idx + 1}
          </span>
          <span className="leading-5">{item}</span>
        </div>
      </div>
    ))}
  </div>
);

const paragraph = (text) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-sm leading-6 text-slate-600 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.35)] backdrop-blur">
    {text}
  </div>
);

const routeLinks = (items) => (
  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
    {items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 px-4 py-3 text-sm font-medium text-slate-700 shadow-[0_10px_28px_-22px_rgba(15,23,42,0.35)] backdrop-blur transition hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-50/70"
      >
        <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-sky-300" />
        <span className="flex items-center justify-between gap-3">
          <span>{item.label}</span>
          <span className="text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-sky-600">
            <ChevronIcon />
          </span>
        </span>
      </Link>
    ))}
  </div>
);

export const PLT_WORKSPACE_CONFIGS = {
  home_entry: {
    pageLabel: "Platform",
    dashboardLabel: "Home",
    eyebrow: "PLT-D1",
    title: "Platform Home",
    subtitle:
      "PLT entry workspace for portal landing, account-type-first navigation, quick access, and platform launch flow.",
    accent: "sky",
    metrics: [
      { label: "Bundle", value: "PLT", tone: "sky" },
      { label: "App", value: "Platform Core", tone: "emerald" },
      { label: "Modules", value: "18 seeded", tone: "slate" },
      { label: "Submodules", value: "54 seeded", tone: "violet" },
    ],
    sections: [
      {
        id: "entry-actions",
        title: "Quick Access / App Launcher",
        content: routeLinks([
          { label: "Open Launcher", href: "/launcher" },
          { label: "Account Setup", href: "/account/setup" },
          { label: "Roles & Access", href: "/account/access" },
          { label: "Platform Monitoring", href: "/admin/platform-monitoring" },
          { label: "Publisher Overview", href: "/publisher" },
          { label: "Announcements", href: "/admin/announcements" },
        ]),
      },
      {
        id: "entry-search",
        title: "Global Search / App Finder",
        content: paragraph(
          "Search panel is UI-first for now. It will query launcher catalog and doc metadata indexes once search endpoints are added."
        ),
      },
    ],
    rightRail: [
      {
        id: "account-type",
        title: "Account Type Selector",
        content: list([
          "Business Account (primary operational use)",
          "Publisher / Contributor Account (app and deployment ecosystem)",
          "Selection becomes session-driven after account setup flow logic",
        ]),
      },
      {
        id: "notifications",
        title: "Notifications Center",
        content: list([
          "Platform-wide updates (pending feed)",
          "Announcements handoff to Admin dashboard",
          "Alert and task stream (later integration)",
        ]),
      },
    ],
  },
  launcher: {
    pageLabel: "Platform",
    dashboardLabel: "Launcher",
    eyebrow: "PLT-D1",
    title: "Platform Core Module Launcher",
    subtitle:
      "Workspace launcher for PLT modules and submodules using metadata-backed catalog responses.",
    accent: "emerald",
    sections: [
      {
        id: "launcher-nav",
        title: "PLT Dashboard Routes",
        content: routeLinks([
          { label: "Platform Home", href: "/home" },
          { label: "Account Setup", href: "/account/setup" },
          { label: "Localization", href: "/account/localization" },
          { label: "Logs & Audit", href: "/admin/logs-audit" },
          { label: "Publisher Apps", href: "/publisher/apps" },
          { label: "Publisher Support", href: "/publisher/support" },
        ]),
      },
      {
        id: "launcher-catalog",
        title: "Launcher Catalog View",
        content: paragraph(
          "Module and submodule tiles remain metadata-driven via the PLT launcher catalog endpoint. Template-look pass will style this into the final launcher grid."
        ),
      },
    ],
    rightRail: [
      {
        id: "launcher-note",
        title: "Catalog Source",
        content: paragraph(
          "Reads from /apis/platform_core/platform/launcher/catalog and uses doc-first metadata for counts and visibility."
        ),
      },
    ],
  },
  account_setup: {
    pageLabel: "Account",
    dashboardLabel: "Setup",
    eyebrow: "PLT-D2",
    title: "Platform Account / Profile Setup",
    subtitle:
      "Business and Publisher/Contributor account onboarding workspace. Account Type First is the primary branching rule.",
    accent: "sky",
    metrics: [
      { label: "Flow", value: "Account Type First", tone: "sky" },
      { label: "States", value: "Draft / Active", tone: "emerald" },
      { label: "Locale", value: "LTR/RTL Ready", tone: "violet" },
      { label: "Mode", value: "PLT Workspace", tone: "slate" },
    ],
    sections: [
      {
        id: "identity",
        title: "Identity and Organization Profile",
        content: list([
          "Account type selection (Business vs Publisher/Contributor)",
          "Organization / publisher profile details",
          "Primary admin contact and verification",
          "Region and compliance baseline",
        ]),
      },
      {
        id: "progress",
        title: "Setup Flow Stages",
        content: list([
          "1. Account type",
          "2. Identity and org profile",
          "3. Security and primary admin",
          "4. Localization and compliance",
          "5. Billing/subscription handoff",
        ]),
      },
    ],
    rightRail: [
      {
        id: "notes",
        title: "Implementation Notes",
        content: paragraph(
          "Use PLT session bootstrap for account type and locale defaults. Form submission actions remain stubbed until PLT-D2 backend actions are implemented."
        ),
      },
    ],
  },
  account_access: {
    pageLabel: "Account",
    dashboardLabel: "Access",
    eyebrow: "PLT-D2",
    title: "User Roles & Access Management",
    subtitle:
      "Doc-first workspace for role assignment, access visibility, and policy review across platform users.",
    accent: "sky",
    metrics: [
      { label: "Users", value: "Pending feed", tone: "slate" },
      { label: "Roles", value: "PLT Mapped", tone: "sky" },
      { label: "Policies", value: "Doc-driven", tone: "emerald" },
      { label: "Audit", value: "Tracked", tone: "violet" },
    ],
    sections: [
      {
        id: "roles-grid",
        title: "Roles and Assignments",
        content: list([
          "Role definitions and hierarchy",
          "Permission assignment review",
          "User-to-role mappings",
          "Access scope by account type / tenant",
        ]),
      },
      {
        id: "doc-actions",
        title: "Doc Actions and Policy Controls",
        content: list([
          "Allowed doc actions by role",
          "Lock/unlock and archive governance",
          "Audit/track visibility",
          "Review pending workflow actions",
        ]),
      },
    ],
    rightRail: [
      {
        id: "mapping",
        title: "Borrow / Native Mix",
        content: paragraph(
          "Role and permission concepts use PLT doc mapping seed candidates (harmonic adapter) while final policy logic remains native 3plug."
        ),
      },
    ],
  },
  account_billing: {
    pageLabel: "Account",
    dashboardLabel: "Billing",
    eyebrow: "PLT-D2",
    title: "Billing & Subscription Setup",
    subtitle:
      "Subscription and license setup workspace for business and publisher/contributor accounts.",
    accent: "emerald",
    metrics: [
      { label: "Tier", value: "Plan pending", tone: "emerald" },
      { label: "Licenses", value: "Pending feed", tone: "slate" },
      { label: "Usage", value: "Pending analytics", tone: "sky" },
      { label: "Renewal", value: "Pending billing", tone: "violet" },
    ],
    sections: [
      {
        id: "plan-options",
        title: "Plans and Bundles",
        content: list([
          "Platform bundle entitlement",
          "Core app bundle selection",
          "Industry pack upgrades (later flow)",
          "Publisher payout model (account-type dependent)",
        ]),
      },
    ],
    rightRail: [
      {
        id: "status",
        title: "Status",
        content: paragraph(
          "UI-first workspace shell. Payment processing and invoicing logic will be connected after dashboard and fetch flows stabilize."
        ),
      },
    ],
  },
  account_localization: {
    pageLabel: "Account",
    dashboardLabel: "Localization",
    eyebrow: "PLT-D2",
    title: "Compliance & Localization Setup",
    subtitle:
      "Region, language, timezone, and direction settings workspace. RTL/LTR support is mandatory.",
    accent: "sky",
    metrics: [
      { label: "Locale", value: "Configurable", tone: "sky" },
      { label: "Direction", value: "LTR / RTL", tone: "emerald" },
      { label: "Timezone", value: "Configurable", tone: "slate" },
      { label: "Compliance", value: "Flags", tone: "violet" },
    ],
    sections: [
      {
        id: "localization",
        title: "Localization Settings",
        content: list([
          "Language and locale",
          "LTR/RTL direction",
          "Timezone and date format",
          "Regional defaults for docs and reports",
        ]),
      },
      {
        id: "preview",
        title: "Direction Preview",
        content: paragraph(
          "Workspace components should mirror layout and semantic icons when UI direction changes. This panel will host the direction preview control."
        ),
      },
    ],
    rightRail: [
      {
        id: "requirements",
        title: "Requirement Lock",
        content: paragraph(
          "Public website and platform shell must both support RTL and LTR from the start; no late retrofit."
        ),
      },
    ],
  },
  admin_platform_monitoring: {
    pageLabel: "Admin",
    dashboardLabel: "Platform Monitoring",
    eyebrow: "PLT-D3",
    title: "Admin / Platform Monitoring Dashboard",
    subtitle:
      "Platform health, service status, and runtime monitoring workspace for platform administrators.",
    accent: "emerald",
    metrics: [
      { label: "Uptime", value: "Pending metrics", tone: "emerald" },
      { label: "API Health", value: "Pending feed", tone: "sky" },
      { label: "Tenants", value: "PLT scoped", tone: "slate" },
      { label: "Alerts", value: "Pending incidents", tone: "violet" },
    ],
    sections: [
      {
        id: "monitoring-widgets",
        title: "Monitoring Widgets",
        content: list([
          "Service health cards",
          "Latency/throughput charts (stub)",
          "Queue/job status widgets",
          "Recent incidents summary",
        ]),
      },
    ],
    rightRail: [
      {
        id: "alerts-rail",
        title: "Alerts / Incidents",
        content: list([
          "No active incidents (stub)",
          "Alert thresholds pending",
          "Monitoring feed integration next",
        ]),
      },
    ],
  },
  admin_logs_audit: {
    pageLabel: "Admin",
    dashboardLabel: "Logs & Audit",
    eyebrow: "PLT-D3",
    title: "System Logs & Audit Dashboard",
    subtitle:
      "Doc-first audit and logging workspace aligned to PLT logging and observability modules.",
    accent: "sky",
    metrics: [
      { label: "Log Streams", value: "PLT", tone: "sky" },
      { label: "Audit Events", value: "Doc-driven", tone: "emerald" },
      { label: "Retention", value: "Policy pending", tone: "slate" },
      { label: "Filters", value: "Ready", tone: "violet" },
    ],
    sections: [
      {
        id: "logs-list",
        title: "Logs / Audit List",
        content: list([
          "Filter bar (pending UI controls)",
          "Log rows / audit entries table",
          "Selection opens detail panel/drawer",
          "Export/report actions later",
        ]),
      },
    ],
    rightRail: [
      {
        id: "detail-panel",
        title: "Selected Event Detail",
        content: paragraph(
          "Detail drawer/panel placeholder for audit event metadata, actor, tenant, and action traces."
        ),
      },
    ],
  },
  admin_license_monitoring: {
    pageLabel: "Admin",
    dashboardLabel: "License Monitoring",
    eyebrow: "PLT-D3",
    title: "License & Subscription Monitoring Dashboard",
    subtitle:
      "Track platform licenses, subscriptions, renewals, and usage across tenants and publisher deployments.",
    accent: "emerald",
    metrics: [
      { label: "Active Licenses", value: "Pending feed", tone: "emerald" },
      { label: "Expiring Soon", value: "Pending feed", tone: "violet" },
      { label: "Usage Trend", value: "Pending analytics", tone: "sky" },
      { label: "Publisher Share", value: "Pending payouts", tone: "slate" },
    ],
    sections: [
      {
        id: "license-table",
        title: "License Overview",
        content: list([
          "Tenant license list",
          "Renewal status",
          "Entitled bundles/apps",
          "Consumption summary",
        ]),
      },
    ],
  },
  admin_announcements: {
    pageLabel: "Admin",
    dashboardLabel: "Announcements",
    eyebrow: "PLT-D3",
    title: "Global Notifications / Announcements Dashboard",
    subtitle:
      "Platform-wide communication workspace for alerts, notices, and rollout messages.",
    accent: "sky",
    sections: [
      {
        id: "composer",
        title: "Announcement Composer",
        content: list([
          "Audience targeting (All / Business / Publisher)",
          "Priority and schedule",
          "Channel selection",
          "Preview and publish workflow",
        ]),
      },
      {
        id: "feed",
        title: "Announcement Feed",
        content: list([
          "Recent announcements list",
          "Published / draft statuses",
          "Edit and archive actions",
        ]),
      },
    ],
  },
  admin_landing_analytics: {
    pageLabel: "Admin",
    dashboardLabel: "Landing Analytics",
    eyebrow: "PLT-D3",
    title: "Landing Page Analytics Dashboard",
    subtitle:
      "Track public website landing performance, registrations, and launcher handoff activity.",
    accent: "emerald",
    metrics: [
      { label: "Visits", value: "Pending analytics", tone: "sky" },
      { label: "Signups", value: "Pending analytics", tone: "emerald" },
      { label: "Launches", value: "Pending analytics", tone: "violet" },
      { label: "Conversion", value: "Pending analytics", tone: "slate" },
    ],
    sections: [
      {
        id: "charts",
        title: "Analytics Charts",
        content: list([
          "Traffic trend",
          "Signup conversion",
          "Launcher click-through",
          "Top entry pages",
        ]),
      },
    ],
  },
  publisher_overview: {
    pageLabel: "Publisher",
    dashboardLabel: "Overview",
    eyebrow: "PLT-D4",
    title: "Publisher Overview Dashboard",
    subtitle:
      "Publisher / Contributor workspace for app activity, deployments, and revenue visibility.",
    accent: "emerald",
    metrics: [
      { label: "Apps", value: "Publisher catalog", tone: "sky" },
      { label: "Deployments", value: "Pending feed", tone: "emerald" },
      { label: "Revenue", value: "Pending revenue", tone: "violet" },
      { label: "Tickets", value: "Pending support", tone: "slate" },
    ],
    sections: [
      {
        id: "recent-releases",
        title: "Recent Releases / Activity",
        content: list([
          "Published apps and versions",
          "Pending approvals",
          "Deployment activity",
          "Support activity summary",
        ]),
      },
    ],
    rightRail: [
      {
        id: "tasks",
        title: "Action Queue",
        content: list([
          "Review release notes",
          "Check deployment readiness",
          "Respond to support requests",
        ]),
      },
    ],
  },
  publisher_apps: {
    pageLabel: "Publisher",
    dashboardLabel: "App Management",
    eyebrow: "PLT-D4",
    title: "App Management Desk",
    subtitle:
      "Workspace for publisher app configuration, versioning, and release management.",
    accent: "sky",
    sections: [
      {
        id: "app-list",
        title: "Apps List",
        content: list([
          "Published apps",
          "Draft apps",
          "Version status",
          "Feature flags (later)"
        ]),
      },
    ],
  },
  publisher_deployments: {
    pageLabel: "Publisher",
    dashboardLabel: "Deployments",
    eyebrow: "PLT-D4",
    title: "Deployment / Implementation Desk",
    subtitle: "Track publisher deployments to business clients and implementation status.",
    accent: "emerald",
    sections: [
      {
        id: "deployment-list",
        title: "Deployment Pipeline",
        content: list([
          "Planned deployments",
          "In-progress implementations",
          "Verification checkpoints",
          "Rollback / incident notes",
        ]),
      },
    ],
  },
  publisher_revenue: {
    pageLabel: "Publisher",
    dashboardLabel: "Revenue",
    eyebrow: "PLT-D4",
    title: "Revenue & License Dashboard",
    subtitle: "Publisher revenue, subscriptions, and commissions workspace.",
    accent: "sky",
    metrics: [
      { label: "Revenue", value: "Pending feed", tone: "emerald" },
      { label: "Subscriptions", value: "Pending billing", tone: "sky" },
      { label: "Commissions", value: "Pending payouts", tone: "violet" },
      { label: "Payouts", value: "Pending schedule", tone: "slate" },
    ],
    sections: [
      {
        id: "revenue-panels",
        title: "Revenue Overview",
        content: list([
          "Revenue by app",
          "Recurring vs one-time",
          "Commission split",
          "Payout schedule",
        ]),
      },
    ],
  },
  publisher_integrations: {
    pageLabel: "Publisher",
    dashboardLabel: "Integrations",
    eyebrow: "PLT-D4",
    title: "Integration Desk",
    subtitle: "Manage API keys, connectors, and integration readiness for published apps.",
    accent: "emerald",
    sections: [
      {
        id: "integrations-grid",
        title: "Integration Management",
        content: list([
          "API key inventory",
          "Connector status",
          "Webhook endpoints",
          "Integration test status",
        ]),
      },
    ],
  },
  publisher_support: {
    pageLabel: "Publisher",
    dashboardLabel: "Support",
    eyebrow: "PLT-D4",
    title: "Support & Collaboration Desk",
    subtitle: "Support workflow workspace for tickets, conversations, and client collaboration.",
    accent: "sky",
    sections: [
      {
        id: "tickets",
        title: "Ticket and Collaboration Feed",
        content: list([
          "Open tickets",
          "Priority queue",
          "Recent conversations",
          "Escalations and follow-up tasks",
        ]),
      },
    ],
  },
};
