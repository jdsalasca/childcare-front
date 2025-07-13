import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../API"; // Import your ApiResponse type
import GuardianTypesAPI from "../GuardianTypesAPI";
import { GuardianType } from "../../types/guardianType";

// Hook to fetch all guardian types
export const useGuardianTypes = () => {
  return useQuery<ApiResponse<GuardianType[]>, Error>({
    queryKey: ['guardianTypes'],
    queryFn: () => GuardianTypesAPI.getGuardianTypes(),
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
  });
};

// Hook to fetch only active guardian types
export const useActiveGuardianTypes = () => {
  return useQuery<ApiResponse<GuardianType[]>, Error>({
    queryKey: ['activeGuardianTypes'],
    queryFn: () => GuardianTypesAPI.getActiveGuardianTypes(),
    staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
  });
};

// Hook to fetch a single guardian type by ID
export const useGuardianTypeById = (id: string | undefined) => {
  return useQuery<ApiResponse<GuardianType>, Error>({
    queryKey: ['guardianType', id],
    queryFn: () => GuardianTypesAPI.getGuardianTypeById(id!),
    enabled: !!id, // Only run the query if ID is provided
  });
};

