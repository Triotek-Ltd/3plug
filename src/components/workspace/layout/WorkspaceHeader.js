export default function WorkspaceHeader({
  eyebrow,
  title,
  subtitle,
  actions,
  accent = "sky",
  meta = [],
  dir = "ltr",
}) {
  const accentMap = {
    sky: {
      shell: "from-sky-100/90 via-white to-cyan-50/70",
      badge: "border-sky-200 bg-sky-50 text-sky-700",
      chip: "border-sky-200 bg-white/80 text-sky-800",
      orb: "bg-sky-400/20",
    },
    emerald: {
      shell: "from-emerald-100/90 via-white to-lime-50/70",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
      chip: "border-emerald-200 bg-white/80 text-emerald-800",
      orb: "bg-emerald-400/20",
    },
  };
  const palette = accentMap[accent] || accentMap.sky;
  const isRtl = dir === "rtl";

  return (
    <section
      className={`relative mb-6 overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br p-6 shadow-[0_24px_70px_-35px_rgba(15,23,42,0.45)] ${palette.shell}`}
    >
      <div className={`pointer-events-none absolute -top-8 ${isRtl ? "-left-10" : "-right-10"} h-40 w-40 rounded-full blur-2xl ${palette.orb}`} />
      <div className={`pointer-events-none absolute bottom-2 ${isRtl ? "right-6" : "left-6"} h-20 w-20 rounded-full bg-white/60 blur-xl`} />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow ? (
            <p
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${palette.badge}`}
            >
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl xl:text-[2rem]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{subtitle}</p>
          ) : null}
          {meta.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {meta.map((item) => (
                <span
                  key={`${item.label}-${item.value}`}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${palette.chip}`}
                >
                  <span className="font-medium opacity-75">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {actions ? <div className="shrink-0 md:self-start">{actions}</div> : null}
      </div>
    </section>
  );
}
