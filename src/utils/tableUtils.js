import ToastTemplates from "@/components/core/common/toast/ToastTemplates";
import { deleteData, postData } from "./Api";

export const deleteSelectedRows = async (
  config,
  endpoint,
  selectedRows,
  openModal,
  setLoading,
  refresh
) => {
  let response = null;
  openModal({
    title: "Confirm Deletion",
    message: `Are you sure you want to delete the selected ${selectedRows.length} item(s)? This action cannot be undone.`,
    confirmButtonStyles: "bg-red-500 hover:bg-red-600 text-white",
    onConfirm: async () => {
      try {
        setLoading(true);
        if (config.name) {
          response = await postData(
            { model_name: config.name, ids: selectedRows },
            "bulkdelete"
          );
        } else if (endpoint) {
          for (let i = 0; i < selectedRows.length; i++) {
            await deleteData(`${endpoint}/${selectedRows[i]}`);
          }
          response = { success: true };
        }
        if (response) {
          ToastTemplates.success("Items deleted successfully.");
          setLoading(false);
          refresh();
          return response;
        } else {
          setLoading(false);
          ToastTemplates.error("Failed to delete. Please try again.");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error deleting item:", error);
        ToastTemplates.error("An error occurred while deleting the item.");
      }
    },
  });
};

export const uploadData = async (config, endpoint, data) => {
  const response = await postData(data, endpoint);
  if (response) {
    return response;
  }
};
