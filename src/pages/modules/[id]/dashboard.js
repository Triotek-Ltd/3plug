import DocDetail from "@/components/pages/detail/DocDetail";
import { useNavbar } from "@/contexts/NavbarContext";
import { moduleDetailConfig } from "@/modules/core/modules";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import ModuleDashboard from "@/components/workspace/ModuleDashboard";

const moduleDetail = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Apps");
    updatePagesText("Core");
    updateTextColor("text-gray-900");
    updateIconColor("text-urple-800");
    setSidebarHidden(false);
  }, []);
  return (
    <div>
      <ModuleDashboard />
    </div>
  );
};

export default moduleDetail;
