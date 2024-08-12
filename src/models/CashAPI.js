import API, { BASE_URL } from './API';

const CashAPI = {
  // Get Daily Cash Record details by date
  getDetailsByDate: async (date) => {
    try {
      const response = await API.get(BASE_URL, `/daily_cash/details_by_date`, { params: { date } });
      console.log('====================================');
      console.log("getDetailsByDate",response);
      console.log('====================================');
      return response;
    } catch (error) {
      console.log('Error fetching daily cash details by date:', error);
      return error;
    }
  },

  // Process Daily Cash Data
  processCashData: async (cashData) => {
    try {
      const response = await API.post(BASE_URL, '/daily_cash/process', cashData);
      return response;
    } catch (error) {
      console.error('Error processing daily cash data:', error);
      return []
      //throw error;
    }
  },
};

export { CashAPI };
