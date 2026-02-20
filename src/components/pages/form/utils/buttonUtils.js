// utils/buttonUtils.js
export const wrapButtonProperties = (button, additionalProps) => {
  const wrappedButton = {
    ...button,
    ...additionalProps,
  };
  if (button.action) {
    wrappedButton.action = (event) => {
      button.action({ ...additionalProps, event });
    };
  }
  return wrappedButton;
};
