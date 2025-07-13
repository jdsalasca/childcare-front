import { useMemo } from 'react';
import { customLogger } from '../../configs/logger';
import { useGendersCache } from '../../models/GenderAPI';
import { GenderType } from '../../types/gender';

const useGenderOptions = () => {
  const { data: genders, error, isLoading } = useGendersCache();

  // Use useMemo to transform gender options and prevent unnecessary re-renders
  const genderOptions = useMemo(() => {
    if (!genders || isLoading) return [];

    customLogger.debug('genders', genders);

    return genders.response.map((gender: GenderType) => ({
      ...gender,
      label: gender.name, // Adjust according to your data structure
      value: gender.id, // Adjust according to your data structure
    }));
  }, [genders, isLoading]);

  return { genderOptions, error, isLoading };
};

export default useGenderOptions;
