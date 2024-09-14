import { useEffect, useState } from "react";
import { customLogger } from "../../configs/logger";
import { useDaysCache } from "../DaysAPI";

const useDays = () => {
  const [allDays, setAllDays] = useState([]);
  const [laboralDays, setLaboralDays] = useState([]);
  const { data: days, error, isLoading } = useDaysCache();
  
  useEffect(() => {
    customLogger.debug("days", days);
    
    if (days && !isLoading) {
      // Set all days
      setAllDays(
        days.response.map(day => ({
          ...day,
          label: day.name,  // Adjust according to your data structure
          value: day.id     // Adjust according to your data structure
        }))
      );
      
      // Set laboral days
      setLaboralDays(
        days.response.filter(day => day.laboral_day).map(day => ({
          ...day,
          label: day.name,  // Adjust according to your data structure
          value: day.id     // Adjust according to your data structure
        }))
      );
    }
  }, [days, isLoading]);

  return { allDays, laboralDays, error, isLoading };
};

export default useDays;
