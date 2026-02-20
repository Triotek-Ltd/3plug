// utils/customComponents.js
import React from "react";

// A registry to hold custom components
const customComponentsRegistry = {};

export const registerComponent = (key, Component) => {
  customComponentsRegistry[key] = Component;
};

export const getComponent = (key) => {
  return customComponentsRegistry[key] || null;
};

export const renderCustomComponents = (components, props) => {
  return components.map((key, index) => {
    const Component = getComponent(key);
    return Component ? <Component key={index} {...props} /> : null;
  });
};
