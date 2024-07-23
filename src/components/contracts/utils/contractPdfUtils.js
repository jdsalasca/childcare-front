// contractPdfUtils.js

import jsPDF from 'jspdf';
import {  contractInfo } from './contractJson';
import { addFonts } from './jsPdfArial';

// Function to add the header
const initialYposition  = 12.7 + 10;
const addPageContent = (doc = new jsPDF(), contractInfo, options, pageName,createPage =false) => {
  if (contractInfo[pageName]) {
    Object.keys(contractInfo[pageName]).forEach(key => {
      let content = contractInfo[pageName][key];
      if (key === 'separator') {
        // Add a separator line
        addSeparator(doc, options);
      } else if (key === 'title' || key === 'subtitle') {
        // Add title or subtitle
        addHeader(doc, content, options, key);
      } else if (key.startsWith('parr')) {
        // Add body text
        addBodyText(doc, content, options);
      }else if (key.startsWith("signSection")){
        addSignSpaces(doc, content, options)

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


const addSignSpaces  =(doc, text, options) => {
  // Preprocess the text to handle HTML tags and line breaks
  text = preprocessText(text);
  
  const lines = doc.splitTextToSize(text, options.contentWidth);
  doc.setFontSize(12);
  
  lines.forEach(line => {
    if (options.yPosition + 10 > options.pageHeight - options.marginBottom) {
      doc.addPage();
      options.yPosition = options.marginTop;
    }
    //renderFormattedLine(doc,line, options)
    doc.text(line, options.marginLeft, options.yPosition);
    options.yPosition += 5; // Adjust the line height as needed
  });
  };
  
const preprocessText = (text) => {
// Replace HTML tags with appropriate formatting
text = text.replace(/<em>/g, '_');  // Replace <em> with _ (or any placeholder you prefer)
text = text.replace(/<\/em>/g, '');  // Replace </em> with _ (or any placeholder you prefer)
text = text.replace(/<strong>/g, '**');  // Replace <strong> with ** (or any placeholder you prefer)
text = text.replace(/<\/strong>/g, '**');  // Replace </strong> with ** (or any placeholder you prefer)

// Replace /n with new line character
text = text.replace(/\/n/g, '\n');

// Remove any remaining HTML tags
text = text.replace(/<\/?[^>]+>/g, '');

return text;
};

// Default object with contractStartDate set to current date in ISO format
export const defaultContractInfo = {
  contractStartDate: new Date().toISOString().split('T')[0], // Format to YYYY-MM-DD
  todayDate: new Date().toISOString().split('T')[0], // Format to YYYY-MM-DD,
  guardian:{
    name:"Jorge Salazar"
  },
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
      case '__':
      case '_':
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
	options.compress = 1;
	// Reduce the resolution of the PDF
	if (options.resolution) {
		options.resolution = 150;
	}

	// Remove unused fonts and images
	if (options.removeUnusedFonts && options.removeUnusedImages) {
		options.removeUnusedFonts = true;
		options.removeUnusedImages = true;
	}

	// Output the compressed PDF
	return pdf.output("datauristring", options);
}
const contractGenerator = (contractInformation =defaultContractInfo) => {
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
  addPageContent(doc, contractBase, pageOptions, 'page3',true);
  addContractTerms(doc, contractBase, pageOptions)
  addContractMutualTerms(doc, contractBase, pageOptions)
  // addPageContent(doc, contractBase, pageOptions, 'page5',true);
  // addPageContent(doc, contractBase, pageOptions, 'page6',true);
  // addPageContent(doc, contractBase, pageOptions, 'page7',true);

  // Save the document
  //doc.save("contract.pdf");

  const pdfBase64 = compressPDF(doc);
  return pdfBase64; 
};

  // Function to add the first page
  const addFirstPage = (doc, options,contractInfo,contractInformation = defaultContractInfo ) => {
    options.yPosition = options.yPosition - 10
    addHeader(doc, "Educando Childcare Center", options,"title");
    addHeader(doc, "Contrato", options,"title");
    addDateOnContract(doc,`Fecha de Comienzo ${contractInformation.contractStartDate}`,options)
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
  addPageContent(doc, contractBase, pageOptions, 'page4',true);
  addPageContent(doc, contractBase, pageOptions, 'page5',true);
  addPageContent(doc, contractBase, pageOptions, 'page6',true);
  addPageContent(doc, contractBase, pageOptions, 'page7',true);
  addPageContent(doc, contractBase, pageOptions, 'page8',true);
  addPageContent(doc, contractBase, pageOptions, 'page9',true);
  addPageContent(doc, contractBase, pageOptions, 'page10',true);




}

export default contractGenerator;

