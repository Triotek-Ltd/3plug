import React, { useState, useEffect, useRef } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { toUnderscoreLowercase } from "@/utils/textConvert";
import { fetchTableData } from "@/components/pages/detail/FetchTable";
import { useNavbar } from "@/contexts/NavbarContext";
import DataTable from "@/components/pages/new/DataTable";
import Pagination from "@/components/pages/list/Pagination";
import PrintButton from "@/components/core/common/buttons/Print";
import ListColorPrint from "@/components/functions/print/ListColorPrint";
import ListDefaultPrint from "@/components/functions/print/ListDefaultPrint";
import PrintTypeModal from "@/components/core/common/modal/PrintTypeModal";
import ReactToPrint from "react-to-print";
import PrintConfirmButton from "@/components/core/common/buttons/PrintConfirm";
import { exportToExcel } from "@/utils/excelUtils";
import Download from "@/components/core/common/buttons/Download";
import { useData } from "@/contexts/DataContext";
import LabelDownload from "@/components/core/common/buttons/LabelDownload";

const DataTableView = ({ fieldData, field, columns = [], list = [] }) => {
  const { dashboardText } = useNavbar();
  const { data, setData } = useData();
  const [linkResponse, setLinkResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setEntries] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [printType, setPrintType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const componentRef = useRef();

  const fieldList = (field?.fieldlist?.split("\n") || []).map((item) => ({
    id: item,
    name: item,
  }));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let fetchedData, linkresponse;

      try {
        if (data.id) {
          if (field.readonly) {
            const response = await fetchTableData(
              field.doc.split(".").pop(),
              `${toUnderscoreLowercase(field?.related_field)}__id`,
              data.id,
              currentPage,
              itemsPerPage
            );
            fetchedData = response.data;
            linkresponse = response.linkresponse;
          } else if (field.use_list) {
            const response = await fetchTableData(
              field.doc.split(".").pop(),
              `id__in`,
              list,
              currentPage,
              itemsPerPage
            );
            fetchedData = response.data;
            linkresponse = response.linkresponse;
          } else {
            const response = await fetchTableData(
              field.doc.split(".").pop(),
              `${field.doc.split(".").pop()}s${dashboardText}__id`,
              data.id,
              currentPage,
              itemsPerPage
            );
            fetchedData = response.data;
            linkresponse = response.linkresponse;
          }
        }

        if (fetchedData) {
          setEntries(fetchedData.total);
          const calculatedTotalPages = Math.ceil(
            fetchedData?.total / itemsPerPage
          );
          setData((prevData) => ({
            ...prevData,
            [field.id]: fetchedData?.list || [],
          }));

          setLinkResponse(linkresponse);
          setTotalPages(calculatedTotalPages);
        }
      } catch (error) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [field, data.id, currentPage, itemsPerPage, dashboardText]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const handlePrintTypeSelect = (type) => {
    setPrintType(type);
    setIsModalOpen(false);
    setModalIsOpen(true);
  };

  const handleExcelDownload = () => {
    if (!data[field.id]) return;

    // Filter out the 'created_at' and 'modified_at' columns
    const filteredData = data[field.id].map((row) => {
      const { created_at, modified_at, ...rest } = row;
      return rest;
    });
    exportToExcel(filteredData, field.name);
  };

  const handleLabelDownload = async () => {
    if (!data[field.id]) return;

    const zip = new JSZip();
    const barcodeImages = data[field.id]
      .filter((row) => row.barcode) // Only entries with a barcode field
      .map((row, index) => ({
        url: row.barcode,
        name: `${row.id}.png`,
      }));

    const imagePromises = barcodeImages.map((barcode) => {
      const barcodeUrl =
        typeof barcode.url === "string"
          ? barcode.url
              .replace("/media", "/apis/media") // Replace /media with /apis/media
              .replace("http://masafa", "https://masafa") // Replace http:// with https://
          : barcode.url;

      return fetch(barcodeUrl)
        .then((response) => response.blob())
        .then((blob) => {
          zip.file(barcode.name, blob);
        });
    });

    await Promise.all(imagePromises);

    // Generate zip and download
    zip.generateAsync({ type: "blob" }).then((blob) => {
      saveAs(blob, `${data.id}_labels.zip`);
    });
  };

  if (loading) return <div>Loading data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <div className="flex flex-col w-full justify-between items-end">
        <div className="flex">
          <button
            type="button"
            className="mr-4"
            onClick={() => setIsModalOpen(true)}
          >
            <PrintButton />
          </button>
          {field.id === "items" && (
            <button
              type="button"
              className="mr-4"
              onClick={handleLabelDownload}
            >
              <LabelDownload />
            </button>
          )}
          <button type="button" className="mr-8" onClick={handleExcelDownload}>
            <Download />
          </button>
        </div>
        <DataTable
          data={data[field.id]}
          linkResponse={linkResponse}
          readOnly={true}
          field={field}
          columns={columns}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        total_entries={totalEntries}
      />

      {/* Hidden content for printing */}
      {printType && data[field.id] && (
        <ReactToPrint
          trigger={() => (
            <div>
              <PrintConfirmButton
                modalIsOpen={modalIsOpen}
                setModalIsOpen={setModalIsOpen}
              />
            </div>
          )}
          content={() => componentRef.current}
        />
      )}

      {data[field.id] && (
        <div className="hidden">
          {printType === "default" ? (
            <ListDefaultPrint
              ref={componentRef}
              data={data[field.id]}
              fields={fieldList}
              title={field.name}
              filters={[]}
              load={modalIsOpen}
            />
          ) : (
            <ListColorPrint
              ref={componentRef}
              data={data[field.id]}
              fields={fieldList}
              title={field.name}
              filters={[]}
              load={modalIsOpen}
            />
          )}
        </div>
      )}

      <PrintTypeModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onSelectPrintType={handlePrintTypeSelect}
      />
    </>
  );
};

export default DataTableView;
