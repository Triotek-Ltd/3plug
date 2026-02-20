// AdditionalSettings.js
import React from "react";
import { useConfig } from "@/contexts/ConfigContext";

const AdditionalSettings = () => {
  const { localConfig } = useConfig();

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Additional Settings</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Track Changes
        </label>
        <input
          type="checkbox"
          checked={localConfig.track_changes || false}
          onChange={(e) => handleFieldChange("track_changes", e.target.checked)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Track Seen
        </label>
        <input
          type="checkbox"
          checked={localConfig.track_seen || false}
          onChange={(e) => handleFieldChange("track_seen", e.target.checked)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Track Views
        </label>
        <input
          type="checkbox"
          checked={localConfig.track_views || false}
          onChange={(e) => handleFieldChange("track_views", e.target.checked)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Is Virtual
        </label>
        <input
          type="checkbox"
          checked={localConfig.is_virtual || false}
          onChange={(e) => handleFieldChange("is_virtual", e.target.checked)}
          className="mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Beta</label>
        <input
          type="checkbox"
          checked={localConfig.beta || false}
          onChange={(e) => handleFieldChange("beta", e.target.checked)}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default AdditionalSettings;
