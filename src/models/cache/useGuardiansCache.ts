import { useQuery } from '@tanstack/react-query';
import { Guardian } from '../../types/guardian';
import { ApiResponse } from '../API';
import { GuardiansAPI } from '../GuardiansAPI';

const useGuardiansCache = () => {
  return useQuery<ApiResponse<Guardian[]>>({
    queryKey: ['guardians'], // Unique key for caching
    queryFn: GuardiansAPI.getGuardians, // API function
  });
};

// For fetching a single guardian by ID
const useGuardianById = (id: string | undefined) => {
  return useQuery<ApiResponse<Guardian>, Error>({
    queryKey: ['guardian', id], // Unique key for caching
    queryFn: () => GuardiansAPI.getGuardianById(id!), // API function, assert id is not undefined
    enabled: !!id, // Only run the query if ID is provided
  });
};

export { useGuardianById, useGuardiansCache };
