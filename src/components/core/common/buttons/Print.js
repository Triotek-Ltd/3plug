import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

const PrintButton = ({ className, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-block px-2 py-1 mb-0 font-bold text-center uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-transparent text-green-900 border-1 border-green-500 hover:opacity-75 ${className}`}
    >
      <FontAwesomeIcon icon={faPrint} />
    </div>
  );
};

export default PrintButton;
