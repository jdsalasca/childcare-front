import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";

const ChildrenGuardiansAPI = {
    // Get Bill Types by Currency Code
    createChildrenGuardians: async (data) => {
      try {
        const response = await API.post(BASE_URL, '/children-guardians', data);
        return response;
      } catch (error) {
        console.error('Error creating children-guardians:', error);
        return error;
      }
    },
    

  getByChildId: async (childId) => {
    try {
      const response = await API.get(BASE_URL, `/children-guardians/child/${childId}`);
      return response;
    } catch (error) {
      console.error('Error fetching children-guardians by childId:', error);
      throw error;
    }
  },

};

// Create a custom hook to use in your components
export const useChildrenGuardiansCache = () => {
  return useQuery({
    queryKey: ['children-guardians'],  // Unique key for cachi
    queryFn: () => ChildrenGuardiansAPI.createChildrenGuardians(),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
};

export {ChildrenGuardiansAPI};