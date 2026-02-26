import {
  fetchDocDetail,
  fetchDocList,
  fetchDocMeta,
  fetchPltLauncherCatalog,
  fetchPltSessionBootstrap,
  fetchPltWorkspaces,
} from "@/utils/platformFetch";

const unwrap = (result) => {
  if (!result) return null;
  if (result.error) return null;
  return result.data || null;
};

export const resolvePltShellContext = async (params = {}) => {
  const [sessionRes, catalogRes, workspaceRes] = await Promise.all([
    fetchPltSessionBootstrap(params),
    fetchPltLauncherCatalog({ bundle: "plt", ...params }),
    fetchPltWorkspaces({ bundle: "plt", app: "platform_core", ...params }),
  ]);

  const session = unwrap(sessionRes);
  const catalog = unwrap(catalogRes);
  const workspaces = unwrap(workspaceRes);

  return {
    session,
    catalog,
    workspaces,
    shell: buildShellModel({ session, catalog, workspaces }),
  };
};

export const resolveDocRuntime = async ({ docKey, docId = null, params = {} }) => {
  const [metaRes, dataRes] = await Promise.all([
    fetchDocMeta(docKey, params),
    docId ? fetchDocDetail(docKey, docId, params) : fetchDocList(docKey, params),
  ]);

  const meta = unwrap(metaRes);
  const data = unwrap(dataRes);

  return {
    meta,
    data,
    doc: {
      docKey,
      allowedActions:
        meta?.data?.allowed_actions ||
        meta?.data?.doc_meta?.allowed_actions ||
        [],
      stateModel: meta?.data?.state_model || null,
    },
  };
};

export const buildShellModel = ({ session, catalog, workspaces }) => {
  const sessionData = session?.data || {};
  const catalogData = catalog?.data || {};
  const workspaceData = workspaces?.data || {};
  const accountType =
    sessionData?.account?.account_type ||
    session?.context?.account?.account_type ||
    null;

  const modules = catalogData.modules || [];
  const submodules = catalogData.submodules || [];
  const backendTopNav = sessionData.top_nav || sessionData.topNav || [];
  const backendLauncherSections = catalogData.launcher_sections || catalogData.launcherSections || [];
  const derivedLauncherSections = modules.length
    ? [
        {
          id: "plt-platform-core",
          title: "Platform Core",
          appId: "platform_core",
          modules: modules.map((module) => ({
            ...module,
            submodules: submodules.filter((sub) => sub.module_id === module.id),
          })),
        },
      ]
    : [];

  return {
    accountType,
    ui: session?.context?.ui || sessionData.ui || { dir: "ltr", locale: "en" },
    bundles: catalogData.bundle ? [catalogData.bundle] : [],
    apps: catalogData.apps || [],
    modules,
    submodules,
    workspaces: workspaceData.workspaces || [],
    // Backend-owned nav model (empty array fallback only; no fabricated route data).
    topNav: backendTopNav.length > 0 ? backendTopNav : [],
    launcherSections:
      backendLauncherSections.length > 0 ? backendLauncherSections : derivedLauncherSections,
  };
};
