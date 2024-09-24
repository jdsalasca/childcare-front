import { useEffect, useState } from 'react';
import { useDocumentTypesCache } from '../../models/DocumentTypeAPI'; // Adjust path accordingly
import { DocumentType } from '../../types/documentType';

const useDocumentTypeOptions = () => {
  const [documentTypeOptions, setDocumentTypeOptions] = useState<DocumentType[]>([]);
  const { data: documentTypes, error, isLoading } = useDocumentTypesCache();

  useEffect(() => {
    if (documentTypes && !isLoading) {
      console.log("documentTypes", documentTypes);
      
      // Filter document types where status is "Active"
      const activeDocumentTypes = documentTypes.response.filter((docType: DocumentType) => docType.status === 'Active');
      
      setDocumentTypeOptions(activeDocumentTypes.map(docType => ({
        ...docType,
        label: docType.name,  // Adjust according to your data structure
        value: docType.id     // Adjust according to your data structure
      })));
    }
  }, [documentTypes, isLoading]);

  return { documentTypeOptions, error, isLoading };
};

export default useDocumentTypeOptions;
