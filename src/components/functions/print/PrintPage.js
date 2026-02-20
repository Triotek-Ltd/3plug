import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useDocumentData } from "@/hooks/useDocumentData";
import { useData } from "@/contexts/DataContext";
import { findDocDetails } from "@/utils/findDocDetails";
import { useReactToPrint } from "react-to-print";
import PrimaryButton from "@/components/core/common/buttons/Primary";
import { fetchData } from "@/utils/Api";
import Select from "react-select";
import SecondaryButton from "@/components/core/common/buttons/Secondary";
import DefaultPrintFormat from "./DefaultPrint";

const PrintPage = () => {
  const router = useRouter();
  const { slug, id } = router.query;
  const [config, setConfig] = useState(null);
  const [printData, setPrintData] = useState(null);
  const [PrintComponent, setPrintComponent] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState("");
  const printRef = useRef(null); // Initialize with null
  const [isPreview, setIsPreview] = useState(true);
  const [prints, setPrints] = useState([]);
  const [url, setUrl] = useState(null);

  const { form } = useData();
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
    if (!selectedFormat) return;

    const loadPrintComponent = async () => {
      try {
        setPrintComponent(null); // Reset component before loading new one
        const docData = findDocDetails(selectedFormat, "print_format");

        if (!docData) throw new Error("Failed to fetch document details");
        setUrl(docData);

        // const Component = (
        //   await import(
        //     `../../../../apps/${docData?.app_id}/${docData?.app_id}/${docData?.module_id}/print_format/${selectedFormat}/${selectedFormat}.js`
        //   )
        // ).default;

        // setPrintComponent(() => Component);
      } catch (error) {
        console.error("Failed to load print format:", error);
      }
    };

    loadPrintComponent();
  }, [selectedFormat]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const handlePrintClick = () => {
    setIsPreview(false);

    // If no PrintComponent is loaded, trigger the default browser print dialog
    if (!PrintComponent) {
      window.print();
      return;
    }

    // Otherwise, use react-to-print
    setTimeout(() => {
      handlePrint();
    }, 1000);
  };

  return (
    <>
      {/* <div
        className={`fixed top-0 left-0 w-full h-full z-50 bg-gray-900 opacity-90 ${
          isPreview ? "hidden" : ""
        }`}
        style={{ top: 0, left: 0, width: "100%", height: "100%", zIndex: 9999 }}
      ></div> */}
      <div className="p-6 bg-white shadow-lg min-h-[85vh] rounded-lg">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Print Preview</h1>
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
          </div>
          <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-gray-50">
            <div ref={printRef} className="preview-container">
              {PrintComponent && printData ? (
                <PrintComponent preview={isPreview} data={form} />
              ) : (
                <DefaultPrintFormat preview={isPreview} data={form} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintPage;
