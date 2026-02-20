// utils/customActions.js
const customActionsRegistry = {};

export const registerAction = (key, action) => {
  customActionsRegistry[key] = action;
};

export const getAction = (key) => {
  return customActionsRegistry[key] || null;
};

export const executeAction = (key, props) => {
  const action = getAction(key);
  if (action) {
    action(props);
  }
};
