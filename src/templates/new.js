import { useNavbar } from "@/contexts/NavbarContext";
import React, { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import NewDocument from "@/components/pages/new/NewDocument.js";
import { useRouter } from "next/router.js";
import { toTitleCase } from "@/utils/textConvert.js";

const Newdocument = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const router = useRouter();
  const [dashboardText, setDashboardText] = useState("");

  useEffect(() => {
    const pathParts = router.pathname.split("/").filter(Boolean);
    if (pathParts.length >= 2) {
      const newDashboardText = toTitleCase(pathParts[1]);
      updateDashboardText(newDashboardText);
      setDashboardText(newDashboardText);
      updatePagesText(toTitleCase(pathParts[0]));
    } else if (pathParts.length === 1) {
      const newDashboardText = toTitleCase(pathParts[0]);
      updateDashboardText(newDashboardText);
      setDashboardText(newDashboardText);
    }
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, [
    router.pathname,
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
    setSidebarHidden,
  ]);

  const endpoint = router.pathname
    .replace(/\/new$/, "")
    .replace(/\/$/, "")
    .substring(1);

  const newdocumentConfig = {
    endpoint: endpoint,
    name: dashboardText || "document", // Use dashboardText or fallback to "document"
    customize: true,
    isList: true,
    fields: fields,
    settings: settings,
    data: [],
  };

  return <NewDocument config={newdocumentConfig} />;
};

export default Newdocument;
