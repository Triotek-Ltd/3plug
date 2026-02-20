import handleDelete from "../../list/TableTemplate/DeleteHandler";

export const handleDeleteAction = (props) => {
  const { endpoint, openModal, setLoading, navigateUp: refresh } = props;
  handleDelete({
    endpoint,
    openModal,
    setLoading,
    refresh,
  });
};
