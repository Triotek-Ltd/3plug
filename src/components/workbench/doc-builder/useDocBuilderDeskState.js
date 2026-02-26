import useDocBuilderCatalogState from "@/components/workbench/doc-builder/useDocBuilderCatalogState";
import useDocBuilderNativeFilesState from "@/components/workbench/doc-builder/useDocBuilderNativeFilesState";

export default function useDocBuilderDeskState() {
  const catalog = useDocBuilderCatalogState();
  const {
    bundleFilter,
    appFilter,
    moduleFilter,
    submoduleFilter,
    selectedDocKey,
    selectedDocRow,
    selectedDocMeta,
  } = catalog;

  const selectedBundleValue = bundleFilter !== "all" ? bundleFilter : "plt";
  const selectedAppValue = appFilter !== "all" ? appFilter : "platform_core";
  const selectedModuleValue = selectedDocRow?.module || selectedDocRow?.module_key || (moduleFilter !== "all" ? moduleFilter : "");
  const selectedSubmoduleValue =
    selectedDocRow?.submodule || selectedDocRow?.submodule_key || (submoduleFilter !== "all" ? submoduleFilter : "");

  const nativeFiles = useDocBuilderNativeFilesState({
    selectedDocKey,
    selectedBundleValue,
    selectedAppValue,
    selectedModuleValue,
    selectedSubmoduleValue,
    selectedDocMeta,
    selectedDocRow,
  });

  return {
    ...catalog,
    ...nativeFiles,
  };
}
