import { useState, useEffect } from 'react';
import { useGuardiansCache } from '../../models/cache/useGuardiansCache';

export const useGuardianOptions = () => {
  const [guardianOptions, setGuardianOptions] = useState([]);
  const { data: guardians, error, isLoading } = useGuardiansCache();

  useEffect(() => {
    if (guardians && !isLoading) {
      console.log("guardians", guardians);
      
      // Filter guardians if necessary (e.g., active status or specific criteria)
      // Assuming you have a status or similar field; adjust as needed
      const activeGuardians = guardians.filter(guardian => guardian.status === 'Active');
      
      setGuardianOptions(activeGuardians.map(guardian => ({
        ...guardian,
        label: guardian.names,  // Adjust according to your data structure
        value: guardian.id      // Adjust according to your data structure
      })));
    }
  }, [guardians, isLoading]);

  return { guardianOptions, error, isLoading };
};

