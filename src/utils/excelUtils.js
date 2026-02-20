import * as XLSX from "xlsx";

export const exportToExcel = (data, fileName) => {
  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate a buffer for the workbook and trigger the download
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

  // Create a link element, set the href to the blob, and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${fileName}.xlsx`);
  document.body.appendChild(link);
  link.click();

  // Clean up the link element
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
