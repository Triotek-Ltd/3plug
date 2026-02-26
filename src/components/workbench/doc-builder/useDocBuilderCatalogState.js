import { useEffect, useMemo, useState } from "react";
import {
  fetchDocMeta,
  fetchPltApps,
  fetchPltLauncherCatalog,
  fetchPltModules,
  fetchPltSandboxCatalog,
  fetchPltSessionBootstrap,
  fetchPltSubmodules,
  fetchPltWorkspaces,
} from "@/utils/platformFetch";
import { toOptions, unwrapData } from "@/components/workbench/doc-builder/utils";

export default function useDocBuilderCatalogState() {
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState("");
  const [apiStatus, setApiStatus] = useState({});
  const [sessionBootstrap, setSessionBootstrap] = useState(null);
  const [launcherCatalog, setLauncherCatalog] = useState(null);
  const [appsCatalog, setAppsCatalog] = useState(null);
  const [modulesCatalog, setModulesCatalog] = useState(null);
  const [submodulesCatalog, setSubmodulesCatalog] = useState(null);
  const [workspacesCatalog, setWorkspacesCatalog] = useState(null);
  const [sandboxCatalog, setSandboxCatalog] = useState(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [selectedDocMeta, setSelectedDocMeta] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [bundleFilter, setBundleFilter] = useState("all");
  const [appFilter, setAppFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [submoduleFilter, setSubmoduleFilter] = useState("all");
  const [docFilter, setDocFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [deskView, setDeskView] = useState("selection");
  const [tableActiveFilters, setTableActiveFilters] = useState({
    doc_key: { value: "", matchType: "__icontains" },
    module: { value: "", matchType: "__icontains" },
    submodule: { value: "", matchType: "__icontains" },
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setCatalogLoading(true);
      setCatalogError("");
      try {
        const [sessionRes, launcherRes, appsRes, modulesRes, submodulesRes, workspacesRes, sandboxRes] = await Promise.all([
          fetchPltSessionBootstrap(),
          fetchPltLauncherCatalog({ bundle: "plt" }),
          fetchPltApps({ bundle: "plt" }),
          fetchPltModules({ bundle: "plt" }),
          fetchPltSubmodules({ bundle: "plt" }),
          fetchPltWorkspaces({ bundle: "plt", app: "platform_core" }),
          fetchPltSandboxCatalog(),
        ]);
        if (!mounted) return;
        const nextStatus = {
          session: !sessionRes?.error,
          launcher: !launcherRes?.error,
          apps: !appsRes?.error,
          modules: !modulesRes?.error,
          submodules: !submodulesRes?.error,
          workspaces: !workspacesRes?.error,
          sandbox: !sandboxRes?.error,
        };
        setApiStatus(nextStatus);
        setSessionBootstrap(unwrapData(sessionRes));
        setLauncherCatalog(unwrapData(launcherRes));
        setAppsCatalog(unwrapData(appsRes));
        setModulesCatalog(unwrapData(modulesRes));
        setSubmodulesCatalog(unwrapData(submodulesRes));
        setWorkspacesCatalog(unwrapData(workspacesRes));
        setSandboxCatalog(unwrapData(sandboxRes));
        if (Object.values(nextStatus).some((ok) => !ok)) {
          setCatalogError("One or more PLT APIs failed. Builder desk is using available responses.");
        }
      } catch (e) {
        if (mounted) setCatalogError(e?.message || "Failed to load builder catalogs.");
      } finally {
        if (mounted) setCatalogLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const bundles = useMemo(() => (launcherCatalog?.bundle ? [launcherCatalog.bundle] : []), [launcherCatalog]);
  const apps = useMemo(() => appsCatalog?.apps || launcherCatalog?.apps || [], [appsCatalog, launcherCatalog]);
  const modules = useMemo(() => modulesCatalog?.modules || launcherCatalog?.modules || [], [modulesCatalog, launcherCatalog]);
  const submodules = useMemo(() => submodulesCatalog?.submodules || launcherCatalog?.submodules || [], [submodulesCatalog, launcherCatalog]);
  const docs = useMemo(() => sandboxCatalog?.docs || [], [sandboxCatalog]);

  const filteredApps = useMemo(
    () => (bundleFilter === "all" ? apps : apps.filter((a) => String(a.bundle_id || a.bundle || "") === bundleFilter)),
    [apps, bundleFilter]
  );
  const filteredModules = useMemo(
    () => (appFilter === "all" ? modules : modules.filter((m) => String(m.app_id || m.app || "") === appFilter)),
    [modules, appFilter]
  );
  const filteredSubmodules = useMemo(
    () => (moduleFilter === "all" ? submodules : submodules.filter((s) => String(s.module_id || s.module || "") === moduleFilter)),
    [submodules, moduleFilter]
  );

  const visibleDocs = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    return docs.filter((d) => {
      if (moduleFilter !== "all" && String(d.module || d.module_key || "") !== moduleFilter) return false;
      if (submoduleFilter !== "all" && String(d.submodule || d.submodule_key || "") !== submoduleFilter) return false;
      if (docFilter !== "all" && String(d.doc_key || "") !== docFilter) return false;
      if (!q) return true;
      return [d.doc_key, d.module, d.module_key, d.submodule, d.submodule_key]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    });
  }, [docs, moduleFilter, submoduleFilter, docFilter, searchText]);

  const docsTableConfig = useMemo(
    () => ({
      name: "Docs",
      quick_entry: false,
      fields: [
        { fieldname: "id", label: "ID", fieldtype: "Data", in_list_view: 1 },
        { fieldname: "doc_key", label: "Doc Key", fieldtype: "Data", in_list_view: 1, in_standard_filter: 1 },
        { fieldname: "module", label: "Module", fieldtype: "Data", in_list_view: 1, in_standard_filter: 1 },
        { fieldname: "submodule", label: "Submodule", fieldtype: "Data", in_list_view: 1, in_standard_filter: 1 },
        { fieldname: "actions_count", label: "Actions", fieldtype: "Int", in_list_view: 1 },
      ],
    }),
    []
  );
  const tableFilters = useMemo(
    () => ({
      doc_key: { value: "", matchType: "__icontains" },
      module: { value: "", matchType: "__icontains" },
      submodule: { value: "", matchType: "__icontains" },
    }),
    []
  );
  const handleTableFilterChange = (name, type, value) => {
    setTableActiveFilters((prev) => ({
      ...prev,
      [name]: { ...(prev[name] || { value: "", matchType: "__icontains" }), value, matchType: type },
    }));
    setCurrentPage(1);
  };
  const handleClearTableFilters = () => {
    setTableActiveFilters({
      doc_key: { value: "", matchType: "__icontains" },
      module: { value: "", matchType: "__icontains" },
      submodule: { value: "", matchType: "__icontains" },
    });
    setCurrentPage(1);
  };

  const docsTableRows = useMemo(() => {
    const tf = tableActiveFilters;
    return visibleDocs
      .filter((d) => {
        const checks = [
          [String(d.doc_key || ""), tf.doc_key?.value],
          [String(d.module || d.module_key || ""), tf.module?.value],
          [String(d.submodule || d.submodule_key || ""), tf.submodule?.value],
        ];
        return checks.every(([value, filterValue]) => {
          const needle = String(filterValue || "").trim().toLowerCase();
          return !needle || String(value).toLowerCase().includes(needle);
        });
      })
      .map((d, index) => ({
        id: d.doc_key || `doc-${index}`,
        doc_key: d.doc_key || "-",
        module: d.module || d.module_key || "-",
        submodule: d.submodule || d.submodule_key || "-",
        actions_count: Array.isArray(d.actions) ? d.actions.length : 0,
      }));
  }, [visibleDocs, tableActiveFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [bundleFilter, appFilter, moduleFilter, submoduleFilter, docFilter, searchText]);

  const totalEntries = docsTableRows.length;
  const totalPages = Math.max(1, itemsPerPage === 0 ? 1 : Math.ceil(totalEntries / itemsPerPage));
  const pagedDocs = useMemo(() => {
    if (itemsPerPage === 0) return docsTableRows;
    const start = (currentPage - 1) * itemsPerPage;
    return docsTableRows.slice(start, start + itemsPerPage);
  }, [docsTableRows, currentPage, itemsPerPage]);

  const selectedDocKey = docFilter !== "all" ? docFilter : docsTableRows[0]?.doc_key || "";

  useEffect(() => {
    let mounted = true;
    const loadMeta = async () => {
      if (!selectedDocKey) return setSelectedDocMeta(null);
      setMetaLoading(true);
      try {
        const res = await fetchDocMeta(selectedDocKey);
        if (mounted) setSelectedDocMeta(unwrapData(res));
      } catch {
        if (mounted) setSelectedDocMeta(null);
      } finally {
        if (mounted) setMetaLoading(false);
      }
    };
    loadMeta();
    return () => {
      mounted = false;
    };
  }, [selectedDocKey]);

  const selectedDocRow =
    visibleDocs.find((d) => d.doc_key === selectedDocKey) || docsTableRows.find((d) => d.doc_key === selectedDocKey) || null;

  const bundleOptions = toOptions(bundles, (b) => b.id, (b) => b.label || b.name, "All Bundles");
  const appOptions = toOptions(filteredApps, (a) => a.id, (a) => a.label || a.name, "All Apps");
  const moduleOptions = toOptions(filteredModules, (m) => m.id, (m) => m.label || m.name, "All Modules");
  const submoduleOptions = toOptions(filteredSubmodules, (s) => s.submodule_key || s.id, (s) => s.label || s.name, "All Submodules");
  const docOptions = toOptions(visibleDocs, (d) => d.doc_key, (d) => d.doc_key, "All Docs");
  const fieldCount = Array.isArray(selectedDocMeta?.schema?.fields) ? selectedDocMeta.schema.fields.length : 0;
  const allowedActions = Array.isArray(selectedDocMeta?.allowed_actions) ? selectedDocMeta.allowed_actions : [];
  const deskViewOptions = [
    { label: "Selection", value: "selection" },
    { label: "Schema Builder", value: "schema" },
    { label: "Form Builder", value: "form" },
    { label: "List / Report Builder", value: "list_report" },
    { label: "Actions / Permissions", value: "actions" },
  ];

  return {
    catalogLoading,
    catalogError,
    apiStatus,
    sessionBootstrap,
    launcherCatalog,
    appsCatalog,
    modulesCatalog,
    submodulesCatalog,
    workspacesCatalog,
    sandboxCatalog,
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
    setTableActiveFilters,
    visibleDocs,
    docs,
    bundles,
    apps,
    modules,
    submodules,
    docsTableConfig,
    tableFilters,
    handleTableFilterChange,
    handleClearTableFilters,
    totalEntries,
    totalPages,
    pagedDocs,
    selectedDocKey,
    selectedDocRow,
    bundleOptions,
    appOptions,
    moduleOptions,
    submoduleOptions,
    docOptions,
    fieldCount,
    allowedActions,
    deskViewOptions,
  };
}
