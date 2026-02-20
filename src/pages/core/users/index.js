import React, { useEffect } from "react";
import ListTable from "@/components/pages/list/Table";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { userFilters, userListConfig } from "@/modules/core/users";

const UserList = () => {
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
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
  }, []);
  return (
    <ListTable
      tableConfig={userListConfig}
      filters={userFilters}
      endpoint={"users"}
    />
  );
};

export default UserList;
