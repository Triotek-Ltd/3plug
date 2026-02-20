import React, { useState } from "react";

const TextEditorField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  hidden,
  handleInputChange,
}) => {
  const [editorContent, setEditorContent] = useState(value || "");

  const handleChange = (event) => {
    const newValue = event.target.value;
    setEditorContent(newValue);
    handleInputChange("value", newValue); // Pass the updated value back to parent
  };

  return (
    <div className="flex flex-col space-y-4" hidden={hidden}>
      <textarea
        value={editorContent}
        onChange={handleChange}
        rows={8}
        readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
        disabled={readOnly || preview}
        className="w-full p-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-800"
        placeholder="Start typing your text here..."
      />
    </div>
  );
};

export default TextEditorField;
