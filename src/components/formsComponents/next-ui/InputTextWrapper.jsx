import { Input } from '@nextui-org/react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Controller } from 'react-hook-form';

/**
 * Reusable Input wrapper for react-hook-form with NextUI.
 *
 * This component integrates `react-hook-form` with the `NextUI` Input component, allowing for form validation and custom input handling.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the input field in the form (required).
 * @param {Object} props.control - Control object from react-hook-form (required).
 * @param {Object} [props.rules] - Validation rules for the input field, as per `react-hook-form`'s `RegisterOptions` type. Optional.
 * @param {string} props.label - Label text for the input field (required).
 * @param {boolean} [props.disabled=false] - Whether the input is disabled. Optional, defaults to false.
 * @param {Function} [props.onChangeCustom] - Custom onChange handler if needed. Optional.
 * @param {string} [props.placeholder] - Optional placeholder text for the input.
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the wrapper element.
 * @param {Object} [props.rest] - Any additional props for the `Input` component.
 * 
 * @returns {React.Element} The rendered InputWrapper component.
 */
const InputTextWrapper = ({
  name,
  control,
  rules,
  label,
  disabled = false,
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
        <div className={`flex flex-col gap-2 ${spanClassName}`}>
          <label htmlFor={name} className="text-base font-medium text-gray-700">
            {label}
          </label>
          <Input
            id={name}
            {...field}
            value={field.value || ''}
            status={error ? 'error' : 'default'}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => {
              const value = e.target.value;
              const formattedValue = onChangeCustom ? onChangeCustom(value) : value;
              field.onChange(formattedValue);
            }}
            {...rest}
          />
          {error && <small className="text-red-500">{error.message}</small>}
        </div>
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
  onChangeCustom: PropTypes.func, // Optional custom onChange handler
  placeholder: PropTypes.string, // Optional placeholder text
  spanClassName: PropTypes.string, // Optional class name for the wrapper element
  rest: PropTypes.object, // Additional props passed to Input
};

export default InputTextWrapper;
