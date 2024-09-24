import { useEffect, useState } from "react";
import { useDaysCache } from "../DaysAPI";


const useDays = () => {
  const [allDays, setAllDays] = useState<DayType[]>([]);
  const [laboralDays, setLaboralDays] = useState<DayType[]>([]);
  const { data: days, error, isLoading } = useDaysCache(); // Specify the return type here

  useEffect(() => {
    // customLogger.debug("days", days);
    
    if (days && !isLoading) {
      // Set all days
      setAllDays(
        days.response.map(day => ({
          ...day,
          label: day.name,  // Ensure label is taken from name
          value: day.id     // Ensure value is taken from id
        }))
      );
      
      // Set laboral days
      setLaboralDays(
        days.response.filter(day => day.laboral_day).map(day => ({
          ...day,
          label: day.name,  // Ensure label is taken from name
          value: day.id     // Ensure value is taken from id
        }))
      );
    }
  }, [days, isLoading]);

  return { allDays, laboralDays, error, isLoading };
};

export default useDays;
