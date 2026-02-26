import Link from "next/link";

export default function RuntimeDocNavStrip({ items = [] }) {
  const visible = Array.isArray(items) ? items.slice(0, 8) : [];
  if (!visible.length) return null;

  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {visible.map((item, index) => (
        <Link
          key={`${item.label || "nav"}-${index}`}
          href={item.href || item.link || "#"}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          {item.label || item.link || "Link"}
        </Link>
      ))}
    </div>
  );
}
