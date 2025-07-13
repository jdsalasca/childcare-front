import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import { classNames } from 'primereact/utils';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
interface InputTextWrapperProps {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  label: string;
  disabled?: boolean;
  keyFilter?: KeyFilterType;
  onChangeCustom?: (value: string) => string;
  placeholder?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void; // Updated type
  readOnly?: boolean;
  className?: string;
  spanClassName?: string;
  [key: string]: any; // For the rest prop
}
/**
 * Reusable InputText wrapper for react-hook-form.
 */
const InputTextWrapper: React.FC<InputTextWrapperProps> = ({
  name,
  control,
  rules,
  readOnly,
  label,
  disabled = false,
  keyFilter,
  onBlur,
  onChangeCustom,
  placeholder,
  spanClassName = '',
  className = '',
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
            value={field.value || ''}
            onBlur={event => {
              if (onBlur) {
                onBlur(event); // Call the onBlur function with the event
              }
              field.onBlur(); // Ensure react-hook-form's onBlur is called
            }}
            className={classNames({ 'p-invalid': error }) + ' ' + className}
            disabled={disabled}
            readOnly={readOnly}
            keyfilter={keyFilter}
            placeholder={placeholder}
            onChange={e => {
              const value = e.target.value;
              const formattedValue = onChangeCustom
                ? onChangeCustom(value)
                : value;
              field.onChange(formattedValue);
            }}
            {...rest}
          />
          <label htmlFor={name}>{label}</label>
          {error && <small className='p-error'>{error.message}</small>}
        </span>
      )}
    />
  );
};

export default InputTextWrapper;
