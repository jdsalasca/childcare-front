import { useQuery } from "@tanstack/react-query";
import API, { BASE_URL } from "./API";

const DocumentTypeAPI = {
    // Get all document types
    getDocumentTypes: async () => {
      try {
        const response = await API.get(BASE_URL,'/document_types');
        return response;
      } catch (error) {
        console.error('Error fetching document types:', error);
        throw error;
      }
    },

    // Get only active document types
    getActiveDocumentTypes: async () => {
      try {
        const response = await API.get(BASE_URL,`/document_types/active`);
        return response;
      } catch (error) {
        console.error('Error fetching active document types:', error);
        throw error;
      }
    }
};

// Create a custom hook to use in your components for all document types
export const useDocumentTypesCache = () => {
  return useQuery({
    queryKey: ['document_types'],  // Unique key for caching
    queryFn: () => DocumentTypeAPI.getDocumentTypes(),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30,  // Cache time in milliseconds (30 minutes)
  });
};

// Custom hook for active document types only
export const useActiveDocumentTypesCache = () => {
  return useQuery({
    queryKey: ['active_document_types'],  // Unique key for caching active types
    queryFn: () => DocumentTypeAPI.getActiveDocumentTypes(),  // API function
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30,  // Cache time in milliseconds (30 minutes)
  });
};

export { DocumentTypeAPI };
