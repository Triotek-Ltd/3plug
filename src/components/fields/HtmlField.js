import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Dynamically import to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const HtmlEditorField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  hidden,
  placeholder = "Enter HTML content here...",
}) => {
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleEditorChange = (content) => {
    setEditorValue(content);
    if (onChange) onChange({ target: { value: content } });
  };

  return (
    <div className={`flex flex-col space-y-2 w-full ${hidden ? "hidden" : ""}`}>
      {!preview ? (
        <ReactQuill
          value={editorValue}
          onChange={handleEditorChange}
          readOnly={readOnly}
          theme={readOnly ? "bubble" : "snow"}
          placeholder={placeholder}
          className="w-full"
        />
      ) : (
        <div
          className="prose prose-sm w-full"
          dangerouslySetInnerHTML={{ __html: editorValue }}
        />
      )}
    </div>
  );
};

export default HtmlEditorField;
