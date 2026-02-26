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

export default function PrintFormatBuilderDeskWorkspace() {
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

  const printConfig = nativeDocFiles?.doc?.print_format || {};

  return (
    <WorkspaceShell dir={dir} className="py-4 md:py-5">
      <WorkspaceHeader
        dir={dir}
        eyebrow="Workbench"
        title="Print Format Builder Desk"
        subtitle="Define print format metadata and output defaults for native docs using reusable field and panel components."
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
        deskViewOptions={[{ label: "Print Format Builder", value: "selection" }]}
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
        <div className="xl:col-span-6">
          <WorkspacePanel title="Print Format Configuration" description="Save print-format defaults into the native doc definition (`doc.json`).">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <TextField
                label="Format Name"
                value={printConfig.name || ""}
                onChange={(e) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), name: e.target.value },
                  }))
                }
                placeholder="Standard"
              />
              <SelectField
                label="Page Size"
                value={printConfig.page_size || "A4"}
                onChange={(value) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), page_size: value || "A4" },
                  }))
                }
                options={[
                  { label: "A4", value: "A4" },
                  { label: "Letter", value: "Letter" },
                  { label: "Legal", value: "Legal" },
                ]}
              />
              <SelectField
                label="Orientation"
                value={printConfig.orientation || "portrait"}
                onChange={(value) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), orientation: value || "portrait" },
                  }))
                }
                options={[
                  { label: "Portrait", value: "portrait" },
                  { label: "Landscape", value: "landscape" },
                ]}
              />
              <TextField
                label="Header Template"
                value={printConfig.header_template || ""}
                onChange={(e) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), header_template: e.target.value },
                  }))
                }
                placeholder="header_default"
              />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <CheckField
                label="Show Header"
                checked={Boolean(printConfig.show_header ?? true)}
                onChange={(e) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), show_header: e.target.checked },
                  }))
                }
              />
              <CheckField
                label="Show Footer"
                checked={Boolean(printConfig.show_footer ?? true)}
                onChange={(e) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), show_footer: e.target.checked },
                  }))
                }
              />
              <CheckField
                label="Include Draft Watermark"
                checked={Boolean(printConfig.draft_watermark)}
                onChange={(e) =>
                  updateNativeDoc((doc) => ({
                    ...doc,
                    print_format: { ...(doc.print_format || {}), draft_watermark: e.target.checked },
                  }))
                }
              />
            </div>
          </WorkspacePanel>
        </div>
        <div className="xl:col-span-6">
          <WorkspacePanel title="Print Format Preview (JSON)" description="Live preview of the `doc.json.print_format` payload that will be saved.">
            <pre className="max-h-[360px] overflow-auto rounded-lg bg-slate-950 p-3 text-[11px] leading-5 text-slate-100">
              {JSON.stringify(printConfig, null, 2)}
            </pre>
          </WorkspacePanel>
        </div>
      </div>
    </WorkspaceShell>
  );
}
