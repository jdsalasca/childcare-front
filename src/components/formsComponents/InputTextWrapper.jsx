import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types'; // Import PropTypes
import { Controller } from 'react-hook-form';

/**
 * Reusable InputText wrapper for react-hook-form.
 *
 * This component integrates `react-hook-form` with the `primereact` InputText component, allowing for form validation and custom input handling.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the input field in the form (required).
 * @param {Object} props.control - Control object from react-hook-form (required).
 * @param {Object} [props.rules] - Validation rules for the input field, as per `react-hook-form`'s `RegisterOptions` type. Optional.
 * @param {string} props.label - Label text for the input field (required).
 * @param {boolean} [props.disabled=false] - Whether the input is disabled. Optional, defaults to false.
 * @param {string} [props.keyFilter] - The keyfilter pattern for the input. Optional.
 * @param {Function} [props.onChangeCustom] - Custom onChange handler if needed. Optional.
 * @param {string} [props.placeholder] - Optional placeholder text for the input.
 * @param {Function} [props.onBlur] - Optional onBlur handler for the input.
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the `<span>` wrapper element.
 * @param {Object} [props.rest] - Any additional props for the `InputText` component.
 * 
 * @returns {React.Element} The rendered InputTextWrapper component.
 */
const InputTextWrapper = ({
  name,
  control,
  rules,
  label,
  disabled = false,
  keyFilter,
  onBlur,
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
            onBlur={onBlur}
            value={field.value || ''}
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
          {error && <small className="p-error">{error.message}</small>}
        </span>
      )}
    />
  );
};
// Prop type validation
InputTextWrapper.propTypes = {
  name: PropTypes.string.isRequired, // Required string for the input name
  control: PropTypes.object.isRequired, // Control object from react-hook-form
  rules: PropTypes.object, // Validation rules for react-hook-form
  label: PropTypes.string.isRequired, // Label for the input
  disabled: PropTypes.bool, // Whether the input is disabled
  valueFormatter: PropTypes.func, // Optional value formatter function
  keyFilter: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(RegExp)]),
  onChangeCustom: PropTypes.func, // Optional custom onChange handler
  onBlur: PropTypes.func, // Optional onBlur handler
  placeholder: PropTypes.string, // Optional placeholder text
  spanClassName: PropTypes.string, // Optional class name for the span wrapper
  rest: PropTypes.object, // Additional props passed to InputText
};

export default InputTextWrapper;
