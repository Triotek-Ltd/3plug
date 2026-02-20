import { useNavbar } from "@/contexts/NavbarContext";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import NewDocument from "@/components/pages/new/NewDocument";
import { newRolegroupConfig } from "@/modules/core/rolegroup";

const Newmodule = () => {
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
    updateTextColor("text-gray-200");
    setSidebarHidden(false);
  }, []);
  return <NewDocument config={newRolegroupConfig} />;
};

export default Newmodule;
