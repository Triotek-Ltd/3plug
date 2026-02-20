import React, { useEffect } from "react";
import ListTable from "@/components/pages/list/Table";
import { appFilters, appListConfig } from "@/modules/core/apps";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { ConfigProvider } from "@/contexts/ConfigContext";

const AppList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Apps");
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);
  return (
    <ConfigProvider
      initialConfig={appListConfig}
      initialAppData={{ endpoint: "apps" }}
    >
      <ListTable
        tableConfig={appListConfig}
        filters={appFilters}
        endpoint={"apps"}
      />
    </ConfigProvider>
  );
};

export default AppList;
