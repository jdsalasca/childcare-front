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
    createContractSchedule: async (contract) => {
        try {
          const response = await API.post(BASE_URL, '/contracts/schedule',  contract);
          return response;
        } catch (error) {
          console.error('Error creating contract schedule:', error);
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


class ContractModel{
  /**
   * This are the currents permissions used on the contract
   * this has to be updated with the information of @class ContractPermissionsAPI
   */
  static CONTRACT_PERMISSIONS =[
    'share_photos_with_families',
    'allow_other_parents_to_take_photos',
    'use_photos_for_art_and_activities',
    'use_photos_for_promotion',
    'walk_around_neighborhood',
    'walk_to_park_or_transport',
    'walk_in_school',
    'guardian_received_manual'
  ]

}
/**
 * Contact factory class for creating contracts
 */
class ContractBuilder {
  constructor(guardians) {
    this.guardians = guardians;
  }
  build() {
    // Ensure guardians array is not empty and has a titular guardian
    const titularGuardian = this.guardians.find(g => g.titular);
    if (!titularGuardian) {
      throw new Error('No titular guardian found');
    }

    return {
      guardian_id_titular: titularGuardian.id,
    };
  }
}


export { ContractAPI, ContractBuilder, ContractModel };

