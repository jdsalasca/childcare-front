import ChildrenAPI from "../../../models/ChildrenAPI";

/**
 * This class provides the communication between the Bills component and the backend of the childcare API.
 */
export class BillsModel {
    /**
     * @param {Function} getValues - Function to retrieve values from somewhere.
     * @param {Function} toast - Function to show notifications or alerts.
     */
    constructor(getValues, toast) {
        this.getValues = getValues;
        this.toast = toast;
    }

    /**
     * Fetches children data from the API and formats it.
     * 
     * @returns {Promise<Array>} - A promise that resolves to an array of students with formatted names.
     */
    async fetchChildren() {
        try {
            const response = await ChildrenAPI.getChildren();
            if (!response) {
                throw new Error("No response from API");
            }

            // Map response to add childName property
            return response.map(child => ({
                ...child,
                childName: `${child.first_name} ${child.last_name}`
            }));
        } catch (err) {
            console.error("Error fetching children:", err);
            this.toast("Error fetching children"); // Notify the user of the error
            return []; // Return an empty array if there is an error
        }
    }

    /**
     * Creates a new bill object with default values.
     * 
     * @param {Array} fields - Array of fields to base the new bill on.
     * @returns {Object} - The newly created bill object.
     */
    static newBill(fields) {
        return {
            originalIndex: fields.length, // Ensure unique originalIndex
            disabled: false,
            names: '',
            cash: '',
            check: '',
            date: new Date().toISOString().split('T')[0] // Format date to YYYY-MM-DD
        };
    }
}
