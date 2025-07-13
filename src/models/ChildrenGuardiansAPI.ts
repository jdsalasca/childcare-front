import { useQuery, UseQueryResult } from '@tanstack/react-query';
import API, { ApiResponse, BASE_URL } from './API';

// Define the structure of the data for creating children guardians
interface ChildrenGuardiansData {
  // Define properties based on the expected structure of the data
}

const ChildrenGuardiansAPI = {
  // Create Children Guardians
  createChildrenGuardians: async (
    data: ChildrenGuardiansData
  ): Promise<ApiResponse<ChildrenGuardiansData>> => {
    try {
      const response = await API.post<ChildrenGuardiansData>(
        BASE_URL,
        '/children-guardians',
        data
      );
      return response;
    } catch (error) {
      console.error('Error creating children-guardians:', error);
      throw error; // Throw error to be handled by calling function
    }
  },

  // Get Guardians by Child ID
  getByChildId: async (
    childId: string
  ): Promise<ApiResponse<ChildrenGuardiansData>> => {
    try {
      const response = await API.get<ChildrenGuardiansData>(
        BASE_URL,
        `/children-guardians/child/${childId}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching children-guardians by childId:', error);
      throw error; // Ensure errors are propagated
    }
  },
};

// Create a custom hook to use in your components
export const useChildrenGuardiansCache = (): UseQueryResult<any, Error> => {
  return useQuery<any, Error>({
    queryKey: ['children-guardians'], // Unique key for caching
    queryFn: () => ChildrenGuardiansAPI.createChildrenGuardians({}), // Call with empty object or pass valid data
  });
};

export { ChildrenGuardiansAPI };
