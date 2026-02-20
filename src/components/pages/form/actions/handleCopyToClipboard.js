import ToastTemplates from "@/components/core/common/toast/ToastTemplates";

export const handleCopyToClipboard = (props) => {
  try {
    const dataToCopy = JSON.stringify(props?.data, null, 2); // Convert props to a readable JSON string
    navigator.clipboard
      .writeText(dataToCopy)
      .then(() => {
        ToastTemplates.success("Copied to clipboard");
      })
      .catch((error) => {
        console.error("Failed to copy data to clipboard: ", error);
      });
  } catch (error) {
    console.error("An error occurred while copying to clipboard: ", error);
  }
};
