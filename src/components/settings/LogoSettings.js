import React, { useState, useEffect } from "react";

const LogoSettings = () => {
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {
    // Fetch logo URL from API or configuration
    fetch("/api/logo")
      .then((response) => response.json())
      .then((data) => setLogoUrl(data.logo || ""))
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  const handleSaveLogo = () => {
    fetch("/api/logo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logo: logoUrl }),
    })
      .then((response) => {
        if (response.ok) {
        } else {
          console.error("Failed to update logo");
        }
      })
      .catch((error) => console.error("Error updating logo:", error));
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        value={logoUrl}
        onChange={(e) => setLogoUrl(e.target.value)}
        placeholder="Logo URL"
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={handleSaveLogo}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Logo
      </button>
    </div>
  );
};

export default LogoSettings;
