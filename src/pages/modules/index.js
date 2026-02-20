import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { toTitleCase } from "@/utils/textConvert";
import Loading from "@/components/core/account/Loading";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeListTable from "@/components/pages/list/doctype/DoctypeListTable";
import config from "@/modules/core/module.json";
import ListTable from "@/components/pages/list/Table";

const ModuleList = () => {
  const router = useRouter();
  const [appData, setAppData] = useState({
    endpoint: "modules",
  });

  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    updatePageInfo,
    updateNavLinks,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  updateDashboardText("Modules");
  updatePagesText("Core");
  updateTextColor("text-gray-900");
  updateIconColor("text-purple-900");
  setSidebarHidden(false);

  if (!config) {
    return <Loading />;
  }

  return (
    <ConfigProvider initialConfig={config} initialAppData={appData}>
      <ListTable tableConfig={config} endpoint={"modules"} />
    </ConfigProvider>
  );
};

export default ModuleList;
