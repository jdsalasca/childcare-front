import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ChildType } from 'types/child';
import API, { ApiResponse, BASE_URL } from './API';


interface CreateChildData {
    first_name: string;
    last_name: string;
    // Add other properties as needed
}


const ChildrenAPI = {
    // Create a new child
    // FIXME Reviwes why im waitting for DATA instead of the response
    createChild: async (childData: CreateChildData): Promise<ApiResponse<ChildType>> => {
        try {
            const response = await API.post<ChildType>(BASE_URL, '/children', childData);
            return response; // Ensure you return the correct data structure
        } catch (error) {
            console.error('Error creating child:', error);
            throw error;
        }
    },

 // Get all children
getChildren: async (): Promise<ApiResponse<ChildType[]>> => {  // Change the response type to Child[]
    try {
        const response = await API.get<ChildType[]>(BASE_URL, '/children');
        return response; // Ensure you return the correct data structure
    } catch (error) {
        console.error('Error fetching children:', error);
        throw error;
    }
},

    // Get a single child by ID
    getChild: async (id: string): Promise<ApiResponse<ChildType>> => {
        try {
            const response = await API.get<ChildType>(BASE_URL, `/children/${id}`);
            return response; // Ensure you return the correct data structure
        } catch (error) {
            console.error(`Error fetching child with ID ${id}:`, error);
            throw error;
        }
    },

    // Update a child by ID
    updateChild: async (id: number, childData: CreateChildData): Promise<ApiResponse<ChildType>> => {
        try {
            const response = await API.put<ChildType>(BASE_URL, `/children/${id}`, childData);
            return response; // Ensure you return the correct data structure
        } catch (error) {
            console.error(`Error updating child with ID ${id}:`, error);
            throw error;
        }
    },

    // Delete a child by ID
    deleteChild: async (id: string): Promise<ApiResponse<ChildType>> => {
        try {
            const response = await API.delete<ChildType>(BASE_URL, `/children/${id}`);
            return response; // Ensure you return the correct data structure
        } catch (error) {
            console.error(`Error deleting child with ID ${id}:`, error);
            throw error;
        }
    }
};

export const useChildren = (): UseQueryResult<ChildType[], Error> => {  
    const childrenQuery = useQuery<ApiResponse<ChildType[]>, Error>({
        queryKey: ['children'], // Unique key for caching
        queryFn: ChildrenAPI.getChildren, // Function to fetch children
        // Optional: Add config like staleTime, cacheTime, etc., to avoid unnecessary refetching
    });

    // Memoize the transformed data to avoid unnecessary re-renders
    const updateChildren = useMemo(() => {
        if (childrenQuery.data && childrenQuery.data.httpStatus === 200) {
            return childrenQuery.data.response.map(child => ({
                ...child,
                fullName: `${child.first_name} ${child.last_name}`,
            }));
        }
        return [];
    }, [childrenQuery.data]);

    return {
        ...childrenQuery,
        data: updateChildren, // Ensure data is always of type ChildType[]
        error: childrenQuery.error, // Pass the error if it exists
        isError: childrenQuery.isError,
        isLoading: childrenQuery.isLoading,
        isSuccess: childrenQuery.isSuccess,
        status: childrenQuery.status,
        // Include other properties as needed...
    } as UseQueryResult<ChildType[], Error>; // Assert the return type
};

export default ChildrenAPI;
