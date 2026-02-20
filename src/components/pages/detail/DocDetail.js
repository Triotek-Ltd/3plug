import React, { useEffect, useState, useRef } from "react";
import { fetchData, updateData, deleteData } from "@/utils/Api";
import { toast } from "react-toastify";
import { useData } from "@/contexts/DataContext";
import { useRouter } from "next/router";
import {
  faEnvelope,
  faCog,
  faInfoCircle,
  faTrash,
  faFileEdit,
  faPlus,
  faDeleteLeft,
} from "@fortawesome/free-solid-svg-icons";
import DocForm from "@/components/pages/new/DocForm";
import ConfirmationModal from "@/components/core/common/modal/ConfirmationModal";
import DocHeader from "@/components/core/common/header/DocHeader";
import DocFields from "@/components/pages/detail/DocFields";
import DocMessages from "@/components/pages/detail/DocMessages"; // New import for Messages tab
import DocSettings from "@/components/pages/detail/DocSettings"; // New import for Settings tab
import DocFooter from "@/components/pages/detail/DocFooter";
import DocEditFields from "@/components/pages/detail/DocEditFields";
import useKeySave from "@/hooks/useKeySave";

const DocDetail = ({ config, saveSettings }) => {
  const { data, setData } = useData();
  const router = useRouter();
  const [endpoint, setEndpoint] = useState("");
  const [selectedTab, setSelectedTab] = useState("Details");
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      setEndpoint(`${config.endpoint}/${id}`);
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
        toast.error(`Failed to fetch data: ${error.message || error}`);
      }
    };

    const timer = setTimeout(() => {
      fetchData1();
    }, 500);

    return () => clearTimeout(timer);
  }, [endpoint, setData]);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSaveClick = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  useKeySave(handleSaveClick);

  const handleUpdate = async (formData) => {
    try {
      const changedFields = getChangedFields(formData);
      if (Object.keys(changedFields).length) {
        const response = await updateData(changedFields, endpoint);
        if (response?.data) {
          toast.success("Document updated successfully!");
          setData(response.data);
          setIsEditing(false);
        }
      }
    } catch (error) {
      toast.error(`Failed to update document: ${error.message || error}`);
    }
  };

  const getChangedFields = (formData) => {
    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (data[key] !== formData[key]) {
        changedFields[key] = formData[key];
      }
    });
    return changedFields;
  };

  const handleFormSubmitSuccess = (formData) => {
    handleSaveClick();
    handleUpdate(formData);
  };

  const handleDelete = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsModalOpen(false);
    try {
      await deleteData(endpoint);
      toast.success("Document deleted successfully!");
      router.push(`/${config.endpoint}`);
    } catch (error) {
      toast.error(`Failed to delete document: ${error.message || error}`);
    }
  };

  const tabs = [
    { name: "Details", icon: faInfoCircle, label: "Details" },
    ...(config.endpoint === "documents"
      ? [{ name: "Fields", icon: faFileEdit, label: "Fields" }]
      : []),
    { name: "Messages", icon: faEnvelope, label: "Messages" },
    { name: "Settings", icon: faCog, label: "Settings" },
  ];
  const buttons = [
    {
      type: "primary",
      text: "New Entry",
      action: "handleNew",
      icon: faPlus,
      group: "Common",
    },

    {
      type: "primary",
      text: "Delete",
      action: handleDelete,
      icon: faTrash,
      group: "Common",
    },
  ];

  return (
    <div className="mx-2 -mt-24">
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
        isEditing={true}
        id={id}
        buttons={buttons}
        handleDelete={handleDelete}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        handleTabClick={handleTabClick}
      />
      {selectedTab === "Details" ? (
        <DocForm
          ref={formRef}
          config={config}
          initialData={data}
          onSubmit={handleFormSubmitSuccess}
          type="detail"
        />
      ) : selectedTab === "Fields" ? (
        <DocEditFields config={config} data={data} />
      ) : selectedTab === "Settings" ? (
        <DocSettings
          config={config}
          data={data}
          setting={config.setting}
          saveSettings={saveSettings}
        />
      ) : null}
      <DocFooter data={data} />
    </div>
  );
};

export default DocDetail;
