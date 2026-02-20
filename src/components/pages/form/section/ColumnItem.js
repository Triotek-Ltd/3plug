import React, { Suspense, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useConfig } from "@/contexts/ConfigContext";
import FieldItem from "../FieldItem";
import { useData } from "@/contexts/DataContext";

const ColumnItem = ({ section, column, handleFocus, handleBlur }) => {
  const { selectedItem, localConfig, selectedTab, setLocalConfig } =
    useConfig();
  const { form } = useData();
  const [isVisible, setIsVisible] = useState(true);

  // Evaluate depends_on condition whenever form or column.depends_on changes
  useEffect(() => {
    if (column?.depends_on) {
      const visibility = evaluateDependsOn(column.depends_on, form);
      setIsVisible(visibility);
    }
  }, [form, column?.depends_on]);

  // Function to evaluate depends_on condition
  const evaluateDependsOn = (dependsOn, form) => {
    try {
      // If form is null, return true to make the section visible by default
      if (!form) return true;
  
      const match = dependsOn.match(/^\s*(\w+)\s*(!=|==)\s*(['"]?)(.*?)\3\s*$/);
      if (!match) {
        console.error("Invalid depends_on condition format:", dependsOn);
        return true;
      }
  
      const [, key, operator, , value] = match;
      const formValue = form[key.trim()];
  
      if (operator === "!=") {
        return formValue !== value;
      } else if (operator === "==") {
        return formValue === value;
      }
      return true;
    } catch (error) {
      console.error("Error evaluating depends_on condition:", error);
      return true;
    }
  };

  // If the column is not visible, return null
  if (!isVisible) return null;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={clsx("flex-1 rounded-md")}>
        {column?.label && (
          <div className="flex flex-row w-full h-fit justify-between">
            <h5 className="text-md font-semibold p-2">{column.label}</h5>
          </div>
        )}

        {/* Render draggable items inside the column */}
        {column?.fields?.map((item) => (
          <Suspense fallback={<div>Loading...</div>} key={item.fieldname}>
            <FieldItem
              item={item}
              handleFocus={handleFocus}
              handleBlur={handleBlur}
            />
          </Suspense>
        ))}
      </div>
    </Suspense>
  );
};

export default ColumnItem;
