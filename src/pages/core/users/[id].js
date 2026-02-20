import DocDetail from "@/components/pages/detail/DocDetail";
import { useNavbar } from "@/contexts/NavbarContext";
import { useEffect } from "react";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  userDetailConfig,
  userDocFields,
  userDocumentDetailConfig,
} from "@/modules/core/users";
import DocumentDetail from "@/components/pages/detail/DocumentDetail";

const AppDetail = () => {
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
  return (
    <div>
      <DocumentDetail config={userDocumentDetailConfig} />
    </div>
  );
};

export default AppDetail;
