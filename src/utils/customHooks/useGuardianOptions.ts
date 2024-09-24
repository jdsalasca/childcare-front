import { useEffect, useState } from 'react';
import { useGuardiansCache } from '../../models/cache/useGuardiansCache';
import { Guardian } from '../../types/guardian';


const useGuardianOptions = () => {
  const [guardianOptions, setGuardianOptions] = useState<Guardian[]>([]);
  const { data: guardians, error, isLoading } = useGuardiansCache();

  useEffect(() => {
    if (guardians && !isLoading) {
      // Filter guardians if necessary (e.g., active status or specific criteria)
      const activeGuardians = guardians.response.filter((guardian: Guardian) => guardian.status === 'Active');

    // Create a new type that extends Guardian to include additional properties
    const guardianOptions = activeGuardians.map((guardian: Guardian) => ({
      ...guardian,
      id_static: guardian.id.toString(), // Ensure id_static is a string
      label: `${guardian.name} - ${guardian.last_name}`, // Adjust according to your data structure
      value: guardian.id.toString()      // Ensure value is a string
    }));

    setGuardianOptions(guardianOptions);

    }
  }, [guardians, isLoading]);

  return { guardianOptions, error, isLoading };
};

export default useGuardianOptions;
