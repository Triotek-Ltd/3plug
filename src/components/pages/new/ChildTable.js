import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { fetchTableData } from "@/components/pages/detail/FetchTable";
import { useNavbar } from "@/contexts/NavbarContext";
import { useRouter } from "next/router";
import ChildTableStandard from "@/components/pages/new/ChildTableStandard";
import ChildTableEditableRows from "@/components/pages/new/ChildTableEditableRows";
import { postData, updateData } from "@/utils/Api";

const ChildTable = ({
  name,
  handleChange,
  doc,
  field,
  placeholder = "Select",
  readOnly = false,
  hidden = false,
  type,
  initialData,
}) => {
  const [selected, setSelected] = useState(initialData?.value || []);
  const [linkResponse, setLinkResponse] = useState(null);
  const [linkDetail, setLinkDetail] = useState(placeholder);

  const { dashboardText } = useNavbar();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // setSelected(initialData.value);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docLastPart = doc.split(".").pop();
        if (field.use_list) {
          setSelected(initialData[field.id]);
        }

        const { data: fetchedData, linkresponse } = await fetchTableData(
          docLastPart,
          `${docLastPart}s${dashboardText}__id`,
          id
        );

        setLinkDetail(linkresponse.data);

        if (type !== "new") {
          setSelected([...fetchedData.list]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, doc, dashboardText, type]);

  if (field.readonly) {
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

      router.push(newUrl);
    };

    return (
      <div className="w-full items-center">
        Add New
        <button
          type="button"
          onClick={handleAddNew}
          className="ml-4 py-1.5 px-3 rounded bg-purple-500 hover:bg-purple-700 text-white"
          title="Add New"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>
    );
  }

  const getColumnHeaders = () => {
    const fieldList = field?.fieldlist?.split("\n") || [];
    const fieldsToInclude = ["id", ...fieldList];

    if (readOnly && passedColumns && passedColumns.length > 0) {
      return passedColumns.map((key) => ({
        label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        key,
      }));
    }

    const allKeys = new Set(fieldsToInclude);

    return Array.from(allKeys).map((key) => ({
      label: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      key,
    }));
  };

  const columns = getColumnHeaders();

  const handleSelectionChange = (selectedOption) => {
    let newSelection;

    if (Array.isArray(selectedOption)) {
      newSelection = selectedOption.map((option) => option.value);
    } else {
      newSelection = selectedOption?.value ? [selectedOption.value] : [];
    }

    setSelected((prevSelected) => {
      const updatedSelection = [...newSelection];
      const idList = updatedSelection.map((item) => item.id);

      handleChange(idList);
      return updatedSelection;
    });
  };

  const handleDelete = (item) => {
    setSelected(selected.filter((i) => i !== item));
    const updatedSelection = selected.filter((i) => i !== item);
    const idList = updatedSelection?.map((item) => item.id);
    handleChange(idList);
  };

  const handleAddingRow = async (newRow) => {
    const response = await postData(
      newRow,
      `${linkDetail.app}/${linkDetail.id}`
    );
    if (response?.data) {
      const updatedRows = [...selected, response?.data];
      const idList = updatedRows.map((item) => item.id);
      setSelected(updatedRows);
      handleChange(idList);
    }
  };

  const handleSavingRow = async (id, row) => {
    await updateData(row, `${linkDetail.app}/${linkDetail.id}/${id}`);
  };

  return (
    <div className={`relative ${hidden ? "hidden" : ""}`}>
      {field.childtable ? (
        <ChildTableEditableRows
          name={name}
          handleSelectionChange={handleSelectionChange}
          doc={doc}
          isMulti={true}
          placeholder={placeholder}
          selected={selected}
          setSelected={setSelected}
          setLinkResponse={setLinkResponse}
          field={field}
          linkResponse={linkResponse}
          type={type}
          readOnly={readOnly}
          columns={columns}
          handleDelete={handleDelete}
          handleAddingRow={handleAddingRow}
          handleSavingRow={handleSavingRow}
        />
      ) : (
        <ChildTableStandard
          name={name}
          handleSelectionChange={handleSelectionChange}
          doc={doc}
          isMulti={true}
          placeholder={placeholder}
          selected={selected}
          setLinkResponse={setLinkResponse}
          field={field}
          linkResponse={linkResponse}
          type={type}
          readOnly={readOnly}
          columns={columns}
          handleDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ChildTable;
