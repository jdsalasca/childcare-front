import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";
import { ContractModel } from "./ContractAPI";
import { ContractPermission } from "../types/contractPermission";


export const ContractPermissionsAPI = {
  createContractPermissions: async (contractPermission: ContractPermission): Promise<any> => {
    try {
      const response = await API.post(BASE_URL, '/contract_permissions', contractPermission);
      return response;
    } catch (error) {
      console.error('Error creating contract permissions:', error);
      throw error;
    }
  },

  updateContractPermissions: async (contractPermission: ContractPermission): Promise<any> => {
    try {
      const response = await API.put(BASE_URL, '/contract_permissions', { contractPermission });
      return response;
    } catch (error) {
      console.error('Error updating contract permissions:', error);
      throw error;
    }
  },

  getAllContractPermissions: async (): Promise<any> => {
    try {
      const response = await API.get(BASE_URL, '/contract_permissions');
      return response;
    } catch (error) {
      console.error('Error fetching contract permissions:', error);
      throw error;
    }
  },

  getContractPermissionsById: async (id: string): Promise<any> => {
    try {
      const response = await API.get(BASE_URL, `/contract_permissions/${id}`);
      return response;
    } catch (error) {
      console.error('Error fetching contract permissions by id:', error);
      throw error;
    }
  },

  deleteContractPermissions: async (id: string): Promise<any> => {
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
 * @param id 
 * @returns returns the contract permissions by id
 */
export const useContractPermissionsById = (id: string | undefined) => {
  return useQuery({
    queryKey: ['contract_permissions', id],  // Unique key for caching
    queryFn: () => ContractPermissionsAPI.getContractPermissionsById(id!),  // API function
    enabled: !!id,  // Only run the query if ID is provided
  });
};

// Create a custom hook to use in your components
export const useContractPermissionsCache = () => {
  return useQuery({
    queryKey: ['contract_permissions'],  // Unique key for caching
    queryFn: () => ContractPermissionsAPI.getAllContractPermissions(),  // API function
  });
};

type ContractPermissionKeys = keyof ContractPermission;

export class ContractPermissionsValidator {
  /**
   * 
   * @param permissions 
   * @returns returns the number of accepted permissions
   */
  static getValidContractPermissions(permissions: ContractPermission | undefined): number {
    if(permissions == null){
      return 0;
    }
    const permissionValidKeys = Object.keys(permissions).filter((key) => {
      const typedKey = key as ContractPermissionKeys; // Assert the key type
      return permissions[typedKey] === true && ContractModel.CONTRACT_PERMISSIONS.includes(key as string);
    });
    return permissionValidKeys.length; // Returns count of valid permissions
  }
}
