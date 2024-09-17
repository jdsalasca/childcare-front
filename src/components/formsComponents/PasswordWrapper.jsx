import { Divider } from 'primereact/divider';
import { Password } from 'primereact/password';
import { classNames } from "primereact/utils";
import PropTypes from 'prop-types';
import { Controller } from "react-hook-form";

const PasswordWrapper = ({
  name,
  control,
  rules,
  label,
  disabled = false,
  keyFilter,
  onChangeCustom,
  placeholder,
  spanClassName = '',
  ...rest
}) => {
    const header = <div className="font-bold mb-3">Pick a password</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3">
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
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
            {...field}
            value={field.value || ''}
            className={classNames({ 'p-invalid': error  }) + " c-input-password-field"}
            disabled={disabled}
            toggleMask
            header = {header}
            footer = {footer}
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
          {error && <small className="p-error">{error.message}</small>}
        </span>
      )}
    />
  );
};

// Prop type validation
PasswordWrapper.propTypes = {
  name: PropTypes.string.isRequired, // Required string for the input name
  control: PropTypes.object.isRequired, // Control object from react-hook-form
  rules: PropTypes.object, // Validation rules for react-hook-form
  label: PropTypes.string.isRequired, // Label for the input
  disabled: PropTypes.bool, // Whether the input is disabled
  keyFilter: PropTypes.string, // Optional keyFilter for input
  onChangeCustom: PropTypes.func, // Optional custom onChange handler
  placeholder: PropTypes.string, // Optional placeholder text
  spanClassName: PropTypes.string, // Optional class name for the span wrapper
  rest: PropTypes.object, // Additional props passed to InputText
};


export default PasswordWrapper;    