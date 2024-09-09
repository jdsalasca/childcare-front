import { useEffect, useState } from "react";
import { useDaysCache } from "../DaysAPI";

const useDays = () => {
  const [daysOptions, setDaysOptions] = useState([]);
  const { data: days, error, isLoading } = useDaysCache();
  
  useEffect(() => {
    console.log("days", days)
    
    if (days && !isLoading) {
      setDaysOptions(days.response.map(day => ({
        ...day,
        label: day.name,  // Adjust according to your data structure
        value: day.id     // Adjust according to your data structure
      })));
    }
  }, [days, isLoading]);

  return { daysOptions, error, isLoading };
};

export default useDays;