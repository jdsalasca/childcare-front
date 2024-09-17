/* eslint-disable no-unused-vars */
// contractPdfUtils.js

import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import { customLogger } from '../../../configs/logger';
import { Functions } from '../../../utils/functions';
import { defaultContractInfo, defaultContractInfoFinished } from '../utilsAndConstants';
import { ContractUtils } from './contractUtils/contractUtils';
import { addFonts } from './jsPdfArial';
import { contractInfo } from './newContractGenerator';

// Function to add the header
const initialYposition  = 12.7 + 10;
/**
 * This function adds the content of a page to the jsPDF object.
 * @param {jsPDF} doc - The jsPDF object
 * @param {Object} contractInfo - The contract information object
 * @param {Object} options - The options object
 * @param {string} pageName - The name of the page to add
 * @param {boolean} createPage - Whether to create a new page
 * @param {Object} contractInformation - The contract information object
 * @returns {jsPDF}  The updated jsPDF object
 */
const addPageContent = (doc = new jsPDF(), contractInfo, options, pageName,createPage =false, contractInformation = defaultContractInfoFinished) => {
  if (contractInfo[pageName]) {
    Object.keys(contractInfo[pageName]).forEach(key => {

      let content = contractInfo[pageName][key];
      if (key.startsWith('separator')) {
        // Add a separator line
        addSeparator(doc, options);
      } else if (key === 'title' || key === 'subtitle') {
        // Add title or subtitle
        addHeader(doc, content, options, key);
      } else if (key.startsWith('parr')) {
        // Add body text
        addBodyText(doc, content, options);
        
      }else if(key.startsWith("yPlus")){
        customLogger.debug('yPlus', content)
        options.yPosition += content
    }else if (key.startsWith("signSection")){
        customLogger.debug('signSection', content)
        addSignSpaces(doc, contractInfo, options,contractInformation)
      }
    });
    // Reset the yPosition to the initial value after adding the content
    options.yPosition = options.initialY;
    if(createPage){
      doc.addPage()
    }
  } else {
    console.warn(`Page name "${pageName}" not found in contractInfo.`);
  }
};
const addHeaderFontStyle = (textObject, type) => {
  if (typeof textObject === "string") {
    return type === 'title' ? 'bold' : 'italic';
  } else if (typeof textObject === "object") {
    return textObject.fontStyle;
  }
};

// Function to add a title or subtitle
const addHeader = (doc, text, options, type = 'subtitle') => {
  const fontStyle = addHeaderFontStyle(text, type);
  text = preprocessText(text.text ?? text);
  const fontSize = type === 'title' ? 16 : 14;
  doc.setFontSize(fontSize);
  doc.setFont("Arial", fontStyle);
  renderFormattedLine(doc,text.text ?? text, options, true)
  //doc.text(text, options.pageWidth / 2, options.yPosition, { align: "center" });
  doc.setFont("Arial", "normal");
  doc.setFontSize(12); // Larger font size for header
  options.yPosition += 10; // Adjust the line height as needed
  //options.yPosition += fontSize + 10; // Update yPosition after header
};
// Function to add a separator line
const addSeparator = (doc, options) => {
  const lineWidth = 0.5; // Default width of the line in cm
  const yPosition = options.yPosition; // Position to start the line

  doc.setLineWidth(lineWidth);
  doc.line(options.marginLeft, yPosition, options.pageWidth - options.marginLeft, yPosition); // Draw the line
  options.yPosition = yPosition + lineWidth + 10; // Update yPosition to be below the line

  // Reset to default line width (optional, if your library needs this)
  doc.setLineWidth(0.2); // Reset to default line width if necessary
};

// Function to add the footer
const addFooter = (doc, text, options) => {
doc.setFontSize(10);
doc.text(text, options.pageWidth / 2, options.pageHeight - options.marginBottom, { align: "center" });
};

const addBodyText = (doc, text, options) => {
// Preprocess the text to handle HTML tags and line breaks
text = preprocessText(text);

const lines = doc.splitTextToSize(text, options.contentWidth);
doc.setFontSize(12);

lines.forEach(line => {
  if (options.yPosition + 10 > options.pageHeight - options.marginBottom) {
    doc.addPage();
    options.yPosition = options.marginTop;
  }
  renderFormattedLine(doc,line, options)
  options.yPosition += 5; // Adjust the line height as needed
});
};


/**
 * This function adds the sign spaces to the contract
 * @param {jsPDF} doc - The jsPDF object
 * @param {Object} text - The text object
 * @param {Object} options - The options object
 * @param {Object} contractInformation - The contract information object  
 */
