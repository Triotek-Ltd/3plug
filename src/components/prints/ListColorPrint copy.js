import { toTitleCase } from "@/utils/textConvert";
import React, { useEffect, useState } from "react";

const CONTENT_PADDING = 10;
const PAGE_HEIGHT = 297;
const PAGE_WIDTH = 210;
const LANDSCAPE_PAGE_HEIGHT = 210;
const LANDSCAPE_PAGE_WIDTH = 297;
const CONTENT_HEIGHT_RATIO = 0.9;
const PAGE_HEIGHT_PX = PAGE_HEIGHT * 3.77953;
const PAGE_WIDTH_PX = PAGE_WIDTH * 3.77953;
const CONTENT_HEIGHT_PX = PAGE_HEIGHT_PX * CONTENT_HEIGHT_RATIO;
const LANDSCAPE_PAGE_HEIGHT_PX = LANDSCAPE_PAGE_HEIGHT * 3.77953;
const LANDSCAPE_PAGE_WIDTH_PX = LANDSCAPE_PAGE_WIDTH * 3.77953;
const LANDSCAPE_CONTENT_HEIGHT_PX =
  LANDSCAPE_PAGE_HEIGHT_PX * CONTENT_HEIGHT_RATIO;

const iconClassMap = {
  id: "fa-id-badge",
  file: "fa-file-alt",
  date: "fa-calendar-day",
  email: "fa-envelope",
  phone: "fa-phone",
  url: "fa-link",
  address: "fa-map-marker-alt",
};

const ListColorPrint = React.forwardRef(
  ({ data, title, fields, filters, load }, ref) => {
    const [pages, setPages] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [isLandscape, setIsLandscape] = useState(false);
    const filteredFields = fields.filter((field) => field.id !== "id");

    useEffect(() => {
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

      const calculatePages = () => {
        const contentContainer = document.createElement("div");
        contentContainer.style.width = `${
          isLandscape ? LANDSCAPE_PAGE_WIDTH_PX : PAGE_WIDTH_PX
        }px`;
        contentContainer.style.position = "absolute";
        contentContainer.style.top = "0";
        contentContainer.style.left = "0";
        contentContainer.style.visibility = "hidden";
        document.body.appendChild(contentContainer);

        const pagesArr = [];
        let currentPageContent = [];
        let currentHeight = 0;

        const columnCount = filteredFields.length * 2 + 3;
        const gridTemplateColumns = `repeat(${columnCount}, 1fr)`;

        const tableHeader = `
        <table class="min-w-full mt-2 rounded-t-sm text-xs overflow-hidden">
          <thead>
            <tr
             class="bg-pink-100 border-b-[1px] border-purple-700 justify-center"
             style="display: grid; grid-template-columns: ${gridTemplateColumns};" 
             >
              <th class="py-3 px-1 text-center text-purple-900 font-bold col-span-1">No.</th>
              <th class="py-3 px-1 text-center text-purple-900 font-bold col-span-2">ID</th>
              ${filteredFields
                .map(
                  (field) =>
                    `<th class="py-3 px-1 text-center text-purple-900 font-bold col-span-2 break-words">${toTitleCase(
                      field.name
                    )}</th>`
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
      `;
        const tableFooter = `</tbody></table>`;

        currentPageContent.push(tableHeader);

        data?.forEach((item, index) => {
          const rowClasses = index % 2 === 0 ? "bg-purple-50" : "bg-white";
          const contentHtml = `
          <div class="${rowClasses} justify-center text-center border-b border-gray-100 text-xs"          
             style="display: grid; grid-template-columns: ${gridTemplateColumns};" >
            <div class="py-3 px-1 text-center text-purple-900 font-medium border-r border-gray-100">
              ${index + 1}
            </div>
            <div class="py-3 px-1 text-gray-800 border-l border-gray-100 col-span-2">
              ${item.id}
            </div>
            ${filteredFields
              .map(
                (field) => `
              <div class="py-3 px-1 text-gray-800 border-l border-gray-100 col-span-2 break-words">
                ${item[field.id] || ""}
              </div>`
              )
              .join("")}
          </div>
        `;

          const contentDiv = document.createElement("div");
          contentDiv.style.marginBottom = "20px";
          contentDiv.innerHTML = contentHtml;

          contentContainer.appendChild(contentDiv);
          currentHeight = contentContainer.scrollHeight;

          if (
            currentHeight >
            (isLandscape ? LANDSCAPE_CONTENT_HEIGHT_PX : CONTENT_HEIGHT_PX) -
              2 * CONTENT_PADDING
          ) {
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

        if (currentPageContent.length > 0) {
          pagesArr.push(currentPageContent);
        }

        document.body.removeChild(contentContainer);
        setPages(pagesArr);
      };

      setIsLandscape(filteredFields.length > 3); // Adjust landscape mode based on column count
      calculatePages();
    }, [load, data]);

    return (
      <div
        ref={ref}
        style={{
          width: `${isLandscape ? LANDSCAPE_PAGE_WIDTH : PAGE_WIDTH}mm`,
          margin: "0 auto",
        }}
      >
        {data &&
          pages?.map((pageData, pageIndex) => (
            <div
              key={pageIndex}
              className="relative bg-white text-black print:w-[210mm] print:h-[297mm] print:overflow-hidden"
              style={{
                width: `${isLandscape ? LANDSCAPE_PAGE_WIDTH : PAGE_WIDTH}mm`,
                height: `${
                  isLandscape ? LANDSCAPE_PAGE_HEIGHT : PAGE_HEIGHT
                }mm`,
                margin: "0 auto",
                pageBreakAfter:
                  pageIndex < pages.length - 1 ? "always" : "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Header Section */}
              <div className="relative w-full pt-4">
                <img
                  src="/img/print/head.png"
                  alt="Header"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content Section */}
              <div
                className="flex-1 flex flex-col mx-8 my-4 items-center justify-start"
                style={{
                  paddingTop: CONTENT_PADDING,
                  paddingBottom: CONTENT_PADDING,
                  overflow: "hidden",
                }}
              >
                <div className="flex flex-wrap gap-x-2 items-center justify-center">
                  {pageIndex === 0 && title && (
                    <h2 className="text-xl font-bold text-center mb-2">
                      {title} list
                    </h2>
                  )}
                </div>
                {pageIndex === 0 &&
                  filters &&
                  Object.keys(filters).length > 0 && (
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {Object.entries(filters)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => (
                          <div className="flex flex-row justify-between bg-slate-50 w-[100%] rounded px-2 py-1 my-1">
                            <div className="flex-none w-full px-1">
                              <div>
                                <p className="mb-0 font-sans text-sm font-medium text-gray-800 leading-normal">
                                  {toTitleCase(key)}
                                </p>
                                <h5 className="mb-0 font-bold">{value}</h5>
                              </div>
                            </div>
                            <div className="px-1 text-right -ml-12 flex justify-end">
                              <div className="flex items-center justify-center w-12 h-12 text-center rounded-lg bg-gradient-to-tl from-purple-700 to-pink-500">
                                <i className="fas fa-id-badge text-lg text-white"></i>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                <div className="w-full">
                  {pageData?.map((contentHtml, index) => (
                    <div
                      key={index}
                      dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer Section */}
              <div className="flex items-center justify-center font-semibold text-sm">
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
  }
);

export default ListColorPrint;
