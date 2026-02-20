import React, { useState } from "react";

const QRCodeField = ({ value, onChange, readOnly }) => {
  const qrCodeUrl = value
    ? `/api/qrcode?text=${encodeURIComponent(value)}`
    : "";

  return (
    <div className="p-4 w-full bg-gray-100 rounded-md">
      {!readOnly && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded-md w-full"
          placeholder="Enter text to generate QR code"
        />
      )}
      {qrCodeUrl && (
        <div className="flex flex-row items-center">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="p-1 bg-white rounded-md w-48 h-48"
          />
          <div className="flex flex-col items-center p-4">
            <a
              href={qrCodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-purple-600"
            >
              Open QR Image
            </a>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-purple-600"
            >
              Open URL
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeField;
