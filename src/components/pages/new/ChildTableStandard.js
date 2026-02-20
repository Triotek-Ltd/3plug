import DataTable from "@/components/pages/new/DataTable";
import DocLink from "@/components/pages/new/DocLink";

const ChildTableStandard = ({
  handleSelectionChange,
  name,
  doc,
  isMulti,
  placeholder,
  selected,
  setLinkResponse,
  field,
  linkResponse,
  type,
  readOnly,
  columns,
  handleDelete,
}) => {
  return (
    <>
      <div className="flex w-full items-center space-x-3">
        <div className="w-full items-center">
          <DocLink
            name={name}
            handleChange={handleSelectionChange}
            doc={doc}
            isMulti={isMulti}
            placeholder={placeholder}
            exclude={selected}
            initialData={selected}
            onLinkResponse={setLinkResponse}
            field={field}
            isNew={type === "new"}
          />
        </div>
      </div>

      <DataTable
        data={selected}
        columns={columns}
        linkResponse={linkResponse}
        onDelete={handleDelete}
        readOnly={readOnly}
        field={field}
      />
    </>
  );
};

export default ChildTableStandard;
