import { FormValues } from '@components/bills/viewModels/useBillsViewModel';
import { CashByDay } from 'types/cashByDay';
import API, { ApiResponse, ApiResponseModel, BASE_URL } from './API';

// Define the shape of the response if known
interface CashRecordDetails {
  // Define the properties based on the API response
  // Example:
  id: number;
  amount: number;
  date: string;
  description: string;
}



// Define the properties based on the data structure being processed
interface CashData {
  // Example properties based on expected data
  amount: number;
  date?: string;
  description: string;
}

const CashAPI = {
  // Get Daily Cash Record details by date
  getDetailsByDate: async (date: string): Promise<ApiResponse<CashByDay>> => {
    try {
      const response = await API.get<CashByDay>(BASE_URL, `/daily-cash/details_by_date`, { params: { date } });
      return response;
    } catch (error) {
      console.error('Error fetching cash details by date:', error);
      // You might want to create a custom error response model
      return new ApiResponseModel(500, "error"); // Return a proper error response
    }
  },

  // Process Daily Cash Data
  processCashData: async (cashData: FormValues): Promise<ApiResponse<CashRecordDetails>> => {
    try {
      const response = await API.post<CashRecordDetails>(BASE_URL, '/daily-cash/process', cashData);
      return response;
    } catch (error) {
      console.error('Error processing daily cash data:', error);
      return new ApiResponseModel(404, "error"); // Adjust based on your needs
    }
  },
};

export { CashAPI };

