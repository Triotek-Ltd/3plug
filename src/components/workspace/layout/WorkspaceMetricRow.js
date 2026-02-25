function MetricCard({ label, value, tone = "slate" }) {
  const toneStyles = {
    slate:
      "border-slate-200/80 bg-white/90 text-slate-900 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)]",
    sky:
      "border-sky-200/80 bg-gradient-to-br from-sky-50 to-cyan-50/70 text-sky-900 shadow-[0_12px_30px_-24px_rgba(2,132,199,0.35)]",
    emerald:
      "border-emerald-200/80 bg-gradient-to-br from-emerald-50 to-lime-50/70 text-emerald-900 shadow-[0_12px_30px_-24px_rgba(5,150,105,0.32)]",
    violet:
      "border-violet-200/80 bg-gradient-to-br from-violet-50 to-fuchsia-50/70 text-violet-900 shadow-[0_12px_30px_-24px_rgba(109,40,217,0.3)]",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border px-4 py-3.5 transition hover:-translate-y-0.5 ${toneStyles[tone] || toneStyles.slate}`}
    >
      <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />
      <div className="text-xs uppercase tracking-[0.14em] text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold tracking-tight">{value}</div>
    </div>
  );
}

export default function WorkspaceMetricRow({ items = [] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </div>
  );
}
