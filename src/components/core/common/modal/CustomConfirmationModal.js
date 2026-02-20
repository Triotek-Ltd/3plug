import React from "react";
// import { FaTimes } from "react-icons/fa"; // Close icon (X)
import Modal from "./Modal"; // Import the reusable Modal component

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
  confirmButtonStyles = "",
  customButtonStyles = "",
}) => {
  const baseButtonClass =
    "transition-all border border-solid rounded-lg shadow-md cursor-pointer leading-pro ease-soft-in text-xs active:opacity-85 hover:scale-105 tracking-tight-soft font-bold px-4 py-2 bg-fuchsia-500";

  // Default actions if none are provided
  const defaultActions = [
    {
      label: "Cancel",
      onClick: onClose,
      className: `${baseButtonClass} bg-gray-200 hover:bg-gray-300 text-gray-800`, // Cancel button class
    },
    {
      label: "Confirm",
      onClick: onConfirm,
      className: `${baseButtonClass} ${confirmButtonStyles}`, // Confirm button class with passed styles
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col w-fit p-4">
        {/* <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none"
      >
        <FaTimes size={18} />
      </button> */}

        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-between items-center space-x-4 mt-4 text-gray-100">
          {/* Cancel Button - Left */}
          <button
            onClick={defaultActions[0]?.onClick}
            className={defaultActions[0]?.className}
          >
            {defaultActions[0]?.label}
          </button>

          <div className="flex justify-between items-center space-x-2">
            {/* Custom Button - Centered if provided */}
            {customButtonStyles && (
              <button
                onClick={customButtonStyles?.onClick}
                className={`${baseButtonClass} ${customButtonStyles} mx-auto`} // Centered with mx-auto
              >
                {customButtonStyles?.label}
              </button>
            )}

            {/* Confirm Button - Right */}
            <button
              onClick={defaultActions[1]?.onClick}
              className={defaultActions[1]?.className}
            >
              {defaultActions[1]?.label}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
