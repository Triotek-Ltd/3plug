import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import DocBuilderHierarchyPanel from "@/components/workbench/doc-builder/DocBuilderHierarchyPanel";
import DocBuilderDocsTablePanel from "@/components/workbench/doc-builder/DocBuilderDocsTablePanel";
import DocBuilderMetaPreviewPanel from "@/components/workbench/doc-builder/DocBuilderMetaPreviewPanel";
import DocBuilderActionsPermissionsView from "@/components/workbench/doc-builder/DocBuilderActionsPermissionsView";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";
import { useUiDirection } from "@/contexts/UiDirectionContext";

export default function ActionsPermissionsBuilderDeskWorkspace() {
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
    updateNativeActions,
    loadNativeDocFiles,
    saveNativeDocFiles,
  } = state;

  return (
    <WorkspaceShell dir={dir} className="py-4 md:py-5">
      <WorkspaceHeader
        dir={dir}
        eyebrow="Workbench"
        title="Actions / Permissions Builder Desk"
        subtitle="Configure native actions, workflow, and permissions using existing settings and detail builder components."
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
        deskView="actions"
        setDeskView={() => {}}
        bundleOptions={bundleOptions}
        appOptions={appOptions}
        moduleOptions={moduleOptions}
        submoduleOptions={submoduleOptions}
        docOptions={docOptions}
        deskViewOptions={[{ label: "Actions / Permissions", value: "actions" }]}
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

      <DocBuilderActionsPermissionsView nativeDocFiles={nativeDocFiles} updateNativeActions={updateNativeActions} />
    </WorkspaceShell>
  );
}
