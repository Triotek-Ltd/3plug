import React, { useEffect, useState } from "react";
import ListTable from "@/components/pages/list/Table";
import { useNavbar } from "@/contexts/NavbarContext";
import { useSidebar } from "@/contexts/SidebarContext";
import { useRouter } from "next/router";
import { toTitleCase } from "@/utils/textConvert";
import { userListConfig } from "@/modules/core/users";

const transformFields = (fields) => {
  const filters = {
    id: {
      type: "text",
      default: "",
    },
  };
  const listFields = [];

  fields?.forEach((field) => {
    if (field.filter) {
      if (field.type === "SelectField") {
        filters[field.id] = {
          type: "select",
          default: field.default || "",
          options:
            field.options?.map((option) => ({
              value: option,
              label: option,
            })) || [], // Ensure options are in the correct format
        };
      } else {
        filters[field.id] = {
          type: "text",
          default: field.default || "",
        };
      }
    }

    if (field.list) {
      listFields.push({
        id: field.id,
        name: field.name,
        type: field.type,
        default: field.default || "",
      });
    }
  });

  return { filters, listFields };
};

const documentList = () => {
  const {
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    updateIconColor,
  } = useNavbar();
  const { setSidebarHidden } = useSidebar();
  const router = useRouter();
  const [name, setName] = useState("");

  const { filters: documentFilters, listFields } = transformFields(
    userListConfig?.fields
  );

  useEffect(() => {
    const pathParts = router.pathname.split("/").filter(Boolean);
    let newName = "";
    if (pathParts.length >= 2) {
      newName = toTitleCase(pathParts[1]);
      updateDashboardText(newName);
      updatePagesText(toTitleCase(pathParts[0]));
    } else if (pathParts.length === 1) {
      newName = toTitleCase(pathParts[0]);
      updateDashboardText(newName);
    }
    updateTextColor("text-gray-900");
    updateIconColor("text-purple-900");
    setSidebarHidden(false);
    setName(newName);
  }, [
    router.pathname,
    updateDashboardText,
    updatePagesText,
    updateTextColor,
    setSidebarHidden,
  ]);

  const endpoint = router.pathname.substring(1);

  const documentListConfig = {
    title: "documents",
    customize: true,
    isList: true,
    fields: listFields,
    data: [],
    name, // Add the name here
  };

  return (
    <ListTable
      tableConfig={documentListConfig}
      filters={documentFilters}
      endpoint={endpoint}
    />
  );
};

export default documentList;
