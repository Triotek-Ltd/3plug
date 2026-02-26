export default function DirectionTogglePill({
  dirMode = "ltr",
  onToggle,
  className = "",
  inline = false,
}) {
  const isRtl = dirMode === "rtl";
  const baseClassName = inline
    ? "inline-flex items-center justify-center rounded-md bg-white px-3 py-2 font-bold shadow-md"
    : `fixed ${isRtl ? "left-2 rotate-90" : "right-2 -rotate-90"} top-[40%] z-30 rounded-t-md bg-white px-3 py-1 font-bold shadow-md`;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`${baseClassName} ${className}`}
      aria-label={`Switch to ${dirMode === "ltr" ? "RTL" : "LTR"} layout`}
    >
      {dirMode === "ltr" ? "RTL" : "LTR"}
    </button>
  );
}
