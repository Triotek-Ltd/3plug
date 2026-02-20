import { registerEvent, triggerEvent } from "@/utils/events";
import { findDocDetails } from "@/utils/findDocDetails";

export function useFormEvents(form, setForm, doc, setDoc) {
  const initializeFormEvents = async (slug) => {
    if (!slug) return;
    try {
      // setPrintComponent(null); // Reset component before loading new one
      const docData = findDocDetails(slug);

      // if (!docData) throw new Error("Failed to fetch document details");
      // // setUrl(docData);

      // const { default: Setup } = await import(
      //   `../../apps/${docData?.app_id}/${docData?.app_id}/${docData?.module_id}/doctype/${slug}/${slug}.js`
      // );
      // // Setup(form, registerEvent);

      // await triggerEvent("refresh", form, setForm, doc, setDoc);
    } catch (error) {
      console.error("Failed to load print format:", error);
    }
  };

  return { initializeFormEvents };
}