//#region  sign space
const addSignSpaces  =(doc = new jsPDF(), text, options, contractInformation) => {
  customLogger.debug('addSignSpaces params',contractInformation, text, options)
  const titularName = contractInformation.titularName
  const totalWidth = options.contentWidth; // Total width of the content area
  const nameFieldWidth = totalWidth * 0.3; // 30% of the total width
  const signatureFieldWidth = totalWidth * 0.4; // 40% of the total width
  const dateFieldWidth = totalWidth * 0.2; // 20% of the total width

  // Split the text to fit within the name field width
  const nameLines = doc.splitTextToSize(titularName, nameFieldWidth);

  doc.setFontSize(12);

  // Render "Nombre de padres/Guardian" field (wrapped text)
  nameLines.forEach((line, index) => {
    if (options.yPosition + 15 > options.pageHeight - options.marginBottom) {
      doc.addPage();
      options.yPosition = options.marginTop;
    }
    customLogger.debug('line', line, index)  
    doc.text(line, options.marginLeft, options.yPosition + ((index === 0)?12 :index* 5)) ; // Adjust line height if needed
  });

  // Adjust yPosition after rendering the name field
  options.yPosition += nameLines.length * 5 + 5; // Adjust for spacing

  // Render the horizontal lines for each field (no boxes, just lines)
  const lineYPosition = options.yPosition + 5; // Adjust to where the line should appear

  // "Nombre de padres/Guardian" line (30% width)
  doc.line(
    options.marginLeft,
    lineYPosition,
    options.marginLeft + nameFieldWidth,
    lineYPosition
  );

  // "Firma" line (40% width)
  doc.line(
    options.marginLeft + nameFieldWidth + 5, // Small gap between name and signature line
    lineYPosition,
    options.marginLeft + nameFieldWidth + signatureFieldWidth,
    lineYPosition
  );

  // "Fecha" line (20% width)
  doc.line(
    options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, // Gap between signature and date
    lineYPosition,
    options.marginLeft + nameFieldWidth + signatureFieldWidth + dateFieldWidth,
    lineYPosition
  );
  // Optionally, add labels for each field above the lines
  // doc.text('Firma', options.marginLeft + nameFieldWidth + 5, lineYPosition + 5); // firma not needed cuz is put by the user
  doc.text(Functions.formatDateToMMDDYY(new Date()), options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, lineYPosition - 2);
  // Optionally, add labels for each field above the lines
  doc.text("Nombre", options.marginLeft, lineYPosition + 5);
  doc.text('Firma', options.marginLeft + nameFieldWidth + 5, lineYPosition + 5);
  doc.text('Fecha', options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, lineYPosition + 5);
};



/**
 * This function adds the sign spaces to the contract
 * @param {jsPDF} doc - The jsPDF object
 * @param {Object} text - The text object
 * @param {Object} options - The options object
 * @param {Object} contractInformation - The contract information object  
 */
//#region  sign space
const specialSignSpace  =(doc = new jsPDF(), text, options, contractInformation) => {
  customLogger.debug('addSignSpaces params',contractInformation, text, options)
  const titularName = contractInformation.titularName
  const totalWidth = options.contentWidth; // Total width of the content area
  const nameFieldWidth = totalWidth * 0.3; // 30% of the total width
  const signatureFieldWidth = totalWidth * 0.4; // 40% of the total width
  const dateFieldWidth = totalWidth * 0.2; // 20% of the total width

  // Split the text to fit within the name field width
  const nameLines = doc.splitTextToSize(titularName, nameFieldWidth);

  doc.setFontSize(12);

  // Render "Nombre de padres/Guardian" field (wrapped text)
  nameLines.forEach((line, index) => {
    if (options.yPosition + 15 > options.pageHeight - options.marginBottom) {
      doc.addPage();
      options.yPosition = options.marginTop;
    }
    customLogger.debug('line', line, index)  
    doc.text(line, options.marginLeft, options.yPosition + ((index === 0)?12 :index* 5)) ; // Adjust line height if needed
  });

  // Adjust yPosition after rendering the name field
  options.yPosition += nameLines.length * 5 + 5; // Adjust for spacing

  // Render the horizontal lines for each field (no boxes, just lines)
  const lineYPosition = options.yPosition + 5; // Adjust to where the line should appear

  // "Nombre de padres/Guardian" line (30% width)
  doc.line(
    options.marginLeft,
    lineYPosition,
    options.marginLeft + nameFieldWidth,
    lineYPosition
  );

  // "Firma" line (40% width)
  doc.line(
    options.marginLeft + nameFieldWidth + 5, // Small gap between name and signature line
    lineYPosition,
    options.marginLeft + nameFieldWidth + signatureFieldWidth,
    lineYPosition
  );

  // "Fecha" line (20% width)
  doc.line(
    options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, // Gap between signature and date
    lineYPosition,
    options.marginLeft + nameFieldWidth + signatureFieldWidth + dateFieldWidth,
    lineYPosition
  );
  // Optionally, add labels for each field above the lines
  // doc.text('Firma', options.marginLeft + nameFieldWidth + 5, lineYPosition + 5); // firma not needed cuz is put by the user
  doc.text(Functions.formatDateToMMDDYY(new Date()), options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, lineYPosition - 2);
  // Optionally, add labels for each field above the lines
  doc.text("Nombre", options.marginLeft, lineYPosition + 5);
  doc.text('Firma', options.marginLeft + nameFieldWidth + 5, lineYPosition + 5);
  doc.text('Fecha', options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, lineYPosition + 5);
};



  
const preprocessText = (text) => {
// Replace HTML tags with appropriate formatting
text = text.replace(/<em>/g, ' ');  // Replace <em> with _ (or any placeholder you prefer)
text = text.replace(/<\/em>/g, '');  // Replace </em> with _ (or any placeholder you prefer)
text = text.replace(/<strong>/g, '**');  // Replace <strong> with ** (or any placeholder you prefer)
text = text.replace(/<\/strong>/g, '**');  // Replace </strong> with ** (or any placeholder you prefer)

// Replace /n with new line character
text = text.replace(/\/n/g, '\n');

// Remove any remaining HTML tags
text = text.replace(/<\/?[^>]+>/g, '');

return text;
};


