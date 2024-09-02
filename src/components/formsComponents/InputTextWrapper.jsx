import React from 'react';
import { Controller, RegisterOptions } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

/**
 * Reusable InputText wrapper for react-hook-form.
 *
 * This component integrates `react-hook-form` with the `primereact` InputText component, allowing for form validation and custom input handling.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the input field in the form (required).
 * @param {Object} props.control - Control object from react-hook-form (required).
 * @param {RegisterOptions} [props.rules] - Validation rules for the input field, as per `react-hook-form`'s `RegisterOptions` type. Optional.
 * @param {Function} props.getFormErrorMessage - Function to retrieve the error message for the field (required).
 * @param {string} props.label - Label text for the input field (required).
 * @param {boolean} [props.disabled=false] - Whether the input is disabled. Optional, defaults to false.
 * @param {string} [props.keyFilter] - The keyfilter pattern for the input. Optional.
 * @param {Function} [props.onChangeCustom] - Custom onChange handler if needed. Optional.
 * @param {string} [props.placeholder] - Optional placeholder text for the input.
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the `<span>` wrapper element.
 * @param {Object} [props.rest] - Any additional props for the `InputText` component.
 * 
 * @returns {React.Element} The rendered InputTextWrapper component.
 */
const InputTextWrapper = ({
  name,
  control,
  rules,
  getFormErrorMessage,
  label,
  disabled = false,
  keyFilter,
  onChangeCustom,
  placeholder,
  spanClassName = '',
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span className={`p-float-label ${spanClassName}`}>
          <InputText
            id={name}
            {...field}
            className={classNames({ 'p-invalid': error })}
            disabled={disabled}
            keyfilter={keyFilter}
            placeholder={placeholder}
            onChange={(e) => {
              const value = e.target.value;
              const formattedValue = onChangeCustom ? onChangeCustom(value) : value;
              field.onChange(formattedValue);
            }}
            {...rest}
          />
          <label htmlFor={name}>{label}</label>
          {getFormErrorMessage(name)}
        </span>
      )}
    />
  );
};

export default InputTextWrapper;
