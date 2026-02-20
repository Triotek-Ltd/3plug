import DocDetail from "@/components/pages/detail/DocDetail";
import { useNavbar } from "@/contexts/NavbarContext";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import { reminderDetailConfig } from "@/modules/core/reminder";
import DocumentDetail from "@/components/pages/detail/DocumentDetail";

const moduleDetail = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();

  useEffect(() => {
    updateDashboardText("Reminder");
    updatePagesText("core");
    updateTextColor("text-white");
    updateIconColor("text-blue-200");
    setSidebarHidden(false);
  }, []);
  return (
    <div>
      <DocumentDetail config={reminderDetailConfig} />
    </div>
  );
};

export default moduleDetail;
