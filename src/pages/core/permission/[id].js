import { useNavbar } from "@/contexts/NavbarContext";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import DocumentDetail from "@/components/pages/detail/DocumentDetail";
import { permissionDetailConfig } from "@/modules/core/permissions";

const moduleDetail = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Permission");
    updatePagesText("core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, []);
  return (
    <div>
      <DocumentDetail config={permissionDetailConfig} />
    </div>
  );
};

export default moduleDetail;
