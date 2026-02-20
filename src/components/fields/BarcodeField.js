import React, { useState } from "react";

const BarcodeField = ({ value, onChange, readOnly }) => {
  const barcodeUrl = value
    ? `/api/barcode?text=${encodeURIComponent(value)}`
    : "";

  return (
    <div className="p-4 bg-gray-100 w-full rounded-md">
      {!readOnly && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter text to generate barcode"
        />
      )}
      {barcodeUrl && (
        <div className="flex flex-col items-center">
          <img
            src={barcodeUrl}
            alt="Barcode"
            className="p-1 bg-white rounded-md w-64 h-40"
          />
          <a
            href={barcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-purple-600"
          >
            Open Barcode Image
          </a>
        </div>
      )}
    </div>
  );
};

export default BarcodeField;
