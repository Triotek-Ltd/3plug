import { addFieldToConfig } from "./addFieldToConfig";
import { getFirstFieldname } from "./getFirstField";
import { getLastFieldname } from "./getLastFieldname";

/**
 * Add a section before or after a given field.
 * @param {Object} localConfig - Current configuration.
 * @param {Object} section - section to add a new field to.
 * @param {Boolean} top - Whether to add the section before (true) or after (false).
 * @returns {Promise<Object>} - Updated configuration.
 */
const addSection = async (localConfig, section, top = false) => {
  const { fieldname, prevField } = section;
  const firstField = getFirstFieldname(section);
  const lastFieldname = getLastFieldname(section);

  let newConfig = null;

  if (top) {
    if (prevField) {
      newConfig = await addFieldToConfig(localConfig, prevField, "Section");
    } else {
      newConfig = await addFieldToConfig(
        localConfig,
        firstField,
        "Section",
        true
      );
    }
  } else {
    const targetField = lastFieldname || fieldname || prevField;

    newConfig = await addFieldToConfig(localConfig, targetField, "Section");
  }

  return newConfig;
};

export default addSection;
