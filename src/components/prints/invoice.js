import { fetchData } from "@/utils/Api";
import React, { useEffect, useState } from "react";

const InvoicePrint = React.forwardRef(function InvoicePrint(
  { data, preview = false },
  ref
) {
  const [payments, setPayments] = useState([]);
  const [totalPaid, setTotalPaid] = useState(0);

  const date = new Date();
  const formattedDate = `${date.getDate()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()}`;

  useEffect(() => {
    const cleanCustomerName = data?.customer?.id
      ? data.customer?.id.replace(/[0\+].*$/, "").trim()
      : "Customer";

    if (data.id && data.type) {
      document.title = `${data.type} ${data.id} - ${cleanCustomerName} ${formattedDate}`;
    }

    const handleBeforePrint = () => {
      // No additional action needed before printing
    };

    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
    };
  }, [data]);

  const renderPaymentDetails = () => {
    const isPaybill =
      data?.bank?.name.toLowerCase() === "paybill" ||
      data?.bank?.id === "paybill";

    return (
      <div className="w-fit">
        <p className="font-bold text-[8px] border-b-[1pt] border-black">
          Payment Details
          {/* via {data?.bank?.name} in {data?.bank?.currency} */}
        </p>
        <div className="grid grid-cols-2 gap-2 mt-2 text-[8px]">
          {/* Labels */}
          <p className="font-medium">Bank:</p>
          <p className="font-semibold">{data?.bank?.name || "-"}</p>

          <p className="font-medium">Account Name:</p>
          <p className="font-semibold">{data?.bank?.account_name || "-"}</p>

          <p className="font-medium">
            {isPaybill ? "Account Code:" : "Account Number:"}
          </p>
          <p className="font-semibold">{data?.bank?.account_number || "-"}</p>

          <p className="font-medium">
            {isPaybill ? "Paybill Number:" : "Branch Name:"}
          </p>
          <p className="font-semibold">
            {isPaybill
              ? data?.bank?.paybill_number || "-"
              : data?.bank?.branch || "-"}
          </p>

          {!isPaybill && data?.bank?.swift_code && (
            <>
              <p className="font-medium">Swift Code:</p>
              <p className="font-semibold">{data?.bank?.swift_code}</p>
            </>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetchData(
          { invoice: data?.id },
          `masafa/payment`
        );

        // Format the payment records smd on the `data.payments` array
        const formattedPayments = response?.data?.data?.map((payment) => ({
          date: payment.date || "N/A",
          amount: payment.amount || 0,
          source: payment.source || "",
        }));

        setPayments(formattedPayments);

        // Directly get totalPaid and balance from the `data` object
        const totalPaid = parseFloat(data.total_paid) || 0;
        setTotalPaid(totalPaid);
      } catch (error) {
        console.error(
          `Failed to fetch payment history: ${error.message || error}`
        );
      }
    };

    fetchPayments();
  }, [data]);

  return (
    <div ref={ref} className="w-[w-80%] min-h-screen flex flex-col p-4">
      <table className="w-full">
        <thead className={`${preview ? "hidden" : ""}`}>
          <tr className="min-h-32 w-full">
            <td>
              <div className="h-32"></div>
            </td>
          </tr>
        </thead>

        {/* Header */}
        <div
          className={` ${
            preview ? "" : "fixed top-0 z-8 w-[83.5%] "
          } flex justify-between items-center py-1 px-0 border-b-[1pt] border-black mx-8`}
        >
          <div className="grid grid-cols-1 items-center">
            <img
              src="/img/logos/logo.png"
              alt="Header"
              className="h-[68px] mt-6 object-cover"
            />
            <a
              href="https://www.masafalogistics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-900"
            >
              <h4 className="text-[12px] font-medium italic">
                www.masafalogistics.com
              </h4>
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4 text-[8px] h-full self-end">
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

        {/* Invoice Details */}
        <div className="relative z-8 text-center my-1 px-8">
          <p className="text-[20px] font-bold uppercase border-b-[1pt] border-black -mt-8">
            {data.type}
          </p>
          <div className="flex justify-between items-center border-b-[1pt] border-black  py-[2px]">
            <p className="text-[8px] font-semibold">
              {data.type} Number: {data.id}
            </p>
            <p className="text-[8px] font-semibold">Date: {formattedDate}</p>
          </div>
          <div className="flex justify-between items-center border-b-[1pt] border-black py-[2px]">
            <p className="text-[8px] text-left font-semibold">
              To:{" "}
              {data?.customer
                ? `${data?.customer?.first_name} ${data?.customer?.last_name}  ${data?.customer?.phone}`
                : "Customer"}
              <br />
              Adress: {data?.customer?.street && `${data?.customer?.street}, `}
              {data?.customer?.suburb && ` ${data?.customer?.suburb}, `}
              {data?.customer?.street && ` ${data?.customer?.street}, `}
              {data?.customer?.city && ` ${data?.customer?.city}, `}
              {data?.customer?.province && ` ${data?.customer?.province}, `}
              {data?.customer?.country && ` ${data?.customer?.country}`}
              <br />
              VAT/PIN Number:{" "}
              {data?.customer.vat_number
                ? `${data?.customer?.vat_number} `
                : ""}
              <br />
              {data?.supplier?.name && data?.supplier?.phone && (
                <p>
                  From: {data?.supplier.name} - {data?.supplier.phone}
                </p>
              )}
            </p>

            <div>
              <img
                src={`/api/qrcode?text=${encodeURIComponent(data?.qr_code)}`}
                alt="barcode"
                className="h-14 w-fit object-cover"
              />
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="relative z-8 mt-1  px-8">
          {Array.isArray(data?.items) && data?.items?.length > 0 ? (
            <>
              <div className="text-[8px] font-bold">Summary of Invoice</div>
              <table className="min-w-full divide-y divide-black border-y-[1pt] border-black">
                <thead>
                  <tr>
                    <th className="px-1 text-left text-[8px] font-bold uppercase">
                      ID
                    </th>
                    <th
                      colSpan="3"
                      className="px-1 text-left text-[8px] font-bold uppercase"
                    >
                      Detail
                    </th>
                    <th className="px-1 text-left text-[8px] font-bold uppercase">
                      Type
                    </th>
                    <th className="px-1 text-left text-[8px] font-bold uppercase">
                      Weight
                    </th>
                    <th className="px-1 text-left text-[8px] font-bold uppercase">
                      Quantity
                    </th>
                    <th
                      colSpan="2"
                      className="px-1 text-right text-[8px] font-bold uppercase whitespace-nowrap"
                    >
                      Amount ({data.currency})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((item, index) => (
                    <tr
                      key={index}
                      className={`items-start ${index % 2 === 0 ? "" : ""}`}
                    >
                      <td className="px-1 text-[8px]">{item.id}</td>
                      <td colSpan="3" className="px-1 text-[8px]">
                        {item.description}
                      </td>
                      <td className="px-1 text-[8px]">{item.packaging_type}</td>
                      <td className="px-1 text-[8px]">{item.weight}</td>
                      <td className="px-1 text-[8px] text-center">
                        {item.quantity || 1}
                      </td>
                      <td colSpan="2" className="px-1 text-[8px] text-right">
                        {item.price || 0}
                      </td>
                    </tr>
                  ))}
                  <tr className="">
                    <td
                      colSpan="7"
                      className="px-1 text-[8px] text-right font-bold"
                    >
                      Sub Total ({data.currency})
                    </td>
                    <td className="px-1 py-1 text-[8px] font-bold text-right">
                      {data.items.reduce(
                        (total, item) => total + (item.price || 0),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* Services Table */}
        <div className="relative z-8 mt-2  px-8">
          {Array.isArray(data?.services) && data?.services?.length > 0 ? (
            <>
              <div className="text-[8px] font-bold">Services</div>
              <table className="min-w-full divide-y divide-black border-y-[1pt] border-black">
                <thead>
                  <tr>
                    <th className="px-1 text-left text-[8px] font-bold uppercase">
                      Name
                    </th>
                    <th className="px-1 text-left text-[8px] font-bold uppercase">
                      Description
                    </th>
                    <th className="px-1 text-right text-[8px] font-bold uppercase">
                      Amount ({data.currency})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.services?.map((service, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "" : ""}`}>
                      <td className="px-1 text-[8px]">{service.name}</td>
                      <td className="px-1 text-[8px]">{service.description}</td>
                      <td className="px-1 text-[8px] text-right">
                        {service.price || 0}
                      </td>
                    </tr>
                  ))}
                  <tr className="">
                    <td
                      colSpan="2"
                      className="px-1 text-[8px] text-right font-bold"
                    >
                      Sub Total ({data.currency})
                    </td>
                    <td className="px-1 py-1 text-[8px] text-right font-bold">
                      {data.services.reduce(
                        (total, item) => total + (item.price || 0),
                        0
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : (
            <></>
          )}
        </div>

        {/* Discounts Table */}
        <div className="relative z-8 mt-2 flex justify-end w-full  px-8">
          <div className="w-fit flex flex-col justify-end">
            {Array.isArray(data?.discounts) && data?.discounts?.length > 0 ? (
              <>
                <table className="w-fit border-b-[1pt] border-black">
                  <thead>
                    <tr className="w-full grid grid-cols-2">
                      <th className="px-1 text-left text-[8px] font-bold uppercase">
                        Discount
                      </th>
                      <th className="px-1 text-right text-[8px] font-bold uppercase">
                        Amount ({data.currency})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.discounts?.map((discount, index) => (
                      <tr
                        key={index}
                        className={`w-full grid grid-cols-2 ${
                          index % 2 === 0 ? "" : ""
                        }`}
                      >
                        <td className="px-1 text-[8px]">
                          {discount.description}
                        </td>
                        <td className="px-1 text-[8px] text-right">
                          {discount.amount || 0}
                        </td>
                      </tr>
                    ))}
                    <tr className={`w-full grid grid-cols-2 `}>
                      <td className="px-1 text-[8px] font-bold">
                        Sub Total ({data.currency})
                      </td>
                      <td className="px-1 text-[8px] text-right font-bold">
                        {data?.discount?.reduce(
                          (total, item) => total + (item.amount || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Payment */}
        <div className="relative z-8 mt-2 flex justify-end w-full px-8">
          <div className="w-fit flex flex-col justify-end">
            {payments?.length > 0 && data.type == "Invoice" ? (
              <>
                <div className="text-[8px] font-bold text-right">Payments</div>
                <table className="min-w-full border-y-[1pt] border-black">
                  <thead>
                    <tr className="w-full grid grid-cols-3">
                      <th className="px-1 text-left text-[8px] font-bold uppercase">
                        Date Paid
                      </th>
                      <th className="px-1 py-1 text-left text-[8px] font-bold uppercase">
                        Method
                      </th>
                      <th className="px-1 py-1 text-right text-[8px] font-bold uppercase">
                        Amount ({data.currency})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments?.map((payment, index) => (
                      <tr
                        key={index}
                        className={`w-full grid grid-cols-3 ${
                          index % 2 === 0 ? "" : ""
                        }`}
                      >
                        <td className="px-1 text-[8px]">{payment.date}</td>
                        <td className="px-1 text-[8px]">{payment.source}</td>
                        <td className="px-1 py-1 text-[8px] text-right">
                          {payment.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* Total Amount */}
        <div className="relative z-8 mt-2 flex justify-end w-full px-8">
          <div className="relative z-8 text-[8px] grid grid-cols-2 w-1/3">
            <div className="font-bold">Total {data.type}</div>
            <span className="text-darkblack-900 font-bold text-right">
              {data.currency} {data.total_amount || 0}
            </span>
            <div className="">Total Paid</div>
            <span className="text-darkblack-900 text-right">
              {data.currency} {totalPaid.toLocaleString() || 0}
            </span>
            <div className="font-bold py-1 border-y-[1pt] border-black">
              Balance
            </div>
            <span className="text-darkblack-900 font-bold text-right py-1 border-y-[1pt] border-black">
              {data.currency} {data?.balance?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {/* Payment Details */}
        {data?.type === "Invoice" && data?.bank && (
          <div className="relative z-8 mt-2 px-8">{renderPaymentDetails()}</div>
        )}

        {/* Note */}
        {data?.note && (
          <div className="relative z-8 mt-4">
            <div className="text-[8px] font-bold text-center underline">
              Note
            </div>
            <div className="text-[8px] font-semibold text-center">
              {data?.note}
            </div>
          </div>
        )}
        <div
          className={` ${
            preview ? "" : "fixed bottom-2 w-[83.5%] "
          } flex flex-col items-center justify-center px-8 py-1 border-t-[1pt] border-black  mx-8`}
        >
          <div className="text-[8px] text-darkblack-900 text-center space-y-1">
            <p className="text-[7px]">
              {" "}
              69 on 9th Avenue, Bezuidenhout Valley Johannesburg, South Africa -
              Telephone:+27114700702
            </p>

            <p className="text-[7px]">
              Blue Sky Filling Station, Ngara Park Road, Nairobi, Kenya -
              Telephone: +254711595716
            </p>
          </div>
        </div>

        <tfoot className={`${preview ? "hidden" : ""}`}>
          <tr className="min-h-12 w-full">
            <td>
              <div className="h-12"></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});

export default InvoicePrint;
