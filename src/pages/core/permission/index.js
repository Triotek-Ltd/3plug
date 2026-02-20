import React, { useEffect } from "react";
import ListTable from "@/components/pages/list/Table";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { permissionListConfig } from "@/modules/core/permissions";
const moduleList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Permission");
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);
  return (
    <ListTable
      tableConfig={permissionListConfig}
      filters={[]}
      endpoint={"core/permission"}
    />
  );
};

export default moduleList;
