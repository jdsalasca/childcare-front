/**
 * This class provides utility functions for formatting dates and other operations.
 */
export class Functions {
  /**
   * Esta es la validación para los Emails usadas en toda la aplicación
   */
  static emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Formats a currency value to USD format
   *
   * @param {number | null | undefined} value - The number to format
   * @returns {string} The formatted currency string
   */
  static formatCurrency(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '$0.00';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  /**
   * Formats a date to the format yyyy-mm-dd.
   * This is the standard format used by the application for backend communication.
   *
   * @param {Date | string} dateInput - The date to be formatted. Can be a Date object or a string that can be parsed by Date.
   * @returns {string} The formatted date in the format yyyy-mm-dd.
   */
  static formatDateToYYYYMMDD(dateInput: string | Date): string {
    let date: Date;

    // Check if the input is a Date object
    if (dateInput instanceof Date) {
      date = dateInput;
    }
    // Check if the input is a string that can be parsed by Date
    else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    }
    // If the input is neither of the above, return an empty string or handle it as needed
    else {
      return '';
    }

    // Check if date is invalid
    if (isNaN(date.getTime())) {
      return '';
    }

    // Format the date as yyyy-mm-dd using UTC to avoid timezone issues
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  /**
   * Formats a date to the format mm/dd/yy.
   *
   * @param {Date | string} dateInput - The date to be formatted. Can be a Date object or a string that can be parsed by Date.
   * @returns {string} The formatted date in the format mm/dd/yy.
   */
  static formatDateToMMDDYY(dateInput: Date | string): string {
    let date: Date;

    // Check if the input is a Date object
    if (dateInput instanceof Date) {
      date = dateInput;
    }
    // Check if the input is a string that can be parsed by Date
    else if (typeof dateInput === 'string') {
      date = new Date(dateInput);
    }
    // If the input is neither of the above, return an empty string or handle it as needed
    else {
      return '';
    }

    // Check if date is invalid
    if (isNaN(date.getTime())) {
      return '01/01/70';
    }

    // Format the date as mm/dd/yy using UTC to avoid timezone issues
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = String(date.getUTCFullYear()).slice(-2); // Get the last two digits of the year

    return `${month}/${day}/${year}`;
  }
}
