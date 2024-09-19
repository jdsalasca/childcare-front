import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppModels } from "../AppModels";
import GuardiansAPI from "../GuardiansAPI";

export const useGuardiansCache = () => {
  return useQuery({
    queryKey: ['guardians'], // Unique key for caching
    queryFn: GuardiansAPI.getGuardians, // API function
    staleTime: AppModels.DEFAULT_CACHE_TIME_30_SECONDS, // Cache time in milliseconds (20 minutes)
    cacheTime: AppModels.DEFAULT_CACHE_TIME_30_SECONDS, // Cache time in milliseconds (30 minutes)
  });
};

// For fetching a single guardian by ID
export const useGuardianById = (id) => {
  return useQuery({
    queryKey: ['guardian', id], // Unique key for caching
    queryFn: () => GuardiansAPI.getGuardianById(id), // API function
    staleTime: 1000 * 60 * 20, // Cache time in milliseconds (20 minutes)
    cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
    enabled: !!id, // Only run the query if ID is provided
  });
};

// For creating a new guardian
export const useCreateGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: GuardiansAPI.createGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries(['guardians']); // Invalidate guardians cache
    },
  });
};

// For updating a guardian
export const useUpdateGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => GuardiansAPI.updateGuardian(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['guardians']); // Invalidate guardians cache
    },
  });
};

// For deleting a guardian
export const useDeleteGuardian = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: GuardiansAPI.deleteGuardian,
    onSuccess: () => {
      queryClient.invalidateQueries(['guardians']); // Invalidate guardians cache
    },
  });
};
