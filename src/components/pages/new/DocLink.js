import React, { useState, useEffect } from "react";
import Select from "react-select";
import { fetchData } from "@/utils/Api";
import { toast } from "react-toastify";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import { useData } from "@/contexts/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";

const DocLink = ({
  name,
  handleChange,
  placeholder,
  initialData,
  doc,
  exclude = [],
  isMulti = false,
  onLinkResponse,
  field,
  isNew,
}) => {
  const { data, form } = useData();
  const [selected, setSelected] = useState(initialData);
  const [localData, setLocalData] = useState({});
  const [holder, setHolder] = useState(placeholder);
  const [linkDetail, setLinkDetail] = useState(placeholder);
  const [options, setOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const endpoint = `documents/${toUnderscoreLowercase(doc.split(".").pop())}`;
  useEffect(() => {
    if (form) {
      setLocalData(form);
    } else {
      setLocalData(data);
    }
  }, [form, data]);

  useEffect(() => {
    if (localData[field?.id] && !isMulti) {
      const value =
        typeof localData[field?.id] === "object" &&
        localData[field?.id] !== null
          ? localData[field?.id].value
          : localData[field?.id];

      setHolder(value);
    } else if (placeholder) {
      const placeholderValue =
        typeof placeholder === "object" && placeholder !== null
          ? placeholder.value
          : placeholder;

      setHolder(placeholderValue);
    }

    if (initialData) {
      const initialOptions = initialData.map((item) => ({
        value: item,
        label: item.name || item.id,
      }));
      setSelected(initialOptions);
    }

    const fetchOptions = async () => {
      setLoading(true);
      let param = { page_length: 200 };
      try {
        if (field.filter_on) {
          const conditions = field.filter_on.split(",");
          conditions.forEach((condition) => {
            const [rawKey, rawValue] = condition
              .split("==")
              .map((part) => part.trim());

            let value;
            if (rawValue.startsWith("{") && rawValue.endsWith("}")) {
              const dataKey = rawValue.slice(1, -1).trim();

              value = localData[dataKey]?.id || localData[dataKey]?.value;
            } else {
              value = rawValue.replace(/['"]/g, "").trim();
            }

            param[rawKey] = value;
          });
        }

        const linkresponse = await fetchData({}, endpoint);

        if (linkresponse.data) {
          setLinkDetail(linkresponse.data);
          const response = await fetchData(
            param,
            `${linkresponse?.data?.app}/${linkresponse?.data?.id}`
          );
          if (response?.data?.list) {
            const labelList = field?.label?.split(",");
            const fetchedOptions = response?.data?.list?.map((option) => {
              const label = labelList
                ?.map((labelKey) => option[labelKey])
                ?.join(" ");
              return {
                value: option,
                label: label
                  ? label
                  : option.name
                  ? `${option.name} ${option.id}`
                  : option.first_name && option.last_name
                  ? `${option.first_name} ${option.last_name}`
                  : option.username
                  ? option.username
                  : option.id,
              };
            });

            const filteredOptions = exclude.length
              ? fetchedOptions?.filter(
                  (option) =>
                    !exclude.some((excluded) => excluded.id === option.value.id)
                )
              : fetchedOptions;
            setOptions(filteredOptions);
            setAllOptions(fetchedOptions);
          }
        }
        if (onLinkResponse) {
          onLinkResponse(linkresponse);
        }
      } catch (error) {
        setError(error.message || error);
        toast.error(`Failed to fetch data: ${error.message || error}`);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchOptions();
    }, 2000);

    return () => clearTimeout(timer);
  }, [exclude, localData]);

  const handleSelectionChange = (selectedOption) => {
    const validSelections = Array.isArray(selectedOption)
      ? selectedOption.filter((selected) =>
          allOptions.some((option) => option.value.id === selected.value.id)
        )
      : allOptions.some(
          (option) => option.value.id === selectedOption?.value?.id
        )
      ? selectedOption
      : null;

    setSelected(validSelections);
    handleChange(validSelections);
  };

  const handleAddNew = () => {
    const currentPath = router.asPath;

    const pathSegments = currentPath.split("/");

    const lastSegment = pathSegments.pop();
    const secondLastSegment = pathSegments.pop();

    const newDocRoute = `/${linkDetail.app}/${linkDetail.id}/new`;

    const queryString = new URLSearchParams({
      [`${secondLastSegment}`]: lastSegment,
    }).toString();

    const newUrl = `${newDocRoute}?${queryString}`;

    window.open(newUrl, "_blank");
  };

  return (
    <div className="flex w-full items-center space-x-3">
      <div className="w-full items-center">
        {!field.readonly && (
          <Select
            value={selected}
            onChange={handleSelectionChange}
            options={options}
            isSearchable
            placeholder={holder?.value || holder}
            isMulti={isMulti}
            className="text-xs text-gray-800 dark:text-gray-200"
          />
        )}
      </div>

      <button
        type="button"
        onClick={handleAddNew}
        className="py-1.5 px-3 rounded bg-purple-500 hover:bg-purple-700 text-white"
        title="Add New"
      >
        <FontAwesomeIcon icon={faPlus} />
      </button>
    </div>
  );
};

export default DocLink;
