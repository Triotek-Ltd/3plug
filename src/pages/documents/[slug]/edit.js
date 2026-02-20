import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { toTitleCase } from "@/utils/textConvert";
import Loading from "@/components/core/account/Loading";
import DoctypeStudio from "@/components/studio/doctype/DocStudio";
import { ConfigProvider } from "@/contexts/ConfigContext";
import ToastTemplates from "@/components/core/common/toast/ToastTemplates";
import { postData } from "@/utils/Api";
import { useData } from "@/contexts/DataContext";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";

const DocumentDetail = () => {
  const { slug } = useRouter().query;
  const [config, setConfig] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const { setLoading } = useData();

  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    updatePageInfo,
    updateNavLinks,
  } = useNavbar();
  const { setSidebarHidden, setSidebarWidth } = useSidebar();

  useEffect(() => {
    if (!slug) return;

    const fetchDocumentData = async () => {
      try {
        // Fetch document details

        const docData = findDocDetails(slug);
        if (!docData) throw new Error("Failed to fetch document details");

        setFilePath(docData.docPath);

        // Update UI elements
        const title = toTitleCase(slug);
        updateDashboardText(title);
        updatePagesText(toTitleCase(docData.module));
        updatePageInfo({ text: title, link: `documents/${slug}` });
        updateNavLinks([
          { text: toTitleCase(docData.app), link: `/apps/${docData.app}` },
          {
            text: "Documents",
            link: `/documents`,
          },
        ]);

        // Fetch configuration data
        const configData = await importFile(slug, `${slug}.json`);
        if (!configData) throw new Error("Failed to load configuration");

        setConfig(configData.content);

        // Sidebar and UI customization
        updateTextColor("text-gray-200");
        updateIconColor("text-purple-300");
        setSidebarWidth(100);
        setSidebarHidden(true);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDocumentData();
  }, [slug]);

  const saveConfig = async (settings) => {
    try {
      if (!filePath || !slug) throw new Error("File path or slug not set");
      setLoading(true);
      const response = await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directoryPath: filePath,
          filename: `${slug}.json`,
          content: settings,
        }),
      });

      if (response.ok) {
        setConfig(settings);
        const response1 = await postData({ doc: slug }, `migrate`);
        if (!response1) {
          throw new Error("Failed to migrate");
        } else {
          ToastTemplates.success("Saved!");
        }
      } else throw new Error("Failed to save configuration");
    } catch (error) {
      console.error("Error saving configuration:", error);
      ToastTemplates.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <Loading />;
  }

  return (
    <ConfigProvider
      initialConfig={config}
      initialAppData={{ endpoint: `documents/${slug}` }}
    >
      <DoctypeStudio handleSave={saveConfig} config={config} />
    </ConfigProvider>
  );
};

export default DocumentDetail;
