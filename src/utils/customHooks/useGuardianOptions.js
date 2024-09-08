import { useState, useEffect } from 'react';
import { useGuardiansCache } from '../../models/cache/useGuardiansCache';

const useGuardianOptions = () => {
  const [guardianOptions, setGuardianOptions] = useState([]);
  const { data: guardians, error, isLoading } = useGuardiansCache();

  useEffect(() => {
    if (guardians && !isLoading) {
      
      // Filter guardians if necessary (e.g., active status or specific criteria)
      // Assuming you have a status or similar field; adjust as needed
      const activeGuardians = guardians?.response.filter(guardian => guardian.status === 'Active');
      console.log("guardians", guardians, activeGuardians);
      
      setGuardianOptions(guardians?.response.map(guardian => ({
        ...guardian,
        label: guardian.name + ' - ' + guardian.last_name, // Adjust according to your data structure
        value: guardian.id      // Adjust according to your data structure
      })));
    }
  }, [guardians, isLoading]);

  return { guardianOptions, error, isLoading };
};

export default useGuardianOptions;