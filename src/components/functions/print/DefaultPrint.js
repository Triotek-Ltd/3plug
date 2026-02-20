import React, { forwardRef } from "react";

const DefaultPrintFormat = forwardRef(({ data, preview = true }, ref) => {
  return (
    <div ref={ref} className="default-print-format p-6 bg-white print:p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Document Details</h1>
      <div className="border-t border-b border-gray-300 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-sm font-medium text-gray-700">Document ID:</div>
          <div className="text-sm text-gray-900">{data?.id || "N/A"}</div>
          <div className="text-sm font-medium text-gray-700">
            Document Name:
          </div>
          <div className="text-sm text-gray-900">{data?.name || "N/A"}</div>
          <div className="text-sm font-medium text-gray-700">Created On:</div>
          <div className="text-sm text-gray-900">{data?.created || "N/A"}</div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Details</h2>
        <p className="text-sm text-gray-700">
          {data?.details || "No additional details available."}
        </p>
      </div>
      {preview && (
        <div className="mt-6 text-center text-sm text-gray-500 print:hidden">
          This is a preview. Click "Print" to generate the document.
        </div>
      )}
    </div>
  );
});

export default DefaultPrintFormat;
