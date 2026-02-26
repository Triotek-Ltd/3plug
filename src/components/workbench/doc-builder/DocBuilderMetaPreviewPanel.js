import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import TableTooltip from "@/components/tooltip/TableTooltip";

export default function DocBuilderMetaPreviewPanel({
  selectedDocRow,
  metaLoading,
  fieldCount,
  allowedActions,
  sessionBootstrap,
  selectedDocMeta,
}) {
  return (
    <WorkspacePanel title="Selected Doc Preview" description="Backend-loaded metadata preview for the selected doc.">
      {selectedDocRow ? (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Doc Key</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{selectedDocRow.doc_key}</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-slate-50 px-2 py-2"><div className="text-slate-500">Module</div><div className="font-semibold text-slate-800">{selectedDocRow.module || selectedDocRow.module_key || "-"}</div></div>
              <div className="rounded-lg bg-slate-50 px-2 py-2"><div className="text-slate-500">Submodule</div><div className="font-semibold text-slate-800">{selectedDocRow.submodule || selectedDocRow.submodule_key || "-"}</div></div>
              <div className="rounded-lg bg-slate-50 px-2 py-2"><div className="text-slate-500">Schema Fields</div><div className="font-semibold text-slate-800">{metaLoading ? "..." : fieldCount}</div></div>
              <div className="rounded-lg bg-slate-50 px-2 py-2"><div className="text-slate-500">Actions</div><div className="font-semibold text-slate-800">{metaLoading ? "..." : allowedActions.length}</div></div>
              <div className="rounded-lg bg-slate-50 px-2 py-2 col-span-2"><div className="text-slate-500">Session Account</div><div className="font-semibold text-slate-800">{sessionBootstrap?.account?.display_name || sessionBootstrap?.user?.name || "Unavailable"}</div></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.12em] text-slate-500">Allowed Actions</div>
              <TableTooltip content="Loaded dynamically from docs/meta and DocRuntime."><span className="text-[11px] text-slate-400">info</span></TableTooltip>
            </div>
            {allowedActions.length ? (
              <div className="flex flex-wrap gap-2">
                {allowedActions.map((action) => <span key={action} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-700">{action}</span>)}
              </div>
            ) : <div className="text-xs text-slate-600">{metaLoading ? "Loading..." : "No actions returned."}</div>}
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="mb-2 text-xs uppercase tracking-[0.12em] text-slate-500">Meta Preview (JSON)</div>
            <pre className="max-h-[220px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">{JSON.stringify({ doc_key: selectedDocMeta?.doc_key || selectedDocRow.doc_key, module_key: selectedDocMeta?.module_key, submodule_key: selectedDocMeta?.submodule_key, allowed_actions: selectedDocMeta?.allowed_actions || [], schema_field_count: fieldCount }, null, 2)}</pre>
          </div>
        </div>
      ) : <div className="text-sm text-slate-600">Select a doc from the table to preview its definition metadata.</div>}
    </WorkspacePanel>
  );
}
