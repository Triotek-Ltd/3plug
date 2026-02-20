import ToastTemplates from "@/components/core/common/toast/ToastTemplates";

export const handleNext = (props) => {
  const { router, data, setForm, setData } = props;

  const currentPath = router.asPath;
  const newPath = currentPath.replace(/\/[^/]*$/, `/${data?._next}`);
  if (data?._next) {
    setForm({});
    setData({});
    router.push(newPath);
  } else {
    ToastTemplates.info("No next page found", "", "top-right");
  }
};
