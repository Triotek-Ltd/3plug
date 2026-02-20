import { getFromDB } from "@/utils/indexedDB";
import React, { useEffect, useState } from "react";

const DispatchPrint = React.forwardRef(({ data }, ref) => {
  const [currentDate, setCurrentDate] = useState("");
  const [prof, setProf] = useState("");

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
  }, []);
  useEffect(() => {
    const checkAuth = async () => {
      const perm = await getFromDB("profile");
      setProf(perm);
    };
    checkAuth();
  }, []);

  return (
    <table ref={ref} className="w-full">
      {/* Header */}
      <thead>
        <tr className="min-h-40 w-full min-w-full">
          <td>
            <div className="h-40"></div>
          </td>
        </tr>
      </thead>
      <div className="fixed top-0 flex flex-row w-full pt-4 px-8">
        <div className="flex flex-row w-full justify-between items-center mb-4 border-b-[1px] border-black">
          <div className="grid grid-cols-1 items-center">
            <img
              src="/img/logos/logo.png"
              alt="Header"
              className="h-[93px] mt-6 object-cover"
            />
            <a
              href="https://www.masafalogistics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900"
            >
              <h4 className="text-base font-medium italic">
                www.masafalogistics.com
              </h4>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col">
              <span className="text-red-700 font-semibold">SOUTH AFRICA</span>
              <span>+27 11 470 0702</span>
              <span>+27 83 599 5695</span>
              <span>+27 74 618 8600</span>
              <span>+27 79 8007 734</span>
            </div>
            <div className="flex flex-col">
              <span className="text-red-700 font-semibold">KENYA</span>
              <span>+254 72 522 1800</span>
              <span>+254 71 289 1753</span>
              <span>+254 79 267 4681</span>
              <span>+254 71 159 5716</span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="text-center mb-2 px-8">
        <p className="text-3xl font-bold uppercase border-b-[1px] border-black">
          Delivery Note
        </p>
        <div className="flex flex-row justify-between border-b-[1px] border-black mb-2">
          <p className="text-sm mb-1">Delivery Number: {data.id}</p>
          <p className="text-sm mb-1">Date: {currentDate}</p>
        </div>
        <div className="flex flex-row justify-between border-b-[1px] border-black mb-2">
          <p className="text-xl text-left font-bold">
            Delivered To: <br /> {data.customer}
          </p>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="mb-2 px-8">
        <table className="w-full mt-4 rounded-t-sm text-xs overflow-hidden">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data.items) && data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.quantity || 1}</td>
                  <td className="p-4">Service</td>
                  <td className="p-4">{item.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Signature Section */}
      <div className="mb-4 mt-8 px-8">
        <div className="flex flex-row justify-between">
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-y-2">
              <p className="text-sm font-medium">Delivered By:</p>
              <p className="text-sm font-bold">
                {prof?.first_name} - {prof?.last_name}{" "}
              </p>
            </div>
            <div className="border-t border-black w-48 mt-12"></div>
            <p className="text-xs">Signature</p>
          </div>
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-y-2">
              <p className="text-sm font-medium">Received By:</p>
              <p className="text-sm font-bold">
                {data?.receiver_name} - {data?.receiver_phone}{" "}
              </p>
            </div>
            <div className="border-t border-black w-48 mt-12"></div>
            <p className="text-xs">Signature</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full flex flex-col px-8">
        <div className="flex flex-col pb-1 pt-2 text-center border-t-[1px] border-black text-xs">
          <p>
            {" "}
            69 on 9th Avenue, Bezuidenhout Valley Johannesburg, South Africa -
            Telephone:+27114700702
          </p>

          <p>
            Blue Sky Filling Station, Ngara Park Road, Nairobi, Kenya -
            Telephone: +254711595716
          </p>
        </div>
      </div>

      <tfoot>
        <tr className="min-h-14">
          <td>
            <div className="h-14"></div>
          </td>
        </tr>
      </tfoot>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0px !important;
          }
          body {
            padding: 0px;
          }
        }
      `}</style>
    </table>
  );
});

export default DispatchPrint;
