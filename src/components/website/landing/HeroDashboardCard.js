export default function HeroDashboardCard() {
  return (
    <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-900/10">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-800">3plug Portal</span>
        <span className="rounded-full bg-slate-100 px-2 py-1">Cloud / Local</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-sky-700">Launcher</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">Core Apps + Packs</div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            {["OPS", "MGT", "ADM", "SP Packs"].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Lifecycle</div>
          <div className="mt-2 text-sm font-semibold text-slate-900">Entitle, Activate, Upgrade</div>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            {[
              "Tenant-aware activation",
              "Compatibility checks",
              "Rollback-ready updates",
            ].map((line) => (
              <div key={line} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                {line}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50 p-3">
          <div className="text-xs uppercase tracking-wider text-sky-700">Account Types</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-sky-500/10 px-2 py-1 text-sky-700">Business</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-emerald-700">Publisher</span>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-3">
          <div className="text-xs uppercase tracking-wider text-emerald-700">Deployment</div>
          <div className="mt-2 text-xs text-emerald-800">
            Portal-first UX for cloud-native and local/on-prem modes.
          </div>
        </div>
      </div>
    </div>
  );
}
