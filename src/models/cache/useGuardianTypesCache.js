import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GuardianTypesAPI from "../GuardianTypesAPI";

// Hook to fetch all guardian types
export const useGuardianTypes = () => {
  return useQuery({
    queryKey:['guardianTypes'],
    queryFn: () => GuardianTypesAPI.getGuardianTypes(),
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
};

// Hook to fetch only active guardian types
export const useActiveGuardianTypes = () => {
  return useQuery({
    queryKey: ['activeGuardianTypes'],
    queryFn: () => GuardianTypesAPI.getActiveGuardianTypes(),
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
  });
};

// Hook to fetch a single guardian type by ID
export const useGuardianTypeById = (id) => {
  return useQuery(['guardianType', id], () => GuardianTypesAPI.getGuardianTypeById(id));
};

// Hook to create a new guardian type
export const useCreateGuardianType = () => {
  const queryClient = useQueryClient();
  return useMutation(GuardianTypesAPI.createGuardianType, {
    onSuccess: () => {
      queryClient.invalidateQueries(['guardianTypes']);
    },
  });
};

// Hook to update a guardian type
export const useUpdateGuardianType = () => {
  const queryClient = useQueryClient();
  return useMutation(({ id, data }) => GuardianTypesAPI.updateGuardianType(id, data), {
    onSuccess: () => {
      queryClient.invalidateQueries(['guardianTypes']);
      queryClient.invalidateQueries(['guardianType']);
    },
  });
};

// Hook to delete a guardian type
export const useDeleteGuardianType = () => {
  const queryClient = useQueryClient();
  return useMutation(GuardianTypesAPI.deleteGuardianType, {
    onSuccess: () => {
      queryClient.invalidateQueries(['guardianTypes']);
    },
  });
};
