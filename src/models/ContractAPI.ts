import { useQuery } from '@tanstack/react-query';
import API, { ApiResponse, BASE_URL } from './API';
import { ContractDaySchedule } from './ApiModels';

interface Contract {
  contract_id?: string;
  [key: string]: any; // Add specific fields as needed
}

const ContractAPI = {
  // Create a contract
  createContract: async (
    contract: Contract
  ): Promise<ApiResponse<Contract>> => {
    try {
      const response = await API.post<Contract>(
        BASE_URL,
        '/contracts',
        contract
      );
      return response;
    } catch (error) {
      console.error('Error creating contract:', error);
      throw error;
    }
  },

  // Create a contract schedule
  createContractSchedule: async (
    contract: ContractDaySchedule
  ): Promise<ApiResponse<Contract>> => {
    try {
      const response = await API.post<ContractDaySchedule[]>(
        BASE_URL,
        '/contracts/schedule',
        contract
      );
      return response;
    } catch (error) {
      console.error('Error creating contract schedule:', error);
      throw error;
    }
  },

  // Update contract payment details
  updateContractPaymentDetails: async (
    contract: Contract
  ): Promise<ApiResponse<Contract>> => {
    console.log('contract on createContract', contract);

    try {
      const response = await API.put<Contract>(
        BASE_URL,
        `/contracts/payment_details/${contract.contract_id}`,
        contract
      );
      return response;
    } catch (error) {
      console.error('Error updating contract payment details:', error);
      throw error;
    }
  },

  // Update contract
  updateContract: async (
    contract: Contract
  ): Promise<ApiResponse<Contract>> => {
    try {
      const response = await API.put<Contract>(BASE_URL, '/contracts', {
        contract,
      });
      return response;
    } catch (error) {
      console.error('Error updating contract:', error);
      throw error;
    }
  },

  // Get all contracts
  getAllContracts: async (): Promise<ApiResponse<Contract>> => {
    try {
      const response = await API.get<Contract>(BASE_URL, '/contracts');
      return response;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  },

  // Get contract by ID
  getContractById: async (id: string): Promise<ApiResponse<Contract>> => {
    try {
      const response = await API.get<Contract>(BASE_URL, `/contracts/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching contract by id:', error);
      throw error;
    }
  },

  // Delete contract
  deleteContract: async (id: string): Promise<ApiResponse<Contract>> => {
    try {
      const response = await API.delete<Contract>(BASE_URL, `/contracts/${id}`);
      return response;
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  },
};

/**
 * Custom hook to fetch a contract by ID
 * @param id - The ID of the contract
 * @returns The result of the query
 */
export const useContractById = (id: string) => {
  return useQuery<ApiResponse<Contract>>({
    queryKey: ['contract', id], // Unique key for caching
    queryFn: () => ContractAPI.getContractById(id), // API function
    enabled: !!id, // Only run the query if ID is provided
  });
};

// Create a custom hook to use all contracts
export const useContractsCache = () => {
  return useQuery<ApiResponse<Contract>>({
    queryKey: ['contracts'], // Unique key for caching
    queryFn: () => ContractAPI.getAllContracts(), // API function
  });
};

// Contract model
class ContractModel {
  static CONTRACT_PERMISSIONS = [
    'share_photos_with_families',
    'allow_other_parents_to_take_photos',
    'use_photos_for_art_and_activities',
    'use_photos_for_promotion',
    'walk_around_neighborhood',
    'walk_to_park_or_transport',
    'walk_in_school',
    'guardian_received_manual',
  ];
}

// Contract builder class for creating contracts
class ContractBuilder {
  private guardians: any[]; // Define a proper type for guardians

  constructor(guardians: any[]) {
    this.guardians = guardians;
  }

  build() {
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
