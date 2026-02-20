import React from "react";
import Download from "@/components/core/common/buttons/Download";
import PrintButton from "@/components/core/common/buttons/Print";
import Upload from "@/components/core/common/buttons/Upload";
import PrimaryButton1 from "@/components/core/common/buttons/Primary1";
import DeleteButton from "@/components/core/common/buttons/Delete";
import CustomButton from "@/components/core/common/buttons/Custom";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { toTitleCase } from "@/utils/textConvert";

const TableHeader = ({
  title,
  onPrint,
  onImport,
  onExport,
  onDelete,
  handleAddButtonClick,
  tableConfig,
  refresh,
}) => {
  return (
    <div className="flex flex-row justify-end w-full px-4 py-1 mb-2 bg-white border-b-0 border-b-solid rounded-t-2xl border-b-transparent">
      {/* <h1 className="text-xl font-semibold">{toTitleCase(title)}</h1> */}
      <div className="text-right flex items-center justify-end space-x-4">
        <CustomButton
          className={"!items-center py-1"}
          icon={faRefresh}
          onClick={refresh}
        />
        <button type="button" onClick={onPrint}>
          <PrintButton />
        </button>
        <button type="button" onClick={onImport}>
          <Upload />
        </button>
        <button type="button" onClick={onExport}>
          <Download />
        </button>
        <button type="button" onClick={onDelete}>
          <DeleteButton />
        </button>
        <button type="button" onClick={handleAddButtonClick}>
          <PrimaryButton1 text={`+ Add ${tableConfig.name}`} />
        </button>
      </div>
    </div>
  );
};

export default TableHeader;
