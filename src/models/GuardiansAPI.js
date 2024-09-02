import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";

const GuardiansAPI = {
  // Fetch all guardians
  getGuardians: async () => {
    try {
      const response = await API.get(BASE_URL,'/guardians');  
      return response.data; // Ensure you return the actual data
    } catch (error) {
      console.error('Error fetching guardians:', error);
      throw error;
    }
  },

  // Fetch a single guardian by ID
  getGuardianById: async (id) => {
    try {
      const response = await API.get(BASE_URL,`/guardians/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching guardian with id ${id}:`, error);
      throw error;
    }
  },

  // Create a new guardian
  createGuardian: async (data) => {
    try {
      const response = await API.post(BASE_URL,`/guardians`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating guardian:', error);
      throw error;
    }
  },

  // Update a guardian by ID
  updateGuardian: async (id, data) => {
    try {
      const response = await API.put(BASE_URL,`/guardians/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating guardian with id ${id}:`, error);
      throw error;
    }
  },

  // Delete a guardian by ID
  deleteGuardian: async (id) => {
    try {
      const response = await API.delete(BASE_URL,`/guardians/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting guardian with id ${id}:`, error);
      throw error;
    }
  }
};

export default GuardiansAPI;
