import React from 'react';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

interface SelectWrapperProps {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  options: { label: string; value: any }[];
  label: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  spanClassName?: string;
  readOnly?: boolean;
  [key: string]: any; // Para aceptar props adicionales
}

/**
 * Reusable Dropdown wrapper for react-hook-form.
 */
const SelectWrapper: React.FC<SelectWrapperProps> = ({
  name,
  control,
  rules,
  options,
  label,
  disabled = false,
  placeholder,
  className = '',
  spanClassName = '',
  readOnly = false,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span className={`p-float-label ${spanClassName}`}>
          <Dropdown
            id={name}
            value={field.value || ''}
            options={options}
            onChange={e => field.onChange(e.value)}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder || label}
            className={classNames({ 'p-invalid': error }) + ' ' + className}
            {...rest}
          />
          <label htmlFor={name}>{label}</label>
          {error && <small className='p-error'>{error.message}</small>}
        </span>
      )}
    />
  );
};

export default SelectWrapper;
