import Link from "next/link";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import SecondaryButton from "@/components/core/common/buttons/Secondary";

export default function RuntimeDetailActionsBar({
  basePath,
  id,
  actions = [],
  runningAction,
  onRunAction,
  onReload,
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <Link
        href={`${basePath}/list`}
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        List
      </Link>
      <Link
        href={`${basePath}/report`}
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Report
      </Link>
      <Link
        href={`${basePath}/${id}/edit`}
        className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Edit
      </Link>
      {actions.map((action) => (
        <PrimaryButton
          key={action.id}
          text={runningAction === action.id ? `Running ${action.label || action.id}...` : action.label || action.id}
          onClick={() => onRunAction(action.id)}
          disabled={Boolean(runningAction)}
          className="!px-3 !py-2 !text-xs"
        />
      ))}
      <SecondaryButton text="Reload" onClick={onReload} className="!px-3 !py-2 !text-xs" />
    </div>
  );
}
