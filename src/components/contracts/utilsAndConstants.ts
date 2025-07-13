// src/contracts/utilsAndConstants.ts

interface ScheduleEntry {
  day_id: number;
  check_in: string;
  check_out: string;
}

// Removed local DayType interface - using the one from types/day.ts

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

export const calculateWeeksOld = (bornDate: string | Date | null): number => {
  if (!bornDate) return 0;
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

import { DayType } from '../../types/day';

export const validateSchedule = (schedule: ScheduleEntry[] | null | undefined, days: DayType[] | null): boolean => {
  // Handle null/undefined inputs
  if (!schedule || !days || schedule.length === 0) {
    return false;
  }

  // Validate each schedule entry
  for (const entry of schedule) {
    // Check if day_id is valid
    if (!entry.day_id || !days.find(day => day.id === entry.day_id)) {
      return false;
    }

    // Check if check_in and check_out are provided
    if (!entry.check_in || !entry.check_out) {
      return false;
    }

    // Validate time format and logic
    const checkInTime = parseTime(entry.check_in);
    const checkOutTime = parseTime(entry.check_out);

    // Check if times are valid
    if (checkInTime === null || checkOutTime === null) {
      return false;
    }

    // Check if check_out is after check_in
    if (checkOutTime <= checkInTime) {
      return false;
    }

    // Check if the duration is reasonable (not more than 12 hours)
    const durationHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    if (durationHours > 12) {
      return false;
    }
  }

  return true;
};

// Helper function to parse time strings like "08:00" or "17:00"
function parseTime(timeString: string): number | null {
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
  const match = timeString.match(timeRegex);
  
  if (!match) {
    return null;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  
  // Create a date object for today with the specified time
  const today = new Date();
  const timeDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes);
  
  return timeDate.getTime();
}

export const formatTime = (date: Date | null): string => {
  if (!date) return '';
  
  const options: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  };
  
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

// Export billTypes for tests
export const billTypes = [
  { id: 1, label: 'Hundred', name: 'Hundred', value: 100 },
  { id: 2, label: 'Fifty', name: 'Fifty', value: 50 },
  { id: 3, label: 'Twenty', name: 'Twenty', value: 20 },
  { id: 4, label: 'Ten', name: 'Ten', value: 10 },
  { id: 5, label: 'Five', name: 'Five', value: 5 },
  { id: 6, label: 'One', name: 'One', value: 1 },
];
