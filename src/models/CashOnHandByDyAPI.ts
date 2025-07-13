import {
  CashOnHandByDay,
  CashOnHandByDayResponse,
} from 'types/cashOnHandByDay';
import { customLogger } from '../configs/logger';
import { Functions } from '../utils/functions';
import API, { ApiResponse, ApiResponseModel, BASE_URL } from './API';

// Define the shape of the response if known
interface CashOnHandResponse {
  // Define properties based on the API response
}

const CashOnHandByDyAPI = {
  // Get Daily Cash Record details by date
  getDetailsByDate: async (
    date: string
  ): Promise<CashOnHandResponse | Error> => {
    try {
      const response = await API.get<CashOnHandResponse>(
        BASE_URL,
        `/cash-on-hand-by-day/day/${date}`
      );
      return response;
    } catch (error) {
      customLogger.info('Error fetching daily cash details by date:', error);
      return error as Error; // Ensure the error is typed as Error
    }
  },

  /**
   * This method is used to save the income money for a specific date
   * @param {CashOnHandByDyModel} cashData - The cash on hand by day model
   * @returns {Promise<ApiResponseModel>}
   */
  processCashOnHandByDay: async (
    cashData: CashOnHandByDyModel = new CashOnHandByDyModel(
      new Date(),
      0,
      new Date()
    )
  ): Promise<ApiResponse<CashOnHandByDay>> => {
    try {
      cashData.isValid();
      const response = await API.post<CashOnHandByDay>(
        BASE_URL,
        '/cash-on-hand-by-day',
        cashData.build()
      );
      return response;
    } catch (error) {
      customLogger.info(
        'Error processing daily cash data on processCashData:',
        error
      );

      // Return a structured ApiResponseModel even on error
      const errorResponse: ApiResponseModel = new ApiResponseModel(
        400,
        'Error processing cash on hand data'
      );

      return errorResponse;
    }
  },

  /**
   *
   * @param {Date} date - The date for which the money is received
   * @returns {Promise<ApiResponseModel>} - The response from the API.
   */
  getMoneyUntilDate: async (
    date: Date = new Date()
  ): Promise<ApiResponse<CashOnHandByDayResponse>> => {
    try {
      const formattedDate = Functions.formatDateToYYYYMMDD(date);
      const response = await API.get<CashOnHandByDayResponse>(
        BASE_URL,
        `/cash-on-hand-by-day/money/until/${formattedDate}`
      );
      return response;
    } catch (error) {
      customLogger.info('Error processing daily cash data:', error);
      return new ApiResponseModel(400, 'Error processing cash on hand data');
    }
  },
};
/**
 * This class represents the cash on hand by day model
 */
export class CashOnHandByDyModel {
  private _date_of_income: Date | string;
  private _cash_received: number;
  private _date_of_income_registered: Date;

  constructor(
    date_of_income: Date | string,
    cash_received: number,
    date_of_income_registered: Date
  ) {
    this._date_of_income = date_of_income;
    this._cash_received = cash_received;
    this._date_of_income_registered = date_of_income_registered;
  }

  // Getters to format the dates
  get date_of_income() {
    return Functions.formatDateToYYYYMMDD(this._date_of_income);
  }

  get date_of_income_registered() {
    return Functions.formatDateToYYYYMMDD(this._date_of_income_registered);
  }

  build() {
    return {
      date_of_income: this.date_of_income, // Access the formatted date
      cash_received: this._cash_received,
      date_of_income_registered: this.date_of_income_registered, // Access the formatted date
    };
  }

  isValid() {
    if (!this._date_of_income) {
      throw new Error('Date of income is required');
    }
    if (this._cash_received == null) {
      throw new Error('Cash received is required');
    }
    if (!this._date_of_income_registered) {
      throw new Error('Date of income registered is required');
    }
  }
}

export { CashOnHandByDyAPI };
