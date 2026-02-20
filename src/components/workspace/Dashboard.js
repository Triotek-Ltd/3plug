import React, { useState, useEffect } from "react";
import {
  faHome,
  faInfoCircle,
  faImages,
  faHandsHelping,
  faBook,
  faBookOpen,
  faBookReader,
  faBox,
  faUsers,
  faChartLine,
  faEnvelope,
  faExternalLinkAlt, // Better icon for external links
} from "@fortawesome/free-solid-svg-icons";
import LinkSection from "@/components/workspace/LinkSection";
import LinkCard from "@/components/workspace/LinkCard";
import config from "@/data/config.json";

const Dashboard = () => {
  const [appModules, setAppModules] = useState([]);

  useEffect(() => {
    setAppModules(config);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Header Section */}
      <div className="w-full mx-4 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500">
        <h1 className="text-3xl font-bold text-white">Destiny Care Home CMS</h1>
        <p className="text-lg text-white opacity-90">
          Welcome to the Content Management System for Destiny Care Home.
        </p>
      </div>
      <div className="w-full px-6 mt-6 flex justify-end">
        <a
          href="https://www.destinycarehome.org" // Replace with the actual website URL
          target="_blank" // Open in a new tab
          rel="noopener noreferrer" // Security best practice
          className="flex items-center space-x-2 px-6 py-3 bg-pink-100 border border-purple-200 rounded-lg shadow-sm hover:shadow-md hover:border-purple-400 hover:bg-pink-200 transition-all duration-300"
        >
          <span className="text-sm font-semibold text-purple-700">
            Website Preview
          </span>
          <svg
            className="w-4 h-4 text-purple-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
        </a>
      </div>

      {/* Quick Stats Section */}
      <div className="w-full px-6 py-4">
        <h6 className="text-xl font-bold text-gray-800">Quick Stats</h6>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600">Total Visitors</p>
            <p className="text-2xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600">New Messages</p>
            <p className="text-2xl font-bold text-green-600">12</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600">Total Services</p>
            <p className="text-2xl font-bold text-purple-600">8</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600">Media Files</p>
            <p className="text-2xl font-bold text-pink-600">56</p>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="w-full px-3 mt-4">
        <h6 className="pl-3 ml-2 text-sm font-bold leading-tight text-pink-900 uppercase opacity-90">
          Quick Links
        </h6>
        <div className="grid grid-cols-2 md:grid-cols-4 px-4 py-2 gap-4">
          <LinkCard
            title="Home"
            icon={faHome}
            href="/app/page/home"
            iconBg="bg-gradient-to-tl from-blue-400 to-green-500"
            bgColor="bg-white"
            tooltipContent="Go to Home"
          />
          <LinkCard
            title="About"
            icon={faInfoCircle}
            href="/app/page/about"
            iconBg="bg-gradient-to-tl from-blue-400 to-green-500"
            bgColor="bg-white"
            tooltipContent="About Destiny Care Home"
          />
          <LinkCard
            title="Services"
            icon={faHandsHelping}
            href="/app/page/services"
            iconBg="bg-gradient-to-tl from-blue-400 to-green-500"
            bgColor="bg-white"
            tooltipContent="View Services"
          />
          <LinkCard
            title="Gallery"
            icon={faImages}
            href="/app/page/gallery"
            iconBg="bg-gradient-to-tl from-blue-400 to-green-500"
            bgColor="bg-white"
            tooltipContent="View Gallery"
          />
        </div>
      </div>

      {/* Module List Section */}
      <div className="w-full px-3 mt-6">
        <h6 className="pl-3 ml-2 text-sm font-bold leading-tight text-gray-800 uppercase opacity-90">
          Module List
        </h6>
        <div className="grid grid-cols-2 md:grid-cols-4 px-4 py-2 gap-4">
          {Object.keys(appModules).map((appName, index) => (
            <LinkCard
              key={index}
              title={`${appName.charAt(0).toUpperCase() + appName.slice(1)}`}
              icon={faBox}
              href={`/${appName}`}
              iconBg="bg-gradient-to-tl from-green-400 to-blue-500"
              bgColor="bg-white"
              tooltipContent={`Manage ${appName}`}
            />
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="w-full px-6 py-4">
        <h6 className="text-xl font-bold text-gray-800">Recent Activity</h6>
        <div className="mt-4 bg-white rounded-lg shadow-md p-4">
          <ul className="space-y-3">
            <li className="flex items-center space-x-3">
              <span className="text-green-500">✔</span>
              <p className="text-sm text-gray-700">
                Updated the "About Us" page.
              </p>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-blue-500">📤</span>
              <p className="text-sm text-gray-700">
                Uploaded 5 new images to the Gallery.
              </p>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-yellow-500">⚠</span>
              <p className="text-sm text-gray-700">
                2 new messages require attention.
              </p>
            </li>
          </ul>
        </div>
      </div>

      {/* Link Sections for Modules */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(appModules).map((appName) => (
          <LinkSection
            key={appName}
            title={`${
              appName.charAt(0).toUpperCase() + appName.slice(1)
            } Modules`}
            description={`Manage modules for ${
              appName.charAt(0).toUpperCase() + appName.slice(1)
            }.`}
            tooltipContent={`Manage modules for ${
              appName.charAt(0).toUpperCase() + appName.slice(1)
            }.`}
            links={appModules[appName].modules.map((module) => ({
              href: `/${appName}/${module.moduleName}`,
              text: `${
                module.moduleName.charAt(0).toUpperCase() +
                module.moduleName.slice(1)
              }`,
              icon: faBox,
            }))}
            bgColor="bg-gradient-to-tl from-blue-200 to-green-200"
            textColor="text-gray-900"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
