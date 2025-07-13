/* eslint-disable no-useless-escape */
export class Validations {
    static isValidEmail(email : string) : boolean {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    static isValidPhoneNumber(phoneNumber :string) : boolean {
        const re = /^\+?[0-9]+$/;
        return re.test(String(phoneNumber).toLowerCase());
    }

    /**
     * Validates phone numbers with various formats
     */
    static isValidPhone(phoneNumber: string): boolean {
        const re = /^[\+]?[1-9][\d]{9,15}$/;
        return re.test(String(phoneNumber).replace(/[\s\-\(\)]/g, ''));
    }

    /**
     * Validates if a field is required (not empty)
     */
    static isRequired(value: any): boolean {
        return value !== null && value !== undefined && String(value).trim() !== '';
    }

    /**
     * Validates if a value is numeric
     */
    static isNumeric(value: string): boolean {
        return !isNaN(Number(value)) && !isNaN(parseFloat(value));
    }

    /**
     * Validates if a date is within a given range
     */
    static isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
        return date >= startDate && date <= endDate;
    }

    /**
     * Method to capitalize the first letter of each word specified for names and lastNames
     * @param {*} value
     * @returns 
     */
    static capitalizeFirstLetter = (value: string) : string => {
        return value
          .split(' ') // Split the string into words
          .map(word => {
            // Capitalize the first letter of each word, handling special characters
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();  // TODO add tildes
          })
          .join(' '); // Join the words back into a string
      };
}