import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

interface CheckboxWrapperProps {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  label: string;
  disabled?: boolean;
  labelClassName?: string;
  spanClassName?: string;
  labelPosition?: 'left' | 'right';
  checkboxClassName?: string; // Custom prop for checkbox styling
  internationalization?: boolean | string; // Accept both boolean and string
  className?: string;
  [key: string]: any;
}

const CheckboxWrapper: React.FC<CheckboxWrapperProps> = ({
  name,
  control,
  rules,
  label,
  disabled = false,
  labelClassName = '',
  spanClassName = '',
  labelPosition = 'right',
  checkboxClassName = '',
  // internationalization, // Unused parameter removed
  className = '',
  ...rest
}) => {
  // Filter out custom props that shouldn't be passed to the Checkbox component
  const {
    checkboxClassName: _checkboxClassName,
    internationalization: _internationalization,
    labelClassName: _labelClassName,
    spanClassName: _spanClassName,
    labelPosition: _labelPosition,
    ...checkboxProps
  } = rest;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span
          className={`inline-flex items-center max-w-5 break-words ${spanClassName} ${labelPosition === 'left' ? 'flex-row' : 'flex-row-reverse'} ${className}`}
          style={{ maxWidth: '15rem', wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%' }}
        >
          {labelPosition === 'left' && (
            <p className={`mr-auto ${labelClassName}`}>{label}</p>
          )}
          <Checkbox
            id={name}
            {...field}
            checked={field.value}
            className={classNames(
              { 'p-invalid': error },
              checkboxClassName
            )}
            disabled={disabled}
            onChange={(e) => field.onChange(e.checked)}
            {...checkboxProps}
          />
          {labelPosition === 'right' && (
            <p 
              className={`ml-2 break-all whitespace-normal ${labelClassName}`}
              style={{ 
                flexGrow: 1,
                flexShrink: 1,
                minWidth: 0,
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              {label}
            </p>
          )}
          {error && <small className="p-error">{error.message}</small>}
        </span>
      )}
    />
  );
};

export default CheckboxWrapper;