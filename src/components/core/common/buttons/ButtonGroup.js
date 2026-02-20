import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "./Primary";
import SecondaryButton from "./Secondary";
import CustomButton from "./Custom";
import DropdownMenu from "../header/DropdownMenu";
import {
  faCaretDown,
  faCogs,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";

const ButtonGroup = ({ buttons }) => {
  const renderButton = (button, index) => {
    const { type = "custom", action, group, icon, ...rest } = button;

    // Render individual button types
    switch (type) {
      case "primary":
        return (
          <PrimaryButton key={index} {...rest} onClick={action} icon={icon} />
        );
      case "secondary":
        return (
          <SecondaryButton key={index} {...rest} onClick={action} icon={icon} />
        );
      case "custom":
        return (
          <CustomButton key={index} {...rest} onClick={action} icon={icon} />
        );
      default:
        return (
          <CustomButton key={index} {...rest} onClick={action} icon={icon} />
        );
    }
  };

  // Group buttons by their group property (group is now a string)
  const groupedButtons = buttons.reduce((acc, button) => {
    const { group } = button;

    // Place empty group buttons as a special case
    if (group === "") {
      acc["Common"] = acc["Common"] || [];
      acc["Common"].push(button);
    } else if (group) {
      // Group by actual group name
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(button);
    } else {
      // Ungrouped buttons
      acc["ungrouped"] = acc["ungrouped"] || [];
      acc["ungrouped"].push(button);
    }
    return acc;
  }, {});

  // Create order of rendering
  const groupOrder = [
    ...Object.keys(groupedButtons).filter(
      (group) => group !== "Common" // Then all grouped buttons (excluding empty group)
    ),
    "Common", // Finally, the empty group (ellipsis)
  ];

  return (
    <>
      {/* Loop through the defined group order */}
      {groupOrder.map((groupKey) => (
        <React.Fragment key={groupKey}>
          {/* Render ungrouped buttons first */}
          {groupKey === "ungrouped" &&
            groupedButtons[groupKey]?.map((button, index) => (
              <React.Fragment key={index}>
                {renderButton(button, index)}
              </React.Fragment>
            ))}

          {/* Render groups as DropdownMenus */}
          {groupKey !== "ungrouped" && groupKey !== "Common" && (
            <DropdownMenu
              trigger={<CustomButton text={groupKey} icon={faCaretDown} />}
              options={groupedButtons[groupKey]?.map((button) => ({
                text: button.text,
                action: button.action,
                icon: button.icon || faCogs,
              }))}
            />
          )}

          {/* Special case for empty group, render as "..." */}
          {groupKey === "Common" && (
            <DropdownMenu
              trigger={
                <CustomButton icon={faEllipsisH} className={"px-4 py-1"} />
              }
              options={groupedButtons[groupKey]?.map((button) => ({
                text: button.text,
                action: button.action,
                icon: button.icon || faCogs,
              }))}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ButtonGroup;
