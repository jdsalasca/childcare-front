import { useMemo } from 'react';
import { useDocumentTypesCache } from '../../models/DocumentTypeAPI'; // Adjust path accordingly
import { DocumentType } from '../../types/documentType';

const useDocumentTypeOptions = () => {
  const { data: documentTypes, error, isLoading } = useDocumentTypesCache();

  // Use useMemo to transform document type options and prevent unnecessary re-renders
  const documentTypeOptions = useMemo(() => {
    if (!documentTypes || isLoading) return [];


    // Filter document types where status is "Active"
    const activeDocumentTypes = documentTypes.response.filter(
      (docType: DocumentType) => docType.status === 'Active'
    );

    return activeDocumentTypes.map(docType => ({
      ...docType,
      label: docType.name, // Adjust according to your data structure
      value: docType.id, // Adjust according to your data structure
    }));
  }, [documentTypes, isLoading]);

  return { documentTypeOptions, error, isLoading };
};

export default useDocumentTypeOptions;
