import { Guardian } from "../types/guardian";
import API, { ApiResponse, BASE_URL } from "./API";

const GuardiansAPI = {
  // Fetch all guardians
  getGuardians: async (): Promise<ApiResponse<Guardian[]>> => {
    try {
      const response = await API.get<Guardian[]>(BASE_URL, '/guardians');
      return response; // Ensure you return the actual data
    } catch (error) {
      console.error('Error fetching guardians:', error);
      throw error;
    }
  },

  // Fetch a single guardian by ID
  getGuardianById: async (id: string): Promise<ApiResponse<Guardian>> => {
    try {
      const response = await API.get<Guardian>(BASE_URL, `/guardians/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching guardian with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new guardian
  createGuardian: async (data: Omit<Guardian, 'id'>): Promise<ApiResponse<Guardian>> => {
    try {
      const response = await API.post<Guardian>(BASE_URL, '/guardians', data);
      return response;
    } catch (error) {
      console.error('Error creating guardian:', error);
      throw error;
    }
  },

  // Update a guardian by ID
  updateGuardian: async (id: string, data: Guardian): Promise<ApiResponse<Guardian>> => {
    try {
      const response = await API.put<Guardian>(BASE_URL, `/guardians/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating guardian with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a guardian by ID
  deleteGuardian: async (id: string): Promise<void> => {
    try {
      await API.delete(BASE_URL, `/guardians/${id}`);
    } catch (error) {
      console.error(`Error deleting guardian with id ${id}:`, error);
      throw error;
    }
  }
};

class GuardiansModel {
  // Add any properties or methods if needed
    }
export { GuardiansAPI, GuardiansModel };

