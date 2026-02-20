import React from "react";

const HeadingField = ({ text, value, onChange, readOnly, preview, hidden }) => (
  <h3
    className="text-lg font-bold"
    readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
    disabled={readOnly || preview}
    hidden={hidden}
  >
    {text}
  </h3>
);

export default HeadingField;
