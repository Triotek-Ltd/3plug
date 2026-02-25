export default function WorkspacePanel({
  title,
  actions,
  children,
  className = "",
  tone = "default",
}) {
  const toneMap = {
    default:
      "border-slate-200/80 bg-white/90 shadow-[0_12px_38px_-26px_rgba(15,23,42,0.35)]",
    glass:
      "border-white/70 bg-white/70 shadow-[0_12px_38px_-26px_rgba(15,23,42,0.25)] backdrop-blur",
    dark:
      "border-slate-800 bg-slate-900 text-slate-100 shadow-[0_20px_45px_-28px_rgba(2,6,23,0.65)]",
  };
  const headerText =
    tone === "dark"
      ? "text-slate-300"
      : "text-slate-500";

  return (
    <section
      className={`rounded-2xl border p-5 ${toneMap[tone] || toneMap.default} ${className}`}
    >
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? (
            <h2 className={`text-xs font-semibold uppercase tracking-[0.16em] ${headerText}`}>
              {title}
            </h2>
          ) : (
            <div />
          )}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
