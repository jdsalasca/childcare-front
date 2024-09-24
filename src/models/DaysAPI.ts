import { useQuery } from '@tanstack/react-query';
import API, { ApiResponse, BASE_URL } from './API';


const DaysAPI = {
  // Get all days
  getAllDays: async (): Promise<ApiResponse<DayType[]>>  => {
    try {
      const response = await API.get<DayType[]>(BASE_URL, '/days');
      return response;
    } catch (error) {
      console.error('Error fetching days:', error);
      throw error;
    }
  },

  // Get a single day by id
  getDayById: async (id: string): Promise<ApiResponse<DayType>> => {
    try {
      const response = await API.get<DayType>(BASE_URL, `/days/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching day by id:', error);
      throw error;
    }
  },
};

export const useDaysCache = () => {
  return useQuery({
    queryKey: ['days'],  // Unique key for caching
    queryFn: () => DaysAPI.getAllDays(),  // API function
  });
};

export { DaysAPI };

