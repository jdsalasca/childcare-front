import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import PropTypes from 'prop-types'; // Import PropTypes
import { Controller } from 'react-hook-form';

/**
 * Reusable Checkbox wrapper for react-hook-form with customizable label position.
 *
 * @param {Object} props - Component props.
 * @param {string} props.name - Name of the checkbox field in the form (required).
 * @param {Object} props.control - Control object from react-hook-form (required).
 * @param {Object} [props.rules] - Validation rules for the checkbox field. Optional.
 * @param {string} props.label - Label text for the checkbox field (required).
 * @param {boolean} [props.disabled=false] - Whether the checkbox is disabled. Optional.
 * @param {string} [props.spanClassName] - Optional CSS class name(s) to apply to the `<span>` wrapper.
 * @param {string} [props.labelClassName] - Optional CSS class name(s) to apply to the label.
 * @param {string} [props.labelPosition="right"] - Position of the label: 'left' or 'right'. Defaults to 'right'.
 * @param {Object} [props.rest] - Any additional props for the `Checkbox` component.
 * 
 * @returns {React.Element} The rendered CheckboxWrapper component.
 */
const CheckboxWrapper = ({
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
          {labelPosition === 'left' && <p className={labelClassName} htmlFor={name}>{label}</p>}
          <Checkbox
            id={name}
            {...field}
            checked={field.value}
            className={classNames({ 'p-invalid': error })}
            disabled={disabled}
            onChange={(e) => field.onChange(e.checked)}
            {...rest}
          />
          {labelPosition === 'right' && <p className={labelClassName} htmlFor={name}>{label}</p>}
          {error && <small className="p-error">{error.message}</small>}
        </span>
      )}
    />
  );
};

// Prop type validation
CheckboxWrapper.propTypes = {
  name: PropTypes.string.isRequired, // Required string for the checkbox name
  control: PropTypes.object.isRequired, // Control object from react-hook-form
  rules: PropTypes.object, // Optional validation rules
  getFormErrorMessage: PropTypes.func, // Function to retrieve form error messages
  label: PropTypes.string.isRequired, // Required label for the checkbox
  disabled: PropTypes.bool, // Whether the checkbox is disabled
  labelClassName: PropTypes.string, // Optional CSS class for the label
  spanClassName: PropTypes.string, // Optional CSS class for the span wrapper
  labelPosition: PropTypes.oneOf(['left', 'right']), // Label position can only be 'left' or 'right'
  rest: PropTypes.object, // Additional props passed to Checkbox
};


export default CheckboxWrapper;
