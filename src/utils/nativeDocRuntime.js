import { fetchData, postData } from "@/utils/Api";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeFields(schema = {}) {
  return ensureArray(schema.fields).map((field) => ({
    ...field,
    id: field.id || field.fieldname,
    fieldname: field.fieldname || field.id,
    name: field.name || field.label || field.fieldname || field.id,
  }));
}

export async function loadNativeDocFiles(hierarchy) {
  const params = new URLSearchParams({
    bundle: hierarchy.bundle,
    app: hierarchy.app,
    module: hierarchy.module,
    submodule: hierarchy.submodule,
    doc_key: hierarchy.doc,
  });

  const response = await fetch(`/api/native-doc-files?${params.toString()}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Failed to load native doc files");
  }
  return response.json();
}

export function buildListTableConfig(hierarchy, nativeFiles) {
  const doc = nativeFiles?.doc || {};
  const schema = nativeFiles?.schema || {};
  const fields = normalizeFields(schema);

  return {
    name: doc.title || hierarchy.doc,
    title: doc.title || hierarchy.doc,
    isList: true,
    quick_entry: false,
    customize: false,
    fields,
    settings: doc.list_report || {},
  };
}

export function buildReportTableConfig(hierarchy, nativeFiles, reportRows = []) {
  const doc = nativeFiles?.doc || {};
  const listReport = doc.list_report || {};
  const groupKey = listReport.group_by || "group";

  return {
    name: `${doc.title || hierarchy.doc} Report`,
    title: `${doc.title || hierarchy.doc} Report`,
    isList: true,
    quick_entry: false,
    customize: false,
    fields: [
      { fieldname: "id", label: "ID", fieldtype: "Data", in_list_view: 1 },
      { fieldname: groupKey, label: `Group (${groupKey})`, fieldtype: "Data", in_list_view: 1, in_standard_filter: 1 },
      { fieldname: "count", label: "Count", fieldtype: "Int", in_list_view: 1, in_standard_filter: 0 },
    ],
    settings: {
      report_mode: true,
      source_count: Array.isArray(reportRows) ? reportRows.length : 0,
    },
  };
}

export async function loadDocListData(docKey) {
  try {
    const rows = await fetchData({}, docKey);
    if (Array.isArray(rows)) return rows;
    if (Array.isArray(rows?.data)) return rows.data;
    if (Array.isArray(rows?.results)) return rows.results;
    return [];
  } catch {
    return [];
  }
}

export function buildDefaultListFilters(tableConfig) {
  const filters = {};
  (tableConfig?.fields || []).forEach((field) => {
    if (!field?.fieldname) return;
    if (field?.in_standard_filter || field?.filter) {
      filters[field.fieldname] = "";
    }
  });
  return filters;
}

export function filterRuntimeRows(rows, activeFilters) {
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    Object.entries(activeFilters || {}).every(([key, value]) => {
      if (!value) return true;
      const cell = row?.[key];
      return String(cell ?? "")
        .toLowerCase()
        .includes(String(value).toLowerCase());
    })
  );
}

export function buildRuntimeReportRows(rows, groupBy) {
  const keyName = groupBy || "group";
  const map = new Map();
  (Array.isArray(rows) ? rows : []).forEach((row) => {
    const groupValue = String(row?.[keyName] ?? "Unspecified");
    map.set(groupValue, (map.get(groupValue) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([group, count], index) => ({
      id: `report-${index + 1}`,
      [keyName]: group,
      count,
    }))
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0));
}

export function getRenderableFormFields(nativeFiles) {
  const fields = normalizeFields(nativeFiles?.schema || {});
  return fields.filter((field) => {
    const type = String(field.fieldtype || field.type || "").toLowerCase();
    if (!field.fieldname) return false;
    if (field.hidden || field.hidden === 1) return false;
    if (["section break", "column break", "tab break", "html"].includes(type)) {
      return false;
    }
    return true;
  });
}

export function buildInitialFormState(fields, row = null) {
  const state = {};
  fields.forEach((field) => {
    const key = field.fieldname || field.id;
    if (!key) return;
    state[key] = row?.[key] ?? field.default ?? "";
  });
  return state;
}

export async function loadDocDetailData(docKey, rowId) {
  if (!docKey || !rowId) return null;
  try {
    const response = await fetchData({}, `${docKey}/${rowId}`);
    return response?.data || response || null;
  } catch {
    return null;
  }
}

export async function executeDocRuntimeAction(docKey, rowId, actionId, payload = {}) {
  if (!docKey || !rowId || !actionId) {
    throw new Error("Missing doc/action context");
  }
  const endpoint = `${docKey}/${rowId}/actions/${actionId}`;
  const response = await postData(payload, endpoint);
  if (response?.error) {
    throw new Error(response?.message || "Action failed");
  }
  return response?.data || response;
}

function humanizeKey(value = "") {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveRuntimeNavLink(link, basePath) {
  if (!link) return basePath;
  if (String(link).startsWith("./")) {
    return `${basePath}/${String(link).slice(2)}`.replace(/\/+/g, "/");
  }
  return link;
}

function buildStandardRuntimeNavItems(basePath) {
  return [
    { label: "List", href: `${basePath}/list`, target: "sidebar", enabled: true },
    { label: "Report", href: `${basePath}/report`, target: "sidebar", enabled: true },
    { label: "New", href: `${basePath}/new`, target: "quick_action", enabled: true },
  ];
}

export function buildRuntimeUiConfig(hierarchy, nativeFiles, viewKey) {
  const docConfig = nativeFiles?.doc || {};
  const page = docConfig.page || {};
  const workspace = docConfig.workspace || {};
  const navigation = docConfig.navigation || {};
  const basePath = `/erp/${hierarchy.bundle}/${hierarchy.app}/${hierarchy.module}/${hierarchy.submodule}/${hierarchy.doc}`;
  const authoredNavItems = (Array.isArray(navigation.items) ? navigation.items : [])
    .filter((item) => item?.enabled !== false)
    .map((item) => ({
      ...item,
      href: resolveRuntimeNavLink(
        item.link,
        basePath
      ),
    }));
  const navItems = authoredNavItems.length ? authoredNavItems : buildStandardRuntimeNavItems(basePath);

  const titleBase = page.title || humanizeKey(hierarchy.doc);
  const viewTitle = viewKey ? ` ${humanizeKey(viewKey)}` : "";
  const dir = workspace.dir || page.dir || "ltr";

  return {
    dir,
    title: `${titleBase}${viewTitle}`,
    eyebrow: workspace.name || "ERP",
    subtitle:
      page.description ||
      workspace.description ||
      "Doc-driven runtime page rendered from native config files.",
    meta: [
      { label: "Bundle", value: hierarchy.bundle },
      { label: "App", value: hierarchy.app },
      { label: "Module", value: hierarchy.module },
      { label: "Submodule", value: hierarchy.submodule },
    ],
    navItems,
    basePath,
  };
}
