import * as XLSX from 'xlsx';
import { CashRegisterReportResponse, CashRegisterReportDay } from '../../../../types/cashRegister';

interface ExcelReportData {
  date: string;
  status: string;
  openingTime: string;
  openingAmount: number;
  openingCashier: string;
  closingTime: string;
  closingAmount: number;
  closingCashier: string;
  difference: number;
  currency: string;
}

const formatDateTime = (dateTime: string): string => {
  return new Date(dateTime).toLocaleString();
};

export const generateCashRegisterExcel = (reportData: CashRegisterReportResponse): void => {
  try {
    if (!reportData.success || !reportData.data.days || reportData.data.days.length === 0) {
      throw new Error('No data available for export');
    }

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare data for the main sheet
    const excelData: ExcelReportData[] = reportData.data.days.map((day: CashRegisterReportDay) => ({
      date: day.date,
      status: day.status.charAt(0).toUpperCase() + day.status.slice(1),
      openingTime: day.opening.time ? formatDateTime(day.opening.time) : 'N/A',
      openingAmount: day.opening.amount || 0,
      openingCashier: day.opening.cashier?.name || 'N/A',
      closingTime: day.closing.time ? formatDateTime(day.closing.time) : 'N/A',
      closingAmount: day.closing.amount || 0,
      closingCashier: day.closing.cashier?.name || 'N/A',
      difference: day.difference || 0,
      currency: day.currency || 'USD',
    }));

    // Create main data worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData, {
      header: [
        'date',
        'status',
        'openingTime',
        'openingAmount',
        'openingCashier',
        'closingTime',
        'closingAmount',
        'closingCashier',
        'difference',
        'currency',
      ],
    });

    // Set column headers
    const headers = [
      'Date',
      'Status',
      'Opening Time',
      'Opening Amount',
      'Opening Cashier',
      'Closing Time',
      'Closing Amount',
      'Closing Cashier',
      'Difference',
      'Currency',
    ];

    // Update headers
    headers.forEach((header, index) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
      if (worksheet[cellAddress]) {
        worksheet[cellAddress].v = header;
      }
    });

    // Set column widths
    const colWidths = [
      { wch: 12 }, // Date
      { wch: 10 }, // Status
      { wch: 18 }, // Opening Time
      { wch: 15 }, // Opening Amount
      { wch: 15 }, // Opening Cashier
      { wch: 18 }, // Closing Time
      { wch: 15 }, // Closing Amount
      { wch: 15 }, // Closing Cashier
      { wch: 12 }, // Difference
      { wch: 10 }, // Currency
    ];

    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cash Register Report');

    // Create summary sheet
    const summaryData = [
      ['Summary Statistics'],
      ['Total Days', reportData.data.days.length],
      ['Total Opening Amount', reportData.data.days.reduce((sum, day) => sum + (day.opening.amount || 0), 0)],
      ['Total Closing Amount', reportData.data.days.reduce((sum, day) => sum + (day.closing.amount || 0), 0)],
      ['Total Difference', reportData.data.days.reduce((sum, day) => sum + (day.difference || 0), 0)],
      ['Opened Days', reportData.data.days.filter(day => day.status === 'opened').length],
      ['Closed Days', reportData.data.days.filter(day => day.status === 'closed').length],
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    summaryWorksheet['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate filename with current date
    const now = new Date();
    const filename = `cash_register_report_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;

    // Save file
    XLSX.writeFile(workbook, filename);

  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw error;
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}; 