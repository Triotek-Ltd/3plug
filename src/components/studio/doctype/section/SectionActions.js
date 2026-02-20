import React, { useState, useEffect, useRef } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import { addFieldToConfig } from "../utils/addFieldToConfig";
import { getFirstFieldname } from "../utils/getFirstField";
import { getLastFieldname } from "../utils/getLastFieldname";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisH,
  faArrowUp,
  faArrowDown,
  faTrash,
  faColumns,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "motion/react";
import { getFieldsAfterBreak } from "../utils/getFieldsAfterBreak";
import { deleteFieldsFromConfig } from "../utils/deleteFields";
import addSection from "../utils/addSection";
import deleteSection from "../utils/deleteSection";
import ConfirmationModal from "@/components/core/common/modal/CustomConfirmationModal";
import SectionDropdownMenu from "./SectionDropdownMenu";

const SectionActions = ({ section }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldDeleteFields, setShouldDeleteFields] = useState(false); // State to track field deletion choice
  const { localConfig, setLocalConfig } = useConfig();
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setMenuOpen(false);

  const handleAddSection = async (top = false) => {
    try {
      const newConfig = await addSection(localConfig, section, top);
      setLocalConfig({ ...newConfig });
      closeMenu();
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const handleAddColumn = async () => {
    const targetField =
      getLastFieldname(section) || section.fieldname || section.prevField;
    const newConfig = await addFieldToConfig(
      localConfig,
      targetField,
      "Column"
    );
    setLocalConfig({ ...newConfig });
    closeMenu();
  };

  const handleDeleteSection = async () => {
    setIsModalOpen(true);
    closeMenu();
  };

  // Handle modal confirmation
  const handleConfirmDelete = async () => {
    try {
      const newConfig = await deleteSection(
        localConfig,
        section,
        shouldDeleteFields
      ); // Pass user choice for field deletion
      setLocalConfig({ ...newConfig });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  // Handle modal cancellation
  const handleCancelDelete = () => {
    setIsModalOpen(false);
  };

  // Toggle the state for whether the user wants to delete fields
  const toggleDeleteFields = () => {
    setShouldDeleteFields((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center" ref={menuRef}>
      {/* Dropdown Button */}
      <button
        className={`p-2 hover:text-purple-700 ${
          isMenuOpen ? "text-purple-700" : "text-gray-900"
        }`}
        onClick={toggleMenu}
        aria-label="Open Actions Menu"
      >
        <FontAwesomeIcon
          icon={isMenuOpen ? faEllipsisV : faEllipsisH}
          className="text-lg"
        />
      </button>

      {/* Dropdown Menu with Animation */}
      <SectionDropdownMenu
        isOpen={isMenuOpen}
        handleAddSection={handleAddSection}
        handleAddColumn={handleAddColumn}
        handleDeleteSection={handleDeleteSection}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this section? ${
          shouldDeleteFields
            ? "(Including all related fields)"
            : "(Only the section break)"
        }`}
        title="Confirm Deletion"
        confirmButtonStyles="bg-red-600 hover:bg-red-700" // Custom styles for the Confirm button
        customButtonStyles={{
          label: shouldDeleteFields
            ? "Delete Only Section Break"
            : "Delete With Fields",
          onClick: toggleDeleteFields, // Custom onClick for the custom button
        }}
      />
    </div>
  );
};

export default SectionActions;
