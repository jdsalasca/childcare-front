import { customLogger } from '../configs/logger'
import { Functions } from '../utils/functions'
import API, { BASE_URL } from './API'
import { ApiResponseModel } from './ApiModels'
import { AppModels } from './AppModels'

const CashOnHandByDyAPI = {
  // Get Daily Cash Record details by date
  getDetailsByDate: async date => {
    try {
      const response = await API.get(BASE_URL, `/cash-on-hand-by-day/day/${date}`)
      
      return response
    } catch (error) {
      customLogger.info('Error fetching daily cash details by date:', error)
      return error
    }
  },

  /**
   * This method is used to save the income money for a specific date
   * @param {CashOnHandByDyModel} cashData - The cash on hand by day model
   * @returns
   */
  // Process Daily Cash Data
  processCashOnHandByDay: async (cashData = new CashOnHandByDyModel()) => {
    try {
      cashData.isValid()
      const response = await API.post(BASE_URL, '/cash-on-hand-by-day', cashData?.build())
      return response
    } catch (error) {
      if (typeof error === AppModels.defaultResponseModel) {

        return error
      }
      customLogger.info(
        'Error Error processing daily cash data on processCashData:',
        error
      )
      return new ApiResponseModel(400, error);
      //throw error;
    }
  },
  /**
   *
   * @param {Date} date - The date for which the money is received
   * @returns  {ApiResponseModel} ApiResponseModel - The response from the API.
   */
  getMoneyUntilDate: async (date = new Date()) => {
    try {
      const formattedDate = Functions.formatDateToYYYYMMDD(date)
      const response = await API.get(
        BASE_URL,
        `/cash-on-hand-by-day/money/until/${formattedDate}`
      )
      return response
    } catch (error) {
      customLogger.info('Error Error processing daily cash data:', error)
      return error
      //throw error;
    }
  }
}

/**
 * This class represents the cash on hand by day model
 * @property {Date} date_of_income - The date of income, which is the day for witch the money is received
 * @property {number} cash_received - The cash received for the day:: is a Decimal(10,2) data type
 *
 * @property {Date} date_of_income_registered - The date of income registered
 */
export class CashOnHandByDyModel {
  _date_of_income = new Date()
  _cash_received = 0.0
  _date_of_income_registered = new Date()


  get date_of_income_registered() {
    return Functions.formatDateToYYYYMMDD(this._date_of_income_registered);
  }

  set date_of_income_registered(value) {
    this._date_of_income_registered = Functions.formatDateToYYYYMMDD(value);
  }

  get date_of_income() {
    return Functions.formatDateToYYYYMMDD(this._date_of_income);
  }

  set date_of_income(value) {
    this._date_of_income = Functions.formatDateToYYYYMMDD(value);
  }
  constructor (date_of_income, cash_received, date_of_income_registered) {
    this.date_of_income = date_of_income
    this.cash_received = cash_received
    this.date_of_income_registered = date_of_income_registered
  }
  build(){
    return {
      date_of_income: this.date_of_income,
      cash_received: this.cash_received,
      date_of_income_registered: this.date_of_income_registered
    }
  }
  isValid () {
    if (
      this.date_of_income == null ||
      this.date_of_income == '' ||
      this.date_of_income == undefined
    ) {
      throw new Error('Date of income is required')
    }
    if (
      this.cash_received == null ||
      this.cash_received == '' ||
      this.cash_received == undefined
    ) {
      throw new Error('Cash received is required')
    }
    if (
      this.date_of_income_registered == null ||
      this.date_of_income_registered == '' ||
      this.date_of_income_registered == undefined
    ) {
      throw new Error('Date of income registered is required')
    }
  }
}

export { CashOnHandByDyAPI }
