export const handlePrint = (props) => {
  const { router } = props;

  const currentPath = router.asPath;
  const newPath = `${currentPath}/print`;

  router.push(newPath);
};
