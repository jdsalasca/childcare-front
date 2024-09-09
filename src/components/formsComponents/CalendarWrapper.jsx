import React from 'react';
import { Controller, RegisterOptions } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';

/**
 * Reusable Calendar wrapper for react-hook-form.
 *
 * This component integrates `react-hook-form` with the `primereact` Calendar component, allowing for form validation and custom input handling.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the input field in the form (required).
 * @param {Object} props.control - Control object from react-hook-form (required).
 * @param {string} props.dateFormat - Date format string (required).
 * @param {RegisterOptions} [props.rules] - Validation rules for the input field, as per `react-hook-form`'s `RegisterOptions` type. Optional.
 * @param {Function} props.getFormErrorMessage - Function to retrieve the error message for the field (required).
 * @param {string} props.label - Label text for the calendar field (required).
 * @param {boolean} [props.disabled=false] - Whether the calendar is disabled. Optional, defaults to false.
 * @param {Function} [props.onChangeCustom] - Custom onChange handler if needed. Optional.
 * @param {Object} [props.rest] - Any additional props for the `Calendar` component.
 * @param {boolean} [props.showIcon=false] - Whether to show the calendar icon. Optional, defaults to false.  
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the `<span>` wrapper element.
 * 
 * @returns {React.Element} The rendered CalendarWrapper component.
 */
const CalendarWrapper = ({
  name,
  control,
  dateFormat,
  rules,
  getFormErrorMessage,
  label,
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
        const value = typeof field.value === 'string' ? new Date(field.value) : field.value;

        return (
          <span className={`p-float-label ${spanClassName}`}>
            <Calendar
              id={name}
              {...field}
              dateFormat={dateFormat}
              className={classNames({ 'p-invalid': error })}
              disabled={disabled}
              showIcon={showIcon}
              value={value || null} // Ensure value is a Date object or null
              onChange={(e) => {
                field.onChange(e.value);
                if (onChangeCustom) {
                  onChangeCustom(e.value);
                }
              }}
              {...rest}
            />
            <label htmlFor={name}>{label}</label>
          {error && <small className="p-error">{error.message}</small>}

            {/* {getFormErrorMessage(name)} */}
          </span>
        );
      }}
    />
  );
};

export default CalendarWrapper;
