import API, { BASE_URL } from "./API";

const GuardianTypesAPI = {
  // Fetch all guardian types
  getGuardianTypes: async () => {
    try {
      const response = await API.get(BASE_URL,'/guardian_types');
      return response; // Ensure you return the actual data
    } catch (error) {
      console.error('Error fetching guardian types:', error);
      throw error;
    }
  },

  // Fetch only active guardian types
  getActiveGuardianTypes: async () => {
    try {
      const response = await API.get(BASE_URL,'/guardian_types/active');
      return response; // Ensure you return the actual data
    } catch (error) {
      console.error('Error fetching active guardian types:', error);
      throw error;
    }
  },

  // Fetch a single guardian type by ID
  getGuardianTypeById: async (id) => {
    try {
      const response = await API.get(BASE_URL,`/guardian_types/${id}`);
      return response;
    } catch (error) {
      console.error(`Error fetching guardian type with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new guardian type
  createGuardianType: async (data) => {
    try {
      const response = await API.post(BASE_URL,`/guardian_types`, data);
      return response;
    } catch (error) {
      console.error('Error creating guardian type:', error);
      throw error;
    }
  },

  // Update a guardian type by ID
  updateGuardianType: async (id, data) => {
    try {
      const response = await API.put(BASE_URL,`/guardian_types/${id}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating guardian type with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a guardian type by ID
  deleteGuardianType: async (id) => {
    try {
      const response = await API.delete(BASE_URL,`/guardian_types/${id}`);
      return response;
    } catch (error) {
      console.error(`Error deleting guardian type with id ${id}:`, error);
      throw error;
    }
  }
};

export default GuardianTypesAPI;
