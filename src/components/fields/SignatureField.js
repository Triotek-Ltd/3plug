import React, { useRef, useState } from "react";

const SignatureField = ({
  value = "",
  onChange,
  readOnly,
  preview,
  hidden,
  handleInputChange,
}) => {
  const [signature, setSignature] = useState(value || "");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(
      e.clientX - canvasRef.current.offsetLeft,
      e.clientY - canvasRef.current.offsetTop
    );
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current.getContext("2d");
    ctx.lineTo(
      e.clientX - canvasRef.current.offsetLeft,
      e.clientY - canvasRef.current.offsetTop
    );
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const ctx = canvasRef.current.getContext("2d");
    const signatureData = canvasRef.current.toDataURL(); // Get the canvas content as a data URL
    setSignature(signatureData);
    handleInputChange("signature", signatureData);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setSignature("");
    handleInputChange("signature", "");
  };

  return (
    <div className="flex flex-col space-y-4" hidden={hidden}>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width="400"
          height="200"
          className="border border-gray-300 rounded-md bg-gray-50"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
          disabled={readOnly || preview}
        />
        {signature && (
          <img
            src={signature}
            alt="Signature Preview"
            className="absolute top-0 left-0 w-full h-full object-cover opacity-30"
          />
        )}
      </div>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={clearCanvas}
          readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
          disabled={readOnly || preview}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Clear
        </button>
        <button
          type="button"
          readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
          disabled={readOnly || preview}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignatureField;
