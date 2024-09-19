import { PDFDocument } from 'pdf-lib';
import { customLogger } from '../../../../configs/logger';

class ContractUtils {
  


  addFormGob = async doc => {
    // Load the external PDF as a PDFDocument from pdf-lib
    const externalPdfBytes = await ContractUtils.formGobAsBits() // Fetch PDF as ArrayBuffer or Uint8Array

    // Use pdf-lib to handle the PDF loading
    const externalPdf = await PDFDocument.load(externalPdfBytes)
    const externalPages = externalPdf.getPages()
    customLogger.debug('externalPdfBytes', externalPdfBytes)
    customLogger.debug('externalPdf', externalPdf)
    customLogger.debug('externalPages', externalPages)
    // Get all pages of the external PDF

    // For each page in the external PDF, convert it to an image and add to jsPDF
    for (let i = 0; i < externalPages.length; i++) {
      if (i > 0) {
        doc.addPage() // Add a new page for each page of the external PDF
      }
      const page = externalPages[i]

      // Convert the page to an image (e.g., PNG or JPEG)
      const imgData = await page
        .render({ scale: 1 })
        .then(canvas => canvas.toDataURL('image/jpeg'))

      // Add the image to the jsPDF document
      doc.addImage(
        imgData,
        'JPEG',
        0,
        0,
        doc.internal.pageSize.getWidth(),
        doc.internal.pageSize.getHeight()
      )
    }
  }

}


export default ContractUtils;