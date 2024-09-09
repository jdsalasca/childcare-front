import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";

const ContractAPI = {
    // Get Bill Types by Currency Code
    createContract: async (contract) => {
      try {
        const response = await API.post(BASE_URL, '/contracts',  contract);
        return response;
      } catch (error) {
        console.error('Error creating contract:', error);
        throw error;
      }
    },
    updateContractPaymentDetails: async (contract) => {
      console.log('contract on createContract', contract);
      
      try {
        const response = await API.put(BASE_URL, `/contracts/payment_details/${contract.contract_id}`,  contract );
        return response;
      } catch (error) {
        console.error('Error updating contract payment details:', error);
        throw error;
      }
    },
    
    updateContract: async (contract) => {
        try {
          const response = await API.put(BASE_URL, '/contracts', { contract });
          return response;
        } catch (error) {
          console.error('Error updating contract:', error);
          throw error;
        }
      },

      getAllContracts: async () => {
        try {
          const response = await API.get(BASE_URL, '/contracts');
          return response;
        } catch (error) {
          console.error('Error fetching contracts:', error);
          throw error;
        }
      },
      getContractById: async (id) => {
        try {
          const response = await API.get(BASE_URL, `/contracts/${id}`);
          return response;
        } catch (error) {
          console.error('Error fetching contract by id:', error);
          throw error;
        }
      }, 
      deleteContract: async (id) => {
        try {
          const response = await API.delete(BASE_URL, `/contracts/${id}`);
          return response;
        } catch (error) {
          console.error('Error deleting contract:', error);
          throw error;
        }
      },    

  };

/**
 * 
 * @param {*} id 
 * @returns returns the contract by id
 */        
export const useContractById = (id) => {
  return useQuery({
    queryKey: ['contract', id],  // Unique key for caching
    queryFn: () => ContractAPI.getContractById(id),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
    enabled: !!id,  // Only run the query if ID is provided
  });
};


// Create a custom hook to use in your components
export const useContractsCache = () => {
  return useQuery({
    queryKey: ['contracts'],  // Unique key for caching
    queryFn: () => ContractAPI.createContract(),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
};

export {ContractAPI};   