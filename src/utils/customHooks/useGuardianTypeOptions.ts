import { useMemo } from 'react';
import { useGuardianTypes } from '../../models/cache/useGuardianTypesCache';

const useGuardianTypeOptions = () => {
  const { data: guardianTypes, error, isLoading } = useGuardianTypes();

  // Use useMemo to transform guardian type options and prevent unnecessary re-renders
  const guardianTypeOptions = useMemo(() => {
    if (!guardianTypes || isLoading) return [];
    
    // Filter guardian types where status is "Active"
    const activeGuardianTypes = guardianTypes.response?.filter((type: GuardianType) => type.status === 'Active');

    if (activeGuardianTypes) {
      return activeGuardianTypes.map(type => ({
        ...type,
        label: type.name,  // Assuming type.name is the correct property for the label
        value: type.id     // Assuming type.id is a string
      }));
    }
    
    return [];
  }, [guardianTypes, isLoading]);

  return { guardianTypeOptions, error, isLoading };
};

export default useGuardianTypeOptions;
