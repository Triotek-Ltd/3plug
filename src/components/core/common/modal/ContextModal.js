import React from "react";
import Modal from "./Modal";
import { useModal } from "@/contexts/ModalContext";

const ContextConfirmationModal = () => {
  const { modalState, closeModal } = useModal();
  const {
    isOpen,
    title,
    message,
    onConfirm,
    confirmButtonStyles = "",
  } = modalState;

  const baseButtonClass =
    "transition-all border border-solid rounded-lg shadow-md cursor-pointer leading-pro ease-soft-in text-xs active:opacity-85 hover:scale-105 tracking-tight-soft font-bold px-4 py-2 bg-fuchsia-500";

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      position="top"
      className="!pt-40"
    >
      <div className="flex flex-col w-fit p-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-between items-center space-x-4 mt-4 text-gray-100">
          <button
            onClick={closeModal}
            className={`${baseButtonClass} bg-gray-200 hover:bg-gray-300 text-gray-800`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              closeModal();
            }}
            className={`${baseButtonClass} ${confirmButtonStyles}`}
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ContextConfirmationModal;
