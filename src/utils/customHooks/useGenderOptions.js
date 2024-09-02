import { useState, useEffect } from 'react';
import { useGendersCache } from '../../models/GenderAPI';

const useGenderOptions = () => {
  const [genderOptions, setGenderOptions] = useState([]);
  const { data: genders, error, isLoading } = useGendersCache();

  useEffect(() => {
    if (genders && !isLoading) {
        console.log("genders", genders);
        
      setGenderOptions(genders.response.map(gender => ({
        ...gender,
        label: gender.name,  // Adjust according to your data structure
        value: gender.id     // Adjust according to your data structure
      })));
    }
  }, [genders, isLoading]);

  return { genderOptions, error, isLoading };
};

export default useGenderOptions;
