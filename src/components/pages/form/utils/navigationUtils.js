// utils/navigationUtils.js
export const navigateUp = (router) => {
  const currentPath = router.asPath;
  const segments = currentPath.split("/").filter(Boolean);
  if (segments.length > 1) {
    segments.pop();
  }
  const newPath = `/${segments.join("/")}`;
  router.push(newPath);
};

export const reloadData = (router) => {
  router.reload();
};
