import { useNavbar } from "@/contexts/NavbarContext";
import { newAppConfig } from "@/modules/core/apps";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import NewDoc from "@/components/pages/new/NewDoc";
import { useRouter } from "next/router";
import { fetchData } from "@/utils/Api";

const NewApp = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    updatePageInfo,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = React.useState(null);

  useEffect(() => {
    const title = "Apps";
    updateDashboardText(title);
    updatePageInfo({ text: title, link: `apps` });
    updatePagesText("Core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
    const fetchDocumentData = async () => {
      const responseData = await fetchData({}, `apps/${id}`);
      if (responseData?.data) {
        setData(responseData.data);
      }
    };

    fetchDocumentData();
  }, [id]);
  return <NewDoc config={newAppConfig} initialData={data} />;
};

export default NewApp;
