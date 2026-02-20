import ToastTemplates from "@/components/core/common/toast/ToastTemplates";

export const handlePrevious = (props) => {
  const { router, data, setForm, setData } = props;

  const currentPath = router.asPath;
  const newPath = currentPath.replace(/\/[^/]*$/, `/${data?._prev}`);

  if (data?._prev) {
    setForm({});
    setData({});
    router.push(newPath);
  } else {
    ToastTemplates.info("No next page found", "", "top-right");
  }
};
