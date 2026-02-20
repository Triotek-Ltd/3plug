import Download from "@/components/core/common/buttons/Download";
import PrintButton from "@/components/core/common/buttons/Print";
import Upload from "@/components/core/common/buttons/Upload";
import React from "react";

const TableActions = ({ onPrint, onImport, onExport, onDelete }) => {
  return (
    <div className="px-3 text-right flex items-center space-x-4">
      {/* <button type="button" onClick={onPrint}>
        <PrintButton />
      </button> */}
      <button type="button" onClick={onImport}>
        <Upload />
      </button>
      <button type="button" onClick={onExport}>
        <Download />
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default TableActions;
