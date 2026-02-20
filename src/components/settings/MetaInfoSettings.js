import React, { useState, useEffect } from "react";
import { getFromDB } from "@/utils/indexedDB";

const MetaInfoSettings = () => {
  const [metaInfo, setMetaInfo] = useState({
    site_title: "",
    welcome_message: "",
    website_preview_url: "",
    website_preview_label: "",
    about_tooltip: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/workspace-settings")
      .then((response) => response.json())
      .then((data) => setMetaInfo(data?.settings || {}))
      .catch((error) => console.error("Error fetching workspace info:", error));
  }, []);

  const handleInputChange = (field, value) => {
    setMetaInfo({ ...metaInfo, [field]: value });
  };

  const handleSaveMetaInfo = async () => {
    const token = await getFromDB("authToken");
    const tenant =
      typeof window !== "undefined" ? window.location.hostname : "localhost";

    const response = await fetch("/api/workspace-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Token ${token}` : "",
        "X-Tenant": tenant,
      },
      body: JSON.stringify({ settings: metaInfo }),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus("Saved successfully.");
      return;
    }

    setStatus(data?.error || "Failed to save. Admin permissions required.");
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        value={metaInfo.site_title || ""}
        onChange={(e) => handleInputChange("site_title", e.target.value)}
        placeholder="Workspace Title"
        className="border p-2 rounded mb-2"
      />
      <textarea
        value={metaInfo.welcome_message || ""}
        onChange={(e) => handleInputChange("welcome_message", e.target.value)}
        placeholder="Welcome Message"
        className="border p-2 rounded mb-2"
      />
      <input
        type="text"
        value={metaInfo.website_preview_url || ""}
        onChange={(e) => handleInputChange("website_preview_url", e.target.value)}
        placeholder="Website Preview URL"
        className="border p-2 rounded mb-2"
      />
      <input
        type="text"
        value={metaInfo.website_preview_label || ""}
        onChange={(e) =>
          handleInputChange("website_preview_label", e.target.value)
        }
        placeholder="Website Preview Label"
        className="border p-2 rounded mb-2"
      />
      <input
        type="text"
        value={metaInfo.about_tooltip || ""}
        onChange={(e) => handleInputChange("about_tooltip", e.target.value)}
        placeholder="About Tooltip Text"
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={handleSaveMetaInfo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Workspace Info
      </button>
      {status ? <p className="mt-2 text-sm text-slate-700">{status}</p> : null}
    </div>
  );
};

export default MetaInfoSettings;
