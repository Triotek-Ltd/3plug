import React, { useState, useEffect } from "react";
import TableField from "./TableField";
import { fetchData } from "@/utils/Api";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";
import { useRouter } from "next/router";
import PrimaryButton from "../core/common/buttons/Primary";
import { saveToDB } from "@/utils/indexedDB";
import { useData } from "@/contexts/DataContext";

const ConnectionField = ({ value = [], field, hidden, readOnly = false }) => {
  const [endpoint, setEndpoint] = useState(null);
  const [appData, setAppData] = useState(null);
  const [slug_link, setSlug] = useState(null);
  const [options, setOptions] = useState([]);
  const { setForm } = useData();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const initializeAndFetch = async () => {
      if (!field || hidden) return;

      try {
        const slug = toUnderscoreLowercase(field.options);
        setSlug(slug);
        const docData = findDocDetails(slug);

        let newEndpoint = slug;
        let newAppData = {
          search_fields: field?.search_fields || "id",
          title_field: field?.title_field || "id",
          link_field: field?.linked_field || "id",
        };

        if (docData) {
          newEndpoint = `${docData.app}/${slug}`;
        }

        setEndpoint(newEndpoint);
        setAppData(newAppData);

        const link_field = field?.linked_field || "id";
        const response = await fetchData(
          { page_length: 10, search: "", [link_field]: id },
          newEndpoint
        );

        setOptions(response?.data?.data || []);
      } catch (error) {
        console.error("Error initializing or fetching options", error);
        setOptions([]);
      }
    };

    initializeAndFetch();
  }, [field, hidden, id]);

  if (hidden) return null;

  const handleAddNew = () => {
    setForm({ [appData?.link_field]: id });
    router.push(`/app/${slug_link}/new`);
  };

  const handleViewAll = () => {
    const activeFilters = {
      [appData?.link_field]: { value: id, matchType: "equals" },
    };
    saveToDB(`/app/${slug_link}`, activeFilters).catch((error) =>
      console.error(`Failed to save filters: ${error.message}`)
    );
    router.push(`/app/${slug_link}`);
  };
  return (
    <div className="flex flex-col space-y-4 py-2 w-full">
      <TableField field={field} value={options} readOnly={true} />
      {!readOnly && (
        <div className="flex flex-row space-x-4 pb-2 w-full">
          <PrimaryButton onClick={handleViewAll} text={"View All"} />
          <PrimaryButton onClick={handleAddNew} text={"Add New"} />
        </div>
      )}
    </div>
  );
};

export default ConnectionField;
