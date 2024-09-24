import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
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
  icon?: string;
  timeOnly?: boolean;
  showIcon?: boolean;
  spanClassName?: string;
  [key: string]: any; // To allow additional props
}

const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  name,
  control,
  dateFormat = 'mm/dd/yy',
  rules,
  maxDate,
  label,
  icon = 'pi pi-calendar',
  timeOnly = false,
  disabled = false,
  spanClassName = '',
  onChangeCustom,
  showIcon = false,
  ...rest
}) => {
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
          <span className={`p-float-label ${spanClassName}`}>
            <Calendar
              mask={timeOnly ? undefined : '99/99/9999'} // Use undefined instead of null
              id={name}
              {...field}
              dateFormat={dateFormat}
              className={classNames({ 'p-invalid': error })}
              disabled={disabled}
              showIcon={showIcon}
              maxDate={maxDate}
              icon={icon}
              timeOnly={timeOnly}
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
              {...rest}
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
