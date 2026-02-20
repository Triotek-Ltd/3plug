import { findDocDetails } from "@/utils/findDocDetails";
import { importFile } from "@/utils/importFile";

export const fetchDocumentData = async (slug) => {
  try {
    // Fetch document details
    const docData = findDocDetails(slug);
    if (!docData) throw new Error("Failed to fetch document details");

    // Fetch configuration data
    const configData = await importFile(slug, `${slug}.json`);
    if (!configData) throw new Error("Failed to load configuration");

    // Extract field order and fields from the configData
    const fieldOrder = configData.content?.field_order || [];
    const fields = configData.content?.fields || [];

    // Map fields to columns to display in the QuickEntry
    const columns = fieldOrder
      .map((fieldName) => {
        const field = fields.find((f) => f.fieldname === fieldName);
        return field && field.in_list_view === 1
          ? { label: field.label, fieldname: field.fieldname }
          : null;
      })
      .filter((column) => column !== null);

    return { columns, configData }; // Returning both columns and configData
  } catch (error) {
    console.error("Error fetching document data:", error.message);
    return { columns: [], configData: null }; // Return null for configData in case of error
  }
};
