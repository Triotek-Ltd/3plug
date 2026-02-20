import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import TableTooltip from "@/components/tooltip/TableTooltip";
import Link from "next/link";

// Default class names
const DEFAULT_BASE_CLASSES =
  "w-full flex flex-row items-center justify-between pl-2 py-2 pr-3 hover:pr-2 min-w-0 break-words";
const DEFAULT_ICON_CONTAINER_CLASSES =
  "flex items-center justify-center w-6 h-6 text-center rounded-lg";
const DEFAULT_ARROW_ICON_CONTAINER_CLASSES =
  "flex items-center justify-center rounded-full h-6 w-6";
const DEFAULT_TEXT_CLASSES = "font-semibold text-base mb-1";
const DEFAULT_ICON_CLASSES = "h-4 w-4 text-white";
const DEFAULT_ARROW_ICON_CLASSES = "text-white text-sm";
const DEFAULT_LINK_CARD_CONTAINER_CLASSES =
  "shadow-soft-xl rounded-2xl bg-clip-border text-center";

const DEFAULT_ICON_BG = "bg-gradient-to-tl from-purple-700 to-pink-500";
const DEFAULT_BG_COLOR = "bg-white";

const LinkCard = ({
  title,
  icon,
  href,
  iconBg = DEFAULT_ICON_BG,
  bgColor = DEFAULT_BG_COLOR,
  tooltipContent,
  iconClassName = "",
  textClassName = DEFAULT_TEXT_CLASSES,
  className = "", // Custom styles for the entire component
  baseClassName = DEFAULT_BASE_CLASSES, // Custom class for the base container
  iconContainerClassName = DEFAULT_ICON_CONTAINER_CLASSES, // Custom class for the icon container
  arrowClassName = "", // Custom class for arrow icon container
  textClassNameOverride = DEFAULT_TEXT_CLASSES, // Custom text class name
  linkCardContainerClassName = DEFAULT_LINK_CARD_CONTAINER_CLASSES, // Custom class for the entire card container
}) => {
  return (
    <div className={`w-full ${className}`}>
      {/* <TableTooltip content={tooltipContent}> */}
      <Link
        href={href}
        className={`${baseClassName} ${bgColor} ${linkCardContainerClassName}`}
      >
        <div className="flex flex-row items-center justify-center gap-x-2">
          {/* Icon Container */}
          <div className={`${iconContainerClassName} ${iconBg}`}>
            <FontAwesomeIcon
              icon={icon}
              className={`${DEFAULT_ICON_CLASSES} ${iconClassName}`} // Apply icon specific styles
            />
          </div>
          {/* Title Text */}
          <p className={`${textClassNameOverride}`}>{title}</p>
        </div>
        {/* Arrow Icon */}
        <div
          className={`${DEFAULT_ARROW_ICON_CONTAINER_CLASSES} ${arrowClassName} `}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            className={DEFAULT_ARROW_ICON_CLASSES}
          />
        </div>
      </Link>
      {/* </TableTooltip> */}
    </div>
  );
};

export default LinkCard;
