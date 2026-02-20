import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp, Eye, Pencil } from "lucide-react";

const MarkdownEditorField = ({
  value = "",
  onChange,
  readOnly,
  hidden,
  placeholder = "Enter Markdown content...",
}) => {
  const [editorValue, setEditorValue] = useState(value);
  const [rows, setRows] = useState(8);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (e) => {
    setEditorValue(e.target.value);
    if (onChange) onChange(e);
  };

  const expand = () => setRows((prev) => prev + 4);
  const collapse = () => setRows((prev) => (prev > 4 ? prev - 4 : 4));

  if (hidden) return null;

  return (
    <div className="flex flex-col space-y-2 w-full border border-gray-300 rounded-md p-2 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {!readOnly && (
            <>
              <button
                type="button"
                onClick={expand}
                className="p-1 rounded hover:bg-gray-100"
                title="Expand"
              >
                <ChevronDown size={16} className="text-blue-500" />
              </button>
              <button
                type="button"
                onClick={collapse}
                className="p-1 rounded hover:bg-gray-100"
                title="Collapse"
              >
                <ChevronUp size={16} className="text-red-500" />
              </button>
            </>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setShowPreview(false)}
            className={`p-1 rounded hover:bg-gray-100 ${
              !showPreview ? "bg-gray-200" : ""
            }`}
            title="Edit"
          >
            <Pencil size={16} className="text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className={`p-1 rounded hover:bg-gray-100 ${
              showPreview ? "bg-gray-200" : ""
            }`}
            title="Preview"
          >
            <Eye size={16} className="text-gray-700" />
          </button>
        </div>
      </div>

      {!showPreview ? (
        <textarea
          value={editorValue}
          readOnly={readOnly}
          disabled={readOnly}
          onChange={handleChange}
          rows={rows}
          className="p-2 text-sm w-full border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder={placeholder}
        />
      ) : (
        <div className="prose prose-sm w-full p-2 border border-gray-200 rounded bg-gray-50 min-h-[100px]">
          <ReactMarkdown>{editorValue || "*Nothing to preview*"}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownEditorField;
