import { useNavbar } from "@/contexts/NavbarContext";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import NewDocument from "@/components/pages/new/NewDocument";
import { newUserConfig } from "@/modules/core/users";

const NewUser = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("User");
    updatePagesText("Core");
    updateTextColor("text-gray-200");
    setSidebarHidden(false);
  }, []);
  return <NewDocument config={newUserConfig} />;
};

export default NewUser;
