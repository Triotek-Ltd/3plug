import React, { createContext, useContext, useCallback } from "react";
import { toast } from "react-toastify";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const showToast = useCallback((message, options = {}) => {
    toast(message, {
      position: options.position || "top-right", // Default position
      autoClose: options.autoClose || 3000, // Default auto close time
      hideProgressBar: options.hideProgressBar || false, // Default progress bar visibility
      closeOnClick: options.closeOnClick || true, // Default click close behavior
      pauseOnHover: options.pauseOnHover || true, // Default pause on hover behavior
      draggable: options.draggable || true, // Default draggable behavior
      type: options.type || "default", // Default toast type (info, success, etc.)
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
