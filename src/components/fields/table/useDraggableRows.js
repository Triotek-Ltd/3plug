import { useState, useCallback } from "react";

export const useDraggableRows = (tableData, orderField, setTableData) => {
  const [draggedRowIndex, setDraggedRowIndex] = useState(null);

  const handleDragStart = useCallback((index) => {
    setDraggedRowIndex(index);
  }, []);

  const handleDragOver = useCallback((event) => {
    event.preventDefault(); // Allow drop
  }, []);

  const handleDrop = useCallback(
    (dropIndex) => {
      if (draggedRowIndex === null || draggedRowIndex === dropIndex) return;

      // Clone tableData and rearrange rows based on drag-and-drop
      const updatedData = [...tableData];
      const [draggedRow] = updatedData.splice(draggedRowIndex, 1); // Remove dragged row
      updatedData.splice(dropIndex, 0, draggedRow); // Insert at dropIndex

      // Update the orderField for each row
      updatedData.forEach((row, index) => {
        row[orderField] = index + 1; // Assuming orderField starts from 1
      });

      setTableData(updatedData);
      setDraggedRowIndex(null); // Reset draggedRowIndex
    },
    [draggedRowIndex, tableData, orderField, setTableData]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedRowIndex(null); // Reset draggedRowIndex after drag operation
  }, []);

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
};
