import jsPDF from 'jspdf';
import { logoImg } from './logoimg';
import { addFonts } from '../utils/jsPdfArial';


export const exportToPDF = (bills) => {
  const doc = new jsPDF();
  addFonts(doc);

  const margin = 10;
  const lineHeightLeftSide = 4;
  const lineHeightRightSide = 7;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const maxBillsPerPage = 4;
  let billIndex = 0;

  bills.forEach((bill, index) => {
    console.log('====================================');
    console.log(bill );
    console.log('====================================');
    if((bill.cash == null || bill.cash ==="" || bill.cash ===0) && (bill.check == null || bill.check ===""|| bill.check ===0) ){
      return;
    }
    if (billIndex >= maxBillsPerPage) {
      doc.addPage();
      billIndex = 0;
    }

    const startY = margin + (billIndex * (pageHeight / maxBillsPerPage));

    const leftStartX = margin-4;
    renderLeftContent(doc, leftStartX, startY, lineHeightLeftSide, bill, pageWidth, pageHeight);

    const rightStartX = pageWidth / 2 + margin;
    renderRightContent(doc, rightStartX, startY, lineHeightRightSide, bill);

    // Draw gray line after each bill
    const lineYPos = startY + (pageHeight / maxBillsPerPage) - 5; // Adjust the Y position to be at the bottom of each bill
    drawGrayLine(doc, lineYPos, pageWidth);

    billIndex++;
  });

  doc.save('deposit_ticket.pdf');
};

const drawGrayLine = (doc, yPos, pageWidth) => {
  doc.setDrawColor(0, 0, 0); // Set draw color to gray
  doc.setLineWidth(0.5); // Adjust the thickness of the line
  doc.line(0, yPos - 5, pageWidth, yPos - 5);
  doc.setLineWidth(0.1); // Adjust the thickness of the line

};

const logoImage = 'data:image/png;base64,' + logoImg; // Replace with base64 of the logo

const renderLeftContent = (doc, startX, startY, lineHeight, bill, pageWidth, pageHeight) => {
  const leftContent = [
    { text: 'DEPOSIT TICKET', style: { bold: true, color: 'black', drawColor: 'gray' } },
    { text: 'EDUCANDO CHILDCARE CENTER INC', style: { bold: true, color: 'black'} }, // Set drawColor to gray for this line
    { text: '(GOLD ACCOUNT)', style: { color: 'black' } },
    { text: '5414 S 36 TH ST ', style: { color: 'black' } },
    { text: 'OMAHA NE 68107', style: { color: 'black' } },
    { text: `Date: ${bill.date || ''}`, style: { color: 'black', bold: true } },
    { text: 'SIGN HERE IF CASH RECEIVED (IF REQUIRED)*', style: { color: 'black' } },
    { text: 'A5001d 1003a 731856840C', style: { color: 'black' } }
  ];

  // Add the image to the left side, covering 100% of the left side's 50% width
  const leftWidth = pageWidth / 2;
  doc.setFontSize(8);

  // Calculate initial Y position
  let currentY = startY;

  // Helper function to draw text
  const drawText = (text, style, yPos, drawColor = 'black',xPosition = 0) => {
    if (style.bold) {
      doc.setFont(undefined, 'bold');
    } else {
      doc.setFont(undefined, 'normal');
    }

    doc.setTextColor(drawColor);

    const textWidth = doc.getTextWidth(text);
    const centerX = (startX) + (leftWidth - textWidth) / 2;
    doc.text(text, (centerX+xPosition), yPos);
  };

  currentY -= 5;
  
  // Render each line individually
  drawText(leftContent[0].text, leftContent[0].style, currentY,leftContent[0].style.drawColor);
  currentY += lineHeight;

  // Use drawColor specified in style for the second line
  drawText(leftContent[1].text, leftContent[1].style, currentY, leftContent[1].style.drawColor);
  currentY += lineHeight;

  // Restore to default color (black) for subsequent lines
  drawText(leftContent[2].text, leftContent[2].style, currentY,leftContent[2].style.drawColor);
  currentY += lineHeight;

  drawText(leftContent[3].text, leftContent[3].style, currentY,leftContent[3].style.drawColor);
  currentY += lineHeight;

  drawText(leftContent[4].text, leftContent[4].style, currentY,leftContent[4].style.drawColor);
  currentY += lineHeight + 3;

  drawText(leftContent[5].text, leftContent[5].style, currentY,leftContent[5].style.drawColor);
  currentY += lineHeight + 8;

  // Draw the gray line for signing
  doc.setDrawColor(169, 169, 169); // Set draw color to gray
  const lineStartX = startX + 10;
  const lineEndX = startX + leftWidth - 5;
  const lineY = currentY - 5;
  doc.line(lineStartX, lineY, lineEndX, lineY);
  doc.setFontSize(11);
  // Add the specific text with a gray line below it
  drawText(leftContent[6].text, leftContent[6].style, currentY,leftContent[6].style.drawColor, 5);
  currentY += lineHeight - 4;
  doc.setFontSize(8);
  // Add the image below the line
  doc.addImage(logoImage, 'PNG', startX + (leftWidth -110) / 2, currentY+2, leftWidth - 10, 20); // Adjust the width and height as needed
  currentY += 24 + lineHeight; // Move down by the height of the image plus some margin
  doc.setFontSize(22);

  doc.setFont("micrenc", "normal");
  // Add the final line of text
  drawText(leftContent[7].text, leftContent[7].style, currentY,leftContent[7].style.drawColor, -8);
  
  // Reset font to default (Helvetica)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
};

