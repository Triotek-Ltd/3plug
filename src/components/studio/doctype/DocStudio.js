import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DocHeader from "@/components/core/common/header/DocHeader";
import Canvas from "@/components/studio/doctype/Canvas";
import FieldSettings from "./settings";
import { useConfig } from "@/contexts/ConfigContext";
import useKeyEvents from "@/hooks/useKeyEvents"; // Importing the useKeyEvents hook
import {
  faPrint,
  faTrash,
  faList,
  faClone,
  faCheck,
  faEdit,
  faTimes,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import DraggableTable from "./draggableTable";
import SettingsForm from "./SettingsForm";
import { handleDocSave } from "./utils/saveUtils";
import { useData } from "@/contexts/DataContext";

const DoctypeStudio = ({ handleSave, config }) => {
  const { localConfig } = useConfig();
  const { form } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState("form"); // State to track the selected tab
  const router = useRouter();
  const { slug } = router.query;

  // Check for changes whenever config or localConfig updates
  useEffect(() => {
    setIsEditing(true); // Enable editing if the configs are not similar
  }, [localConfig]);

  const handleSaveClick = () => {
    handleDocSave(localConfig, form, handleSave);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Handle Duplicate
  const handleDuplicate = () => {};

  // Handle Print
  const handlePrint = () => {};

  // Handle Delete
  const handleDelete = () => {};

  // Handle Go to List
  const handleGoToList = () => {
    window.open(`/app/${slug}`, "_blank"); // Open in a new tab
  };

  useKeyEvents(() => {}, handleSaveClick, handleDuplicate);

  const buttons = [
    {
      type: "primary",
      text: "Print",
      action: handlePrint,
      icon: faPrint,
      group: "",
    },
    {
      type: "secondary",
      text: "Delete",
      action: handleDelete,
      icon: faTrash,
      group: "",
    },
    {
      type: "secondary",
      text: "Go to List",
      action: handleGoToList,
      icon: faList,
    },
    {
      type: "primary",
      text: "Duplicate",
      action: handleDuplicate,
      icon: faClone,
      group: "",
    },
  ];

  return (
    <div className="">
      <DocHeader
        isEditing={isEditing}
        handleEditClick={handleEditClick}
        handleSaveClick={handleSaveClick}
        title={localConfig?.name}
        buttons={buttons}
      />
      <DndProvider backend={HTML5Backend}>
        <div className="px-4">
          <div className="w-full shadow-md shadow-gray-400 bg-gray-100 border border-gray-400 rounded-lg mt-2">
            <div className="flex w-full space-x-6 border-b-[1px] border-gray-400 py-2 px-4">
              {["form", "settings", "fieldList"].map((tab) => (
                <button
                  key={tab}
                  className={` ${
                    selectedTab === tab
                      ? "border-b-[1px] border-purple-800 text-purple-900"
                      : "text-gray-800"
                  } px-0 pt-2 font-bold text-base`}
                  onClick={() => handleTabChange(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative z-1 flex max-h-[78vh]">
              {/* Main Content Section */}
              {selectedTab === "settings" ? (
                <div className="w-full">
                  <SettingsForm />
                </div>
              ) : (
                <>
                  <div className="w-3/4 bg-white rounded max-h-[100vh]">
                    {selectedTab === "form" && (
                      <div className="h-full overflow-y-auto">
                        <Canvas />
                      </div>
                    )}
                    {selectedTab === "fieldList" && (
                      <div className="overflow-y-auto max-h-[73vh] w-full">
                        <DraggableTable useDivs />
                      </div>
                    )}
                  </div>

                  {/* Settings Section */}
                  {selectedTab !== "settings" && (
                    <div className="w-1/4 p-2 ml-4 shadow-md shadow-gray-400 bg-white rounded max-h-[100vh] border border-gray-300 rounded-lg">
                      <div className="h-full overflow-y-auto shadow-inner">
                        <FieldSettings />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </DndProvider>
    </div>
  );
};

export default DoctypeStudio;
