/* eslint-disable no-useless-escape */
export class Validations {
    static isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    static isValidPhoneNumber(phoneNumber) {
        const re = /^\+?[0-9]+$/;
        return re.test(String(phoneNumber).toLowerCase());
    }

    /**
     * Method to capitalize the first letter of each word specified for names and lastNames
     * @param {*} value
     * @returns 
     */
    static capitalizeFirstLetter = (value) => {
        return value
          .split(' ') // Split the string into words
          .map(word => {
            // Capitalize the first letter of each word, handling special characters
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();  // TODO add tildes
          })
          .join(' '); // Join the words back into a string
      };
}