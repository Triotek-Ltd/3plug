import React, { useState } from "react";
import Modal from "react-modal";

const PrintConfirmButton = ({ className, modalIsOpen, setModalIsOpen }) => {
  const closeModal = () => setModalIsOpen(false);
  const openModal = () => setModalIsOpen(true);

  const handleConfirm = () => {
    closeModal();
  };

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
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Confirmation Modal"
      >
        <h2 className="text-xl font-semibold mb-4">Confirm Print</h2>
        <p className="mb-6">Are you sure you want to print this document?</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleConfirm}
            className="uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-fuchsia-500 text-xl text-white font-bold px-4 py-2 rounded-lg shadow"
          >
            Yes
          </button>
          {/* <button
            onClick={closeModal}
            className="uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-gray-500 text-xl text-fuchsia font-bold px-4 py-2 rounded-lg shadow"
          >
            No
          </button> */}
        </div>
      </Modal>
    </>
  );
};

export default PrintConfirmButton;
