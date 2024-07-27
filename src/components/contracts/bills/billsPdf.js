import jsPDF from 'jspdf';
import { logoImg } from './logoimg';
import { addFonts } from '../utils/jsPdfArial';

// Usage example:
// renderLeftContent(doc, 10, 10, 10, bill, pageWidth, pageHeight);
const renderRightContent = (doc, startX, startY, lineHeight, bill) => {
  const rightMargin = 10; // Left margin for the right side content
  const boxWidth = 40; // Width of the boxes
  const boxHeight = lineHeight + 2; // Height of the boxes
  const labelMargin = 0; // Margin between label and box

  const rightContent = [
    { label: 'CASH >', value: String(bill.cash || '') },
    { label: 'CHECK >', value: String(bill.check || '') },
    { label: 'OTHER SIDE >', value: '' },
    { label: 'Subtotal >', value: String(bill.subtotal || '') },
    { label: 'Received >', value: String(bill.received || '') },
    { label: 'Total $', value: String(bill.total || '') }
  ];
  

  rightContent.forEach((item, i) => {
    const yPos = startY + (i * lineHeight * 1.5); // Adding more spacing between lines

    // Draw label
    doc.text(item.label, startX + rightMargin, yPos, { align: 'left' });

    // Draw box behind the value
    const boxXPos = startX + rightMargin + labelMargin + boxWidth; // Position box after label
    const boxYPos = yPos - lineHeight + 2; // Adjusting position to be behind the value
    doc.rect(boxXPos, boxYPos, boxWidth, boxHeight); // Adjust size and position as needed

    // Draw value inside the box
    const textXPos = boxXPos + 5; // Text position inside the box with some padding
    doc.text(item.value, textXPos, yPos, { align: 'left' });
  });
};


export const exportToPDF = (bills) => {
  const doc = new jsPDF();
  addFonts(doc)

  const margin = 10;
  const lineHeight = 8;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const maxBillsPerPage = 3;
  let billIndex = 0;

  bills.forEach((bill, index) => {
    if (billIndex >= maxBillsPerPage) {
      doc.addPage();
      billIndex = 0;
    }

    const startY = margin + (billIndex * 90);

    const leftStartX = margin;
    renderLeftContent(doc, leftStartX, startY, lineHeight, bill, pageWidth, pageHeight);

    const rightStartX = pageWidth / 2 + margin;
    renderRightContent(doc, rightStartX, startY, lineHeight, bill);

    // Draw gray line after each bill
    const lineYPos = startY + 90 - 5; // Adjust the Y position to be at the bottom of each bill
    drawGrayLine(doc, lineYPos, pageWidth);

    billIndex++;
  });

  doc.save('deposit_ticket.pdf');
};

const drawGrayLine = (doc, yPos, pageWidth) => {
  doc.setDrawColor(0, 0, 0); // Set draw color to gray
  doc.setLineWidth(0.5); // Adjust the thickness of the line
  doc.line(0, yPos-5, pageWidth, yPos-5);
};

const logoImage = 'data:image/png;base64,' + logoImg; // Replace with base64 of the logo

const renderLeftContent = (doc, startX, startY, lineHeight, bill, pageWidth, pageHeight) => {
    console.log('====================================');
    console.log("bill", bill);
    console.log('====================================');
    const leftContent = [
        { text: 'DEPOSIT TICKET', style: { bold: true, color: 'black' } },
        { text: 'PAISANO INSURANCE LLC', style: { bold: true, color: 'black' } },
        { text: '(GOLD ACCOUNT) OFF FR', style: { color: 'black' } },
        { text: '4806 S 24TH ST', style: { color: 'black' } },
        { text: 'OMAHA NE 68107', style: { color: 'black' } },
        { text: `Date: ${bill.date || ''}`, style: { color: 'black', bold: true } },
        { text: 'SIGN HERE IF CASH RECEIVED (IF REQUIRED)*', style: { color: 'black' } },
        { text: 'A5001d1003a 110172530C', style: { color: 'black' } }
    ];

    // Add the image to the left side, covering 100% of the left side's 50% width
    const leftWidth = pageWidth / 2;

    doc.setFontSize(12);

    // Calculate initial Y position
    let currentY = startY;

    // Helper function to draw text
    const drawText = (text, style, yPos) => {
        if (style.bold) {
            doc.setFont(undefined, 'bold');
        } else {
            doc.setFont(undefined, 'normal');
        }

        if (style.color) {
            doc.setTextColor(style.color);
        } else {
            doc.setTextColor('black');
        }

        const textWidth = doc.getTextWidth(text);
        const centerX = startX + (leftWidth - textWidth) / 2;
        doc.text(text, centerX, yPos);
    };

    // Render each line individually
    drawText(leftContent[0].text, leftContent[0].style, currentY);
    currentY += lineHeight;

    drawText(leftContent[1].text, leftContent[1].style, currentY);
    currentY += lineHeight;

    drawText(leftContent[2].text, leftContent[2].style, currentY);
    currentY += lineHeight;

    drawText(leftContent[3].text, leftContent[3].style, currentY);
    currentY += lineHeight;

    drawText(leftContent[4].text, leftContent[4].style, currentY);
    currentY += lineHeight;

    drawText(leftContent[5].text, leftContent[5].style, currentY);
    currentY += lineHeight+5;
        // Draw the gray line for signing
        doc.setDrawColor(169, 169, 169); // Set draw color to gray
        const lineStartX = startX + 10;
        const lineEndX = startX + leftWidth - 5;
        const lineY = currentY-5 ;
        doc.line(lineStartX, lineY, lineEndX, lineY);
    

    // Add the specific text with a gray line below it
    drawText(leftContent[6].text, leftContent[6].style, currentY);
    currentY += lineHeight-8;


    // currentY += 5; // Move down by a bit after the line

    // Add the image below the line
    doc.addImage(logoImage, 'PNG', startX + (leftWidth - 90) / 2, currentY, leftWidth - 10, 20); // Adjust the width and height as needed
    currentY += 20 + lineHeight; // Move down by the height of the image plus some margin

    doc.setFont("VT323", "normal");
    // Add the final line of text
    drawText(leftContent[7].text, leftContent[7].style, currentY-5);
      // Reset font to default (Helvetica)
  doc.setFont("helvetica", "normal");
};
