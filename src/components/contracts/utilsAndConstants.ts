// src/contracts/utilsAndConstants.ts


// Interfaces
interface ProgramOption {
  label: string;
  value: string;
  minWeek: number;
  maxWeek: number;
}



// Constants
export const programOptions: ProgramOption[] = [
  { label: 'Infant', value: 'Infant', minWeek: 0, maxWeek: 78 },
  { label: 'Toddler', value: 'Toddler', minWeek: 78, maxWeek: 156 },
  { label: 'Pre-school', value: 'Preschool', minWeek: 156, maxWeek: 260 },
  { label: 'School age', value: 'School age', minWeek: 260, maxWeek: 624 },
  { label: 'Other', value: 'Other', minWeek: 260, maxWeek: 624000 },
];


export const determineProgram = (weeksOld: number): string => {
  return (
    programOptions.find(program => weeksOld >= program.minWeek && weeksOld <= program.maxWeek)?.value || ''
  );
};

export const calculateAge = (bornDate: string | Date): number  => {
  const today = new Date();
  const birthDate = new Date(bornDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const calculateWeeksOld = (bornDate: string | Date): number => {
  const today = new Date();
  const birthDate = new Date(bornDate);
  const diffTime = Math.abs(today.getTime() - birthDate.getTime());
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
};



export const fontStyles = {
  ITALIC: "italic",
  BOLD: "bold",
  NORMAL: "normal"
};


export const validateSchedule = (schedule: Record<string, any>, days: DayType[] | null): boolean => {
  if (days == null || schedule == null) return false;
  let isValid = true;

  days.forEach(day => {
    const start = schedule[`${day}check_in`];
    const end = schedule[`${day}check_out`];

    if (start && end) {
      const startTime = new Date(start);
      const endTime = new Date(end);
      const hoursDifference = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (startTime >= endTime || hoursDifference > 9) {
        isValid = false;
      }
    }
  });

  return isValid;
};

export const formatTime = (date: Date | null): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
