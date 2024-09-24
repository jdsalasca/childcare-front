import { useQuery } from "@tanstack/react-query";
import { DocumentType } from "../types/documentType";
import API, { ApiResponse, BASE_URL } from "./API";


const DocumentTypeAPI = {
  // Get all document types
  getDocumentTypes: async (): Promise<ApiResponse<DocumentType[]>> => {
    try {
      const response = await API.get<DocumentType[]>(BASE_URL, '/document_types');
      return response;
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  },

  // Get only active document types
  getActiveDocumentTypes: async (): Promise<ApiResponse<DocumentType[]>> => {
    try {
      const response = await API.get<DocumentType[]>(BASE_URL, '/document_types/active');
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
  });
};

// Custom hook for active document types only
export const useActiveDocumentTypesCache = () => {
  return useQuery({
    queryKey: ['active_document_types'],  // Unique key for caching active types
    queryFn: () => DocumentTypeAPI.getActiveDocumentTypes(),  // API function
  });
};

export { DocumentTypeAPI };

