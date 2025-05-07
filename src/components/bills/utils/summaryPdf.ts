import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Bill, FormValues } from '../viewModels/useBillsViewModel';
import { educando } from './assets/educando_logo';

interface BillType {
    bill: string;
    amount: number;
    total: number;
}

export const exportToSummaryPDF = (data: FormValues): void => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const halfPageWidth = pageWidth / 2;

    // Add Title and Date
    doc.setFontSize(14);
    doc.text("EDUCANDO CHILDCARE CASH REGISTER", pageWidth / 2, margin, { align: 'center' });
    doc.setFontSize(12);
    // Convert date to string if needed
    const dateString = typeof data.date === 'string' ? data.date : (data.date ? data.date.toString() : '');
    doc.text(dateString, pageWidth / 2, margin + 10, { align: 'center' });

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
    generateCashCountTable(doc, data.billTypes, currentY, halfPageWidth, pageHeight);

    // Notes and Scanned Date, QuickBooks, Signature on the right side
    generateNotesSection(doc, data, currentY, currentY, halfPageWidth, pageHeight, margin);

    // Save without adding receipt pages
    doc.save('summary_report.pdf');
};

const generateChildrenTable = (doc: jsPDF, bills: Bill[], startY: number, pageHeight: number, margin: number): number => {
    const headers = [["Children Name", "Cash", "Check", "Total"]];
    const rows: (string | number)[][] = [];

    // First, calculate the correct totals
    let totalCash = 0;
    let totalCheck = 0;
    let totalOverall = 0;

    bills.forEach(bill => {
        const cash = Number(bill.cash) || 0; // Convert to number, default to 0 if NaN
        const check = Number(bill.check) || 0; // Convert to number, default to 0 if NaN
        const total = cash + check;
    
        if (cash > 0 || check > 0) {
            rows.push([
                bill.names!,
                `$${cash.toFixed(2)}`, // Format with 2 decimal places
                `$${check.toFixed(2)}`, // Format with 2 decimal places
                `$${total.toFixed(2)}` // Format with 2 decimal places
            ]);

            // Add to totals
            totalCash += cash;
            totalCheck += check;
            totalOverall += total;
        }
    });
    
    // Add the totals row
    rows.push([
        "Total", 
        `$${totalCash.toFixed(2)}`, 
        `$${totalCheck.toFixed(2)}`, 
        `$${totalOverall.toFixed(2)}`
    ]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
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

const generateCashOnHandSection = (doc: jsPDF, data: FormValues, startY: number, pageHeight: number, margin: number): number => {
    // Format values properly
    const cashOnHandValue = Number(data.cashOnHand) || 0;
    const totalDepositValue = Number(data.totalDeposit) || 0;
    // Calculate total as sum of cash and check from bills
    const totalOverallValue = data.bills?.reduce((acc, bill) => {
        const cash = Number(bill.cash) || 0;
        const check = Number(bill.check) || 0;
        return acc + cash + check;
    }, 0) || 0;

    if (startY + 30 > pageHeight) {
        doc.addPage();
        startY = margin;
    }

    const values = [
        // { label: "Cash on Hand", value: `$${cashOnHandValue.toFixed(2)}` },
        { label: "Total Deposit", value: `$${totalDepositValue.toFixed(2)}` },
        { label: "TOTAL", value: `$${totalOverallValue.toFixed(2)}` }
    ];

    values.forEach((item, index) => {
        doc.text(item.label, margin, startY + (index * 10));
        doc.text(item.value, margin + 50, startY + (index * 10));
    });

    return startY + values.length * 10 + 10;
};

const generateCashCountTable = (doc: jsPDF, billTypes: BillType[], startY: number, halfPageWidth: number, pageHeight: number): number => {
    if (startY + 30 > pageHeight) {
        doc.addPage();
        startY = 10;
    }

    const headers = [["Bill", "Amount", "Total"]];
    const rows: (string | number)[][] = billTypes.map(bill => {
        const totalValue = Number(bill.total) || 0;
        return [
            bill.bill, 
            bill.amount, 
            `$${totalValue.toFixed(2)}`
        ];
    });

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
    const boxHeight = 40;  // Define the height for the "Notes" box
    const boxYPosition = startY;  // Box will start here

    // Draw the box for "Notes"
    doc.setDrawColor(0);  // Black border
    doc.setLineWidth(1);
    doc.rect(halfPageWidth + 10, boxYPosition, halfPageWidth - 20, boxHeight);  // Draw the rectangle

    // Write the "NOTES:" label and content inside the box
    doc.setFontSize(12);
    doc.text(" NOTES:", halfPageWidth + 12, boxYPosition + 8);  // Label position inside the box

    doc.setFontSize(10);
    doc.text(data.notes || "", halfPageWidth + 12, boxYPosition + 18, {
        maxWidth: halfPageWidth - 24,  // Leave space for padding
    });

    // Now, place the other fields below the box
    const newStartY = boxYPosition + boxHeight + 10;  // Start below the "Notes" box

    // Convert date to string to ensure it's compatible with jsPDF text method
    const dateString = typeof data.date === 'string' ? data.date : (data.date ? data.date.toString() : '');

    doc.setFontSize(12);
    doc.text("SCANNED DATE:", halfPageWidth + 10, newStartY);
    doc.text(dateString, halfPageWidth + 50, newStartY);

    doc.text("QUICKBOOKS:", halfPageWidth + 10, newStartY + 10);
    doc.text(dateString, halfPageWidth + 50, newStartY + 10);

    doc.text("_________________________", halfPageWidth + 30, newStartY + 20);

    return newStartY + 30;  // Return the Y position after the signature field
}; 