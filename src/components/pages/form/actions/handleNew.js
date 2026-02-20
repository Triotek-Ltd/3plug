export const handleNew = (props) => {
  const { router, setForm } = props;

  setForm({});

  const currentPath = router.asPath;
  const newPath = currentPath.replace(/\/[^/]*$/, "/new");

  router.push(newPath);
};
