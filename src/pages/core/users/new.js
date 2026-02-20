import NewDoc from "@/components/pages/new/NewDoc";
import { useNavbar } from "@/contexts/NavbarContext";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
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
    updateDashboardText("Users");
    updatePagesText("Core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, []);
  return <NewDoc config={newUserConfig} />;
};

export default NewUser;
