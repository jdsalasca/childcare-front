import { customLogger } from "../../../configs/logger";
import { CashOnHandByDyAPI, CashOnHandByDyModel } from "../../../models/CashOnHandByDyAPI";
import ChildrenAPI from "../../../models/ChildrenAPI";
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils";

/**
 * This class provides the communication between the Bills component and the backend of the childcare API.
 */
export class BillsModel {
    /**
     * @param {Function} getValues - Function to retrieve values from somewhere.
     * @param {Function} toast - Function to show notifications or alerts.
     * @param {Function} t - Function to translate the messages.
     */
    _t
    _toast
    _getValues
    constructor(getValues, toast,t) {
        this.getValues = getValues;
        this.toast = toast;
        this.t = t;
    }
    get t(){
        return this._t;
    }

    
    // FIXME review why the toast is not working here
    /**
     * Method to process the cash on hand by day
     * @param {CashOnHandByDyModel} cash_on_hand - The cash on hand by day model
     * @returns 
     */
    async onProcessCashData(cash_on_hand = new CashOnHandByDyModel(), t){
      
    try {
        await CashOnHandByDyAPI.processCashOnHandByDay(cash_on_hand)
      }catch(error){
        customLogger.info('print toast here',this.toast)
          customLogger.error('Error on process cash data Bills.jsx', error,)
        ToastInterpreterUtils.toastInterpreter(this.toast,'error', t('cashOnHand.errorMessage'), t('cashOnHand.errorMessageDetails'))
        return error;
      }
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
            customLogger.error("Error fetching children:", err);
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
