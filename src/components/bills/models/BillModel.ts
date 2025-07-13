import { Toast } from 'primereact/toast';
import { RefObject } from 'react';
import { customLogger } from '../../../configs/logger';
import {
  CashOnHandByDyAPI,
  CashOnHandByDyModel,
} from '../../../models/CashOnHandByDyAPI';
import ChildrenAPI from '../../../models/ChildrenAPI';

/**
 * This class provides the communication between the Bills component and the backend of the childcare API.
 */
export class BillsModel {
  private _toastRef: RefObject<Toast>; // Change this if necessary
  private _t: (key: string) => string;

  /**
   * @param {Function} getValues - Function to retrieve values from somewhere.
   * @param {RefObject<Toast>} toastRef - Reference to the Toast component for showing notifications.
   * @param {Function} t - Function to translate the messages.
   */
  constructor(toastRef: RefObject<Toast>, t: (key: string) => string) {
    this._toastRef = toastRef;
    this._t = t;
  }

  // FIXME review why the toast is not working here
  /**
   * Method to process the cash on hand by day
   * @param {CashOnHandByDyModel} cash_on_hand - The cash on hand by day model
   * @returns {Promise<any>} - Returns the result of the processing or an error
   */
  async onProcessCashData(cash_on_hand: CashOnHandByDyModel): Promise<any> {
    try {
      await CashOnHandByDyAPI.processCashOnHandByDay(cash_on_hand);
      // Optionally show success toast here
    } catch (error) {
      customLogger.info('print toast here', this._toastRef);
      customLogger.error('Error on process cash data BillsModel.ts', error);
      // Adjust toast call to use the ref if necessary
      if (this._toastRef.current) {
        this._toastRef.current.show({
          severity: 'error',
          summary: this._t('cashOnHand.errorMessage'),
          detail: this._t('cashOnHand.errorMessageDetails'),
        });
      }
      return error;
    }
  }
  /**
   * Fetches children data from the API and formats it.
   *
   * @returns {Promise<Array<{ childName: string }>>} - A promise that resolves to an array of students with formatted names.
   */
  async fetchChildren(): Promise<Array<{ childName: string }>> {
    try {
      const response = await ChildrenAPI.getChildren();
      if (!response) {
        throw new Error('No response from API');
      }

      // Map response to add childName property
      return response.response.map(child => ({
        ...child,
        childName: `${child.first_name} ${child.last_name}`,
      }));
    } catch (err) {
      customLogger.error('Error fetching children:', err);
      return []; // Return an empty array if there is an error
    }
  }

  /**
   * Creates a new bill object with default values.
   *
   * @param {Array<any>} fields - Array of fields to base the new bill on.
   * @returns {Object} - The newly created bill object.
   */
  static newBill(fields: Array<any>): {
    originalIndex: number;
    disabled: boolean;
    names: string;
    cash: string;
    check: string;
    date: string;
  } {
    return {
      originalIndex: fields.length, // Ensure unique originalIndex
      disabled: false,
      names: '',
      cash: '',
      check: '',
      date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD
    };
  }
}
