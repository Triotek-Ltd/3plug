// import { defaultButtons } from "./buttonConfig";
import { defaultButtons } from "@/components/pages/form/buttonConfig";
import * as buttonActions from "@/components/pages/form/actions";

export function useFormButtons(
  form,
  setForm,
  router,
  openModal,
  endpoint,
  setLoading,
  data,
  setData,
  slug,
  setSmsModalOpen,
  setEmailModalOpen,
  setDoc
) {
  const wrapButtonProperties = (button, additionalProps) => ({
    ...button,
    ...additionalProps,
    action: button.action
      ? (event) => button.action({ ...additionalProps, event })
      : undefined,
  });

  const sharedProps = {
    router,
    form,
    setForm,
    openModal,
    endpoint,
    setLoading,
    data,
    setData,
    slug,
    setSmsModalOpen,
    setEmailModalOpen,
  };
  const buttons = [...defaultButtons].map((button) =>
    wrapButtonProperties(button, sharedProps)
  );

  return { buttons };
}
