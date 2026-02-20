import React, { useEffect } from "react";
import ListTable from "@/components/pages/list/Table";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { rolegroupListConfig } from "@/modules/core/rolegroup";
const moduleList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Rolegroup");
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);
  return (
    <ListTable
      tableConfig={rolegroupListConfig}
      filters={[]}
      endpoint={"core/rolegroup"}
    />
  );
};

export default moduleList;
