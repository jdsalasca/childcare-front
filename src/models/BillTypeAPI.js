import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";

const BillTypeAPI = {
    // Get Bill Types by Currency Code
    getBillTypesByCurrencyCode: async (currencyCode) => {
      try {
        const response = await API.get(BASE_URL, '/bill_types/by_currency', { params: { currency_code: currencyCode } });
        return response;
      } catch (error) {
        console.error('Error fetching bill types by currency code:', error);
        throw error;
      }
    },
    
  };


// Create a custom hook to use in your components
export const useBillTypesByCurrencyCode = (currencyCode) => {
  return useQuery({
    queryKey: ['billTypes', currencyCode],  // Unique key for caching
    queryFn: () => BillTypeAPI.getBillTypesByCurrencyCode(currencyCode),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
};

export {BillTypeAPI}  