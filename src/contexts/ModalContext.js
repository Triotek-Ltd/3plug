import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
    confirmButtonStyles: "",
  });

  const openModal = ({
    title,
    message,
    onConfirm,
    confirmButtonStyles = "",
  }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmButtonStyles,
    });
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};
