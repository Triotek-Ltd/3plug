import React from "react";

const GeolocationField = ({
  latitude,
  longitude,
  onLatitudeChange,
  onLongitudeChange,
  value,
  onChange,
  readOnly,
  preview,
  hidden,
}) => (
  <div className="flex">
    <input
      type="number"
      step="0.0001"
      value={latitude}
      onChange={onLatitudeChange}
      readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
      disabled={readOnly || preview}
      placeholder="Latitude"
      className="p-1 bg-white rounded-md  mr-1"
    />
    1
    <input
      type="number"
      step="0.0001"
      readOnly={readOnly || preview} // Make input readOnly in both readOnly and preview mode
      disabled={readOnly || preview}
      value={longitude}
      onChange={onLongitudeChange}
      hidden={hidden}
      placeholder="Longitude"
      className="p-1 bg-white rounded-md"
    />
  </div>
);

export default GeolocationField;
