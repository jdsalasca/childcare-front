import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const exportBoxesToPDF = (data) => {
    const doc = new jsPDF();
    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const halfPageWidth = pageWidth / 2;

    // Add Title and Date
    doc.setFontSize(14);
    doc.text("EDUCANDO CHILDCARE CASH REGISTER", pageWidth / 2, margin, { align: 'center' });
    doc.setFontSize(12);
    doc.text(data.date, pageWidth / 2, margin + 10, { align: 'center' });

    let currentY = margin + 20;

    // Generate Children Information Table
    currentY = generateChildrenTable(doc, data.bills, currentY, pageHeight, margin);

    // Cash on Hand, Total Deposit, and TOTAL fields
    currentY = generateCashOnHandSection(doc, data, currentY, pageHeight, margin);

    // Conteo de Cash Table on the left side
    const leftTableEndY = generateCashCountTable(doc, data.billTypes, currentY, halfPageWidth, pageHeight);

    // Notes and Scanned Date, QuickBooks, Signature on the right side
    generateNotesSection(doc, data, currentY, currentY, halfPageWidth, pageHeight, margin);

    doc.save('deposit_ticket.pdf');
};

const generateChildrenTable = (doc, bills, startY, pageHeight, margin) => {
    const headers = [["Children Name", "Cash", "Check", "Total"]];
    const rows = [];

    bills.forEach(bill => {
        if ((bill.cash && bill.cash != 0) || (bill.check && bill.check != 0)) {
            const total = parseFloat(bill.cash || 0) + parseFloat(bill.check || 0);
            rows.push([bill.names, (bill.cash > 0) ? `$${bill.cash}` : "",(bill.check > 0) ? `$${bill.check}`: "", `$${total}`]);
        }
    });

    const totalCash = bills.reduce((sum, bill) => sum + parseFloat(bill.cash || 0), 0);
    const totalCheck = bills.reduce((sum, bill) => sum + parseFloat(bill.check || 0), 0);
    const totalOverall = totalCash + totalCheck;

    rows.push(["Total", `$${totalCash}`, `$${totalCheck}`, `$${totalOverall}`]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Transparent header with black text
        didParseCell: (data) => {
            if (data.row.index === data.table.body.length - 1) {
                doc.setFont('helvetica', 'bold');  // Set font to bold for the last row (Total)
            }
        },
        margin: { top: startY, left: margin, right: margin },
        pageBreak: 'auto'
    });

    return doc.autoTable.previous.finalY + 10;  // Return the new Y position after the table
};

const generateCashOnHandSection = (doc, data, startY, pageHeight, margin) => {
    const { cashOnHand = "0.00", totalDeposit = "0.00", totalOverall = "0.00" } = data;

    if (startY + 30 > pageHeight) {
        doc.addPage();
        startY = margin;
    }

    const values = [
        { label: "Cash on Hand", value:  `$${cashOnHand}` },
        { label: "Total Deposit", value: `$${totalDeposit}` },
        { label: "TOTAL", value: `$${totalOverall}` }
    ];

    values.forEach((item, index) => {
        doc.text(item.label, margin, startY + (index * 10));
        doc.text(item.value, margin + 50, startY + (index * 10));
    });

    return startY + values.length * 10 + 10;
};

const generateCashCountTable = (doc, billTypes, startY, halfPageWidth, pageHeight) => {
    if (startY + 30 > pageHeight) {
        doc.addPage();
        startY = 10;
    }

    const headers = [["Bill", "Amount", "Total"]];
    const rows = billTypes.map(bill => [bill.bill, bill.amount, `$${bill.total}`]);

    doc.autoTable({
        head: headers,
        body: rows,
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Transparent header with black text
        margin: { left: 10 },  // Position on the left side
        tableWidth: halfPageWidth - 20,
        pageBreak: 'auto'
    });

    return doc.autoTable.previous.finalY + 10;  // Return the new Y position after the table
};

const generateNotesSection = (doc, data, startY, leftTableEndY, halfPageWidth, pageHeight, margin) => {
    // Ensure there's enough space after the left table, move to new page if necessary
    if (startY + 50 > pageHeight || leftTableEndY + 50 > pageHeight) {
        // doc.addPage();
        startY = margin;
    } else {
    }
    startY = Math.max(startY, leftTableEndY);
    startY= startY+7
    halfPageWidth = halfPageWidth-12
    

    doc.text("SCANNED DATE:", halfPageWidth + 10, startY);
    doc.text(data.date, halfPageWidth + 50, startY);

    doc.text("QUICKBOOKS:", halfPageWidth + 10, startY + 10);
    doc.text("_________________________", halfPageWidth + 50, startY + 10);

    doc.text("Signature:", halfPageWidth + 10, startY + 20);
    doc.text("_________________________", halfPageWidth + 50, startY + 20);

    doc.text("NOTAS:", halfPageWidth + 10, startY + 30);

    doc.setFontSize(10);
    doc.text(data.notes || "", halfPageWidth + 10, startY + 40, {
        maxWidth: halfPageWidth - 20,
    });

    return startY + 50;
};
