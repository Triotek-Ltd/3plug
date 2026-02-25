import Link from "next/link";

function BrandMark({ className = "h-10 w-10 rounded-xl" }) {
  return (
    <span className={`relative block overflow-hidden border border-slate-200 bg-white ${className}`}>
      <img
        src="/brand/logo-3plug.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain p-1"
      />
    </span>
  );
}

export default function BrandLogo({
  href = "/",
  compact = false,
  className = "",
  subtitle = "Operations / Management / Administration",
}) {
  const content = (
    <span className={`flex items-center gap-3 ${className}`}>
      <BrandMark className={compact ? "h-9 w-9 rounded-lg" : "h-10 w-10 rounded-xl"} />
      {!compact && (
        <span className="block">
          <span className="block text-lg font-bold tracking-tight text-slate-900">3plug</span>
          {subtitle ? <span className="block text-xs text-slate-500">{subtitle}</span> : null}
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
}
