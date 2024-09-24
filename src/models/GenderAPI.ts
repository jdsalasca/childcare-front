import { useQuery } from "@tanstack/react-query";
import { GenderType } from "../types/gender";
import API, { ApiResponse, BASE_URL } from "./API";


const GenderAPI = {
  // Get Genders
  getGenders: async (): Promise<ApiResponse<GenderType[]>> => {
    try {
      const response = await API.get<GenderType[]>(BASE_URL, '/genders');
      return response;
    } catch (error) {
      console.error('Error fetching genders:', error);
      throw error;
    }
  },
};

// Create a custom hook to use in your components
export const useGendersCache = () => {
  return useQuery({
    queryKey: ['genders'],  // Unique key for caching
    queryFn: () => GenderAPI.getGenders(),  // API function
  });
};

export { GenderAPI };

