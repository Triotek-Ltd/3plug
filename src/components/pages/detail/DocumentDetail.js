import React, { useEffect, useState, useRef } from "react";
import { fetchData, updateData, deleteData } from "@/utils/Api";
import { toast } from "react-toastify";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";
import {
  faEnvelope,
  faCog,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "@/components/core/common/modal/ConfirmationModal";
import DocHeader from "@/components/core/common/header/DocHeader";
import DocFooter from "@/components/pages/detail/DocFooter";
import DocumentFieldList from "@/components/pages/detail/DocumentFieldList";
import DocumentForm from "@/components/pages/new/DocumentForm";
import DocumentLogs from "@/components/pages/detail/DocumentLogs";
import useKeySave from "@/hooks/useKeySave";
import { getAppModuleDoc } from "@/utils/doc";

const DocumentDetail = ({ config }) => {
  const { data, setData } = useData();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("Details");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);

  const [endpoint, setEndpoint] = useState("");
  const { slug, id } = router.query;
  config.print = true;
  let app, module, doc;

  useEffect(() => {
    if (slug) {
      ({ app, module, doc } = getAppModuleDoc(slug));
      setEndpoint(`${app}/${module}/${slug}/${id}`);
    }
  }, [id]);

  useEffect(() => {
    const fetchData1 = async () => {
      if (!endpoint) return;
      try {
        const response = await fetchData({}, endpoint);
        if (response?.data) {
          setData(response.data);
        }
      } catch (error) {
        toast.error(`Failed to fetch data, ${error.message || error}`);
      }
    };

    const timer = setTimeout(() => {
      fetchData1();
    }, 200);

    return () => clearTimeout(timer);
  }, [endpoint, isEditing]);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  const getChangedFields = (formData) => {
    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      // Skip if the key is 'password' and the value is null
      if (key === "password" && formData[key] === null) {
        return;
      }

      if (data[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    });
    return changedFields;
  };

  const handleUpdate = async (formData) => {
    try {
      const parsedData = {};

      Object.keys(formData).forEach((key) => {
        const { type, value } = formData[key];

        if (value === "" && (type === "date" || type === "datetime-local")) {
          parsedData[key] = null;
          return;
        }

        switch (type) {
          case "float":
          case "decimal":
            parsedData[key] = value === "" ? null : parseFloat(value);
            break;
          case "date":
            const date = new Date(value);
            parsedData[key] = isNaN(date.getTime())
              ? null
              : date.toISOString().split("T")[0];
            break;
          case "datetime-local":
            const datetime = new Date(value);
            parsedData[key] = isNaN(datetime.getTime())
              ? null
              : datetime.toISOString();
            break;
          case "time":
            parsedData[key] = value === "" ? null : value;
            break;
          case "file":
            if (value instanceof File) {
              parsedData[key] = value;
            }
            break;
          default:
            parsedData[key] = value === "" ? null : value;
        }
      });

      const changedFields = getChangedFields(parsedData);

      const response = await updateData(changedFields, endpoint);
      if (response?.data) {
        toast.success("Update successfully!");
        setData(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(`Failed to update, ${error.message || error}`);
    }
  };

  const handleFormSubmitSuccess = (formData) => {
    handleSaveClick();
    handleUpdate(formData);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    try {
      await deleteData(endpoint);
      toast.success("Deleted successfully!");
      router.back();
    } catch (error) {
      toast.error(`Failed to delete, ${error.message || error}`);
    }
  };

  const tabs = [
    { name: "Details", icon: faInfoCircle, label: "Details" },
    { name: "Logs", icon: faEnvelope, label: "Logs" },
    { name: "Settings", icon: faCog, label: "Settings" },
  ];

  useKeySave(handleSaveClick);

  return (
    <div className="mx-4 -mt-28">
      <ConfirmationModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
      <DocHeader
        data={data}
        tabs={tabs}
        config={config}
        selectedTab={selectedTab}
        isEditing={isEditing}
        id={id}
        handleDelete={handleDelete}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        handleTabClick={handleTabClick}
      />
      {selectedTab === "Details" &&
        (isEditing ? (
          <DocumentForm
            ref={formRef}
            config={config}
            initialData={data}
            onSubmit={handleFormSubmitSuccess}
            type="detail"
          />
        ) : (
          <DocumentFieldList fields={config.fields} data={data} />
        ))}
      {selectedTab === "Logs" && (
        <DocumentLogs endpoint={endpoint} config={config} id={id} />
      )}
      {selectedTab === "Settings" && (
        <div>{/* Settings component or content goes here */}</div>
      )}
      <DocFooter data={data} />
    </div>
  );
};

export default DocumentDetail;
