import { getFromDB } from "@/utils/indexedDB";
import React, { useEffect, useState } from "react";

const PackingListPrint = React.forwardRef(({ data }, ref) => {
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
    <div ref={ref} className="w-full bg-white text-black">
      {/* Header */}
      <div className="flex flex-row w-full justify-between items-center mb-4 px-8">
        <img
          src="/img/logos/masafa-logo.png"
          alt="Header"
          className="h-28 object-cover"
        />
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

      {/* Delivery Details */}
      <div className="text-center mb-4 px-8">
        <p className="text-2xl font-bold uppercase border-b-[1.5px] border-gray-400 pb-2">
          Packing List
        </p>
        <div className="flex flex-row justify-between border-b-[1.5px] border-gray-400 mb-2">
          <p className="text-sm">Crossborder Number: {data.id}</p>
          <p className="text-sm">Date: {currentDate}</p>
        </div>
        <div className="flex flex-row justify-between border-b-[1.5px] border-gray-400 mb-2">
          <p className="text-sm">Loading Point: {data.loading_point}</p>
          <p className="text-sm">Destination: {data.destination}</p>
        </div>
        <div className="flex flex-row justify-between border-b-[1.5px] border-gray-400 mb-2">
          <p className="text-sm">Vehicle: {data.vehicle}</p>
          <p className="text-sm">Driver: {data.driver}</p>
        </div>
      </div>

      {/* Item Details Section */}
      <div className="mb-4 px-8">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Quantity</th>
              <th className="p-4 text-left">Detail</th>
              <th className="p-4 text-left">Packaging Type</th>
              <th className="p-4 text-left">Weight</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data.items) && data.items.length > 0 ? (
              data.items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-4">{item.id}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">{item.description || "N/A"}</td>
                  <td className="p-4">{item.packaging_type}</td>
                  <td className="p-4">{item.weight}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center">
                  No items available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 w-full flex flex-col px-8">
        <div className="flex flex-col pb-1 pt-2 text-center border-t-2 border-gray-400">
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

      <style jsx global>{`
        @media print {
          @page {
            size: landscape;
            margin: 0;
          }
          body {
            padding: 0;
          }
          .w-full {
            width: 100%;
          }
          .bg-white {
            background-color: white;
          }
          .text-black {
            color: black;
          }
          .border-gray-400 {
            border-color: #b0b0b0;
          }
          .border-b {
            border-bottom-width: 1px;
          }
          .hover\\:bg-gray-100:hover {
            background-color: #f7f7f7;
          }
        }
      `}</style>
    </div>
  );
});

export default PackingListPrint;
