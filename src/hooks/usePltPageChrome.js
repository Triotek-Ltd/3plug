import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useEffect } from "react";

export default function usePltPageChrome({
  pageLabel = "Platform",
  dashboardLabel = "Workspace",
}) {
  const { updateDashboardText, updatePagesText, updateTextColor } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updatePagesText(pageLabel);
    updateDashboardText(dashboardLabel);
    updateTextColor("text-gray-900");
    setSidebarHidden(false);
  }, [
    dashboardLabel,
    pageLabel,
    setSidebarHidden,
    updateDashboardText,
    updatePagesText,
    updateTextColor,
  ]);
}

