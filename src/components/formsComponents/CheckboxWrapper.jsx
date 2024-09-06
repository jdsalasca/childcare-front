import React from 'react';
import { Controller } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

/**
 * Reusable Checkbox wrapper for react-hook-form with customizable label position.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the checkbox field in the form (required).
 * @param {Object} props.control - Control object from react-hook-form (required).
 * @param {RegisterOptions} [props.rules] - Validation rules for the checkbox field. Optional.
 * @param {string} props.label - Label text for the checkbox field (required).
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled. Optional.
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the `<span>` wrapper.
 * @param {string} [props.labelPosition="right"] - Position of the label: 'left' or 'right'. Defaults to 'right'.
 * @param {Object} [props.rest] - Any additional props for the `Checkbox` component.
 * 
 * @returns {React.Element} The rendered CheckboxWrapper component.
 */
const CheckboxWrapper = ({
  name,
  control,
  rules,
  getFormErrorMessage,
  label,
  disabled = false,
  spanClassName = '',
  labelPosition = 'right',
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span className={` p-float-label ${spanClassName} c-checkbox ${labelPosition === 'left' ? 'label-left' : 'label-right'}`}>
          {labelPosition === 'left' && <label htmlFor={name}>{label}</label>}
          <Checkbox
            id={name}
            {...field}
            checked={field.value}
            className={classNames({ 'p-invalid': error })}
            disabled={disabled}
            onChange={(e) => field.onChange(e.checked)}
            {...rest}
          />
          {labelPosition === 'right' && <label htmlFor={name}>{label}</label>}
          {error && <small className="p-error">{error.message}</small>}
        </span>
      )}
    />
  );
};

export default CheckboxWrapper;
