import React, { useEffect } from "react";
import ListTable from "@/components/pages/list/Table";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { reminderListConfig } from "@/modules/core/reminder";

const moduleList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Reminder");
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);
  return (
    <ListTable
      tableConfig={reminderListConfig}
      filters={{
        id: {
          type: "text",
        },
        name: {
          type: "text",
        },
        frequency: {
          type: "text",
        },
      }}
      endpoint={"core/reminder"}
    />
  );
};

export default moduleList;
