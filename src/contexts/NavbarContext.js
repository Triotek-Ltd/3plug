import React, { createContext, useContext, useState } from "react";

// Create context
const NavbarContext = createContext();

// Custom hook to use the context
export const useNavbar = () => {
  return useContext(NavbarContext);
};

// Context provider component
export const NavbarProvider = ({ children }) => {
  const [dashboardText, setDashboardText] = useState("Home");
  const [pagesText, setPagesText] = useState("Dashboard");
  const [textColor, setTextColor] = useState("text-gray-800");
  const [iconColor, setIconColor] = useState("text-purple-900");

  const [navLinks, setNavLinks] = useState([{ text: "Home", link: "/" }]);

  const [pageInfo, setPageInfo] = useState({ text: "Home", link: "/" });

  const updateDashboardText = (newText) => setDashboardText(newText);

  const updatePagesText = (newText) => setPagesText(newText);

  const updateTextColor = (newColor) => setTextColor(newColor);

  const updateIconColor = (newColor) => setIconColor(newColor);

  const updateNavLinks = (newLinks) => setNavLinks(newLinks);

  const updatePageInfo = (newPageInfo) => setPageInfo(newPageInfo);
  // Combine all values to provide through context
  const contextValues = {
    dashboardText,
    updateDashboardText,
    pagesText,
    updatePagesText,
    textColor,
    updateTextColor,
    iconColor,
    updateIconColor,
    navLinks,
    updateNavLinks,
    pageInfo,
    updatePageInfo,
  };

  return (
    <NavbarContext.Provider value={contextValues}>
      {children}
    </NavbarContext.Provider>
  );
};