const renderRightContent = (doc, startX, startY, lineHeight, bill) => {
  const rightMargin = 5; // Left margin for the right side content
  const boxWidth = 20; // Width of the boxes
  const boxHeight = lineHeight - 3; // Height of the boxes
  const labelMargin = 5; // Margin between label and box
  const whiteColor = [255, 255, 255]; // White background for the box
  const grayColor = [200, 200, 200]; // Gray color for background
  const borderColor = [0, 0, 0]; // Black color for borders

  let yPos = startY;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  
  // Render CASH text and box
  doc.text('CASH >', startX + rightMargin, yPos, { align: 'left' });
  const cashBoxX = startX + rightMargin + labelMargin + boxWidth;
  const cashBoxY = yPos - lineHeight + 4;

  // Draw white background with black border
  doc.setFillColor(...whiteColor);
  doc.rect(cashBoxX, cashBoxY, boxWidth, boxHeight, 'F'); // Fill with white
  doc.setLineWidth(0.4); // Set border width to 1
  doc.setDrawColor(...borderColor); // Set border color to black
  doc.rect(cashBoxX, cashBoxY, boxWidth, boxHeight); // Draw border
  doc.setLineWidth(0.5); // Restore line width to 0.5
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text((Number(bill?.cash) || 0).toFixed(2), cashBoxX + 5, yPos, { align: 'left' });
  yPos += lineHeight * 0.6;
  
  // Draw gray background with black border for Received
  const receivedBoxX = startX + rightMargin + labelMargin + boxWidth;
  const receivedBoxY = yPos - lineHeight + 4;
  
  doc.setFillColor(...grayColor);
  doc.rect(receivedBoxX, receivedBoxY, boxWidth, boxHeight, 'F'); // Fill with gray
  yPos += lineHeight * 0.6;

  // Render CHECK text and box
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('CHECK >', startX + rightMargin, yPos, { align: 'left' });
  const checkBoxX = startX + rightMargin + labelMargin + boxWidth;
  const checkBoxY = yPos - lineHeight + 4;

  doc.setFillColor(...whiteColor);
  doc.rect(checkBoxX, checkBoxY, boxWidth, boxHeight, 'F'); // Fill with white
  doc.setLineWidth(0.4); // Set border width to 1
  doc.setDrawColor(...borderColor); // Set border color to black
  doc.rect(checkBoxX, checkBoxY, boxWidth, boxHeight); // Draw border
  doc.setLineWidth(0.5); // Restore line width to 0.5
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text((Number(bill?.check) || 0).toFixed(2), checkBoxX + 5, yPos, { align: 'left' });
  yPos += lineHeight * 1.2;

  // Render OTHER SIDE text and box
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('OTHER ', startX + rightMargin, yPos - 1, { align: 'left' });
  doc.text('SIDE >', startX + rightMargin, yPos + 4, { align: 'left' });
  const otherSideBoxX = startX + rightMargin + labelMargin + boxWidth;
  const otherSideBoxY = yPos - lineHeight + 4;

  // Draw gray background with black border for OTHER SIDE
  doc.setFillColor(...grayColor);
  doc.rect(otherSideBoxX, otherSideBoxY, boxWidth, boxHeight, 'F'); // Fill with gray
  yPos += lineHeight * 0.5
  
  // Draw gray background with black border for Received
  const receivedBoxX2 = startX + rightMargin + labelMargin + boxWidth;
  const receivedBoxY2 = yPos - lineHeight + 4;
  
  doc.setFillColor(...grayColor);
  doc.rect(receivedBoxX2, receivedBoxY2, boxWidth, boxHeight, 'F'); // Fill with gray

  yPos += lineHeight * 1.2 + 8;

  // Render Subtotal text and box with gray background and border
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Subtotal >', startX + rightMargin, yPos, { align: 'left' });
  const subtotalBoxX = startX + rightMargin + labelMargin + boxWidth;
  const subtotalBoxY = yPos - lineHeight + 4;

  // Draw gray background with black border for Subtotal
  doc.setFillColor(...grayColor);
  doc.rect(subtotalBoxX, subtotalBoxY, boxWidth, boxHeight, 'F'); // Fill with gray
  doc.setLineWidth(0.5); // Restore line width to 0.5
  doc.setFillColor(...whiteColor); // Reset to white
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  yPos += lineHeight * 1.2 - 5;

  // Render Received text and box with gray background and border
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Received >', startX + rightMargin, yPos, { align: 'left' });

  yPos += lineHeight * 0.7;

  // Render Total text and box
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Total $', startX + rightMargin, yPos, { align: 'left' });
  const totalBoxX = startX + rightMargin + labelMargin + boxWidth;
  const totalBoxY = yPos - lineHeight + 4;

  doc.setFillColor(...whiteColor);
  doc.rect(totalBoxX, totalBoxY, boxWidth, boxHeight, 'F'); // Fill with white
  doc.setLineWidth(0.4); // Set border width to 1
  doc.setDrawColor(...borderColor); // Set border color to black
  doc.rect(totalBoxX, totalBoxY, boxWidth, boxHeight); // Draw border
  doc.setLineWidth(0.5); // Restore line width to 0.5
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(((Number(bill?.cash) || 0) + (Number(bill?.check) || 0)).toFixed(2), totalBoxX + 5, yPos, { align: 'left' });
};