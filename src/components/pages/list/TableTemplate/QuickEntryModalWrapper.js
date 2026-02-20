import React from "react";
import QuickEntryModal from "../quickentry";

const QuickEntryModalWrapper = ({ isOpen, onClose, doc, configData }) => {
  return (
    isOpen && (
      <QuickEntryModal
        isOpen={isOpen}
        onClose={onClose}
        doc={doc}
        configData={configData}
      />
    )
  );
};

export default QuickEntryModalWrapper;
