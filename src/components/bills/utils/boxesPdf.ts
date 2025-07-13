import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FormValues, Bill } from '../viewModels/useBillsViewModel';
import { educando } from './assets/educando_logo';

// Helper function to format date properly
const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) return '';
    
    // Format as: "Mon, Jul 07, 2025" (without time)
    return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
};


interface BillType {
    bill: string;
    amount: number;
    total: number;
}

export interface pdfDataType {
    date: string;
    bills: Bill[];
    cashOnHand?: string;
    totalDeposit?: string;
    totalOverall?: string;
    billTypes: BillType[];
    notes?: string;
}

export const exportBoxesToPDF = (data: FormValues): void => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const halfPageWidth = pageWidth / 2;

    // Format date properly
    const dateStr = formatDate(data.date);

    // Add Title and Date
    doc.setFontSize(14);
    doc.text("EDUCANDO CHILDCARE CASH REGISTER", pageWidth / 2, margin, { align: 'center' });
    doc.setFontSize(12);
    doc.text(dateStr, pageWidth / 2, margin + 10, { align: 'center' });

    let currentY = margin + 20;

    // Generate Children Information Table
    currentY = generateChildrenTable(doc, data.bills!, currentY, pageHeight, margin);

    // Cash on Hand, Total Deposit, and TOTAL fields
    currentY = generateCashOnHandSection(doc, data, currentY, pageHeight, margin);

    // Determine if enough space is available for both sections
    const estimatedHeightForLeftTable = 70; // Estimate the height for the cash count table

    if (currentY + estimatedHeightForLeftTable > pageHeight) {
        doc.addPage();
        currentY = margin;
    }

    // Conteo de Cash Table on the left side
    generateCashCountTable(doc, data, currentY, halfPageWidth, pageHeight);

    // Notes and Scanned Date, QuickBooks, Signature on the right side
    generateNotesSection(doc, data, currentY, currentY, halfPageWidth, pageHeight, margin);
       // Iterate over each child and generate a receipt on a new page
       data.bills!.forEach((bill) => {
        
            doc.addPage();  // New page for each child

        // Call the receipt generation function for the current child
        generateReceiptForChild(doc, bill, dateStr);
    });


    doc.save('deposit_ticket.pdf');
};

