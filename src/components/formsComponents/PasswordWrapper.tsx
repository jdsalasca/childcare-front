import { Divider } from 'primereact/divider';
import { KeyFilterType } from 'primereact/keyfilter';
import { Password, PasswordProps } from 'primereact/password';
import { classNames } from 'primereact/utils';
import { Control, Controller, RegisterOptions } from 'react-hook-form';

interface PasswordWrapperProps
  extends Omit<PasswordProps, 'onChange' | 'value'> {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
  label: string;
  addFooter?: boolean;
  addHeader?: boolean;
  disabled?: boolean;
  keyFilter?: KeyFilterType;
  onChangeCustom?: (value: string) => string;
  placeholder?: string;
  spanClassName?: string;
  rest?: object;
}

const PasswordWrapper: React.FC<PasswordWrapperProps> = ({
  name,
  control,
  rules,
  label,
  disabled = false,
  keyFilter,
  addFooter,
  addHeader,
  onChangeCustom,
  placeholder,
  spanClassName = '',
  ...rest
}) => {
  const header = <div className='font-bold mb-3'>Pick a password</div>;
  const footer = (
    <>
      <Divider />
      <p className='mt-2'>Suggestions</p>
      <ul className='pl-2 ml-2 mt-0 line-height-3'>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 4 characters</li>
      </ul>
    </>
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span className={`p-float-label ${spanClassName}`}>
          <Password
            id={name}
            value={field.value || ''}
            className={
              classNames({ 'p-invalid': error }) + ' c-input-password-field'
            }
            disabled={disabled}
            toggleMask
            feedback={addHeader || addFooter}
            header={addHeader && header}
            footer={addFooter && footer}
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

export default PasswordWrapper;
