import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import TableTemplate from "@/components/pages/list/TableTemplate";
import Pagination from "@/components/pages/list/Pagination";
import SecondaryButton from "@/components/core/common/buttons/Secondary";

export default function DocBuilderDocsTablePanel({
  docsTableConfig,
  pagedDocs,
  tableFilters,
  tableActiveFilters,
  handleTableFilterChange,
  handleClearTableFilters,
  setDocFilter,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  totalEntries,
}) {
  return (
    <WorkspacePanel title="Docs Table" description="Dynamic docs list for the selected hierarchy.">
      <div className="rounded-xl border border-slate-200 bg-white">
        <TableTemplate
          tableConfig={docsTableConfig}
          data={pagedDocs}
          filters={tableFilters}
          activeFilters={tableActiveFilters}
          handleFilterChange={handleTableFilterChange}
          handleClearFilters={handleClearTableFilters}
          applyFilters={() => {}}
          refresh={() => {}}
        />
      </div>
      {pagedDocs.length ? (
        <div className="mt-2 flex items-center gap-2">
          <SecondaryButton
            text="Open First Row"
            onClick={() => setDocFilter(pagedDocs[0]?.doc_key || "all")}
            className="!px-3 !py-2 !text-xs"
          />
          <span className="text-xs text-slate-500">Use the list filters in the table header to narrow docs further.</span>
        </div>
      ) : null}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value);
          setCurrentPage(1);
        }}
        total_entries={totalEntries}
      />
    </WorkspacePanel>
  );
}
