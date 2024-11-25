import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ChildType } from 'types/child';
import API, { ApiResponse, BASE_URL } from './API';
import { AppModels } from './AppModels';


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
        if(response.httpStatus === 200 && response.response.length > 0){
            return {
                httpStatus: response.httpStatus,
                response: response.response.map((child: ChildType) => ({
                    ...child,
                    static_id: child.id,
                    fullName: `${child.first_name} ${child.last_name}`,
                })),
            };
        }

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
interface UseChildrenResult {
    data: ChildType[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refreshChildren: () => Promise<void>;
}

export const useChildren = (): UseChildrenResult => {  
    const queryClient = useQueryClient();
    const childrenQuery = useQuery<ApiResponse<ChildType[]>, Error>({
        queryKey: ['children'],
        queryFn: ChildrenAPI.getChildren,
        staleTime: AppModels.DEFAULT_CACHE_TIME_5_MINUTES,
    });

    const refreshChildren = async () => {
        await queryClient.invalidateQueries({ queryKey: ['children'] });
    };

    return {
        data: childrenQuery.data?.response || [],
        isLoading: childrenQuery.isLoading,
        isError: childrenQuery.isError,
        error: childrenQuery.error,
        refreshChildren
    };
};

export default ChildrenAPI;
