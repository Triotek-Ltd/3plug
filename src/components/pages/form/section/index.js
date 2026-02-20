import { useConfig } from "@/contexts/ConfigContext";
import React, { useCallback, Suspense, useEffect, useState } from "react";
import SectionItem from "./SectionItem";
import { useData } from "@/contexts/DataContext";

const Section = ({ section, handleFocus, handleBlur }) => {
  const { selectedItem } = useConfig();
  const { form } = useData();
  const [isVisible, setIsVisible] = useState(true);

  // Evaluate depends_on condition whenever form or section.depends_on changes
  useEffect(() => {
    if (section?.depends_on) {
      const visibility = evaluateDependsOn(section.depends_on, form);
      setIsVisible(visibility);
    }
  }, [form, section?.depends_on]);

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

  // If the section is not visible, return null
  if (!isVisible) return null;

  return (
    <div>
      <SectionItem
        section={section}
        handleFocus={handleFocus}
        handleBlur={handleBlur}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default Section;
