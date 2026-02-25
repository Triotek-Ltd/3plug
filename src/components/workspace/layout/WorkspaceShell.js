export default function WorkspaceShell({
  dir = "ltr",
  children,
  className = "",
}) {
  const isRtl = dir === "rtl";

  return (
    <div
      dir={dir}
      className={`mx-auto w-full max-w-[1400px] p-4 md:p-6 ${className}`}
      data-dir={dir}
      data-flow={isRtl ? "rtl" : "ltr"}
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.08),transparent_42%),radial-gradient(circle_at_90%_0%,rgba(16,185,129,0.07),transparent_38%),linear-gradient(180deg,#f8fbff_0%,#f4f7fb_45%,#f8fafc_100%)] p-3 md:p-4">
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="pointer-events-none absolute inset-x-8 top-0 -z-10 h-72 rounded-[2rem] bg-gradient-to-br from-sky-200/40 via-white to-emerald-200/30 blur-3xl" />
        <div className={`pointer-events-none absolute ${isRtl ? "-left-10" : "-right-10"} top-16 -z-10 h-56 w-56 rounded-full bg-cyan-300/25 blur-3xl`} />
        <div className={`pointer-events-none absolute ${isRtl ? "-right-10" : "-left-10"} top-24 -z-10 h-56 w-56 rounded-full bg-emerald-300/20 blur-3xl`} />
        <div className="pointer-events-none absolute bottom-6 left-1/2 -z-10 h-32 w-[70%] -translate-x-1/2 rounded-full bg-slate-900/5 blur-3xl" />
        {children}
      </div>
    </div>
  );
}
