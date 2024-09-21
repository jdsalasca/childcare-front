import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";
import { ContractModel } from "./ContractAPI";

export const ContractPermissionsAPI = {
    createContractPermissions: async (contractPermission) => {
      try {
        const response = await API.post(BASE_URL, '/contract_permissions',  contractPermission);
        return response;
      } catch (error) {
        console.error('Error creating contract permissions:', error);
        throw error;
      }
    },
    
    updateContractPermissions: async (contractPermission) => {
        try {
          const response = await API.put(BASE_URL, '/contract_permissions', { contractPermission });
          return response;
        } catch (error) {
          console.error('Error updating contract permissions:', error);
          throw error;
        }
      },

      getAllContractPermissions: async () => {
        try {
          const response = await API.get(BASE_URL, '/contract_permissions');
          return response;
        } catch (error) {
          console.error('Error fetching contract permissions:', error);
          throw error;
        }
      },
      getContractPermissionsById: async (id) => {
        try {
          const response = await API.get(BASE_URL, `/contract_permissions/${id}`);
          return response;
        } catch (error) {
          console.error('Error fetching contract permissions by id:', error);
          throw error;
        }
      },                         
      deleteContractPermissions: async (id) => {
        try {
          const response = await API.delete(BASE_URL, `/contract_permissions/${id}`);
          return response;
        } catch (error) {
          console.error('Error deleting contract permissions:', error);
          throw error;
        }
      },    

  };

/**
 * 
 * @param {*} id 
 * @returns returns the contract permissions by id
 */        
export const useContractPermissionsById = (id) => {
  return useQuery({
    queryKey: ['contract_permissions', id],  // Unique key for caching
    queryFn: () => ContractPermissionsAPI.getContractPermissionsById(id),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
    enabled: !!id,  // Only run the query if ID is provided
  });
};


// Create a custom hook to use in your components
export const useContractPermissionsCache = () => {
  return useQuery({
    queryKey: ['contract_permissions'],  // Unique key for caching
    queryFn: () => ContractPermissionsAPI.getAllContractPermissions(),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
}; 

export class ContractPermissionsValidator {
  /**
   * 
   * @param {*} permissions 
   * @returns returns the number of accepted permissions
   */
  static getValidContractPermissions(permissions) {
    const permissionValidKeys = Object.keys(permissions).filter(key => permissions[key] === true && ContractModel.CONTRACT_PERMISSIONS.includes(key));
    return Object.values(permissionValidKeys).filter(value => value).length;
}
}