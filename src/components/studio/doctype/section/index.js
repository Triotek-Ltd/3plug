import { useConfig } from "@/contexts/ConfigContext";
import React, { useCallback, Suspense } from "react";
import SectionItem from "./SectionItem";

const Section = ({ section, handleFocus, handleBlur }) => {
  const { selectedItem } = useConfig();

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
