import React, { useEffect } from "react";
import config from "@/modules/core/print-format.json";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeListTable from "@/components/pages/list/doctype/DoctypeListTable";
import { PrintFormatConfig } from "@/modules/core/print-format";

const PrintFormatList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Print Format");
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);

  return (
    <ConfigProvider
      initialConfig={PrintFormatConfig}
      initialAppData={{ endpoint: "print_format" }}
    >
      {/* <ListTable
        tableConfig={documentListConfig}
        filters={documentFilters}
        endpoint={"document"}
      /> */}
      <DoctypeListTable tableConfig={config} />
    </ConfigProvider>
  );
};

export default PrintFormatList;
