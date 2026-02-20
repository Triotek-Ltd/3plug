import { useEffect, useState } from "react";
import { fetchData } from "@/utils/Api";
import { toTitleCase } from "@/utils/textConvert";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useData } from "@/contexts/DataContext";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";

export const useDocumentData = (slug, id, setConfig) => {
  const [appData, setAppData] = useState(null);
  const { setData, setForm } = useData();
  const {
    updateDashboardText,
    updatePagesText,
    updatePageInfo,
    updateNavLinks,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    if (!slug) return;

    const fetchDocumentData = async () => {
      try {
        const docData = findDocDetails(slug);
        if (!docData) throw new Error("Failed to fetch document details");

        setAppData({
          ...docData,
          endpoint: `${docData?.app_id}/${slug}/${id}`,
        });

        // UI updates
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
        updateTextColor("text-gray-200");
        updateIconColor("text-purple-300");
        setSidebarHidden(false);

        // Fetch document data
        const responseData = await fetchData(
          {},
          `${docData.app}/${slug}/${id}`
        );
        if (responseData?.data) {
          setData(responseData.data);
          setForm(responseData.data);
        }

        // Fetch configuration
        const configData = await importFile(slug, `${slug}.json`);
        setConfig(configData.content);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchDocumentData();
  }, [slug, id]);

  return { appData, setAppData };
};
