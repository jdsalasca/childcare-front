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
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span
          className={`inline-flex items-center max-w-5 break-words ${spanClassName} ${labelPosition === 'left' ? 'flex-row' : 'flex-row-reverse'}`}
          style={{ maxWidth: '15rem', wordBreak: 'break-word', overflowWrap: 'break-word', width: '100%' }} // Added max-width style
        >
          {labelPosition === 'left' && (
            <p className={`mr-auto ${labelClassName}`}>{label}</p> // Use mr-auto for left alignment
          )}
          <Checkbox
            id={name}
            {...field}
            checked={field.value}
            className={classNames({ 'p-invalid': error })}
            disabled={disabled}
            onChange={(e) => field.onChange(e.checked)}
            {...rest}
          />
      {labelPosition === 'right' && (
    <p 
      className={`ml-2 break-all whitespace-normal ${labelClassName}`}
      style={{ 
        flexGrow: 1,    // Add this
        flexShrink: 1,  // Add this
        minWidth: 0,    // Add this - important for flex items
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