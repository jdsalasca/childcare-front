import { customLogger } from 'configs/logger';

interface DateUtils {
  convertToUTC: (date: Date | string) => Date;
  calculateDisabledDates: (availableDates: Date[]) => Date[];
}
// utils/dateUtils.ts
export class DateUtilsImpl implements DateUtils {
  private static instance: DateUtilsImpl;

  private constructor() {} // Private constructor to prevent instantiation

  static getInstance(): DateUtilsImpl {
    if (!DateUtilsImpl.instance) {
      DateUtilsImpl.instance = new DateUtilsImpl();
    }
    return DateUtilsImpl.instance;
  }

  convertToUTC(date: Date | string): Date {
    let dateToConvert;

    // Convert the string to a Date object if necessary
    if (typeof date === 'string') {
      dateToConvert = new Date(date);
    } else {
      dateToConvert = date;
    }
    // Use Date.UTC to get the date in UTC with 00:00:00 time
    const utcDate = new Date(
      Date.UTC(
        dateToConvert.getUTCFullYear(),
        dateToConvert.getUTCMonth(),
        dateToConvert.getUTCDate(), // day
        8,
        0,
        0,
        0 // Ensure time is 00:00:00
      )
    );
    customLogger.debug('date on convertToUTC', utcDate.toISOString()); // Log UTC date for debugging

    return utcDate;
  }

  // Utility to calculate disabled dates from available dates
  calculateDisabledDates = (availableDates?: Date[]): Date[] => {
    customLogger.debug('availableDates', availableDates);
    if (!availableDates || availableDates.length === 0) return [];

    const disabledDates: Date[] = [];
    const today = new Date();
    const startYear = today.getFullYear() - 1; // One year before today
    const endYear = today.getFullYear() + 1; // One year after today

    // Normalize available dates to just date part (ignore time)
    const normalizedAvailableDates = availableDates.map(date => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized.getTime();
    });

    // Generate all dates in the range from startYear to endYear
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month < 12; month++) {
        for (let day = 1; day <= 31; day++) {
          const date = new Date(year, month, day);
          if (date.getMonth() !== month) continue; // Skip invalid dates (e.g., Feb 30)

          // Normalize the date to ignore time
          const normalizedDate = new Date(date);
          normalizedDate.setHours(0, 0, 0, 0);

          // Disable the date if it's not in availableDates
          if (!normalizedAvailableDates.includes(normalizedDate.getTime())) {
            disabledDates.push(new Date(date));
          }
        }
      }
    }
    return disabledDates;
  };
}
