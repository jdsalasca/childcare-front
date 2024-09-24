import { useEffect, useState } from 'react';
import { useGuardianTypes } from '../../models/cache/useGuardianTypesCache';

const useGuardianTypeOptions = () => {
  const [guardianTypeOptions, setGuardianTypeOptions] = useState<GuardianType[]>([]);
  const { data: guardianTypes, error, isLoading } = useGuardianTypes();

  useEffect(() => {
    if (guardianTypes && !isLoading) {
      // Filter guardian types where status is "Active"
      const activeGuardianTypes = guardianTypes.response?.filter((type: GuardianType) => type.status === 'Active');

      if (activeGuardianTypes) {
        setGuardianTypeOptions(activeGuardianTypes.map(type => ({
          ...type,
          label: type.name,  // Assuming type.name is the correct property for the label
          value: type.id     // Assuming type.id is a string
        })));
      }
    }
  }, [guardianTypes, isLoading]);

  return { guardianTypeOptions, error, isLoading };
};

export default useGuardianTypeOptions;
