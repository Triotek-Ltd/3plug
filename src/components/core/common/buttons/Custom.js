import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableTooltip from "@/components/tooltip/TableTooltip";

const CustomButton = ({
  text,
  icon,
  children,
  className,
  onClick,
  disabled = false,
  hidden = false,
  toooltip = "",
}) => {
  return (
    // <TableTooltip content={toooltip}>
    <div
      onClick={onClick}
      hidden={hidden}
      className={`inline-block px-2 py-[6.5px] whitespace-nowrap mb-0 font-medium text-center align-middle transition-all bg-transparent border border-solid rounded-md shadow-none cursor-pointer leading-pro ease-soft-in text-[12px] bg-150 active:opacity-85 hover:scale-102 tracking-tight-soft bg-x-25 border-slate-800 text-slate-800 hover:opacity-90 ${className}`}
    >
      <div className="flex items-center justify-center space-x-2 ">
        {/* Render text if provided */}
        {text && <span>{text}</span>}
        {/* Render icon if provided */}
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="text-sm text-gray-700 font-light font-weight-500"
          />
        )}
        {/* Render children */}
        {children}
      </div>
    </div>
    // </TableTooltip>
  );
};

export default CustomButton;
