import { toTitleCase } from "@/utils/textConvert";
import React, { useEffect, useState } from "react";

const CONTENT_PADDING = 10;
const PAGE_HEIGHT = 297;
const PAGE_WIDTH = 210;
const CONTENT_HEIGHT_RATIO = 0.65;
const PAGE_HEIGHT_PX = PAGE_HEIGHT * 3.77953; // Conversion to px
const PAGE_WIDTH_PX = PAGE_WIDTH * 3.77953;
const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX * CONTENT_HEIGHT_RATIO;

const iconClassMap = {
  id: "fa-id-badge",
  file: "fa-file-alt",
  date: "fa-calendar-day",
  email: "fa-envelope",
  phone: "fa-phone",
  url: "fa-link",
  address: "fa-map-marker-alt",
};

const ColorPrint = React.forwardRef(({ data, title, load }, ref) => {
  const [pages, setPages] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);

  useEffect(() => {
    // Calculate current date and time
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    setCurrentDateTime(now.toLocaleDateString("en-US", options));
  }, [load]);

  const measureTextHeight = (text, fontSize, fontFamily) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return 0;

    context.font = `${fontSize} ${fontFamily}`;
    const textMetrics = context.measureText(text);
    return (
      textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
    );
  };

  useEffect(() => {
    const calculatePages = () => {
      const filteredData = data
        ? Object.entries(data).filter(
            ([key]) =>
              key !== "id" && key !== "modified_at" && key !== "created_at"
          )
        : [];

      const contentContainer = document.createElement("div");
      contentContainer.style.width = `${PAGE_WIDTH_PX}px`;
      contentContainer.style.position = "absolute";
      contentContainer.style.top = "0";
      contentContainer.style.left = "0";
      contentContainer.style.visibility = "hidden";
      document.body.appendChild(contentContainer);

      const pagesArr = [];
      let currentPageContent = [];
      let currentHeight = 0;
      const tableFooter = `</tbody></table>`;

      let nonArrayItems = [];

      filteredData.forEach(([key, value], idx) => {
        const iconClass = iconClassMap[key] || "fa-id-badge";

        if (Array.isArray(value)) {
          const isLandscapeMode = value.length > 3;
          if (isLandscapeMode & !isLandscape) {
            setIsLandscape(isLandscapeMode);
          }
        } else {
          nonArrayItems.push({ key, value, iconClass });
        }
      });

      const nonArrayItemsPerPage = isLandscape ? 4 : 2;
      const nonArrayItemsCount = nonArrayItems.length;
      for (let i = 0; i < nonArrayItemsCount; i += nonArrayItemsPerPage) {
        const itemsToProcess = nonArrayItems.slice(i, i + nonArrayItemsPerPage);

        const contentHtml = `
          <div class="grid grid-cols-${nonArrayItemsPerPage} gap-x-4 text-xs text-darkblack-900">
           ${itemsToProcess
             .map(
               (item) => `
              <div class="flex flex-row justify-between bg-slate-50 w-[80%] rounded px-2 py-1 my-1">
                <div class="flex-none w-full px-1">
                  <div>
                    <p class="mb-0 font-sans text-xs font-medium text-gray-800 leading-normal">
                    ${toTitleCase(item.key)}
                    </p>
                      <h5 class="mb-0 font-bold text-xs">${item.value}</h5>
                  </div>
                </div>
                <div class="px-1 text-right flex justify-end">
                  <div class="flex items-center justify-center w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                    <i class="fas ${item.iconClass} text-lg text-white"></i>
                  </div>
                </div>
              </div>
           `
             )
             .join("")}
          </div>
          `;

        const contentDiv = document.createElement("div");
        contentDiv.style.marginBottom = "20px";
        contentDiv.innerHTML = contentHtml;

        contentContainer.appendChild(contentDiv);
        currentHeight = contentContainer.scrollHeight;

        if (currentHeight > pageHeight - 2 * CONTENT_PADDING) {
          pagesArr.push(currentPageContent);
          currentPageContent = [contentDiv.innerHTML];
          contentContainer.innerHTML = "";
          contentContainer.appendChild(contentDiv);
          currentHeight = contentContainer.scrollHeight;
        } else {
          currentPageContent.push(contentDiv.innerHTML);
        }
      }

      filteredData.forEach(([key, value], idx) => {
        if (Array.isArray(value)) {
          const arrayFields = Object.keys(value[0] || {}).filter(
            (field) => field !== "modified_at" && field !== "created_at"
          );
          const columnCount = arrayFields.length * 2 + 1;
          const gridTemplateColumns = `repeat(${columnCount}, 1fr)`;

          const tableHeader = `
            <div class="text-left pt-4 font-semibold">${toTitleCase(key)}</div>
            <table class="min-w-full mt-2 rounded-t-sm overflow-hidden text-xs">
              <thead>
                <tr class="bg-pink-100 border-b-[1px] border-purple-700 justify-center"
                 style="display: grid; grid-template-columns: ${gridTemplateColumns};" 
                >
                  <th class="py-1.5 px-2 text-left text-purple-900 font-bold">No.</th>
                  ${arrayFields
                    .map(
                      (field) =>
                        `<th class="py-1.5 px-1 text-center font-bold col-span-2 break-words">${toTitleCase(
                          field
                        )}</th>`
                    )
                    .join("")} 
                </tr>
              </thead>
              <tbody>
          `;

          currentPageContent.push(tableHeader);

          value.forEach((item, rowIndex) => {
            const rowClasses = rowIndex % 2 === 0 ? "bg-purple-50" : "bg-white";
            const contentHtml = `
             <div class="${rowClasses} justify-center"
               style="display: grid; grid-template-columns: ${gridTemplateColumns};">
                
              <div class="py-1.5 px-2 text-left text-purple-900 font-medium border-r border-gray-400">
                ${rowIndex + 1}
              </div>
               ${arrayFields
                 .map(
                   (field) =>
                     `<div class="py-1.5 px-1 text-left text-darkblack-800 border-l border-gray-100 col-span-2 break-words">${
                       item[field] || ""
                     }</div>`
                 )
                 .join("")}
              </div>
            `;

            const contentDiv = document.createElement("div");
            contentDiv.style.marginBottom = "20px";
            contentDiv.innerHTML = contentHtml;

            contentContainer.appendChild(contentDiv);
            currentHeight = contentContainer.scrollHeight;

            if (currentHeight > CONTENT_HEIGHT_PX - 2 * CONTENT_PADDING) {
              currentPageContent.push(tableFooter);
              pagesArr.push(currentPageContent);
              currentPageContent = [tableHeader, contentDiv.innerHTML];
              contentContainer.innerHTML = "";
              contentContainer.appendChild(contentDiv);
              currentHeight = contentContainer.scrollHeight;
            } else {
              currentPageContent.push(contentDiv.innerHTML);
            }
          });

          currentPageContent.push(tableFooter);
        }
      });

      if (currentPageContent.length > 0) {
        pagesArr.push(currentPageContent);
      }

      document.body.removeChild(contentContainer);
      setPages(pagesArr);
    };

    calculatePages();
  }, [load, data]);

  const pageWidth = isLandscape ? PAGE_HEIGHT : PAGE_WIDTH;
  const pageHeight = isLandscape ? PAGE_WIDTH : PAGE_HEIGHT;

  return (
    <div ref={ref} style={{ width: `${pageWidth}mm`, margin: "0 auto" }}>
      {data &&
        pages?.map((pageData, pageIndex) => (
          <div
            key={pageIndex}
            className="relative bg-white print:w-[210mm] print:h-[297mm] print:overflow-hidden"
            style={{
              width: `${pageWidth}mm`,
              height: `${pageHeight}mm`,
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
              className="flex-1 flex flex-col mx-8 my-4 items-center justify-start"
              style={{
                paddingTop: CONTENT_PADDING,
                paddingBottom: CONTENT_PADDING,
                overflow: "hidden",
              }}
            >
              <div className="grid grid-cols-2 space-x-2">
                {pageIndex === 0 && title && (
                  <h2 className="text-2xl font-bold text-center mb-4">
                    {title}
                  </h2>
                )}
                {pageIndex === 0 && data?.id && (
                  <h2 className="text-2xl font-bold text-center mb-4">
                    {data.id}
                  </h2>
                )}
              </div>
              <div className="w-full grid grid-cols-1 gap-x-4 text-xs">
                {pageData?.map((contentHtml, index) => (
                  <div
                    key={index}
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center font-semibold text-xs">
              Page {pageIndex + 1}
            </div>

            <div className="relative w-full">
              <img
                src="/img/print/footer.png"
                alt="Footer"
                className="w-full h-full object-cover"
              />

              {currentDateTime && (
                <div
                  className="absolute top-2 right-2 left-2 bg-transparent p-1 text-xs text-green-600 text-center italic"
                  style={{
                    top: "10px",
                    right: "10px",
                  }}
                >
                  Generated at {currentDateTime}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
});

export default ColorPrint;
