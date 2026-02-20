import React from "react";
import { deleteData } from "@/utils/Api";
import ToastTemplates from "@/components/core/common/toast/ToastTemplates";

const handleDelete = async ({
  id,
  endpoint,
  openModal,
  setLoading,
  refresh,
}) => {
  return openModal({
    title: "Confirm Deletion",
    message:
      "Are you sure you want to delete this item? This action cannot be undone.",
    confirmButtonStyles: "bg-red-500 hover:bg-red-600 text-white",
    onConfirm: async () => {
      try {
        setLoading(true);
        const url = id ? `${endpoint}/${id}` : endpoint;
        const response = await deleteData(url);
        if (response) {
          ToastTemplates.success(
            response.success || response.message || "Item deleted successfully."
          );
          refresh();
        } else {
          ToastTemplates.error("Failed to delete the item. Please try again.");
          setLoading(false);
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        ToastTemplates.error(
          "An error occurred while deleting the item.",
          error.toString()
        );
        setLoading(false);
      } finally {
        setLoading(false); // Ensure loading state is reset
      }
    },
  });
};

export default handleDelete;
