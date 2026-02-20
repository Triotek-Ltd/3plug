import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

const PrimaryButton = ({ text, className, onClick, icon }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-block whitespace-nowrap px-4 py-1 mb-0 font-bold text-center uppercase align-middle transition-all bg-transparent border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 border-fuchsia-500 text-fuchsia-500 hover:opacity-75 ${className}`}
    >
      {icon && (
        <FontAwesomeIcon icon={icon} className="text-sm text-gray-900" />
      )}
      {text}
    </div>
  );
};

export default PrimaryButton;
