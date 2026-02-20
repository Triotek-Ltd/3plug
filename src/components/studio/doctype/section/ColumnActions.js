import React, { useState, useEffect, useRef } from "react";
import { useConfig } from "@/contexts/ConfigContext";
import addColumn from "../utils/addColumn"; // Import addColumn function
import deleteColumn from "../utils/deleteColumn"; // Import deleteColumn function
import ColActionsDropdownMenu from "./ColDropdownMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import ConfirmationModal from "@/components/core/common/modal/CustomConfirmationModal";

const ColumnActions = ({ column, handleAddField }) => {
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

  const handleAddColumn = async (top = false) => {
    try {
      const newConfig = await addColumn(localConfig, column, top);
      setLocalConfig({ ...newConfig });
      closeMenu();
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const handleDeleteColumn = async () => {
    // Open the confirmation modal
    setIsModalOpen(true);
    closeMenu();
  };

  // Handle modal confirmation
  const handleConfirmDelete = async () => {
    try {
      const newConfig = await deleteColumn(
        localConfig,
        column,
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
      <ColActionsDropdownMenu
        isOpen={isMenuOpen}
        onAddBefore={() => handleAddColumn(true)}
        onAddAfter={() => handleAddColumn(false)}
        onDelete={handleDeleteColumn}
        closeMenu={closeMenu}
        handleAddField={handleAddField}
      />
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        message={`Are you sure you want to delete this column? ${
          shouldDeleteFields
            ? "(Including all related fields)"
            : "(Only the column break)"
        }`}
        title="Confirm Deletion"
        confirmButtonStyles="bg-red-600 hover:bg-red-700" // Custom styles for the Confirm button
        customButtonStyles={{
          label: shouldDeleteFields
            ? "Delete Only Column Break"
            : "Delete With Fields",
          onClick: toggleDeleteFields, // Custom onClick for the custom button
        }}
      />
    </div>
  );
};

export default ColumnActions;
