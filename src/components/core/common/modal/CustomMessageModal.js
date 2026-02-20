import React from "react";
import Modal from "./Modal";

// Custom styles for the modal
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "1rem",
    padding: "0", // Remove default padding
    background: "#fff",
    border: "none",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    maxWidth: "400px",
    width: "100%",
    display: "flex",
    flexDirection: "column", // Use flexbox for layout
    maxHeight: "90vh", // Limit height of the modal
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    padding: "1rem 1rem",
    borderBottom: "1px solid #e5e7eb",
  },
  contentWrapper: {
    flex: 1,
    overflowY: "auto", // Enable vertical scrolling
    padding: "1rem 1rem",
  },
  footer: {
    padding: "1rem 1rem",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    gap: "1rem",
    justifyContent: "space-between",
  },
};

const CustomMessageModal = ({
  isOpen,
  onRequestClose,
  message,
  title,
  onProceed,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onRequestClose}>
      <div style={customStyles.header}>
        <h2 className="text-lg font-medium text-red-600">{title}</h2>
      </div>
      <div className="w-full" style={customStyles.contentWrapper}>
        <div className="w-full">{message}</div>
      </div>
      <div style={customStyles.footer}>
        <button
          onClick={onRequestClose}
          className="uppercase transition-all border border-solid rounded-lg shadow-none cursor-pointer text-xs bg-gray-500 text-white font-bold px-4 py-2 rounded-lg"
        >
          Close
        </button>
        <button
          onClick={onProceed}
          className="uppercase transition-all border border-solid rounded-lg shadow-none cursor-pointer text-xs bg-fuchsia-500 text-white font-bold px-4 py-2 rounded-lg"
        >
          Proceed Anyway
        </button>
      </div>
    </Modal>
  );
};

export default CustomMessageModal;
