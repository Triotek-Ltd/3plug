import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload"; // Change the icon to upload
import TableTooltip from "@/components/tooltip/TableTooltip";

const Upload = ({ className }) => {
  return (
    // <TableTooltip content="Import data from a file">
    <div
      className={`inline-block px-2 py-1 mb-0 font-bold text-center uppercase align-middle transition-all border border-solid rounded-lg shadow-none cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 bg-transparent text-green-900 border-1 border-green-500 hover:opacity-75 ${className}`}
    >
      <FontAwesomeIcon icon={faUpload} />
      {/* Text updated to 'Import Data' */}
    </div>
    // </TableTooltip>
  );
};

export default Upload;
