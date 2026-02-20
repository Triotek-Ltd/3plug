import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { toTitleCase } from "@/utils/textConvert";
import Loading from "@/components/core/account/Loading";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeForm from "@/components/pages/form";
import { postData } from "@/utils/Api";
import { useData } from "@/contexts/DataContext";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";

const DocumentDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [config, setConfig] = useState(null);
  const [appData, setAppData] = useState(null);
  const [filePath, setFilePath] = useState(null);

  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    updatePageInfo,
    updateNavLinks,
  } = useNavbar();
  const { setSidebarHidden, setSidebarWidth } = useSidebar();
  const { loading, setLoading, setData, setForm } = useData();

  useEffect(() => {
    if (!slug) {
      setData(null); // Reset data before fetching new document details
      setForm(null);
      return;
    }

    const fetchDocumentData = async () => {
      try {
        // Fetch document details
        const docData = findDocDetails(slug);
        if (!docData) {
          throw new Error("Failed to fetch document details");
        }

        setAppData(docData);
        setFilePath(docData.docPath);

        // Update UI elements
        const title = toTitleCase(slug);
        updateDashboardText(title);
        updatePagesText(toTitleCase(docData.module));
        updatePageInfo({ text: title, link: `app/${slug}` });
        updateNavLinks([
          { text: toTitleCase(docData.app), link: `/apps/${docData.app_id}` },
          {
            text: toTitleCase(docData.module),
            link: `/modules/${docData.module_id}`,
          },
        ]);

        // Fetch configuration data
        const configData = await importFile(slug, `${slug}.json`);
        if (!configData) throw new Error("Failed to load configuration");

        setConfig(configData.content);

        // Sidebar and UI customization
        updateTextColor("text-gray-200");
        updateIconColor("text-purple-300");
        setSidebarHidden(false);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDocumentData();
  }, [slug]);

  const saveData = async (form) => {
    try {
      setLoading(true);

      const response = await postData(form, `${appData?.app}/${slug}`, true);

      if (response.data) {
        const docid = response.data.id;
        router.push(`/app/${slug}/${docid}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return <Loading />;
  }

  if (config?.issingle && typeof window !== "undefined") {
    const path = window.location.pathname
      .split("/")
      .filter(Boolean)
      .slice(0, -1)
      .join("/");
    window.location.replace(`${window.location.origin}/${path}`);
  }

  return (
    <ConfigProvider initialConfig={config} initialAppData={appData}>
      <DoctypeForm handleSave={saveData} config={config} />
    </ConfigProvider>
  );
};

export default DocumentDetail;
