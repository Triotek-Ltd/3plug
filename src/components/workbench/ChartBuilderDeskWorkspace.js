import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import DocBuilderHierarchyPanel from "@/components/workbench/doc-builder/DocBuilderHierarchyPanel";
import DocBuilderDocsTablePanel from "@/components/workbench/doc-builder/DocBuilderDocsTablePanel";
import DocBuilderMetaPreviewPanel from "@/components/workbench/doc-builder/DocBuilderMetaPreviewPanel";
import SelectField from "@/components/fields/SelectField";
import TextField from "@/components/fields/TextField";
import CheckField from "@/components/fields/CheckField";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";
import { useUiDirection } from "@/contexts/UiDirectionContext";

export default function ChartBuilderDeskWorkspace() {
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
    schemaFields,
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

  const chartConfig = nativeDocFiles?.doc?.chart || {};
  const fieldOptions = [
    { label: "None", value: "" },
    ...schemaFields
      .filter((f) => !String(f.fieldtype || "").includes("Break"))
      .map((f) => ({ label: f.label || f.fieldname || f.id, value: f.fieldname || f.id })),
  ];

  const setChartPatch = (patch) =>
    updateNativeDoc((doc) => ({
      ...doc,
      chart: {
        ...(doc.chart || {}),
        ...patch,
      },
    }));

  return (
    <WorkspaceShell dir={dir} className="py-4 md:py-5">
      <WorkspaceHeader
        dir={dir}
        eyebrow="Workbench"
        title="Chart Builder Desk"
        subtitle="Configure chart metadata and dataset mappings for native docs using reusable field components."
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
        deskViewOptions={[{ label: "Chart Builder", value: "selection" }]}
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
          <WorkspacePanel title="Chart Configuration" description="Stored in `doc.json.chart` for the selected native doc.">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField label="Chart Name" value={chartConfig.name || ""} onChange={(e) => setChartPatch({ name: e.target.value })} placeholder="Revenue Trend" />
              <SelectField
                label="Chart Type"
                value={chartConfig.type || "bar"}
                onChange={(value) => setChartPatch({ type: value || "bar" })}
                options={[
                  { label: "Bar", value: "bar" },
                  { label: "Line", value: "line" },
                  { label: "Pie", value: "pie" },
                  { label: "Area", value: "area" },
                ]}
              />
              <SelectField label="Label Field" value={chartConfig.label_field || ""} onChange={(value) => setChartPatch({ label_field: value || "" })} options={fieldOptions} />
              <SelectField label="Value Field" value={chartConfig.value_field || ""} onChange={(value) => setChartPatch({ value_field: value || "" })} options={fieldOptions} />
              <SelectField label="Group By Field" value={chartConfig.group_by || ""} onChange={(value) => setChartPatch({ group_by: value || "" })} options={fieldOptions} />
              <TextField label="Dataset Limit" type="number" value={String(chartConfig.limit ?? 20)} onChange={(e) => setChartPatch({ limit: Number(e.target.value || 0) || 0 })} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <CheckField label="Show Legend" checked={Boolean(chartConfig.show_legend ?? true)} onChange={(e) => setChartPatch({ show_legend: e.target.checked })} />
              <CheckField label="Stack Series" checked={Boolean(chartConfig.stacked)} onChange={(e) => setChartPatch({ stacked: e.target.checked })} />
              <CheckField label="Auto Refresh" checked={Boolean(chartConfig.auto_refresh)} onChange={(e) => setChartPatch({ auto_refresh: e.target.checked })} />
            </div>
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-5">
          <WorkspacePanel title="Chart Config Preview (JSON)" description="Live preview of `doc.json.chart`.">
            <pre className="max-h-[380px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(chartConfig, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </WorkspaceShell>
  );
}
