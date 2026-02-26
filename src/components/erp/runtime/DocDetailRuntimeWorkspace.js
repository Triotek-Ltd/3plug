import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import RuntimeDocNavStrip from "@/components/erp/runtime/RuntimeDocNavStrip";
import RuntimeDetailActionsBar from "@/components/erp/runtime/RuntimeDetailActionsBar";
import FieldRenderer from "@/components/pages/form/FieldRenderer";
import WorkflowTable from "@/components/pages/detail/settings/Workflow";
import {
  executeDocRuntimeAction,
  buildRuntimeUiConfig,
  getRenderableFormFields,
  loadDocDetailData,
  loadNativeDocFiles,
} from "@/utils/nativeDocRuntime";

export default function DocDetailRuntimeWorkspace() {
  const router = useRouter();
  const { bundle, app, module, submodule, doc, id } = router.query;
  const [nativeFiles, setNativeFiles] = useState(null);
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [runningAction, setRunningAction] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ready = Boolean(bundle && app && module && submodule && doc && id);
  const fields = useMemo(() => getRenderableFormFields(nativeFiles || {}), [nativeFiles]);
  const actions = useMemo(
    () => (Array.isArray(nativeFiles?.actions?.actions) ? nativeFiles.actions.actions.filter((a) => a?.enabled !== false) : []),
    [nativeFiles]
  );
  const uiConfig = useMemo(
    () =>
      ready
        ? buildRuntimeUiConfig({ bundle, app, module, submodule, doc }, nativeFiles || {}, "detail")
        : { dir: "ltr", title: "Doc Detail", eyebrow: "ERP", subtitle: "", meta: [], navItems: [] },
    [ready, bundle, app, module, submodule, doc, nativeFiles]
  );

  const loadPage = async () => {
    if (!ready) return;
    setLoading(true);
    setError("");
    try {
      const hierarchy = { bundle, app, module, submodule, doc };
      const [files, rowData] = await Promise.all([
        loadNativeDocFiles(hierarchy),
        loadDocDetailData(doc, id),
      ]);
      setNativeFiles(files);
      setRow(rowData || {});
    } catch (err) {
      setError(err?.message || "Failed to load runtime detail");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready) loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, bundle, app, module, submodule, doc, id]);

  const handleActionRun = async (actionId) => {
    setRunningAction(actionId);
    setMessage("");
    setError("");
    try {
      await executeDocRuntimeAction(doc, id, actionId, {});
      setMessage(`Action '${actionId}' executed.`);
      await loadPage();
    } catch (err) {
      setError(err?.message || `Action '${actionId}' failed`);
    } finally {
      setRunningAction("");
    }
  };

  return (
    <WorkspaceShell dir={uiConfig.dir}>
      <WorkspaceHeader
        dir={uiConfig.dir}
        eyebrow={uiConfig.eyebrow}
        title={uiConfig.title}
        subtitle={uiConfig.subtitle}
        meta={uiConfig.meta}
      />
      <WorkspacePanel
        title="Detail / Workflow"
        description={error || message || (loading ? "Loading detail..." : "Runtime detail rendered from schema.json, actions.json and backend data")}
      >
        <RuntimeDocNavStrip items={uiConfig.navItems} />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="xl:col-span-7 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <RuntimeDetailActionsBar
                basePath={uiConfig.basePath}
                id={id}
                actions={actions}
                runningAction={runningAction}
                onRunAction={handleActionRun}
                onReload={loadPage}
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {fields.map((field) => {
                  const key = field.fieldname || field.id;
                  return (
                    <div key={key} className="rounded-lg border border-slate-100 p-2">
                      <FieldRenderer
                        fieldtype={field.fieldtype || field.type || "Data"}
                        item={{ ...field, read_only: 1 }}
                        label={field.label || key}
                        value={row?.[key] ?? ""}
                        handleInputChange={() => {}}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="xl:col-span-5 space-y-4">
            <WorkspacePanel title="Workflow" description="Runtime workflow configuration preview from actions.json.">
              <WorkflowTable workflow={nativeFiles?.actions?.workflow || {}} onWorkflowChange={() => {}} />
            </WorkspacePanel>
            <WorkspacePanel title="Actions JSON" description="Current runtime action definitions.">
              <pre className="max-h-[280px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
                {JSON.stringify(nativeFiles?.actions || {}, null, 2)}
              </pre>
            </WorkspacePanel>
          </div>
        </div>
      </WorkspacePanel>
    </WorkspaceShell>
  );
}
