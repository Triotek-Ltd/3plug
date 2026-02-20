import React, { useState } from "react";
import MetaInfoSettings from "@/components/settings/MetaInfoSettings";
import LogoSettings from "@/components/settings/LogoSettings";
import SidebarSettings from "@/components/settings/SidebarSettings"; // Existing sidebar settings
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const SettingsPage = () => {
  const [isMetaInfoOpen, setIsMetaInfoOpen] = useState(true);
  const [isLogoOpen, setIsLogoOpen] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleMetaInfo = () => setIsMetaInfoOpen(!isMetaInfoOpen);
  const toggleLogo = () => setIsLogoOpen(!isLogoOpen);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="p-6 mx-6 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">Settings</h1>

      {/* Sidebar Settings */}
      <div className="mb-4 flex flex-col space-y-2">
        <div
          onClick={toggleSidebar}
          className="flex items-center cursor-pointer justify-between bg-slate-100 p-2 rounded hover:bg-slate-200 transition"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Sidebar Settings
          </h2>
          <FontAwesomeIcon
            icon={isSidebarOpen ? faChevronUp : faChevronDown}
            className="text-purple-500"
          />
        </div>
        {isSidebarOpen && <SidebarSettings />}
      </div>

      {/* Meta Info Settings */}
      <div className="mb-4 flex flex-col space-y-8">
        <div
          onClick={toggleMetaInfo}
          className="flex items-center cursor-pointer justify-between bg-slate-100 p-2 rounded hover:bg-slate-200 transition"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Meta Info Settings
          </h2>
          <FontAwesomeIcon
            icon={isMetaInfoOpen ? faChevronUp : faChevronDown}
            className="text-purple-500"
          />
        </div>
        {isMetaInfoOpen && <MetaInfoSettings />}
      </div>

      {/* Logo Settings */}
      <div className="mb-4 flex flex-col space-y-8">
        <div
          onClick={toggleLogo}
          className="flex items-center cursor-pointer justify-between bg-slate-100 p-2 rounded hover:bg-slate-200 transition"
        >
          <h2 className="text-lg font-semibold text-slate-900">
            Logo Settings
          </h2>
          <FontAwesomeIcon
            icon={isLogoOpen ? faChevronUp : faChevronDown}
            className="text-purple-500"
          />
        </div>
        {isLogoOpen && <LogoSettings />}
      </div>

      {/* Add a footer or button with a green theme if necessary */}
      {/* <div className="mt-6">
        <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition">
          Save Changes
        </button>
      </div> */}
    </div>
  );
};

export default SettingsPage;
