import { useRouter } from "next/router";

export const handlePrint = () => {
  // Implement your print logic here
};

export const handleSendSMS = () => {
  // Implement your send SMS logic here
};

export const handleEmail = () => {
  // Implement your email logic here
};

export const handleJumpToField = () => {
  // Implement your jump to field logic here
};

export const handleDuplicate = (props) => {
  const { router, id, form, setForm, localConfig } = props;

  const removeIdField = (data) => {
    if (Array.isArray(data)) {
      return data
        .map(removeIdField)
        .filter((item) => item !== null && item !== undefined);
    } else if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data)
          .map(([key, value]) => {
            return [key !== "id" ? key : null, removeIdField(value)];
          })
          .filter(([key]) => key !== null)
      );
    }
    return data;
  };

  const removeNoCopyFields = (data) => {
    if (Array.isArray(data)) {
      return data
        .map(removeNoCopyFields)
        .filter((item) => item !== null && item !== undefined);
    } else if (typeof data === "object" && data !== null) {
      return Object.fromEntries(
        Object.entries(data)
          .filter(([key, value]) => {
            const fieldConfig = localConfig?.fields?.find(
              (field) => field.fieldname === key
            );
            const noCopy = fieldConfig?.no_copy;
            return !noCopy || (noCopy !== true && noCopy !== 1); // If no_copy is not true or 1, keep it
          })
          .map(([key, value]) => [key, removeNoCopyFields(value)]) // Recursively process nested objects or arrays
      );
    }
    return data;
  };

  const newForm = removeIdField(form);
  const cleanedForm = removeNoCopyFields(newForm);
  setForm(cleanedForm);

  const currentPath = router.asPath;
  const newPath = currentPath.replace(/\/[^/]*$/, "/new");

  router.push(newPath);
};

export const handleCopyToClipboard = () => {
  // Implement your copy to clipboard logic here
};

export const handleReload = () => {
  // Implement your reload logic here
};

export const handleRemindMe = () => {
  // Implement your remind me logic here
};

export const handleUndo = () => {
  // Implement your undo logic here
};

export const handleRedo = () => {
  // Implement your redo logic here
};

export const handleEditDocType = () => {
  // Implement your edit DocType logic here
};

export const handleNew = () => {
  // Implement your new material request logic here
};

// src/actions/index.js
