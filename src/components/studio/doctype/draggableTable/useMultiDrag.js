import { useState } from "react";

const useMultiDrag = () => {
  const [selectedIndices, setSelectedIndices] = useState([]);

  const toggleSelect = (index) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const moveRow = (fromIndex, toIndex, orderedFields) => {
    const updatedFields = [...orderedFields];
    const [movedRow] = updatedFields.splice(fromIndex, 1);

    // Handle multi-row dragging
    if (selectedIndices.includes(fromIndex)) {
      selectedIndices.forEach((selectedIndex) => {
        if (selectedIndex !== fromIndex) {
          const row = orderedFields[selectedIndex];
          updatedFields.splice(toIndex, 0, row);
        }
      });
    }

    updatedFields.splice(toIndex, 0, movedRow);
    return updatedFields;
  };

  return { selectedIndices, toggleSelect, moveRow };
};

export default useMultiDrag;
