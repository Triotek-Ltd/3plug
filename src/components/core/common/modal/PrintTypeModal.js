import React from "react";
import Modal from "react-modal";

const PrintTypeModal = ({
  isOpen,
  onRequestClose,
  onSelectPrintType,
  handlePdfDownload,
  type = "",
}) => {
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
      padding: "2rem",
      background: "#fff",
      border: "none",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      maxWidth: "400px",
      width: "90%",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  const handlePrintTypeSelect = (type) => {
    onSelectPrintType(type);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Select Print Type"
    >
      <h2 className="text-2xl font-semibold mb-6">Select Print Type</h2>
      <p className="mb-4 text-gray-700">
        Please choose the type of print you would like to perform. Each option
        provides a different format and layout for printing:
      </p>
      <div className="flex flex-col space-y-4">
        {type !== "Crossborder" ? (
          <button
            onClick={() => handlePrintTypeSelect("default")}
            // className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold px-5 py-3"
            className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold px-5 py-3"
          >
            <span className="text-lg">Print</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => handlePrintTypeSelect("packinglist")}
              // className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold px-5 py-3"
              className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold px-5 py-3"
            >
              <span className="text-lg">Print Packing List</span>
            </button>
            <button
              onClick={() => handlePrintTypeSelect("crossborder")}
              // className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-gray-600 hover:bg-gray-500 text-white font-bold px-5 py-3"
              className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold px-5 py-3"
            >
              <span className="text-lg">Print Crossborder</span>
            </button>
          </>
        )}
        {/* <button
          onClick={() => handlePdfDownload()}
          className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold px-5 py-3"
        >
          <span className="text-lg">Download PDF</span>
        </button> */}
      </div>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onRequestClose}
          className="transition-all border border-solid rounded-lg shadow-lg cursor-pointer leading-pro ease-soft-in text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default PrintTypeModal;
