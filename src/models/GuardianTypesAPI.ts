import API, { ApiResponse, BASE_URL } from "./API";
import { GuardianType } from "../types/guardianType";


const GuardianTypesAPI = {
  // Fetch all guardian types
  getGuardianTypes: async ():Promise<ApiResponse<GuardianType[]>> => {
    try {
      const response = await API.get<GuardianType[]>(BASE_URL, '/guardian_types');
      return response; // Ensure you return the actual data
    } catch (error) {
      console.error('Error fetching guardian types:', error);
      throw error;
    }
  },

  // Fetch only active guardian types
  getActiveGuardianTypes: async (): Promise<ApiResponse<GuardianType[]>> => {
    try {
      const response = await API.get<GuardianType[]>(BASE_URL, '/guardian_types/active');
      return response; // Ensure you return the actual data
    } catch (error) {
      console.error('Error fetching active guardian types:', error);
      throw error;
    }
  },

  // Fetch a single guardian type by ID
  getGuardianTypeById: async (id: string): Promise<ApiResponse<GuardianType>> => {
    try {
      const response = await API.get<GuardianType>(BASE_URL, `/guardian_types/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching guardian type with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new guardian type
  createGuardianType: async (data: Omit<GuardianType, 'id'>): Promise<ApiResponse<GuardianType>>  => {
    try {
      const response = await API.post<GuardianType>(BASE_URL, '/guardian_types', data);
      return response;
    } catch (error) {
      console.error('Error creating guardian type:', error);
      throw error;
    }
  },

  // Update a guardian type by ID
  updateGuardianType: async (id: string, data: GuardianType): Promise<ApiResponse<GuardianType>> => {
    try {
      const response = await API.put<GuardianType>(BASE_URL, `/guardian_types/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating guardian type with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a guardian type by ID
  deleteGuardianType: async (id: string): Promise<void> => {
    try {
      await API.delete(BASE_URL, `/guardian_types/${id}`);
    } catch (error) {
      console.error(`Error deleting guardian type with id ${id}:`, error);
      throw error;
    }
  }
};

export default GuardianTypesAPI;
