import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDocumentData } from "@/hooks/useDocumentData";
import { findDocDetails } from "@/utils/findDocDetails";
import ReactToPrint, { useReactToPrint } from "react-to-print";
import { fetchData } from "@/utils/Api";
import Select from "react-select";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import Modal from "@/components/core/common/modal/Modal";

const PrintModal = ({ form, onClose, isOpen }) => {
  const router = useRouter();
  const { slug, id } = router.query;
  const [config, setConfig] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [PrintComponent, setPrintComponent] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const printRef = useRef();
  const [isPreview, setIsPreview] = useState(true);
  const [prints, setPrints] = useState([]);
  const [url, setUrl] = useState(null);

  useDocumentData(slug, id, setConfig);

  useEffect(() => {
    if (config) {
      const printFormatData = findDocDetails(slug);
      if (!printFormatData) return;
      setPrintData(printFormatData);
      setSelectedFormat(config.default_print_format);
    }
  }, [config, slug]);

  useEffect(() => {
    const fetchPrints = async () => {
      try {
        const response = await fetchData({}, `print_format`);
        setPrints(response?.data?.data);
      } catch (error) {
        console.error(
          `Failed to fetch print formats: ${error.message || error}`
        );
      }
    };
    fetchPrints();
  }, [config]);

  useEffect(() => {
    if (!selectedFormat || !isOpen) return;

    const loadPrintComponent = async () => {
      try {
        setPrintComponent(null); // Reset component before loading new one
        const docData = findDocDetails(selectedFormat, "print_format");

        if (!docData) throw new Error("Failed to fetch document details");
        setUrl(docData);

        // const Component =
        //   (
        //     await import(
        //       `../../../../apps/${docData?.app_id}/${docData?.app_id}/${docData?.module_id}/print_format/${selectedFormat}/${selectedFormat}.js`
        //     )
        //   ).default || null;

        // setPrintComponent(() => Component);
      } catch (error) {
        console.error("Failed to load print format:", error);
      }
    };

    loadPrintComponent();
  }, [selectedFormat, isOpen]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforePrint: () => setIsPreview(false),
    onAfterPrint: () => setIsPreview(true),
  });

  const handlePrintClick = () => {
    setIsPreview(false);
    setTimeout(() => {
      handlePrint();
    }, 1000);
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full z-50 bg-gray-900 opacity-90 ${
          isPreview ? "hidden" : ""
        }`}
        style={{ top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}
      ></div>
      <div
        className={` ${
          isOpen
            ? "p-6 bg-white shadow-lg min-h-[85vh] w-full rounded-lg"
            : "hidden"
        }`}
      >
        <Modal isOpen={isOpen} onClose={onClose} position={"top"}>
          <div className="!w-[70vw] mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">
              Print Preview
            </h1>
            <div className="flex flex-col justify-between items-center mb-4">
              <label className="text-base w-full font-medium text-gray-700">
                Select Print Format:
              </label>
              <Select
                className="w-full"
                options={prints?.map((format) => ({
                  value: format?.id,
                  label: format?.name || format?.id,
                }))}
                value={
                  selectedFormat
                    ? { value: selectedFormat, label: selectedFormat }
                    : null
                }
                onChange={(selected) => setSelectedFormat(selected.value)}
              />
            </div>
            <div className="flex gap-4 mb-6">
              <SecondaryButton
                className={"!px-6 !text-xl"}
                onClick={handlePrintClick}
                text="Print"
              />
              <ReactToPrint content={() => printRef.current} />
            </div>
            <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-gray-50">
              {PrintComponent && printData ? (
                <div ref={printRef} className="preview-container">
                  <PrintComponent preview={isPreview} data={form} />
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  Loading print format...
                </p>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default PrintModal;
