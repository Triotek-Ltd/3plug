import { useNavbar } from "@/contexts/NavbarContext";
import { newAppConfig } from "@/modules/core/apps";
import React, { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import NewDoc from "@/components/pages/new/NewDoc";

const NewApp = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    updatePageInfo,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    const title = "Apps";
    updateDashboardText(title);
    updatePageInfo({ text: title, link: `apps` });
    updatePagesText("Core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, []);
  return <NewDoc config={newAppConfig} />;
};

export default NewApp;
