/**
 * This class provides utility functions for formatting dates and other operations.
 * 
 */
export class Functions {

    /**
     * Formats a date to the format yyyy-mm-dd.
     * 
     * @param {Date|string} dateInput - The date to be formatted. Can be a Date object or a string that can be parsed by Date.
     * @returns {string} The formatted date in the format yyyy-mm-dd.
     */
    static formatDateToYYYYMMDD (dateInput)  {
        let date;
    
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
    
        // Format the date as yyyy-mm-dd
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    };

      /**
     * Formats a date to the format mm/dd/yy.
     * 
     * @param {Date|string} dateInput - The date to be formatted. Can be a Date object or a string that can be parsed by Date.
     * @returns {string} The formatted date in the format mm/dd/yy.
     */
      static formatDateToMMDDYY(dateInput) {
        let date;
    
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
    
        // Format the date as mm/dd/yy
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(date.getDate()).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2); // Get the last two digits of the year
    
        return `${month}/${day}/${year}`;
    }
 
}