import React from "react";
import AdvancedSection from "./AdvancedSection";
import GeneralSettings from "./GeneralSettings";
import MoreSection from "./MoreSection";

const FieldSettings = () => {
  return (
    <div className="relative bg-white ">
      <form className="grid gap-y-2">
        {/* General Settings */}
        <div className="p-2 bg-purple-50 rounded-md shadow-inner">
          <GeneralSettings />
        </div>
      </form>
    </div>
  );
};

export default FieldSettings;
