import { customLogger } from 'configs/logger';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import React, { useMemo } from 'react'; // Import useMemo
import { Control, Controller, RegisterOptions } from 'react-hook-form';

interface CalendarWrapperProps {
  name: string;
  control: Control<any>;
  dateFormat?: string;
  rules?: RegisterOptions;
  label: string;
  disabled?: boolean;
  onChangeCustom?: any; // Keep this as Date | undefined
  maxDate?: Date;
  minDate?: Date; // Add minDate prop
  icon?: string;
  timeOnly?: boolean;
  showIcon?: boolean;
  spanClassName?: string;
  availableDates?: Date[];
  [key: string]: any; // To allow additional props
}

// Utility function to generate all possible dates between a range
function getAllDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

// Utility function to calculate disabled dates based on availableDates
function calculateDisabledDates(availableDates: Date[], minDate?: Date, maxDate?: Date): Date[] {
  customLogger.debug('availableDates', availableDates);
  const disabledDates: Date[] = [];
  const allDatesInRange = getAllDatesBetween(minDate ?? new Date(1970, 0, 1), maxDate ?? new Date(2100, 11, 31));

  allDatesInRange.forEach((date) => {
    const isAvailable = availableDates.some(availableDate => availableDate.toDateString() === date.toDateString());
    if (!isAvailable) {
      disabledDates.push(date);
    }
  });

  return disabledDates;
}

const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  name,
  control,
  dateFormat = 'mm/dd/yy',
  rules,
  maxDate,
  minDate,
  label,
  icon = 'pi pi-calendar',
  timeOnly = false,
  disabled = false,
  spanClassName = '',
  onChangeCustom,
  showIcon = false,
  availableDates = [],
  ...rest
}) => {
  // Memoize the disabled dates calculation
  const disabledDates = useMemo(() => {
    return availableDates.length > 0 
      ? calculateDisabledDates(availableDates, minDate, maxDate) 
      : [];
  }, [availableDates, minDate, maxDate]); // Dependencies for useMemo

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => {
        // Convert string to Date object if needed
        const value =
          typeof field.value === 'string' ? new Date(field.value) : field.value;

        return (
          <span className={`relative flex flex-col w-full ${spanClassName}`}>
         
            <Calendar
              mask={timeOnly ? undefined : '99/99/9999'} // Use undefined instead of null
              id={name}
              {...field}
              dateFormat={dateFormat}
              className={classNames(
                'w-full',
                { 'p-invalid': error },
                'min-w-[12rem]' // Ensure minimum width
              )}
              disabled={disabled}
              showIcon={showIcon}
              maxDate={maxDate}
              disabledDates={disabledDates}
              icon={icon}
              timeOnly={timeOnly}
              yearRange='2023:2025'
              value={value ?? undefined} // Use undefined instead of null
              onChange={(e) => {
                const newValue = e.value instanceof Date ? e.value : undefined; // Ensure it's a Date or undefined
                field.onChange(newValue);
                if (onChangeCustom) {
                  onChangeCustom(newValue);
                }
              }}
              showOnFocus={false} // Disable focus-triggered popup
              hideOnDateTimeSelect={true} // Disable the calendar dropdown, only trigger on icon click
              view='date'
            />
            <label htmlFor={name}>{label}</label>
            {error && <small className='p-error'>{error.message}</small>}
          </span>
        );
      }}
    />
  );
};

export default CalendarWrapper;
