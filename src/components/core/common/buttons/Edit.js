import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const EditButton = ({ className }) => {
  return (
    // <TableTooltip content="Edit">
    <div
      className={`inline-block mb-0 font-bold text-center uppercase align-middle transition-all cursor-pointer leading-pro ease-soft-in text-xs bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 text-blue-500 hover:opacity-75 ${className}`}
    >
      <FontAwesomeIcon icon={faEdit} />
    </div>
    // </TableTooltip>
  );
};

export default EditButton;
