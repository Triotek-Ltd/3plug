import React, { useEffect, useState, useRef } from "react";
import { toTitleCase } from "@/utils/textConvert";
import DataTableView from "@/components/pages/detail/DataTableView";

const CONTENT_PADDING = 20;
const PAGE_HEIGHT = 297; // A4 size in mm
const PAGE_WIDTH = 210;
const CONTENT_HEIGHT_RATIO = 0.4;
const PAGE_HEIGHT_PX = PAGE_HEIGHT * 3.77953; // Conversion to px
const PAGE_WIDTH_PX = PAGE_WIDTH * 3.77953;
const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX * CONTENT_HEIGHT_RATIO;

const DocumentPrint = React.forwardRef(({ fields, data }, ref) => {
  const [pages, setPages] = useState([]);
  const contentRef = useRef(null);

  const calculatePages = () => {
    if (!contentRef.current) return;

    // Duplicate data for testing
    const duplicatedData = [];
    for (let i = 0; i < 5; i++) {
      duplicatedData.push(...fields);
    }

    const contentContainer = contentRef.current;
    const contentHeight = contentContainer.scrollHeight;
    const content = contentContainer.innerHTML;

    const pagesArr = [];
    let remainingContent = content;
    let currentHeight = 0;

    // Create a container to measure content
    const tempContainer = document.createElement("div");
    tempContainer.style.width = `${PAGE_WIDTH_PX}px`;
    tempContainer.style.padding = `${CONTENT_PADDING}px`;
    tempContainer.style.boxSizing = "border-box";
    tempContainer.style.visibility = "hidden";
    document.body.appendChild(tempContainer);

    const measureContent = (content) => {
      tempContainer.innerHTML = content;
      return tempContainer.scrollHeight;
    };

    while (remainingContent) {
      const pageContent = remainingContent;
      const pageHeight = measureContent(pageContent);

      if (currentHeight + pageHeight > CONTENT_HEIGHT_PX) {
        pagesArr.push(contentContainer.innerHTML);
        remainingContent = remainingContent.slice(
          contentContainer.innerHTML.length
        );
        currentHeight = 0;
      } else {
        currentHeight += pageHeight;
        remainingContent = remainingContent.slice(
          contentContainer.innerHTML.length
        );
      }
    }

    if (currentHeight > 0) {
      pagesArr.push(contentContainer.innerHTML);
    }

    document.body.removeChild(tempContainer);
    setPages(pagesArr);
  };

  useEffect(() => {
    calculatePages();
  }, []);

  const renderField = (field, data) => {
    const fieldValue = data[field.id] || "";
    const fieldName = toTitleCase(field.name);

    switch (field.type) {
      case "textarea":
        return <div className="h-32">{fieldValue}</div>;
      case "checkbox":
        return (
          <div className="form-checkbox h-5 w-5 text-indigo-600">
            {fieldValue ? "✓" : "✗"}
          </div>
        );
      case "link":
        return <a href={fieldValue}>{fieldValue}</a>;
      case "image":
        return <img src={fieldValue} alt="Image" className="w-full" />;
      case "barcode":
        return <img src={fieldValue} alt="Barcode" className="w-full" />;
      case "ManyToManyField":
        return (
          <div className="w-full">
            <DataTableView fieldData={data} field={field} columns={["id"]} />
          </div>
        );
      default:
        return <div>{fieldValue}</div>;
    }
  };

  const renderSectionContent = (section) => (
    <div key={section.id} className="mb-4">
      <h3 className="text-xl font-semibold mb-2">{section.name}</h3>
      <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))] gap-4 mb-2">
        {section?.columns?.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-x-4 mb-2">
            {column?.fields?.map((field, fieldIndex) => (
              <div key={fieldIndex} className="">
                <div className="font-bold">{toTitleCase(field.name)}</div>
                <div>{renderField(field, data)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => (
    <div>
      {fields?.map((tab) => (
        <div key={tab.id} className="mb-8">
          {tab.name && <h2 className="text-2xl font-bold mb-4">{tab.name}</h2>}
          {tab?.sections?.map(renderSectionContent)}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={ref} style={{ width: `${PAGE_WIDTH}mm`, margin: "0 auto" }}>
      <div ref={contentRef} className="hidden">
        {renderContent()}
      </div>
      {pages?.map((pageData, pageIndex) => (
        <div
          key={pageIndex}
          className="relative bg-white print:w-[210mm] print:h-[297mm] print:overflow-hidden"
          style={{
            width: `${PAGE_WIDTH}mm`,
            height: `${PAGE_HEIGHT}mm`,
            margin: "0 auto",
            pageBreakAfter: pageIndex < pages.length - 1 ? "always" : "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="relative w-full pt-4">
            <img
              src="/img/print/head.png"
              alt="Header"
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="flex-1 flex flex-col m-8 items-center justify-start"
            style={{
              paddingTop: CONTENT_PADDING,
              paddingBottom: CONTENT_PADDING,
              overflow: "auto",
            }}
          >
            <div className="space-y-4 w-full">
              <div dangerouslySetInnerHTML={{ __html: pageData }} />
            </div>
          </div>

          <div className="relative w-full">
            <img
              src="/img/print/footer.png"
              alt="Footer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
});

export default DocumentPrint;
