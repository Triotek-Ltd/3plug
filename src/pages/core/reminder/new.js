import NewDoc from "@/components/pages/new/NewDoc";
import { useNavbar } from "@/contexts/NavbarContext";
import { newReminderConfig } from "@/modules/core/reminder";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import NewDocument from "@/components/pages/new/NewDocument";

const Newmodule = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("reminder");
    updatePagesText("Core");
    updateTextColor("text-gray-200");
    setSidebarHidden(false);
  }, []);
  return <NewDocument config={newReminderConfig} />;
};

export default Newmodule;
