import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import CheckField from "@/components/fields/CheckField";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import DocScopedBuilderDeskFrame from "@/components/workbench/DocScopedBuilderDeskFrame";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";

export default function WorkspaceDeskBuilderWorkspace() {
  const state = useDocBuilderDeskState();
  const { nativeDocFiles, updateNativeDoc } = state;
  const workspaceConfig = nativeDocFiles?.doc?.workspace || {};

  const setWorkspacePatch = (patch) =>
    updateNativeDoc((doc) => ({
      ...doc,
      workspace: {
        ...(doc.workspace || {}),
        ...patch,
      },
    }));

  const applyRuntimeWorkspaceDefaults = () =>
    updateNativeDoc((doc) => ({
      ...doc,
      workspace: {
        layout: "12-col",
        sticky_filters: true,
        show_metrics: true,
        enable_tabs: false,
        ...(doc.workspace || {}),
      },
    }));

  return (
    <DocScopedBuilderDeskFrame
      title="Workspace / Desk Builder"
      subtitle="Configure desk/workspace shell behavior and composition defaults for native docs."
      deskLabel="Workspace / Desk Builder"
      state={state}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <WorkspacePanel title="Workspace Configuration" description="Stored in `doc.json.workspace`.">
            <div className="mb-3 flex items-center justify-end">
              <SecondaryButton
                text="Apply Runtime Workspace Defaults"
                onClick={applyRuntimeWorkspaceDefaults}
                className="!px-3 !py-2 !text-xs"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Desk Name" value={workspaceConfig.name || ""} onChange={(e) => setWorkspacePatch({ name: e.target.value })} placeholder="Operations Desk" />
              <SelectField
                label="Layout"
                value={workspaceConfig.layout || "12-col"}
                onChange={(value) => setWorkspacePatch({ layout: value || "12-col" })}
                options={[
                  { label: "12 Column", value: "12-col" },
                  { label: "2 Column", value: "2-col" },
                  { label: "3 Column", value: "3-col" },
                  { label: "Stacked", value: "stacked" },
                ]}
              />
              <TextField label="Default View" value={workspaceConfig.default_view || ""} onChange={(e) => setWorkspacePatch({ default_view: e.target.value })} placeholder="overview" />
              <TextField label="Sidebar Group" value={workspaceConfig.sidebar_group || ""} onChange={(e) => setWorkspacePatch({ sidebar_group: e.target.value })} placeholder="operations" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <CheckField label="Sticky Filters" checked={Boolean(workspaceConfig.sticky_filters)} onChange={(e) => setWorkspacePatch({ sticky_filters: e.target.checked })} />
              <CheckField label="Show Metrics" checked={Boolean(workspaceConfig.show_metrics ?? true)} onChange={(e) => setWorkspacePatch({ show_metrics: e.target.checked })} />
              <CheckField label="Enable Tabs" checked={Boolean(workspaceConfig.enable_tabs)} onChange={(e) => setWorkspacePatch({ enable_tabs: e.target.checked })} />
            </div>
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-5">
          <WorkspacePanel title="Workspace Config Preview (JSON)" description="Live preview of `doc.json.workspace`.">
            <pre className="max-h-[360px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(workspaceConfig, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </DocScopedBuilderDeskFrame>
  );
}
