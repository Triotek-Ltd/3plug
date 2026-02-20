import DocDetail from "@/components/pages/detail/DocDetail";
import { useNavbar } from "@/contexts/NavbarContext";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import DocumentDetail from "@/components/pages/detail/DocumentDetail";
import { rolegroupDetailConfig } from "@/modules/core/rolegroup";

const moduleDetail = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Rolegroup");
    updatePagesText("core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, []);
  return (
    <div>
      <DocumentDetail config={rolegroupDetailConfig} />
    </div>
  );
};

export default moduleDetail;