const renderFormattedLine = (doc, line, options, centerText = false) => {
  const tokens = line.split(/(\*\*|__|_|#|\u2610|\u2611)/);
  
  let xPos = options.marginLeft;
  let yPos = options.yPosition;

  tokens.forEach(token => {
    switch (token) {
      case '**':
        // Toggle bold font style
        doc.setFont(undefined, doc.getFont().fontStyle === 'bold' ? 'normal' : 'bold');
        break;
      case '$':
        // Toggle italic font style
        doc.setFont(undefined, doc.getFont().fontStyle === 'italic' ? 'normal' : 'italic');
        break;
      case '#':
        // Center text alignment
        centerText = true;
        break;
      case '\u2610': // Unicode for checkbox empty
      case '\u2611': // Unicode for checkbox checked
        if (centerText) {
          doc.text(token, options.pageWidth / 2, yPos, { align: "center" });
        } else {
          doc.text(token, xPos, yPos);
          xPos += doc.getTextWidth(token);
        }
        break;
      default:
        // Default text handling
        if (centerText) {
          doc.text(token, options.pageWidth / 2, yPos, { align: "center" });
        } else {
          doc.text(token, xPos, yPos);
          xPos += doc.getTextWidth(token);
        }
        break;
    }
  });

  // Reset centerText to false for next lines
  centerText = false;
};

export function compressPDF(pdf = new jsPDF(), options) {
	// Check if the options object is defined
	if (!options) {
		options = {};
	}

	// Set the compression algorithm
	options.compression = "gzip";
	options.compress = 5;
	options.removeUnusedFonts  = true
	options.removeUnusedImages = true
	
	// Reduce the resolution of the PDF
	if (options.resolution) {
		options.resolution = 150;
	}

	// Remove unused fonts and images
	if (options.removeUnusedFonts && options.removeUnusedImages) {
		options.removeUnusedFonts = true;
		options.removeUnusedImages = true;
	}
	
	// Adjust resolution if specified
	if (options.resolution) {
		options.resolution = Math.max(72, options.resolution); // Ensure a minimum resolution of 72
	}


	// Output the compressed PDF
	return pdf.output("datauristring", options);
}


const contractGenerator = async (contractInformation =defaultContractInfo) => {
  const contractBase = contractInfo(contractInformation);
  const doc = new jsPDF({
    filters: ["ASCIIHexEncode"], 
    format: 'letter'
  });
  addFonts(doc)

  // Set default font
 // doc.setFont("Arial", "normal");
  doc.setFont("Arial", "normal");
  doc.setFontSize(12);
   // Margin settings and other general properties
   let pageOptions = {
    marginLeft: 12.7, // 6 cm
    marginLeftTitles: 60, // 6 cm
    marginTop: 12.7, // 1.27 cm
    marginBottom: 12.7, // 1.27 cm
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    yPosition:initialYposition, 
    initialY: initialYposition
  };
  pageOptions.contentWidth = pageOptions.pageWidth - pageOptions.marginLeft * 2;
  pageOptions.contentHeight = pageOptions.pageHeight - pageOptions.marginTop - pageOptions.marginBottom;
  // Adding pages to the document
  addFirstPage(doc, pageOptions,contractBase,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page2', true);
  addPageContent(doc, contractBase, pageOptions, 'page3',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page4',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page5',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page6',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page7',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page8',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page9',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page10',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page11',true,contractInformation);
  addPageContent(doc, contractBase, pageOptions, 'page12',true,contractInformation);
  addContractTerms(doc, contractBase, pageOptions)
  await addFormGob(doc, contractBase, pageOptions);

  const pdfBase64 = compressPDF(doc);
  return pdfBase64; 
};
const addFormGob = async (doc) => {
  // Load the external PDF as a PDFDocument from pdf-lib
  const externalPdfBytes = await ContractUtils.formGobAsBits(); // Fetch PDF as ArrayBuffer or Uint8Array

   // Use pdf-lib to handle the PDF loading
   const externalPdf = await PDFDocument.load(externalPdfBytes);

   // Get all pages of the external PDF
   const externalPages = await externalPdf.getPages();
 
   // For each page in the external PDF, convert it to an image and add to jsPDF
   for (let i = 0; i < externalPages.length; i++) {
     if (i > 0) {
       doc.addPage(); // Add a new page for each page of the external PDF
     }
     const page = externalPages[i];
     
     // Convert the page to an image (e.g., PNG or JPEG)
     const imgData = await page.render({ scale: 1 }).then(canvas => canvas.toDataURL('image/jpeg'));
     
     // Add the image to the jsPDF document
     doc.addImage(imgData, 'JPEG', 0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight());
   }
 };
  // Function to add the first page
  const addFirstPage = (doc, options,contractInfo,contractInformation = defaultContractInfo ) => {
    options.yPosition = options.yPosition - 10
    addHeader(doc, "Educando Childcare Center", options,"title");
    addHeader(doc, "Contrato", options,"title");
    addDateOnContract(doc,`Fecha de Comienzo ${Functions.formatDateToMMDDYY(contractInformation.startDate)}`,options)
    addPageContent(doc, contractInfo, options, 'page1');
    options.yPosition = options.initialY
    
    doc.addPage();
  };
// Function to add the header
const addDateOnContract = (doc, text, options) => {
  doc.setFontSize(12); // Larger font size for header
  doc.setFont("Arial", "bold");
  doc.text(text, (options.pageWidth / 2) +50, options.yPosition, { align: "center" });
  doc.setFont("Arial", "normal");
  doc.setFontSize(12); // Larger font size for header
  options.yPosition += 10; // Adjust the line height as needed
};
const addContractMutualTerms = (doc,contractBase, pageOptions) => {
  addPageContent(doc, contractBase, pageOptions, 'page11',true);
  addPageContent(doc, contractBase, pageOptions, 'page12',true);
  addPageContent(doc, contractBase, pageOptions, 'page13',true);
}

const addContractTerms =(doc,contractBase, pageOptions) => {
  addPageContent(doc, contractBase, pageOptions, 'page13',true);
  addPageContent(doc, contractBase, pageOptions, 'page14',true);
  addPageContent(doc, contractBase, pageOptions, 'page15',true);
  addPageContent(doc, contractBase, pageOptions, 'page16',true);
  addPageContent(doc, contractBase, pageOptions, 'page17',true);
  addPageContent(doc, contractBase, pageOptions, 'page18',true);
  addPageContent(doc, contractBase, pageOptions, 'page19',true);




}

export default contractGenerator;

const drawSignatureSection = (doc, startX, startY, lineHeight, parentName, date) => {
  const lineLength = 100; // Length of the lines
  const labelGap = 10; // Gap between the label and the line
  const signatureLineLength = 150; // Length of the signature line

  // Labels
  const labels = [
    { text: 'Name of Mother/Father/Guardian', value: parentName },
    { text: 'Signature', value: '' },
    { text: 'Date', value: date }
  ];

  labels.forEach((label, i) => {
    const yPos = startY + (i * lineHeight * 2); // Positioning lines with some space in between

    // Draw label
    doc.setFontSize(8);
    doc.text(label.text, startX, yPos);

    // Draw line
    const lineStartX = startX + doc.getTextWidth(label.text) + labelGap;
    const lineEndX = lineStartX + (label.text === 'Signature' ? signatureLineLength : lineLength);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(lineStartX, yPos, lineEndX, yPos);

    // Draw value
    if (label.value) {
      doc.text(label.value, lineStartX + 2, yPos - 2); // Adjust position of value
    }
  });
};
