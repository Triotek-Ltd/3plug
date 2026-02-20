import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import TableTooltip from "@/components/tooltip/TableTooltip";

const Download = ({ className, onClick }) => {
  return (
    // <TableTooltip content="Download in excel file">
    <div
      onClick={onClick}
      className={`inline-block px-2 py-1 mb-0 font-bold text-center uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-transparent text-blue-900 border-1 border-blue-500 hover:opacity-75 ${className}`}
    >
      <FontAwesomeIcon icon={faDownload} />
    </div>
    // </TableTooltip>
  );
};

export default Download;
