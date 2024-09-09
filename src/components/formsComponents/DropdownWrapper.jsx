import React, { useEffect } from 'react';
import { Controller, RegisterOptions } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next';

/**
 * Reusable Dropdown wrapper for react-hook-form
 * @param {Object} props
 * @param {string} props.name - Name of the dropdown field in the form.
 * @param {Object} props.control - Control object from react-hook-form.
 * @param {Array} props.options - Array of dropdown options.
 * @param {string} props.optionLabel - The label field for the dropdown options.
 * @param {string} props.optionValue - The value field for the dropdown options.
 * @param {RegisterOptions} [props.rules] - Validation rules for the dropdown field.
 * @param {Function} props.getFormErrorMessage - Function to retrieve the error message for the field.
 * @param {string} props.label - Label text for the dropdown field.
 * @param {boolean} props.disabled - Whether the dropdown is disabled.
 * @param {boolean} props.filter - Whether to filter the dropdown options based on the input value.
 * @param {string} [props.placeholder] - Optional placeholder text for the dropdown.
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the `<span>` wrapper element.
 * @param {Object} props.rest - Any additional props for Dropdown.
 * 
 */
const DropdownWrapper = ({
  name,
  control,
  options,
  optionLabel,
  optionValue,
  rules,
  getFormErrorMessage,
  label,
  disabled = false,
  filter = false,
  placeholder,
  spanClassName = '',
  ...rest
}) => {

  	let {t} = useTranslation();
  
    // Ensure options are filtered to remove any that have null or undefined values for optionValue
    const validLabel = options.filter(option => option[optionValue] != null);
    useEffect(() => {
      if (options !=null&& options.length > 0 && validLabel.length === 0) {
        console.log(options);
        console.error(`Dropdown options must have a value for ${optionValue}`);
      } else {
      }
    }, [optionValue, validLabel]);
  

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span className={`p-float-label ${spanClassName}`}>
          <Dropdown
            id={name}
            {...field}
            options={options}
            filter = {filter}
            emptyMessage={t('dropdownEmptyMessage')}
            optionLabel={optionLabel}
            optionValue={optionValue}
            className={classNames({ 'p-invalid': error })}
            disabled={disabled}
            placeholder={placeholder}
            {...rest}
          />
          <label htmlFor={name}>{label}</label>
          {error && <small className="p-error">{error.message}</small>}

          {/* {getFormErrorMessage(name)} */}
        </span>
      )}
    />
  );
};

export default DropdownWrapper;
