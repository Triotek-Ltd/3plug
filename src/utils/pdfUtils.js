import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generatePDF = async (element) => {
  return new Promise((resolve, reject) => {
    html2canvas(element, { scale: 2, useCORS: true })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const docDefinition = {
          content: [
            {
              image: imgData,
              width: 500,
            },
            {
              text: "Blue Sky Filling Station, Ngara park Road, Nairobi",
              style: "footer",
            },
            {
              text: "Telephone: +254 725 221800",
              style: "footer",
            },
          ],
          styles: {
            footer: {
              fontSize: 10,
              alignment: "center",
              margin: [0, 20, 0, 0],
            },
          },
        };

        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        pdfDocGenerator.download(
          `Invoice-${element.dataset.id || "default"}.pdf`,
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      })
      .catch(reject);
  });
};
