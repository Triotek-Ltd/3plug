import Select from "react-select";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { fetchData } from "@/utils/Api";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import { useConfig } from "@/contexts/ConfigContext";
import QuickEntryModal from "../pages/list/quickentry";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";
import { useData } from "@/contexts/DataContext";

const LinkSelectField = ({
  value = "",
  onChange,
  onValueChange,
  placeholder = "",
  isMulti = false,
  readOnly = false,
  preview = false,
  hidden = false,
  field,
}) => {
  const [endpoint, setEndpoint] = useState(null);
  const [appData, setAppData] = useState(null);
  const [options, setOptions] = useState([]);
  const [display, setDisplay] = useState(value);
  const [filterValue, setFilterValue] = useState(value);
  const [isQuickEntryModalOpen, setIsQuickEntryModalOpen] = useState(false);
  const { setSelectedItem } = useConfig();
  const { form } = useData();
  const inputRef = useRef(null);

  const initializeField = useCallback(async () => {
    if (!field) return;

    try {
      const slug = toUnderscoreLowercase(field.options);
      const docData = findDocDetails(slug);

      if (!docData) {
        setEndpoint(slug);
        setAppData({
          search_fields: field?.search_fields || "id",
          title_field: field?.title_field || "id",
        });
      } else {
        setEndpoint(`${docData.app}/${slug}`);

        const configData = await importFile(slug, `${slug}.json`);

        setAppData(configData.content);
      }
    } catch (error) {
      console.error("Error initializing field", error);
    }
  }, [field]);

  const fetchOptions = useCallback(
    async (search = "") => {
      if (!endpoint || readOnly || preview || hidden) return;

      let filters = {};
      if (field.filter_format) {
        filters = field.filter_format.split("&&").reduce((acc, condition) => {
          let [key, value] = condition.split("==").map((s) => s.trim());
          // Remove quotes and replace placeholders with form values
          value = value.replace(/^"|"$/g, ""); // Remove surrounding quotes if present
          value = value.replace(/\{(.+?)\}/g, (_, match) => {
            const formValue = form[match];
            return formValue !== undefined
              ? typeof formValue === "object" && formValue.id
                ? formValue.id
                : formValue
              : `{${match}}`; // Keep placeholder if form value doesn't exist
          });
          acc[key] = value;
          return acc;
        }, {});
      }

      try {
        // Pass filters individually
        const queryParams = {
          page_length: 10,
          search,
          ...filters,
          search: filterValue,
        };

        const response = await fetchData(queryParams, endpoint);

        const fetchedOptions =
          response?.data?.data?.map((option) => ({
            value: option.id,
            label: option[appData?.title_field]
              ? `${option[appData?.title_field]} - ${option?.id}`
              : option.id,
            fullData: option,
          })) || [];

        setOptions([
          ...fetchedOptions,
          { value: "add-new", label: "+ Add new", isAddNew: true },
        ]);
      } catch (error) {
        console.error("Error fetching options", error);
        setOptions([{ value: "add-new", label: "+ Add new", isAddNew: true }]);
      }
    },
    [endpoint, appData, readOnly, preview, hidden, field, form, filterValue]
  );

  useEffect(() => {
    initializeField();
  }, [initializeField]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions, filterValue]);

  const handleSelectionChange = (selectedOptions) => {
    if (selectedOptions?.some((option) => option.isAddNew)) {
      setIsQuickEntryModalOpen(true);
    } else {
      onChange(selectedOptions.map((option) => option.fullData));
      onValueChange(selectedOptions);
      setSelectedItem(null);
    }
  };

  const handleClose = async (response) => {
    setIsQuickEntryModalOpen(false);
    if (response) {
      await fetchOptions();
    }
  };

  useEffect(() => {
    if (Array.isArray(value) && !!appData?.title_field) {
      const updatedDisplay = value.map((val) => ({
        ...val,
        label: val.fullData[appData?.title_field] || val.fullData.id,
      }));
      setDisplay(updatedDisplay);
    }
  }, [value, appData]);

  if (hidden || preview) return null;

  return (
    <div className="relative w-full">
      {isQuickEntryModalOpen && (
        <QuickEntryModal
          isOpen={isQuickEntryModalOpen}
          onClose={handleClose}
          doc={appData?.name}
          configData={appData}
          redirect={false}
        />
      )}
      <Select
        isMulti
        options={options}
        value={display}
        onChange={handleSelectionChange}
        placeholder={`Select ${field?.label || ""}`}
        classNamePrefix="custom-select"
        onInputChange={(input) => setFilterValue(input)}
      />
    </div>
  );
};

export default LinkSelectField;
