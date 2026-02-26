import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import DocBuilderHierarchyPanel from "@/components/workbench/doc-builder/DocBuilderHierarchyPanel";
import DocBuilderDocsTablePanel from "@/components/workbench/doc-builder/DocBuilderDocsTablePanel";
import DocBuilderMetaPreviewPanel from "@/components/workbench/doc-builder/DocBuilderMetaPreviewPanel";
import DashboardWidgetsEditor from "@/components/workbench/dashboard-builder/DashboardWidgetsEditor";
import TextField from "@/components/fields/TextField";
import CheckField from "@/components/fields/CheckField";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";
import { useUiDirection } from "@/contexts/UiDirectionContext";

export default function DashboardBuilderDeskWorkspace() {
  const { dir } = useUiDirection();
  const state = useDocBuilderDeskState();
  const {
    catalogLoading,
    catalogError,
    apiStatus,
    sessionBootstrap,
    metaLoading,
    selectedDocMeta,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
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
    tableActiveFilters,
    nativeDocFilesLoading,
    nativeDocFilesError,
    nativeDocFilesStatus,
    nativeDocFiles,
    visibleDocs,
    docs,
    bundles,
    apps,
    modules,
    docsTableConfig,
    tableFilters,
    handleTableFilterChange,
    handleClearTableFilters,
    totalEntries,
    totalPages,
    pagedDocs,
    bundleOptions,
    appOptions,
    moduleOptions,
    submoduleOptions,
    docOptions,
    selectedDocRow,
    fieldCount,
    allowedActions,
    updateNativeDoc,
    loadNativeDocFiles,
    saveNativeDocFiles,
  } = state;

  const dashboardConfig = nativeDocFiles?.doc?.dashboard || {};
  const widgets = Array.isArray(dashboardConfig.widgets) ? dashboardConfig.widgets : [];
  const updateDashboard = (patch) =>
    updateNativeDoc((doc) => ({
      ...doc,
      dashboard: {
        ...(doc.dashboard || {}),
        ...patch,
      },
    }));

  return (
    <WorkspaceShell dir={dir} className="py-4 md:py-5">
      <WorkspaceHeader
        dir={dir}
        eyebrow="Workbench"
        title="Dashboard Builder Desk"
        subtitle="Compose dashboard widget configurations for native docs using reusable builder sections and field components."
        meta={[
          { label: "Bundles", value: String(bundles.length) },
          { label: "Apps", value: String(apps.length) },
          { label: "Modules", value: String(modules.length) },
          { label: "Docs", value: String(docs.length) },
        ]}
      />

      <DocBuilderHierarchyPanel
        bundleFilter={bundleFilter}
        setBundleFilter={setBundleFilter}
        appFilter={appFilter}
        setAppFilter={setAppFilter}
        moduleFilter={moduleFilter}
        setModuleFilter={setModuleFilter}
        submoduleFilter={submoduleFilter}
        setSubmoduleFilter={setSubmoduleFilter}
        docFilter={docFilter}
        setDocFilter={setDocFilter}
        searchText={searchText}
        setSearchText={setSearchText}
        deskView="selection"
        setDeskView={() => {}}
        bundleOptions={bundleOptions}
        appOptions={appOptions}
        moduleOptions={moduleOptions}
        submoduleOptions={submoduleOptions}
        docOptions={docOptions}
        deskViewOptions={[{ label: "Dashboard Builder", value: "selection" }]}
        loadNativeDocFiles={loadNativeDocFiles}
        saveNativeDocFiles={saveNativeDocFiles}
        catalogLoading={catalogLoading}
        catalogError={catalogError}
        visibleDocsCount={visibleDocs.length}
        nativeDocFilesLoading={nativeDocFilesLoading}
        nativeDocFilesStatus={nativeDocFilesStatus}
        nativeDocFilesError={nativeDocFilesError}
        apiStatus={apiStatus}
      />

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <DocBuilderDocsTablePanel
            docsTableConfig={docsTableConfig}
            pagedDocs={pagedDocs}
            tableFilters={tableFilters}
            tableActiveFilters={tableActiveFilters}
            handleTableFilterChange={handleTableFilterChange}
            handleClearTableFilters={handleClearTableFilters}
            setDocFilter={setDocFilter}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            totalEntries={totalEntries}
          />
        </div>
        <div className="xl:col-span-5">
          <DocBuilderMetaPreviewPanel
            selectedDocRow={selectedDocRow}
            metaLoading={metaLoading}
            fieldCount={fieldCount}
            allowedActions={allowedActions}
            sessionBootstrap={sessionBootstrap}
            selectedDocMeta={selectedDocMeta}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <WorkspacePanel title="Dashboard Configuration" description="Stored in `doc.json.dashboard` for the selected native doc.">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Dashboard Name" value={dashboardConfig.name || ""} onChange={(e) => updateDashboard({ name: e.target.value })} placeholder="Operations Overview" />
              <TextField label="Layout Columns" type="number" value={String(dashboardConfig.columns ?? 12)} onChange={(e) => updateDashboard({ columns: Number(e.target.value || 0) || 12 })} />
              <CheckField label="Refresh on Load" checked={Boolean(dashboardConfig.refresh_on_load ?? true)} onChange={(e) => updateDashboard({ refresh_on_load: e.target.checked })} />
              <CheckField label="Show Filters Bar" checked={Boolean(dashboardConfig.show_filters ?? true)} onChange={(e) => updateDashboard({ show_filters: e.target.checked })} />
            </div>
            <div className="mt-4">
              <DashboardWidgetsEditor
                widgets={widgets}
                onChange={(nextWidgets) => updateDashboard({ widgets: nextWidgets })}
              />
            </div>
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-5">
          <WorkspacePanel title="Dashboard Config Preview (JSON)" description="Live preview of `doc.json.dashboard`.">
            <pre className="max-h-[420px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(dashboardConfig, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </WorkspaceShell>
  );
}
