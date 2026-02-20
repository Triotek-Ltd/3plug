import React, { useState, useEffect } from "react";

const MetaInfoSettings = () => {
  const [metaInfo, setMetaInfo] = useState({ title: "", description: "" });

  useEffect(() => {
    // Fetch current meta info from API or configuration file
    fetch("/api/meta")
      .then((response) => response.json())
      .then((data) => setMetaInfo(data || {}))
      .catch((error) => console.error("Error fetching meta info:", error));
  }, []);

  const handleInputChange = (field, value) => {
    setMetaInfo({ ...metaInfo, [field]: value });
  };

  const handleSaveMetaInfo = () => {
    fetch("/api/meta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metaInfo),
    })
      .then((response) => {
        if (response.ok) {
        } else {
          console.error("Failed to save meta info");
        }
      })
      .catch((error) => console.error("Error saving meta info:", error));
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        value={metaInfo.title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Site Title"
        className="border p-2 rounded mb-2"
      />
      <textarea
        value={metaInfo.description}
        onChange={(e) => handleInputChange("description", e.target.value)}
        placeholder="Site Description"
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={handleSaveMetaInfo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Meta Info
      </button>
    </div>
  );
};

export default MetaInfoSettings;
