import { toTitleCase } from "@/utils/textConvert";
import React, { useEffect, useState, useRef } from "react";

const ListDefaultPrint = React.forwardRef(
  ({ data, title, fields, filters }, ref) => {
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [isLandscape, setIsLandscape] = useState(false);
    const tableRef = useRef(null);

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

      // Switch to landscape if more than 2 fields are displayed
      setIsLandscape(fields.filter((field) => field.id !== "id").length > 3);
    }, [data, fields]);

    const filteredFields = fields.filter((field) => field.id !== "id");

    return (
      <>
        <style jsx global>{`
          @media print {
            @page {
              size: ${isLandscape ? "landscape" : "portrait"};
            }

            .landscape {
              transform: rotate(-90deg);
              transform-origin: top left;
              width: calc(100% - 1rem);
            }

            .portrait {
              transform: none;
              width: 100%;
            }
          }
        `}</style>

        <table
          ref={ref}
          className={
            isLandscape ? "print:landscape w-full" : "print:portrait w-full"
          }
        >
          <table className="w-full p-8">
            <thead>
              <tr className="min-h-40 w-full">
                <td>
                  <div className="h-40"></div>
                </td>
              </tr>
            </thead>
            {/* Watermark */}
            <div className="fixed bottom-0 z-1 top-0 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
              <span className="text-8xl font-medium text-gray-200 opacity-60 rotate-[-30deg]">
                Masafa Logistics
              </span>
            </div>

            <div className="fixed top-0 w-[95.5%] mx-6 flex justify-between items-center py-2 px-0 border-b-[1px] border-pink-300">
              <div className="grid grid-cols-1 -my-1 uppercase text-darkblack-900">
                <img
                  src="/img/logos/logo.png"
                  alt="Header"
                  className="h-20 object-cover"
                />
                <span className="block font-semibold text-[22px] text-blue-900">
                  Masafa Logistics
                </span>
                <span className="block font-medium text-[15.5px] text-red-700">
                  Crossborder Transport
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-darkblack-900">
                <div className="grid grid-cols-1">
                  <span className="block font-semibold text-red-700">
                    SOUTH AFRICA
                  </span>
                  <span>+27 11 470 0702</span>
                  <span>+27 83 599 5695</span>
                  <span>+27 74 618 8600</span>
                  <span>+27 79 8007 734</span>
                </div>
                <div className="grid grid-cols-1">
                  <span className="block font-semibold text-red-700">
                    KENYA
                  </span>
                  <span>+254 72 522 1800</span>
                  <span>+254 71 289 1753</span>
                  <span>+254 79 267 4681</span>
                  <span>+254 71 159 5716</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="px-6 relative z-8">
              <div className="flex flex-wrap gap-x-2">
                {title && (
                  <h2 className="text-xl font-bold text-darkblack-900 mb-2">
                    {title} list
                  </h2>
                )}
              </div>
              {filters && Object.keys(filters).length > 0 && (
                <div className="grid grid-cols-2 gap-4 w-full">
                  {Object.entries(filters)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-row justify-between bg-purple-50 w-full rounded px-1 py-1 my-1"
                      >
                        <div className="flex-none w-full px-1 text-xs">
                          <div>
                            <p className="mb-0 font-sans text-xs font-medium text-darkblack-900 leading-normal">
                              {toTitleCase(key)}
                            </p>
                            <h5 className="mb-0 font-bold text-darkblack-900">
                              {value}
                            </h5>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <div className="relative z-8 overflow-hidden shadow-lg rounded-sm">
                <table className="min-w-full divide-y divide-darkblack-300">
                  <thead className="bg-gradient-to-r from-blue-400 to-purple-500 text-black">
                    <tr className="bg-purple-50 border-b-[1px] border-purple-100 text-xs justify-center">
                      <th className="px-1.5 py-1.5 text-left text-xs font-bold uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-1.5 py-1.5 text-left text-xs font-bold uppercase tracking-wider">
                        ID
                      </th>
                      {filteredFields.map((field) => (
                        <th
                          key={field.id}
                          className="px-1.5 py-1.5 text-left text-xs font-bold uppercase tracking-wider"
                        >
                          {toTitleCase(field.name)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="w-full min-w-full text-[10px]">
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-purple-100 bg-opacity-50"
                            : "bg-darkblack-100 bg-opacity-50"
                        } hover:bg-purple-100`}
                      >
                        <td className="px-1 py-1">{index + 1}</td>
                        <td className="px-1 py-1">{item.id}</td>
                        {filteredFields.map((field) => (
                          <td
                            key={field.id}
                            className="px-1 py-1 text-left border-l border-purple-100"
                          >
                            {item[field.id] || ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="fixed bottom-0 w-full flex flex-col items-center justify-center w-[92.5%] px-8 py-2 border-t-[1px] border-darkblack-400 bg-darkblack-50">
              <p className="text-xs text-darkblack-600 text-center">
                Blue Sky Filling Station, Ngara park Road, Nairobi
              </p>
              <p className="text-xs text-darkblack-600 text-center">
                Telephone: +254 725 221800
              </p>
            </div>

            <tfoot>
              <tr className="min-h-16 w-full">
                <td>
                  <div className="h-16"></div>
                </td>
              </tr>
            </tfoot>
          </table>
        </table>
      </>
    );
  }
);

export default ListDefaultPrint;
