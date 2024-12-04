import jsPDF from 'jspdf';
import { Functions } from '../../../utils/functions';
import { ContractInfo, Language } from '../types/ContractInfo';
import { addFonts } from './jsPdfArial';
import { contractInfo } from './newContractGenerator';
import { AcroFormTextField } from 'jspdf';
import { mockContract } from '../../../data/mockContract';
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
  if (!contractProcessed[pageName]) {
    console.warn(`Page name "${pageName}" not found in contractInfo.`);
    return doc;
  }


  // Process the page content with child iterations
  const processedPages = processChildIterations(
    contractProcessed[pageName],
    contractInformation?.children || []
  );

  processedPages.forEach((processedPage, index) => {
    // Always add a new page for each child iteration except the first one
    if (index > 0 || (createPage && index === 0)) {
      doc.addPage();
      options.yPosition = options.initialY;
    }

    // Process each content item on the page
    Object.entries(processedPage).forEach(([key, content]) => {
      processContentItem(doc, key, content, options, contractInformation, language);
    });
  });

  return doc;
};


const addInputField = (doc: jsPDF, content: string, options: Options, contractInformation: ContractInfo) => {
  const inputValue = contractInformation.weeklyPayment || '';
  doc.setFontSize(12);
  doc.text(content, options.marginLeft, options.yPosition);
  doc.text(inputValue, options.marginLeft + doc.getTextWidth(content) + 5, options.yPosition);
  options.yPosition += 10;
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

const addBodyText = (doc: jsPDF, text: string, options: Options, editable: boolean = false) => {
  text = preprocessText(text);
  const lines = doc.splitTextToSize(text, options.contentWidth);
  doc.setFontSize(12);

  lines.forEach((line: string) => {
    if (options.yPosition + 10 > options.pageHeight - options.marginBottom) {
      doc.addPage();
      options.yPosition = options.marginTop;
    }
    
    if (editable) {
      // Create text field for editable content
      const field = new AcroFormTextField();
      field.x = options.marginLeft;
      field.y = options.yPosition - 10;
      field.width = options.contentWidth;
      field.height = 12;
      field.multiline = true;
      field.fieldName = `field_${Math.random().toString(36).substr(2, 9)}`;
      field.fontSize = 12;
      field.value = line;
      
      doc.addField(field);
    } else {
      renderFormattedLine(doc, line, options);
    }
    
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

   // Extract input fields with their properties
   const inputRegex = /<input[^>]*>/g;
   const inputs: {text: string, width?: number}[] = [];
   
   text = text.replace(inputRegex, (match) => {
     // Extract width if specified
     const widthMatch = match.match(/width="([^"]*)"/);
     const width = widthMatch ? parseInt(widthMatch[1]) : 50;
     
     // Add placeholder for input
     inputs.push({text: '', width});
     return '{{INPUT}}';
   });
   
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
        case '✓':
          case '✗':
          case '○':
          case '●':
          case '□':
          case '■':
          case '★':
          case '♥':
          case '→':
          case '•':
            // Temporarily switch to Helvetica for unicode characters
            const currentFont = doc.getFont();
            doc.setFont("Helvetica", "normal");
            if (centerText) {
              doc.text(token, options.pageWidth / 2, yPos, { align: "center" });
            } else {
              doc.text(token, xPos, yPos);
              xPos += doc.getTextWidth(token);
            }
            // Switch back to previous font
        doc.setFont(currentFont.fontName, currentFont.fontStyle);
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
  
  static contractBuilder = (contractInformation: ContractInfo = mockContract, language:Language = Language.English) => {
    const contractBase = contractInfo(contractInformation,language);
    const doc = new jsPDF({
      
      filters: ["ASCIIHexEncode"],
      format: 'letter',
      putOnlyUsedFonts: true,
      floatPrecision:16,
      hotfixes:["px_scaling"],

      
    });
    const form = doc.AcroForm;
   
    form.Appearance = () => ({
     needAppearances: true,
     SigFlags: 0,
     TextField: () => new AcroFormTextField()
    })
    
    doc.setProperties({
      title: 'Contract',
      author: 'Educando Childcare Center',
      subject: 'Contract',
      keywords: 'Contract',
      creator: 'Educando Childcare Center',
      
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
    (doc as any).internal.unicode = true;
    doc.setFont("Helvetica", "normal"); // This font supports basic unicode

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

const addFormField = (doc: jsPDF, x: number, y: number, width: number = 50) => {
  try {
    const field = new AcroFormTextField();
    
    field.x = x;
    field.y = y - 10;
    field.width = width;
    field.height = 10;
    field.fieldName = `field_${Math.random().toString(36).substr(2, 9)}`;
    field.fontSize = 12;
    field.value = '';
    field.readOnly = false;
    
    // Add visible borders and background
  /*   field.borderStyle = 'solid';
    field.borderWidth = 1;
    field.backgroundColor = [0.9, 0.9, 0.9];  // Light gray background
    field.textColor = [0, 0, 0]; */
    
    doc.addField(field);
    
    // Draw a visible rectangle around the field
    doc.setDrawColor(0);
    doc.setLineWidth(0.1);
    doc.rect(x, y - 10, width, 10);
    
    return width + 2;
  } catch (error) {
    console.error('Error adding form field:', error);
    return width + 2;
  }
};
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
 /*    doc.addPage(); */
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
function processChildIterations(page: PageContent, children: any[]): PageContent[] {
  // If there's no child iteration content or no children, return original page
  if (!page.childIteration?.content || !children.length) {
    return [page];
  }

  // Create a page for each child
  return children.map(child => {
    // Create a deep copy of the page content
    const processedPage: PageContent = JSON.parse(JSON.stringify({
      // Copy non-iteration content
      ...Object.fromEntries(
        Object.entries(page).filter(([key]) => key !== 'childIteration')
      ),
      // Add child iteration content
      ...page.childIteration.content
    }));

    // Process all string values to replace child placeholders
    const processObject = (obj: any) => {
      const icons = {
        check: 'X',
        circle: 'O',
        // Add more icons as needed
      };
    
      
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string') {
          obj[key] = value
            .replace(/{{childName}}/g, `${child.first_name} ${child.last_name}` || '')
            .replace(/{{childFirstName}}/g, child.first_name || '')
            .replace(/{{childLastName}}/g, child.last_name || '')
            .replace(/{{childBornDate}}/g, Functions.formatDateToMMDDYY(child.born_date!) || '')
            .replace('{{healthStatus}}', child.medicalInformation?.healthStatus || '_________________________________________________')
            .replace('{{treatment}}', child.medicalInformation?.treatment || '________________________________________________________')
            .replace('{{allergies}}', child.medicalInformation?.allergies || '_________________________________________________')
            .replace('{{instructions}}', child.medicalInformation?.instructions || '_________________________________________________________________________________________________________________________________________________________________________________________________________________________________')
         // Add formula information placeholders
         .replace('{{formula}}', child.formulaInformation?.formula || '______________________________________________________________________')
         .replace('{{feedingTimes}}', (child.formulaInformation?.feedingTimes || ['________', '________', '________', '________', '_______']).join('    '))
         .replace('{{maxBottleTime}}', child.formulaInformation?.maxBottleTime || '_______________')
         .replace('{{minBottleTime}}', child.formulaInformation?.minBottleTime || '_________')
         .replace('{{bottleAmount}}', child.formulaInformation?.bottleAmount || '________________________________')
         .replace('{{feedingInstructions}}', child.formulaInformation?.feedingInstructions || '__________________________________________________________________________________________________________________________________________________________________________________________________')
         .replace('{{otherFood}}', child.formulaInformation?.otherFood || '___________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________')
         .replace('{{foodAllergies}}', child.formulaInformation?.foodAllergies || '______________________________________________________________________________________________________________________________________________________')
         // Follow meal program with unicode support
         .replace('{{followMealProgramYes}}', child.formulaInformation?.followMealProgram ? icons.check : '')
         .replace('{{followMealProgramNo}}', child.formulaInformation?.followMealProgram ? '' : icons.circle)
         .replace('{{soap}}', child.permissionsInformation?.soap ? icons.check : icons.circle)
         .replace('{{sanitizer}}', child.permissionsInformation?.sanitizer ? icons.check : icons.circle)
         .replace('{{rashCream}}', child.permissionsInformation?.rashCream ? icons.check : icons.circle)
         .replace('{{teethingMedicine}}', child.permissionsInformation?.teethingMedicine ? icons.check : icons.circle)
         .replace('{{sunscreen}}', child.permissionsInformation?.sunscreen ? icons.check : icons.circle)
         .replace('{{insectRepellent}}', child.permissionsInformation?.insectRepellent ? icons.check : icons.circle)
         .replace('{{other}}', child.permissionsInformation?.other || '______________________________________________________________________________________________________________________________________________________');

         
  
            // Add any other child-related placeholders here
        } else if (typeof value === 'object' && value !== null) {
          processObject(value);
        }
      });
    };

    processObject(processedPage);
    return processedPage;
  });
}
// Add these interfaces at the top of the file
interface IterationMarker {
  start?: boolean;
  end?: boolean;
}

interface PageContent {
  [key: string]: any;
  iterateChildren?: IterationMarker;
}

const processContentItem = (
  doc: jsPDF,
  key: string,
  content: any,
  options: Options,
  contractInformation?: ContractInfo,
  language?: Language
) => {
  const isEditable = key.includes('input') || key.includes('editable');

  switch (true) {
    case key.startsWith('separator'):
      addSeparator(doc, options);
      break;
    case key === 'title' || key === 'subtitle':
      addHeader(doc, content, options, key);
      break;
    case key.startsWith('parr'):
      addBodyText(doc, content, options, isEditable);
      break;
    case key.startsWith('yPlus'):
      options.yPosition += content;
      break;
    case key.startsWith('signSectionEducando'):
      addSignSpaces(doc, content, options, contractInformation, 
        { showParentName: false, showEducandoName: true }, language);
      break;
    case key.startsWith('signSection'):
      addSignSpaces(doc, content, options, contractInformation,
        { showParentName: true, showEducandoName: false }, language);
      break;
    case key.startsWith('input'):
      addInputField(doc, content, options, contractInformation!);
      break;
  }
};