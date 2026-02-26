import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import TableTemplate from "@/components/pages/list/TableTemplate";
import Pagination from "@/components/pages/list/Pagination";
import WorkspaceShell from "@/components/workspace/layout/WorkspaceShell";
import WorkspaceHeader from "@/components/workspace/layout/WorkspaceHeader";
import WorkspacePanel from "@/components/workspace/layout/WorkspacePanel";
import RuntimeDocNavStrip from "@/components/erp/runtime/RuntimeDocNavStrip";
import {
  buildDefaultListFilters,
  buildListTableConfig,
  buildRuntimeUiConfig,
  filterRuntimeRows,
  loadDocListData,
  loadNativeDocFiles,
} from "@/utils/nativeDocRuntime";

export default function ErpDocListRuntimePage() {
  const router = useRouter();
  const { bundle, app, module, submodule, doc } = router.query;
  const [nativeFiles, setNativeFiles] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const hierarchyReady = Boolean(bundle && app && module && submodule && doc);

  useEffect(() => {
    if (!hierarchyReady) return;
    let cancelled = false;
    setLoading(true);
    setError("");

    (async () => {
      try {
        const hierarchy = { bundle, app, module, submodule, doc };
        const [files, listRows] = await Promise.all([
          loadNativeDocFiles(hierarchy),
          loadDocListData(doc),
        ]);
        if (cancelled) return;
        setNativeFiles(files);
        setRows(Array.isArray(listRows) ? listRows : []);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to load runtime list page");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hierarchyReady, bundle, app, module, submodule, doc]);

  const tableConfig = useMemo(() => {
    if (!hierarchyReady) return { name: "Loading", fields: [] };
    return buildListTableConfig(
      { bundle, app, module, submodule, doc },
      nativeFiles || {}
    );
  }, [hierarchyReady, bundle, app, module, submodule, doc, nativeFiles]);
  const uiConfig = useMemo(
    () =>
      hierarchyReady
        ? buildRuntimeUiConfig({ bundle, app, module, submodule, doc }, nativeFiles || {}, "list")
        : { dir: "ltr", title: "Doc List", eyebrow: "ERP", subtitle: "", meta: [], navItems: [] },
    [hierarchyReady, bundle, app, module, submodule, doc, nativeFiles]
  );

  const filterConfig = useMemo(() => buildDefaultListFilters(tableConfig), [tableConfig]);

  useEffect(() => {
    setActiveFilters(filterConfig);
    setCurrentPage(1);
  }, [filterConfig]);

  const filteredRows = useMemo(
    () => filterRuntimeRows(rows, activeFilters),
    [rows, activeFilters]
  );

  const totalEntries = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalEntries / itemsPerPage));
  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRows.slice(start, start + itemsPerPage);
  }, [filteredRows, currentPage, itemsPerPage]);

  const handleFilterChange = (field, value) => {
    setActiveFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setActiveFilters(filterConfig);
    setCurrentPage(1);
  };

  return (
    <WorkspaceShell dir={uiConfig.dir}>
      <WorkspaceHeader
        dir={uiConfig.dir}
        eyebrow={uiConfig.eyebrow}
        title={uiConfig.title}
        subtitle={uiConfig.subtitle}
        meta={uiConfig.meta}
      />
      <WorkspacePanel
        title="List View"
        description={
          error ||
          (loading
            ? "Loading runtime list..."
            : "Runtime list rendered from schema.json and backend data")
        }
      >
        <RuntimeDocNavStrip items={uiConfig.navItems} />
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableTemplate
            tableConfig={tableConfig}
            data={pagedRows}
            filters={filterConfig}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            handleClearFilters={handleClearFilters}
            applyFilters={() => {}}
            refresh={() => router.replace(router.asPath)}
          />
        </div>
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
    </WorkspaceShell>
  );
}
