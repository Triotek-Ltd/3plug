import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import SelectField from "@/components/fields/SelectField";
import TextField from "@/components/fields/TextField";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import SecondaryButton from "@/components/core/common/buttons/Secondary";

export default function DocBuilderHierarchyPanel({
  bundleFilter,
  setBundleFilter,
  appFilter,
  setAppFilter,
  moduleFilter,
  setModuleFilter,
  submoduleFilter,
  setSubmoduleFilter,
  docFilter,
  setDocFilter,
  searchText,
  setSearchText,
  deskView,
  setDeskView,
  bundleOptions,
  appOptions,
  moduleOptions,
  submoduleOptions,
  docOptions,
  deskViewOptions,
  loadNativeDocFiles,
  saveNativeDocFiles,
  onCreateDoc,
  onEditSchema,
  onEditActions,
  catalogLoading,
  catalogError,
  visibleDocsCount = 0,
  nativeDocFilesLoading,
  nativeDocFilesStatus,
  nativeDocFilesError,
  apiStatus = {},
}) {
  return (
    <WorkspacePanel title="Hierarchy + Doc Selection">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
        <SelectField label="Bundle" value={bundleFilter} onChange={(value) => setBundleFilter(value || "all")} options={bundleOptions} />
        <SelectField label="App" value={appFilter} onChange={(value) => setAppFilter(value || "all")} options={appOptions} />
        <SelectField label="Module" value={moduleFilter} onChange={(value) => setModuleFilter(value || "all")} options={moduleOptions} />
        <SelectField label="Submodule" value={submoduleFilter} onChange={(value) => setSubmoduleFilter(value || "all")} options={submoduleOptions} />
        <SelectField label="Doc" value={docFilter} onChange={(value) => setDocFilter(value || "all")} options={docOptions} />
        <TextField label="Search" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search docs/modules..." />
      </div>
      <div className="mt-3 max-w-sm">
        <SelectField label="Desk View" value={deskView} onChange={(value) => setDeskView(value || "selection")} options={deskViewOptions} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <PrimaryButton text="Create Doc" onClick={onCreateDoc || (() => {})} className="!px-3 !py-2 !text-xs" />
        <SecondaryButton text="Edit Schema" onClick={onEditSchema || (() => {})} className="!px-3 !py-2 !text-xs" />
        <SecondaryButton text="Edit Actions" onClick={onEditActions || (() => {})} className="!px-3 !py-2 !text-xs" />
        <SecondaryButton text="Load Native Files" onClick={loadNativeDocFiles} className="!px-3 !py-2 !text-xs" />
        <PrimaryButton text="Save Native Files" onClick={saveNativeDocFiles} className="!px-3 !py-2 !text-xs" />
        <span className="text-xs text-slate-500">
          {catalogLoading ? "Loading catalogs..." : `${visibleDocsCount} docs in current selection`}
        </span>
        {catalogError ? <span className="text-xs text-rose-600">{catalogError}</span> : null}
        {nativeDocFilesLoading ? <span className="text-xs text-slate-500">Native files loading...</span> : null}
        {nativeDocFilesStatus ? <span className="text-xs text-emerald-600">{nativeDocFilesStatus}</span> : null}
        {nativeDocFilesError ? <span className="text-xs text-rose-600">{nativeDocFilesError}</span> : null}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
        {[
          ["session", apiStatus.session],
          ["launcher", apiStatus.launcher],
          ["apps", apiStatus.apps],
          ["modules", apiStatus.modules],
          ["submodules", apiStatus.submodules],
          ["workspaces", apiStatus.workspaces],
          ["sandbox", apiStatus.sandbox],
        ].map(([label, ok]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs">
            <div className="uppercase tracking-[0.1em] text-slate-500">{label}</div>
            <div className={ok ? "font-semibold text-emerald-700" : "font-semibold text-rose-700"}>
              {catalogLoading ? "..." : ok ? "OK" : "ERR"}
            </div>
          </div>
        ))}
      </div>
    </WorkspacePanel>
  );
}
