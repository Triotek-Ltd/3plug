import { fetchData, postData } from "@/utils/Api";

const PLATFORM_CORE_PREFIX = "platform_core";

export const fetchPltSessionBootstrap = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/session/bootstrap`);
};

export const fetchPltLauncherCatalog = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/launcher/catalog`);
};

export const fetchPltApps = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/apps`);
};

export const fetchPltModules = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/modules`);
};

export const fetchPltSubmodules = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/submodules`);
};

export const fetchPltWorkspaces = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/workspaces`);
};

export const fetchPltSandboxCatalog = async (params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/platform/sandbox/catalog`);
};

export const fetchDocMeta = async (docKey, params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/docs/meta/${docKey}`);
};

export const fetchDocList = async (docKey, params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/docs/${docKey}`);
};

export const fetchDocDetail = async (docKey, docId, params = {}) => {
  return fetchData(params, `${PLATFORM_CORE_PREFIX}/docs/${docKey}/${docId}`);
};

export const postDocAction = async (docKey, docId, actionId, payload = {}) => {
  return postData(payload, `${PLATFORM_CORE_PREFIX}/docs/${docKey}/${docId}/actions/${actionId}`);
};
