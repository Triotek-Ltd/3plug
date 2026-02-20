import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { toTitleCase } from "@/utils/textConvert";
import Loading from "@/components/core/account/Loading";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeListTable from "@/components/pages/list/doctype/DoctypeListTable";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";
import NotFoundPage from "@/components/core/common/NotFound";
import { useData } from "@/contexts/DataContext";
import DoctypeForm from "@/components/pages/form";
import SingleDocumentDetail from "@/components/pages/detail/SingleDoc";

const DocumentDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(false);
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
  const { setSidebarHidden } = useSidebar();

  const { setForm, setData } = useData();

  useEffect(() => {
    setData(null); // Reset data before fetching new document details
    setForm(null); // Reset form to avoid stale data
    setAppData(null);
  }, [slug]);

  useEffect(() => {
    if (!slug) {
      setAppData(null);
      setForm(null);
      setData(null);
      return;
    }

    const fetchDocumentData = async () => {
      try {
        // Fetch document details
        const docData = findDocDetails(slug);
        if (!docData) throw new Error("Failed to fetch document details");

        setAppData({ ...docData, endpoint: `${docData.app_id}/${slug}` });
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
        updateTextColor("text-gray-800");
        updateIconColor("text-purple-800");
        setSidebarHidden(false);
      } catch (error) {
        console.error(error.message);
        setError(true);
      }
    };

    fetchDocumentData();
  }, [slug]);

  if (error) {
    return <NotFoundPage />;
  }
  if (!config) {
    return <Loading />;
  }

  const is_single = config?.issingle;
  if (is_single) {
    return <SingleDocumentDetail />;
  }

  return (
    <ConfigProvider initialConfig={config} initialAppData={appData}>
      <DoctypeListTable tableConfig={config} />
    </ConfigProvider>
  );
};

export default DocumentDetail;
