// pages/docs/index.js
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const Docs = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const [documentationData, setDocumentationData] = useState([]);

  // Function to run the Python script and fetch documentation data
  const fetchDocumentationData = async () => {
    try {
      // Trigger Python script to generate JSON file
      await fetch("/api/generateDocs");

      // Fetch the generated JSON data
      const response = await fetch("/src/components/functions/documentation/documentation_data.json");
      const data = await response.json();
      setDocumentationData(data);
    } catch (error) {
      console.error("Error fetching documentation data:", error);
    }
  };

  // Run the fetch once when the component mounts
  useEffect(() => {
    fetchDocumentationData();
  }, []);

  // Toggle the visibility of a section
  const toggleVisibility = (index) => {
    setVisibleSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="p-6 min-h-screen ">
      <div className="mx-auto bg-white shadow-lg p-6 rounded-lg ">
        <h1 className="text-2xl font-bold my-8 text-center text-purple-900">
          User Guide
        </h1>

        {documentationData.map((section, index) => (
          <div key={index} className="mb-10">
            <div
              className="flex justify-between items-center cursor-pointer bg-pink-200 p-4 rounded-lg hover:bg-pink-300 transition duration-300"
              onClick={() => toggleVisibility(index)}
            >
              <h2 id={`section-${index + 1}`} className="text-2xl font-semibold text-purple-800">
                {index + 1}. {section.sectionTitle}
              </h2>
              <FontAwesomeIcon
                icon={visibleSections[index] ? faChevronUp : faChevronDown}
                className="text-purple-600"
              />
            </div>

            <a
              href={section.sectionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline mb-4 block hover:text-green-700"
            >
              Go to Section
            </a>

            {visibleSections[index] && (
              <div className="space-y-6 mt-4">
                {section.steps.map((stepData, stepIndex) => (
                  <div key={stepIndex} className="p-4 border-l-4 border-pink-500 bg-white rounded-lg shadow-sm">
                    <h3 className="text-xl font-medium text-purple-700">
                      {stepData.step}: {stepData.title}
                    </h3>
                    <p className="mt-2 text-gray-800">
                      <strong>Description:</strong> {stepData.description}
                    </p>
                    <p className="mt-2 text-yellow-700">
                      <strong>Caution:</strong> {stepData.caution}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 mx-auto mt-12 ">
        <h2 className="text-xl font-semibold mb-4 text-purple-600">
          Quick Navigation
        </h2>
        <ul className="list-disc pl-6">
          {documentationData.map((section, index) => (
            <li key={index}>
              <a
                href={`#section-${index + 1}`}
                className="text-green-600 underline hover:text-green-700"
              >
                {section.sectionTitle}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Docs;
