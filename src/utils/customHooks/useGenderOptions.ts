import { useEffect, useState } from 'react';
import { customLogger } from '../../configs/logger';
import { useGendersCache } from '../../models/GenderAPI';
import { GenderType } from '../../types/gender';

const useGenderOptions = () => {
  const [genderOptions, setGenderOptions] = useState<GenderType[]>([]);
  const { data: genders, error, isLoading } = useGendersCache();

  useEffect(() => {
    if (genders && !isLoading) {
      customLogger.debug("genders", genders);
      
      setGenderOptions(genders.response.map((gender: GenderType) => ({
        ...gender,
        label: gender.name,  // Adjust according to your data structure
        value: gender.id     // Adjust according to your data structure
      })));
    }
  }, [genders, isLoading]);

  return { genderOptions, error, isLoading };
};

export default useGenderOptions;
