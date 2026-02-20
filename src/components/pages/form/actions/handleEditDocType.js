export const handleEditDocType = (props) => {
  const { router, slug } = props;
  const newPath = `/documents/${slug}`;

  router.push(newPath);
};
