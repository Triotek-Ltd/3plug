import { getFromDB } from "@/utils/indexedDB";
import React, { useEffect, useState } from "react";

const CrossborderPrint = React.forwardRef(({ data }, ref) => {
  const [currentDate, setCurrentDate] = useState("");
  const [prof, setProf] = useState("");
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setCurrentDate(formattedDate);
    const cleanDriver = data.driver
      ? data.driver.replace(/[0\+].*$/, "").trim()
      : "Driver";
    setDriver(cleanDriver);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const perm = await getFromDB("profile");
      setProf(perm);
      document.title = `Crossborder - ${data.id}  - ${currentDate}`;
    };
    checkAuth();
  }, []);

  // Group items by customer
  const groupedData = data?.items?.reduce((acc, item) => {
    if (!acc[item.customer]) {
      acc[item.customer] = {
        customerDetails: item.customerDetails,
        items: [],
      };
    }
    acc[item.customer].items.push(item);
    return acc;
  }, {});

  // Sort items by item ID
  // Object?.keys(groupedData)?.forEach((customer) => {
  //   groupedData[customer]?.items?.sort((a, b) => a.itemId - b.itemId);
  // });

  return (
    <div ref={ref} className="w-full bg-white text-black">
      <table className="w-full">
        <thead>
          <tr className="min-h-40 w-full">
            <td>
              <div className="h-40"></div>
            </td>
          </tr>
        </thead>
        {/* Header */}
        <div className="fixed top-0 w-full bg-white z-10">
          <div className="flex justify-between items-center py-2 px-8">
            <div className="grid grid-cols-1 items-center">
              <img
                src="/img/logos/logo.png"
                alt="Header"
                className="h-[93px] object-cover"
              />
            </div>
            <div className="grid grid-cols-1 self-end">
              <p className="text-sm grid grid-cols-1 font-medium self-end">
                <a
                  href="https://www.masafalogistics.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className=""
                >
                  Website:
                  <span
                    className="text-sm text-blue-900 self-end font-medium
                    italic"
                  >
                    {" "}
                    www.masafalogistics.com
                  </span>
                </a>
                Email: joburg@masafalogistics.com
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs h-full self-end">
              <div className="grid grid-cols-1 self-end">
                <span className="text-red-700 font-semibold">SOUTH AFRICA</span>
                <span>+27 11 470 0702</span>
                <span>+27 83 599 5695</span>
                <span>+27 74 618 8600</span>
                <span>+27 79 8007 734</span>
              </div>
              <div className="grid grid-cols-1 self-end">
                <span className="text-red-700 font-semibold">KENYA</span>
                <span>+254 72 522 1800</span>
                <span>+254 71 289 1753</span>
                <span>+254 79 267 4681</span>
                <span>+254 71 159 5716</span>
              </div>
            </div>
          </div>
          {/* Header Bottom Border with Margin */}
          <div className="w-[94%] mx-auto border-b-[1.5pt] border-black my-2" />
        </div>

        {/* Main Content */}
        <div className=" mb-2 px-8">
          {/* Delivery Details */}
          <div className="text-center">
            <p className="text-2xl font-bold uppercase border-b-[1.5px] border-gray-400 pb-2 -mt-6">
              Crossborder
            </p>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Crossborder Number: {data.id}</p>
              <p className="text-sm">Date: {currentDate}</p>
            </div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Loading Point: {data.loading_point}</p>
              <p className="text-sm">Destination: {data.destination}</p>
            </div>
            <div className="flex justify-between border-b-[1.5px] border-gray-400 mb-2">
              <p className="text-sm">Vehicle: {data.vehicle}</p>
              <p className="text-sm">Driver: {driver}</p>
            </div>
          </div>

          {/* Item Details Section */}
          <div className="mb-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-2 text-left">Customer</th>
                  <th className="p-2 text-left">Item ID</th>
                  <th className="p-2 text-left">Item Name</th>
                  <th className="p-2 text-left">Quantity</th>
                  <th className="p-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {groupedData &&
                  Object.keys(groupedData).length > 0 &&
                  Object.keys(groupedData)?.map((customer) => (
                    <React.Fragment key={customer}>
                      <tr>
                        <td rowSpan={groupedData[customer].items.length}>
                          {groupedData[customer].customerDetails}
                        </td>
                        <td>{groupedData[customer].items[0].itemId}</td>
                        <td>{groupedData[customer].items[0].itemName}</td>
                        <td>{groupedData[customer].items[0].quantity}</td>
                        <td>{groupedData[customer].items[0].price}</td>
                      </tr>
                      {groupedData[customer]?.items?.slice(1).map((item) => (
                        <tr key={item.itemId}>
                          <td>{item.itemId}</td>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.price}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 w-full bg-white">
          <div className="w-[94%] mx-auto border-t-[1.5pt] border-black my-2">
            <div className="px-8 py-2">
              <div className="text-xs text-darkblack-900 text-center space-y-1">
                <p>
                  69 on 9th Avenue, Bezuidenhout Valley Johannesburg, South
                  Africa - Telephone: +27114700702
                </p>
                <p>
                  Blue Sky Filling Station, Ngara Park Road, Nairobi, Kenya -
                  Telephone: +254711595716
                </p>
              </div>
            </div>
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
        <tfoot>
          <tr className="min-h-20 w-full">
            <td>
              <div className="h-20"></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});

export default CrossborderPrint;
