import React from "react";
import { faBox, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import LinkSection from "@/components/workspace/LinkSection";
import LinkCard from "@/components/workspace/LinkCard";
import { useRouter } from "next/router";
import {
  getDocsByModule,
  getDocsByModuleOrApp,
  getModuleById, // Create a function to get a single module by ID
} from "../../utils/generateSidebarData";
import { toTitleCase } from "@/utils/textConvert";

const ModuleDashboard = () => {
  const router = useRouter();
  const { id } = router.query; // Get app ID and module ID from the URL

  // Retrieve documents for the current module
  const coreDocs = module ? getDocsByModule(id) || [] : [];

  const generateDocLinks = (docList) => {
    return docList?.map((doc) => ({
      href: `/app/${doc.id}`, // Generate link using doc ID
      icon: faFileInvoice,
      text: `${doc.name}`, // Capitalize document name
    }));
  };

  return (
    <div className="flex flex-col space-y-6 w-full px-6">
      {/* Module Info Section */}
      <div className="mb-1">
        <h2 className="text-2xl font-semibold">{id && toTitleCase(id)}</h2>
        <p className="text-gray-600">
          {/* Manage and view all documents related to {module.name}. */}
        </p>
      </div>

      {/* Document Section */}
      <div>
        {/* <h3 className="text-xl font-medium mb-4">{module.name} Documents</h3> */}
        <LinkSection
          title={``}
          description={``}
          links={generateDocLinks(coreDocs)} // Us to build links
          bgColor="bg-gray-100"
          textColor="text-gray-900"
          className="rounded-lg p-4 shadow-sm bg-white"
          cols={6}
        />
      </div>
    </div>
  );
};

export default ModuleDashboard;
