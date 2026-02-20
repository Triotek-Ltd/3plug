import React, { useEffect } from "react";
import ListTable from "@/components/pages/list/Table";
import { documentFilters, documentListConfig } from "@/modules/core/documents";
import config from "@/modules/core/doctype";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { ConfigProvider } from "@/contexts/ConfigContext";
import DoctypeListTable from "@/components/pages/list/doctype/DoctypeListTable";

const DocumentList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    updatePageInfo,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    const title = "Documents";
    updateDashboardText(title);
    updatePageInfo({ text: title, link: `documents` });
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);

  return (
    <ConfigProvider
      initialConfig={documentListConfig}
      initialAppData={{ endpoint: "document" }}
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

export default DocumentList;
