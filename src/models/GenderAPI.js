import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";

const GenderAPI = {
    // Get Bill Types by Currency Code
    getGenders: async () => {
      try {
        const response = await API.get(BASE_URL, '/genders');
        return response;
      } catch (error) {
        console.error('Error fetching bill types by currency code:', error);
        throw error;
      }
    },
    
  };


// Create a custom hook to use in your components
export const useGendersCache = () => {
  return useQuery({
    queryKey: ['genders'],  // Unique key for caching
    queryFn: () => GenderAPI.getGenders(),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes) // TODO add this as a constant
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
};

export { GenderAPI };
