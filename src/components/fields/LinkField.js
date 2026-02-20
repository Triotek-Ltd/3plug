import React, { useState, useRef, useCallback } from "react";
import { fetchData } from "@/utils/Api";
import { toast } from "react-toastify";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import { useConfig } from "@/contexts/ConfigContext";
import { motion, AnimatePresence } from "framer-motion";
import QuickEntryModal from "../pages/list/quickentry";
import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";

const LinkField = ({
  value = "",
  onChange,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isQuickEntryModalOpen, setIsQuickEntryModalOpen] = useState(false);
  const { selectedItem, setSelectedItem } = useConfig();
  const inputRef = useRef(null);
  // Fetch endpoint and appData when field is passed
  const initializeField = useCallback(async () => {
    if (!field) return;

    try {
      const slug = toUnderscoreLowercase(field.options);

      const docData = findDocDetails(slug);

      if (!docData) {
        setEndpoint(`${slug}`);

        setAppData({
          search_fields: field?.search_fields || "id",
          title_field: field?.title_field || "id",
        });

        if (value) {
          const response = await fetchData({}, `${slug}/${value}`);

          setSearchTerm(response?.data.id);
        }
      } else {
        setEndpoint(`${docData.app}/${slug}`);

        const configData = await importFile(slug, `${slug}.json`);

        setAppData(configData.content);

        // If value is provided, set the initial search term
        if (value) {
          const titleField =
            configData.content?.title_field || configData.content?.id_field;
          if (typeof value === "string" || typeof value === "number") {
            const response = await fetchData(
              {},
              `${docData.app}/${slug}/${value}`
            );
            const newValue = response?.data;

            setSearchTerm(newValue[titleField] || newValue.id);
          } else {
            setSearchTerm(value[titleField] || value.id || value);
          }
        }
      }
    } catch (error) {
      // toast.error(error.message || "Error initializing field");
    }
  }, [field, value]);

  // Fetch options based on search term
  const fetchOptions = useCallback(
    async (search = "") => {
      if (!endpoint || readOnly || preview || hidden) return;

      try {
        const response = await fetchData({ page_length: 10, search }, endpoint);

        const fetchedOptions =
          response?.data?.data?.map((option) => {
            // Check if title_field is present, and add 'id' to the start of search_fields automatically
            let searchFields = [];

            if (appData.search_fields) {
              if (Array.isArray(appData.search_fields)) {
                // If it's already a list, just use it directly
                searchFields = appData.search_fields.map((key) => key.trim());
              } else if (typeof appData.search_fields === "string") {
                // If it's a string, check for commas and split
                searchFields = appData.search_fields.includes(",")
                  ? appData.search_fields.split(",").map((key) => key.trim()) // Split by comma and trim
                  : [appData.search_fields.trim()]; // Treat it as a single element list
              }
            }

            if (appData.title_field && !searchFields.includes("id")) {
              searchFields.unshift("id"); // Add 'id' to the start of search_fields if title_field is present
            }

            // Create subFields from the processed search fields
            const subFields = searchFields
              .map((key) => option[key])
              .filter(Boolean)
              .join(", ");

            return {
              value: option.id,
              label: option[appData.title_field] || option.id,
              subFields: subFields,
            };
          }) || [];

        setOptions([
          ...fetchedOptions,
          {
            value: "add-new",
            label: "+ Add new",
            subFields: "",
            isAddNew: true,
          },
        ]);
      } catch (error) {
        setOptions([
          {
            value: "add-new",
            label: "+ Add new",
            subFields: "",
            isAddNew: true,
          },
        ]);
      }
    },
    [endpoint, appData, readOnly, preview, hidden]
  );

  // Handle input change
  const handleInputChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    fetchOptions(term);
    setIsDropdownOpen(true);
  };

  // Handle selection change
  const handleSelectionChange = (option) => {
    if (option?.isAddNew) {
      setIsQuickEntryModalOpen(true);
    } else {
      setSearchTerm(option.label);
      onChange(option.value); // Send the selected value to the parent
      setSelectedItem(null);
      setIsDropdownOpen(false);
    }
  };

  // Handle quick entry modal close
  const handleClose = async (response) => {
    setIsQuickEntryModalOpen(false);
    if (response?.id) {
      const newLabel = response[appData.title_field] || response.id;
      setSearchTerm(newLabel);
      onChange(response);
      await fetchOptions(); // Refetch options to include the new entry
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSearchTerm("");
    onChange(null); // Clear the parent value
    setSelectedItem(null);
    fetchOptions("");
  };

  // Open link in a new tab
  const openLink = () => {
    if (endpoint && searchTerm) {
      window.open(
        `/app/${toUnderscoreLowercase(field.options)}/${value?.id || value}`,
        "_blank"
      );
    }
  };

  // Initialize field and appData on mount or field change
  React.useEffect(() => {
    initializeField();
  }, [initializeField]);

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
      <div className="relative w-full flex flex-row items-center justify-between">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="px-1 w-full focus:outline-none focus:ring-0 focus:border-none"
          disabled={readOnly || preview}
          onFocus={() => {
            setIsDropdownOpen(true);
            fetchOptions(searchTerm);
          }}
          onBlur={(e) => {
            if (!e.relatedTarget?.closest(".dropdown-item")) {
              setIsDropdownOpen(false);
            }
          }}
        />
        {value && isDropdownOpen && (
          <>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur event
                clearSelection();
              }}
              className="text-gray-800 font-bold hover:text-gray-700 text-xs ml-1 mr-2"
              title="Clear selection"
            >
              ✕
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent blur event
                openLink();
              }}
              className="text-purple-800 hover:text-gray-700 hover:bg-pink-50 font-bold mr-1"
              title="Open link"
            >
              →
            </button>
          </>
        )}
      </div>
      <AnimatePresence>
        {isDropdownOpen && options.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-1 bg-white text-left border border-gray-300 rounded-sm shadow-lg z-10 max-h-80 overflow-y-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                className={`dropdown-item cursor-pointer py-1 px-2 text-sm hover:bg-gray-100 ${
                  searchTerm === option.label ? "bg-gray-200" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevent blur event
                  handleSelectionChange(option);
                }}
              >
                <div className="space-y-1">
                  <div
                    className={`font-semibold text-sm ${
                      option.isAddNew ? "text-blue-600" : "text-black"
                    }`}
                  >
                    {option.label}
                  </div>
                  {option.subFields && !option.isAddNew && (
                    <div className="text-xs text-gray-500">
                      {option.subFields}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LinkField;
