import { getFieldsAfterBreak } from "./getFieldsAfterBreak";
import { deleteFieldsFromConfig } from "./deleteFields";
import { getFirstFieldname } from "./getFirstField";

/**
 * Delete the section and its related fields from the configuration.
 * @param {Object} localConfig - Current configuration.
 * @param {Object} section - Section to delete.
 * @param {Boolean} deleteFields - Whether to delete related fields or not.
 * @returns {Promise<Object>} - Updated configuration.
 */
const deleteSection = async (localConfig, section, deleteFields = false) => {
  const targetField =
    section.fieldname || section.prevField || getFirstFieldname(section);
  const includeField = section.fieldname || getFirstFieldname(section);
  let list;
  if (deleteFields) {
    // Delete section and related fields
    list = getFieldsAfterBreak(
      localConfig,
      targetField,
      "Section",
      !!includeField
    );
  } else {
    // Only delete the section break (no fields)
    list = [section.fieldname];
  }
  const newConfig = await deleteFieldsFromConfig(localConfig, list);
  return newConfig;
};

export default deleteSection;
