import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import WorkflowTable from "@/components/pages/detail/settings/Workflow";
import SettingsPermissionTable from "@/components/pages/detail/settings/SettingsPermissionTable";
import DocBuilderActionsListEditor from "@/components/workbench/doc-builder/DocBuilderActionsListEditor";

export default function DocBuilderActionsPermissionsView({ nativeDocFiles, updateNativeActions }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
      <div className="xl:col-span-2">
        <WorkspacePanel
          title="Actions Builder"
          description="Define runtime actions, methods, preconditions, and next-state transitions for `actions.json`."
        >
          <DocBuilderActionsListEditor
            actions={nativeDocFiles.actions?.actions || []}
            onChange={(actions) =>
              updateNativeActions((prev) => ({
                ...prev,
                actions,
              }))
            }
          />
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Workflow Builder" description="Existing workflow settings component wired to native actions state.">
        <WorkflowTable
          workflow={nativeDocFiles.actions?.workflow || {}}
          onWorkflowChange={(workflow) => updateNativeActions((prev) => ({ ...prev, workflow }))}
        />
      </WorkspacePanel>
      <WorkspacePanel title="Permission Builder" description="Existing permission settings table wired to native actions state.">
        <SettingsPermissionTable
          settings={nativeDocFiles.actions?.permissions || {}}
          onPermissionsChange={(permissions) => updateNativeActions((prev) => ({ ...prev, permissions }))}
        />
      </WorkspacePanel>
      <div className="xl:col-span-2">
        <WorkspacePanel title="Actions JSON Preview" description="Live preview of the native `actions.json` state that will be saved.">
          <pre className="max-h-[280px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
            {JSON.stringify(nativeDocFiles.actions || {}, null, 2)}
          </pre>
        </WorkspacePanel>
      </div>
    </div>
  );
}