const generateChildrenTable = (doc: jsPDF, bills: Bill[], startY: number, _pageHeight: number, margin: number): number => {
    const headers = [["#","Children Name", "Cash", "Check", "Total"]];
    const rows: (string | number)[][] = [];

    // First, calculate the correct totals
    let totalCash = 0;
    let totalCheck = 0;
    let totalOverall = 0;
    let numerator = 1;
    bills.forEach(bill => {
        const cash = Number(bill.cash) || 0; // Convert to number, default to 0 if NaN
        const check = Number(bill.check) || 0; // Convert to number, default to 0 if NaN
        const total = cash + check;
        
        if (cash > 0 || check > 0) {
            rows.push([
                numerator++,
                bill.names!,
                `$${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `$${check.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            ]);
            

            // Add to totals
            totalCash += cash;
            totalCheck += check;
            totalOverall += total;
        }
    });
    
    // Add the totals row
    rows.push([
        "",
        "Total",
        `$${totalCash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `$${totalCheck.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        `$${totalOverall.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                 
    ]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [190, 22, 34], textColor: [255, 255, 255] },
        didParseCell: (data: any) => { // Specify the type here
            if (data.row.index === data.table.body.length - 1) {
                doc.setFont('helvetica', 'bold');  // Set font to bold for the last row (Total)
            }
        },
        margin: { top: startY, left: margin, right: margin },
        pageBreak: 'auto'
    });

    return doc.autoTable.previous.finalY + 10;  // Return the new Y position after the table
};
const generateReceiptForChild = (doc: jsPDF, bill: Bill, date: string): void => {
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the width of the page
    const pageHeight = doc.internal.pageSize.getHeight(); // Get the height of the page
  
    let currentY = margin;

    // Title: "RECEIPT"
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`RECEIPT`, (pageWidth/2)-15, currentY);  
    currentY += 15;

    // Reset to regular font and size
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    // Date
    doc.text(`Date: ${date}`, margin, currentY);
    currentY += 10;

    // Payment received by
    doc.text(`Payment received by: ____________________________`, margin, currentY);
    currentY += 10;

    // Child's Name
    doc.text(`For Child: ${bill.names}`, margin, currentY);
    currentY += 10;

    // Line for the child's name
    doc.line(margin, currentY, margin + 180, currentY);
    currentY += 20;

    // Calculate the total amount properly
    const cash = Number(bill.cash) || 0;
    const check = Number(bill.check) || 0;
    const total = cash + check;
    
    // Amount section with proper formatting
    const amount = `$${total.toFixed(2)}`;
    doc.text(`Amount: ${amount}`, margin, currentY);
    currentY += 10;

    // Services provided for the weeks section
    doc.text(`Services provided for the weeks of: ____________ to ____________`, margin, currentY);
    currentY += 10;

    // Days and options
    doc.text(`________ days`, margin, currentY);
    currentY += 10;

    doc.text(`1 week                               $ _________ Still due        $ ___________ Credit.`, margin, currentY);
    currentY += 10;

    doc.text(`2 weeks`, margin, currentY);
    currentY += 10;

    doc.text(`Transportation`, margin, currentY);
    currentY += 10;

    doc.text(`Enrollment fee`, margin, currentY);
    currentY += 10;

    doc.text(`Copay for month: ____________`, margin, currentY);
    currentY += 20;

    // Employee signature, right-aligned
    const employeeSignatureText = "Employee signature: _______________________";
    const textWidth = doc.getTextWidth(employeeSignatureText); // Measure the text width
    doc.text(employeeSignatureText, pageWidth - margin - textWidth, currentY); // Right-align the signature line
     // Add the base64 image as a footer at the bottom of the page
     const footerHeight = 50;
    
    //const base64Image = 'data:image/png;base64,'+educando; // Your base64 image string

    doc.addImage(educando, 'PNG', margin, pageHeight - footerHeight - 50, pageWidth - 2 * margin, footerHeight); // Adjust width and height as necessary
};


const generateCashOnHandSection = (doc: jsPDF, data: FormValues, startY: number, pageHeight: number, margin: number): number => {
    // Format values properly
    const totalDepositValue = Number(data.totalDeposit) || 0;
    // Calculate total as sum of cash and check from bills
    const totalOverallValue = data.bills?.reduce((acc, bill) => {
        const cash = Number(bill.cash) || 0;
        const check = Number(bill.check) || 0;
        return acc + cash + check;
    }, 0) || 0;

    if (startY + 50 > pageHeight) {
        doc.addPage();
        startY = margin;
    }

    const values = [
        {
            label: "Total Deposit",
            value: `${Number(totalDepositValue).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`
        },
        {
            label: "TOTAL",
            value: `${Number(totalOverallValue).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`
        }
    ];

    // Add closed money data if available
    if (data.closedMoneyData && data.closedMoneyData.has_closed_money) {
        values.push({
            label: "Closed Money",
            value: `$${Number(data.closedMoneyData.total_closing_amount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`
        });
    }

    values.forEach((item, index) => {
        doc.text(item.label, margin, startY + (index * 10));
        doc.text(item.value, margin + 50, startY + (index * 10));
    });

    return startY + values.length * 10 + 10;
};

const generateCashCountTable = (doc: jsPDF, data: FormValues, startY: number, halfPageWidth: number, pageHeight: number): number => {
    if (startY + 30 > pageHeight) {
        doc.addPage();
        startY = 10;
    }

    const headers = [["Bill", "Quantity", "Total"]];
    const rows: (string | number)[][] = [];

    // Use cash register data if available - check the correct data structure
    if (data.closedMoneyData?.closing_details && Array.isArray(data.closedMoneyData.closing_details)) {
        data.closedMoneyData.closing_details.forEach((detail: any) => {
            rows.push([
                detail.bill_label || `$${Number(detail.bill_value).toFixed(2)}`,
                detail.quantity,
                `$${Number(detail.total_amount).toFixed(2)}`
            ]);
        });
    } else if (data.closedMoneyData?.opening_details && Array.isArray(data.closedMoneyData.opening_details)) {
        // Fallback to opening data if closing is not available
        data.closedMoneyData.opening_details.forEach((detail: any) => {
            rows.push([
                detail.bill_label || `$${Number(detail.bill_value).toFixed(2)}`,
                detail.quantity,
                `$${Number(detail.total_amount).toFixed(2)}`
            ]);
        });
    } else {
        // Fallback to empty rows if no cash register data
        rows.push(["No data", "0", "$0.00"]);
    }

    doc.autoTable({
        head: headers,
        body: rows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        margin: { left: 10 },
        tableWidth: halfPageWidth - 20,
        pageBreak: 'auto'
    });

    return doc.autoTable.previous.finalY + 10;  // Return the new Y position after the table
};

const generateNotesSection = (doc: jsPDF, data: FormValues, startY: number, leftTableEndY: number, halfPageWidth: number, pageHeight: number, margin: number): number => {
    // Ensure there's enough space after the left table, move to new page if necessary
    if (startY + 60 > pageHeight || leftTableEndY + 60 > pageHeight) {
        doc.addPage();
        startY = margin;
    }

    startY = Math.max(startY, leftTableEndY); // Adjust to start after the larger section
    halfPageWidth = halfPageWidth - 12;

    // Set up text positions
    const boxHeight = 40;  // Define the height for the "Notas" box
    const boxYPosition = startY;  // Box will start here

    // Format date properly
    const dateStr = formatDate(data.date);

    // Draw the box for "Notas"
    doc.setDrawColor(0);  // Black border
    doc.setLineWidth(1);
    doc.rect(halfPageWidth + 10, boxYPosition, halfPageWidth - 20, boxHeight);  // Draw the rectangle

    // Write the "NOTAS:" label and content inside the box
    doc.setFontSize(12);
    doc.text(" NOTES:", halfPageWidth + 12, boxYPosition + 8);  // Label position inside the box

    doc.setFontSize(10);
    doc.text(data.notes || "", halfPageWidth + 12, boxYPosition + 18, {
        maxWidth: halfPageWidth - 24,  // Leave space for padding
    });

    // Now, place the other fields below the box
    const newStartY = boxYPosition + boxHeight + 10;  // Start below the "Notas" box

    doc.setFontSize(12);
    doc.text("SCANNED DATE:", halfPageWidth + 10, newStartY);
    doc.text(dateStr, halfPageWidth + 50, newStartY);

    doc.text("QUICKBOOKS:", halfPageWidth + 10, newStartY + 10);
    doc.text(dateStr, halfPageWidth + 50, newStartY + 10);

    doc.text("_________________________", halfPageWidth + 30, newStartY + 20);

    return newStartY + 30;  // Return the Y position after the signature field
};
