import { useState, useEffect } from 'react';
import { useGuardianTypes } from '../../models/cache/useGuardianTypesCache';

const useGuardianTypeOptions = () => {
  const [guardianTypeOptions, setGuardianTypeOptions] = useState([]);
  const { data: guardianTypes, error, isLoading } = useGuardianTypes();

  useEffect(() => {
    if (guardianTypes && !isLoading) {
      
      // Filter guardian types where status is "Active"
      const activeGuardianTypes = guardianTypes?.response?.filter(type => type.status === 'Active');
      
      setGuardianTypeOptions(activeGuardianTypes.map(type => ({
        ...type,
        label: type.type,  // Adjust according to your data structure
        value: type.id     // Adjust according to your data structure
      })));
    }
  }, [guardianTypes, isLoading]);

  return { guardianTypeOptions, error, isLoading };
};

export default useGuardianTypeOptions;
