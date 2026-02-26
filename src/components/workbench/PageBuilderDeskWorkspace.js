import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import TextField from "@/components/fields/TextField";
import SelectField from "@/components/fields/SelectField";
import CheckField from "@/components/fields/CheckField";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import DocScopedBuilderDeskFrame from "@/components/workbench/DocScopedBuilderDeskFrame";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";

export default function PageBuilderDeskWorkspace() {
  const state = useDocBuilderDeskState();
  const { nativeDocFiles, updateNativeDoc } = state;
  const pageConfig = nativeDocFiles?.doc?.page || {};

  const setPagePatch = (patch) =>
    updateNativeDoc((doc) => ({
      ...doc,
      page: {
        ...(doc.page || {}),
        ...patch,
      },
    }));

  const applyRuntimePageDefaults = () =>
    updateNativeDoc((doc) => ({
      ...doc,
      page: {
        template: "list",
        show_filters: true,
        show_toolbar: true,
        quick_entry: false,
        ...(doc.page || {}),
      },
    }));

  return (
    <DocScopedBuilderDeskFrame
      title="Page Builder Desk"
      subtitle="Define page-level metadata and composition defaults for native docs."
      deskLabel="Page Builder"
      state={state}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <WorkspacePanel title="Page Configuration" description="Stored in `doc.json.page` for the selected native doc.">
            <div className="mb-3 flex items-center justify-end">
              <SecondaryButton
                text="Apply Runtime Page Defaults"
                onClick={applyRuntimePageDefaults}
                className="!px-3 !py-2 !text-xs"
              />
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Page Title" value={pageConfig.title || ""} onChange={(e) => setPagePatch({ title: e.target.value })} placeholder="Task Desk" />
              <SelectField
                label="Template"
                value={pageConfig.template || "index"}
                onChange={(value) => setPagePatch({ template: value || "index" })}
                options={[
                  { label: "Index", value: "index" },
                  { label: "List", value: "list" },
                  { label: "Module", value: "module" },
                  { label: "Edit", value: "edit" },
                  { label: "New", value: "new" },
                ]}
              />
              <TextField label="Route Path" value={pageConfig.route || ""} onChange={(e) => setPagePatch({ route: e.target.value })} placeholder="/erp/tasks" />
              <TextField label="Section Key" value={pageConfig.section || ""} onChange={(e) => setPagePatch({ section: e.target.value })} placeholder="operations" />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <CheckField label="Show Filters" checked={Boolean(pageConfig.show_filters ?? true)} onChange={(e) => setPagePatch({ show_filters: e.target.checked })} />
              <CheckField label="Show Toolbar" checked={Boolean(pageConfig.show_toolbar ?? true)} onChange={(e) => setPagePatch({ show_toolbar: e.target.checked })} />
              <CheckField label="Enable Quick Entry" checked={Boolean(pageConfig.quick_entry)} onChange={(e) => setPagePatch({ quick_entry: e.target.checked })} />
            </div>
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-5">
          <WorkspacePanel title="Page Config Preview (JSON)" description="Live preview of `doc.json.page`.">
            <pre className="max-h-[360px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(pageConfig, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </DocScopedBuilderDeskFrame>
  );
}
