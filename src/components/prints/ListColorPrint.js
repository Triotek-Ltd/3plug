import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const ListColorPrint = forwardRef(
  ({ data, fields, title, filters, load }, ref) => {
    if (!load) return null;

    return (
      <div
        ref={ref}
        className="relative z-8 w-full min-h-screen flex flex-col p-8"
      >
        <table className="w-full">
          <thead>
            <tr className="min-h-40 w-full">
              <td>
                <div className="h-40"></div>
              </td>
            </tr>
          </thead>
          {/* Watermark */}
          <div className="fixed bottom-0 -m-8 z-1 top-0 w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
            <span className="text-8xl font-bold text-gray-300 opacity-60 rotate-[-30deg]">
              Masafa Logistics
            </span>
          </div>

          <div className="fixed top-0 w-[92.5%] flex justify-between items-center py-2 px-0 border-b-[1px] border-pink-300">
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
                <span className="block font-semibold text-red-700">KENYA</span>
                <span>+254 72 522 1800</span>
                <span>+254 71 289 1753</span>
                <span>+254 79 267 4681</span>
                <span>+254 71 159 5716</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="content">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  {fields?.map((field, index) => (
                    <th
                      key={index}
                      className="px-4 py-2 text-white bg-gradient-to-r from-blue-500 via-pink-500 to-purple-500 font-semibold text-sm"
                    >
                      {field.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-slate-50" : "bg-pink-50"
                    }`}
                  >
                    {fields?.map((field, fieldIndex) => (
                      <td
                        key={fieldIndex}
                        className="px-4 py-2 text-gray-800 border-t"
                      >
                        {item[field.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="fixed bottom-0 w-full flex flex-col items-center justify-center w-[92.5%] px-8 py-2 border-t-[1px] border-darkblack-400 bg-darkblack-50">
            <p className="text-xs text-darkblack-600 text-center">
              Blue Sky Filling Station, Ngara park Road, Nairobi
            </p>
            <p className="text-xs text-darkblack-600 text-center">
              Telephone: +254 725 221800
            </p>
          </div>

          <style jsx global>{`
            @media print {
              @page {
                margin: 0px !important;
                background-color: #e0e7ff;
              }
              body {
                padding: 0px;
                background-color: #e0e7ff;
              }
            }
          `}</style>

          <tfoot>
            <tr className="min-h-16 w-full">
              <td>
                <div className="h-16"></div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

export default ListColorPrint;
