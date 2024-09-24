import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

interface CheckboxWrapperProps {
  name: string; // Name of the checkbox field in the form (required)
  control: Control<any>; // Control object from react-hook-form (required)
  rules?: RegisterOptions; // Validation rules for the checkbox field (optional)
  label: string; // Label text for the checkbox field (required)
  disabled?: boolean; // Whether the checkbox is disabled (optional)
  labelClassName?: string; // Optional CSS class for the label
  spanClassName?: string; // Optional CSS class for the span wrapper
  labelPosition?: 'left' | 'right'; // Position of the label (default is 'right')
  [key: string]: any; // Additional props for the Checkbox component
}

/**
 * Reusable Checkbox wrapper for react-hook-form with customizable label position.
 *
 * @param {CheckboxWrapperProps} props - Component props.
 * @returns {React.Element} The rendered CheckboxWrapper component.
 */
const CheckboxWrapper: React.FC<CheckboxWrapperProps> = ({
  name,
  control,
  rules,
  label,
  disabled = false,
  labelClassName = '',
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
        <span className={`p-float-label ${spanClassName} c-checkbox ${labelPosition === 'left' ? 'label-left' : 'label-right'}`}>
          {labelPosition === 'left' && <p className={labelClassName}>{label}</p>}
          <Checkbox
            id={name}
            {...field}
            checked={field.value}
            className={classNames({ 'p-invalid': error })}
            disabled={disabled}
            onChange={(e) => field.onChange(e.checked)}
            {...rest}
          />
          {labelPosition === 'right' && <p className={labelClassName} >{label}</p>}
          {error && <small className="p-error">{error.message}</small>}
        </span>
      )}
    />
  );
};

export default CheckboxWrapper;
