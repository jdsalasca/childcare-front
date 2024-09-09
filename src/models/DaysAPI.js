import { useQuery } from '@tanstack/react-query';
import API, { BASE_URL } from './API';

const DaysAPI = {
    // Get all days
    getAllDays: async () => {
        try {
            const response = await API.get(BASE_URL, '/days');
            return response;
        } catch (error) {
            console.error('Error fetching days:', error);
            throw error;
        }
    },
    // Get a single day by id
    getDayById: async (id) => {
        try {
            const response = await API.get(BASE_URL, `/days/${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching day by id:', error);
            throw error;
        }
    },
};

export const useDaysCache = () => {
    return useQuery({
        queryKey: ['days'],  // Unique key for caching
        queryFn: () => DaysAPI.getAllDays(),  // API function
        staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
        cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
    });
};  

export { DaysAPI };