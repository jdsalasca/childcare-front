import * as XLSX from 'xlsx';
import { CashRegisterReportResponse, CashRegisterReportDay } from '../../../../types/cashRegister';

export interface ExcelReportData {
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
    const columnWidths = [
      { wch: 12 }, // Date
      { wch: 10 }, // Status
      { wch: 20 }, // Opening Time
      { wch: 15 }, // Opening Amount
      { wch: 18 }, // Opening Cashier
      { wch: 20 }, // Closing Time
      { wch: 15 }, // Closing Amount
      { wch: 18 }, // Closing Cashier
      { wch: 12 }, // Difference
      { wch: 10 }, // Currency
    ];
    worksheet['!cols'] = columnWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cash Register Report');

    // Create summary worksheet
    const summaryData = [
      ['Total Days', reportData.data.summary.total_days],
      ['Total Opening Amount', reportData.data.summary.total_opening_amount],
      ['Total Closing Amount', reportData.data.summary.total_closing_amount],
      ['Total Difference', reportData.data.summary.total_difference],
      ['Currency', reportData.data.summary.currency],
    ['', ''],
      ['Generated On', new Date().toLocaleString()],
    ];

    const summaryWorksheet = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Set summary column widths
    summaryWorksheet['!cols'] = [
      { wch: 20 }, // Label
      { wch: 20 }, // Value
    ];

    XLSX.utils.book_append_sheet(workbook, summaryWorksheet, 'Summary');

    // Generate filename with current date
    const currentTime = new Date().toLocaleString();
    const filename = `cash_register_report_${currentTime}.xlsx`;

    // Write and download file
    XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    throw error;
  }
};

const formatDateTime = (dateTimeString: string): string => {
  try {
    return new Date(dateTimeString).toLocaleString();
  } catch {
    return dateTimeString;
  }
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}; 