export default function WorkspaceDirectionToggle({ dir = "ltr", onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700 shadow-sm backdrop-blur transition hover:border-sky-300 hover:text-sky-700"
      aria-label={`Switch to ${dir === "ltr" ? "RTL" : "LTR"} layout`}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-700">
        {dir === "ltr" ? "L" : "R"}
      </span>
      <span>{dir === "ltr" ? "RTL" : "LTR"}</span>
    </button>
  );
}
