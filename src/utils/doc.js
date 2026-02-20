import configData from "@/data/config.json";
export const getAppModuleDoc = (slug) => {
  for (const appName in configData) {
    const modules = configData[appName].modules;
    for (const module of modules) {
      const { moduleName, docList } = module;
      if (docList.includes(slug)) {
        return { app: appName, module: moduleName, doc: slug };
      }
    }
  }
  return { app: "", module: "", doc: "" }; // Return empty if not found
};
