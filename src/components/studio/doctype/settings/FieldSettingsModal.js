import React from "react";
import Modal from "@/components/studio/Modal"; // Import the Modal component
import DeleteButton from "../core/common/buttons/Delete";
import AdvancedSection from "./AdvancedSection";
import GeneralSettings from "./GeneralSettings";
import MoreSection from "./MoreSection";

const FieldSettingsModal = ({
  item,
  handleInputChange,
  closeModal,
  deleteField,
  fields,
}) => {
  const { type, readonly, default: defaultValue, options } = item;

  return (
    <Modal onClose={closeModal} title={"Field Settings"}>
      <div className="relative bg-white mb-12">
        {/* Delete Button */}
        <button
          onClick={() => deleteField(item.id1)}
          className="absolute -top-2 right-0 text-red-600 hover:text-red-800 transition-colors"
        >
          <DeleteButton />
        </button>

        {/* Header Section */}
        <div className="mb-4 flex items-center h-4">
          {/* <div className="text-xl font-semibold flex-grow">Field Settings</div> */}
        </div>
        <div className="grid grid-cols-1 gap-y-4">
          {/* Main Content */}
          <div className="grid grid-cols-1 gap-4">
            {/* General Settings Section */}
            <GeneralSettings
              item={item}
              handleInputChange={handleInputChange}
            />
            {/* Advanced Settings Section */}
            <AdvancedSection
              item={item}
              handleInputChange={handleInputChange}
            />

            <MoreSection item={item} handleInputChange={handleInputChange} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FieldSettingsModal;
