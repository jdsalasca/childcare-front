import jsPDF from 'jspdf';
import { Functions } from '../../../utils/functions';
import { ContractInfo, defaultContractInfoFinished, Language } from '../types/ContractInfo';
import { addFonts } from './jsPdfArial';
import { contractInfo } from './newContractGenerator';

const initialYposition = 12.7 + 10;


interface Options {
  marginLeft: number;
  marginLeftTitles: number;
  marginTop: number;
  marginBottom: number;
  pageWidth: number;
  pageHeight: number;
  yPosition: number;
  initialY: number;
  contentWidth: number;
  contentHeight: number;
}

const addPageContent = (
  doc: jsPDF,
  contractProcessed: any,
  options: Options,
  pageName: string,
  createPage: boolean = false,
  contractInformation?: ContractInfo,
  language?: Language
): jsPDF => {

  if (contractProcessed[pageName]) {
    Object.keys(contractProcessed[pageName]).forEach(key => {
      let content = contractProcessed[pageName][key];
      if (key.startsWith('separator')) {
        addSeparator(doc, options);
      } else if (key === 'title' || key === 'subtitle') {
        addHeader(doc, content, options, key);
      } else if (key.startsWith('parr')) {
        addBodyText(doc, content, options);
      } else if (key.startsWith("yPlus")) {
        options.yPosition += content;
      } else if (key.startsWith("signSectionEducando")) {
        addSignSpaces(doc, contractProcessed, options, contractInformation, { showParentName: false, showEducandoName: true },language);
      } else if (key.startsWith("signSection")) {
        addSignSpaces(doc, contractProcessed, options, contractInformation,{ showParentName: true, showEducandoName: false },language);
      }
    });
    options.yPosition = options.initialY;
    if (createPage) {
      doc.addPage();
    }
  } else {
    console.warn(`Page name "${pageName}" not found in contractInfo.`);
  }
  return doc;
};

const addHeaderFontStyle = (textObject: any, type: string): string => {
  if (typeof textObject === "string") {
    return type === 'title' ? 'bold' : 'italic';
  } else if (typeof textObject === "object") {
    return textObject.fontStyle;
  }
  return 'normal';
};

const addHeader = (doc: jsPDF, text: any, options: Options, type: string = 'subtitle') => {
  const fontStyle = addHeaderFontStyle(text, type);
  text = preprocessText(text.text ?? text);
  const fontSize = type === 'title' ? 16 : 14;
  doc.setFontSize(fontSize);
  doc.setFont("Arial", fontStyle);
  renderFormattedLine(doc, text.text ?? text, options, true);
  doc.setFont("Arial", "normal");
  doc.setFontSize(12);
  options.yPosition += 10;
};

const addSeparator = (doc: jsPDF, options: Options) => {
  const lineWidth = 0.5;
  const yPosition = options.yPosition;

  doc.setLineWidth(lineWidth);
  doc.line(options.marginLeft, yPosition, options.pageWidth - options.marginLeft, yPosition);
  options.yPosition = yPosition + lineWidth + 10;

  doc.setLineWidth(0.2);
};


const addBodyText = (doc: jsPDF, text: string, options: Options) => {
  text = preprocessText(text);
  const lines = doc.splitTextToSize(text, options.contentWidth);
  doc.setFontSize(12);

  lines.forEach((line: string) => { // Explicitly type 'line' as string
    if (options.yPosition + 10 > options.pageHeight - options.marginBottom) {
      doc.addPage();
      options.yPosition = options.marginTop;
    }
    renderFormattedLine(doc, line, options);
    options.yPosition += 5;
  });
};

const DefaultSignOptions = {
  showParentName: true,
  showEducandoName: false,
};


