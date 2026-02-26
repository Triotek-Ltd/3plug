import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import { useCallback } from "react";
import DocBuilderDocsTablePanel from "@/components/workbench/doc-builder/DocBuilderDocsTablePanel";
import DocBuilderMetaPreviewPanel from "@/components/workbench/doc-builder/DocBuilderMetaPreviewPanel";
import DocBuilderSchemaView from "@/components/workbench/doc-builder/DocBuilderSchemaView";
import DocBuilderFormView from "@/components/workbench/doc-builder/DocBuilderFormView";
import DocBuilderListReportView from "@/components/workbench/doc-builder/DocBuilderListReportView";
import DocBuilderActionsPermissionsView from "@/components/workbench/doc-builder/DocBuilderActionsPermissionsView";
import DocBuilderHierarchyPanel from "@/components/workbench/doc-builder/DocBuilderHierarchyPanel";
import useDocBuilderDeskState from "@/components/workbench/doc-builder/useDocBuilderDeskState";
import { useUiDirection } from "@/contexts/UiDirectionContext";

export default function DocBuilderDeskWorkspace() {
  const { dir } = useUiDirection();
  const state = useDocBuilderDeskState();
  const {
    catalogLoading,
    catalogError,
    apiStatus,
    sessionBootstrap,
    workspacesCatalog,
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
    deskView,
    setDeskView,
    tableActiveFilters,
    nativeDocFilesLoading,
    nativeDocFilesError,
    nativeDocFilesStatus,
    nativeDocFiles,
    formPreviewValues,
    setFormPreviewValues,
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
    selectedDocKey,
    bundleOptions,
    appOptions,
    moduleOptions,
    submoduleOptions,
    docOptions,
    selectedDocRow,
    fieldCount,
    allowedActions,
    deskViewOptions,
    studioConfig,
    schemaFields,
    listPreviewTableConfig,
    listPreviewRows,
    updateNativeActions,
    updateNativeDoc,
    updateNativeSchemaFields,
    applyStudioSchemaConfig,
    loadNativeDocFiles,
    saveNativeDocFiles,
  } = state;

  const handleSchemaBuilderSave = useCallback(
    async (updatedConfig) => {
      const nextFiles = {
        ...nativeDocFiles,
        schema: {
          ...(nativeDocFiles.schema || {}),
          ...(updatedConfig || {}),
          fields: Array.isArray(updatedConfig?.fields)
            ? updatedConfig.fields
            : nativeDocFiles.schema?.fields || [],
        },
      };
      applyStudioSchemaConfig(updatedConfig);
      await saveNativeDocFiles(nextFiles);
    },
    [applyStudioSchemaConfig, nativeDocFiles, saveNativeDocFiles]
  );
  return (
    <WorkspaceShell dir={dir} className="py-4 md:py-5">
      <WorkspaceHeader
        dir={dir}
        eyebrow="Workbench"
        title="Doc Builder Desk"
        subtitle="Select a bundle, app, module, and submodule to manage native doc definitions."
        meta={[
          { label: "Bundles", value: String(bundles.length) },
          { label: "Apps", value: String(apps.length) },
          { label: "Modules", value: String(modules.length) },
          { label: "Docs", value: String(docs.length) },
          { label: "Workspaces", value: String((workspacesCatalog?.workspaces || []).length) },
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
        deskView={deskView}
        setDeskView={setDeskView}
        bundleOptions={bundleOptions}
        appOptions={appOptions}
        moduleOptions={moduleOptions}
        submoduleOptions={submoduleOptions}
        docOptions={docOptions}
        deskViewOptions={deskViewOptions}
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

      {deskView === "schema" ? (
        <div className="mt-4">
          <DocBuilderSchemaView
            selectedDocKey={selectedDocKey}
            studioConfig={studioConfig}
            onSchemaSave={handleSchemaBuilderSave}
          />
        </div>
      ) : null}

      {deskView === "form" ? (
        <div className="mt-4">
          <DocBuilderFormView
            schemaFields={schemaFields}
            formPreviewValues={formPreviewValues}
            setFormPreviewValues={setFormPreviewValues}
            onSchemaFieldsChange={updateNativeSchemaFields}
          />
        </div>
      ) : null}

      {deskView === "list_report" ? (
        <div className="mt-4">
          <DocBuilderListReportView
            listPreviewTableConfig={listPreviewTableConfig}
            listPreviewRows={listPreviewRows}
            schemaFields={schemaFields}
            nativeDocFiles={nativeDocFiles}
            onSchemaFieldsChange={updateNativeSchemaFields}
            onDocConfigChange={updateNativeDoc}
          />
        </div>
      ) : null}

      {deskView === "actions" ? (
        <DocBuilderActionsPermissionsView nativeDocFiles={nativeDocFiles} updateNativeActions={updateNativeActions} />
      ) : null}
    </WorkspaceShell>
  );
}
