import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import WorkflowTable from "@/components/pages/detail/settings/Workflow";
import DocScopedBuilderDeskFrame from "@/components/workbench/DocScopedBuilderDeskFrame";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";

export default function WorkflowApprovalBuilderWorkspace() {
  const state = useDocBuilderDeskState();
  const { nativeDocFiles, updateNativeActions } = state;
  const workflow = nativeDocFiles?.actions?.workflow || {};

  return (
    <DocScopedBuilderDeskFrame
      title="Workflow / Approval Builder"
      subtitle="Define workflow states, transitions, and approvals for native doc actions."
      deskLabel="Workflow / Approval Builder"
      state={state}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <WorkspacePanel title="Workflow Configuration" description="Stored in `actions.json.workflow`.">
            <WorkflowTable
              workflow={workflow}
              onWorkflowChange={(nextWorkflow) =>
                updateNativeActions((prev) => ({ ...prev, workflow: nextWorkflow }))
              }
            />
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-5">
          <WorkspacePanel title="Workflow Preview (JSON)" description="Live preview of `actions.json.workflow`.">
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(workflow, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </DocScopedBuilderDeskFrame>
  );
}