const addSignSpaces = (doc: jsPDF = new jsPDF(), text: any, options: Options, contractInformation: any, 
signOptions: any = DefaultSignOptions, language : Language = Language.Spanish) => {
  const titularName = contractInformation.titularName;
  const totalWidth = options.contentWidth;
  const nameFieldWidth = totalWidth * 0.3;
  const signatureFieldWidth = totalWidth * 0.4;
  const dateFieldWidth = totalWidth * 0.2;

  const nameLines = doc.splitTextToSize(titularName, nameFieldWidth);
  doc.setFontSize(12);

  if (signOptions.showParentName) {
    nameLines.forEach((line: string, index: number) => { // Explicitly type 'line' as string and 'index' as number
      if (options.yPosition + 15 > options.pageHeight - options.marginBottom) {
        doc.addPage();
        options.yPosition = options.marginTop;
      }
      doc.text(line, options.marginLeft, options.yPosition + ((index === 0) ? 12 : index * 5));
    });
  }
  

  options.yPosition += nameLines.length * 5 + 5;

  const lineYPosition = options.yPosition + 5;
  if (signOptions.showParentName) {
    doc.line(
      options.marginLeft,
      lineYPosition,
      options.marginLeft + nameFieldWidth,
      lineYPosition
    );

    doc.line(
      options.marginLeft + nameFieldWidth + 5,
      lineYPosition,
      options.marginLeft + nameFieldWidth + signatureFieldWidth,
      lineYPosition
    );

    doc.line(
      options.marginLeft + nameFieldWidth + signatureFieldWidth + 10,
      lineYPosition,
      options.marginLeft + nameFieldWidth + signatureFieldWidth + dateFieldWidth,
      lineYPosition
    );
  } else if (signOptions.showEducandoName) {
    doc.line(
      options.marginLeft,
      lineYPosition,
      options.marginLeft + nameFieldWidth + 20,
      lineYPosition
    );
  }

  const dateLabel = language === Language.Spanish ? "Fecha" : "Date";
  const nameLabel = language === Language.Spanish ? "Nombre" : "Name";
  const signLabel = language === Language.Spanish ? "Firma" : "Signature";
  const signEducandoLabel = language === Language.Spanish ? "Firma de Educando Childcare Center" : "Educando Childcare Center Signature";
  if (signOptions.showParentName) {
    doc.text(Functions.formatDateToMMDDYY(new Date()), options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, lineYPosition - 2);
    doc.text(dateLabel, options.marginLeft + nameFieldWidth + signatureFieldWidth + 10, lineYPosition + 5);
  } else if (signOptions.showEducandoName) {
    // Optional: Add date label for Educando if needed
  }

  if (signOptions.showParentName) {
    doc.text(nameLabel, options.marginLeft, lineYPosition + 5);
    doc.text(signLabel, options.marginLeft + nameFieldWidth + 5, lineYPosition + 5);
  } else if (signOptions.showEducandoName) {
    doc.text(signEducandoLabel, options.marginLeft, lineYPosition + 5);
  }
};

  
const preprocessText = (text:string) => {
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


const renderFormattedLine = (doc : jsPDF, line: string, options: Options, centerText: boolean = false) => {
  const tokens = line.split(/(\*\*|__|_|#|\u2610|\u2611)/);
  
  let xPos = options.marginLeft;
  let yPos = options.yPosition;

  tokens.forEach(token => {
    switch (token) {
      case '**':
        // Toggle bold font style
        doc.setFont("Helvetica", doc.getFont().fontStyle === 'bold' ? 'normal' : 'bold');
        break;
      case '$':
        // Toggle italic font style
        doc.setFont("Helvetica", doc.getFont().fontStyle === 'italic' ? 'normal' : 'italic');
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


// Compress PDF for optimization
export function compressPDF(pdf = new jsPDF(), options:any = {}) {
  options.compression = "gzip"; // Set compression type
  options.compress = 5; // Set compression level
  options.removeUnusedFonts = true;
  options.removeUnusedImages = true;

  if (options.resolution) {
    options.resolution = Math.max(72, 150); // Set resolution (ensure it's at least 72 DPI)
  }

  return pdf.output("datauristring", options); // Return compressed PDF as data URI
}

export class ContractPdf {
  static contractBuilder = (contractInformation: ContractInfo = defaultContractInfoFinished, language:Language = Language.English) => {
    const contractBase = contractInfo(contractInformation,language);
    const doc = new jsPDF({
      filters: ["ASCIIHexEncode"],
      format: 'letter'
    });
    addFonts(doc);
    const options: Options = {
      marginLeft: 20,
      marginLeftTitles: 20,
      marginTop: 20,
      marginBottom: 20,
      pageWidth: doc.internal.pageSize.getWidth(),
      pageHeight: doc.internal.pageSize.getHeight(),
      yPosition: initialYposition,
      initialY: initialYposition,
      contentWidth: doc.internal.pageSize.getWidth() - 40,
      contentHeight: doc.internal.pageSize.getHeight() - 40,
    };
    options.contentWidth = options.pageWidth - options.marginLeft * 2;
    options.contentHeight = options.pageHeight - options.marginTop - options.marginBottom;
    addFonts(doc)
    addFirstPage(doc, options,contractBase,contractInformation, language);
    addPageContent(doc, contractBase, options, 'page2', true, contractInformation, language);
    addPageContent(doc, contractBase, options, 'page3',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page4',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page5',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page6',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page7',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page8',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page9',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page10',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page11',true,contractInformation,language);
    addPageContent(doc, contractBase, options, 'page12',true,contractInformation,language); 
    addContractTerms(doc, contractBase, options, language)

    return doc;
  };
}


  // Function to add the first page
  const addFirstPage = (doc: jsPDF, options: Options,contractInfo :any ,contractInformation :ContractInfo, language : Language) => {
    options.yPosition = options.yPosition - 10
    const contractLabel: string = language === Language.English ? "Contract" : "Contrato"
    const startDate: string = language === Language.English ? `Start Date ${Functions.formatDateToMMDDYY(contractInformation.start_date!)}` : `Fecha de Comienzo ${Functions.formatDateToMMDDYY(contractInformation.start_date!)}`
    addHeader(doc, "Educando Childcare Center", options,"title");
    addHeader(doc, contractLabel, options,"title");
    // addDateOnContract(doc,startDate,options)
    addPageContent(doc, contractInfo, options, 'page1',false,undefined,language);
    options.yPosition = options.initialY
    doc.addPage();
  };

  // Function to add the header
const addDateOnContract = (doc : jsPDF, text: string, options: Options) => {
  doc.setFontSize(12); // Larger font size for header
  doc.setFont("Arial", "bold");
  doc.text(text, (options.pageWidth / 2) +50, options.yPosition, { align: "center" });
  doc.setFont("Arial", "normal");
  doc.setFontSize(12); // Larger font size for header
  options.yPosition += 10; // Adjust the line height as needed
};

const addContractTerms =(doc : jsPDF, contractBase: any, options: Options, language : Language) => {
  addPageContent(doc, contractBase, options, 'page13',true,undefined, language );
  addPageContent(doc, contractBase, options, 'page14',true,undefined, language);
  addPageContent(doc, contractBase, options, 'page15',true,undefined, language);
  addPageContent(doc, contractBase, options, 'page16',true,undefined, language);
  addPageContent(doc, contractBase, options, 'page17',true,undefined, language);
  addPageContent(doc, contractBase, options, 'page18',true,undefined, language);
  addPageContent(doc, contractBase, options, 'page19',false,undefined, language);


}

