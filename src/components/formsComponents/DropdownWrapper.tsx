import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useEffect } from 'react';
import { Control, Controller, RegisterOptions } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface DropdownOption {
  [key: string]: any; // Define the shape of your dropdown options
}

interface DropdownWrapperProps
  extends Omit<DropdownProps, 'onChange' | 'value'> {
  name: string;
  control: Control<any>;
  options: DropdownOption[];
  optionLabel: string;
  optionValue: string;
  rules?: RegisterOptions;
  label: string;
  disabled?: boolean;
  filter?: boolean;
  placeholder?: string;
  spanClassName?: string;
  internationalization?: boolean; // New prop for controlling translation
  dropdownStyle?: React.CSSProperties;
  rest?: object;
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
  name,
  control,
  options,
  optionLabel,
  optionValue,
  rules,
  label,
  disabled = false,
  filter = false,
  placeholder,
  spanClassName = '',
  internationalization = false,
  dropdownStyle,
  ...rest
}) => {
  const { t } = useTranslation();

  // Validate that all options have a valid value
  useEffect(() => {
    if (options && options.length > 0) {
      const invalidOptions = options.filter(
        option => option[optionValue] == null
      );
      if (invalidOptions.length > 0) {
        console.error(`Dropdown options must have a value for ${optionValue}`);
      }
    }
  }, [options, optionValue]);
  // Helper function to handle option display
  // Helper function to handle option display
  const displayOption = (option: DropdownOption) => {
    if (!option) return '';
    const text = internationalization
      ? t(option[optionLabel])
      : option[optionLabel];
    // Return the text wrapped in a div that matches PrimeReact's default styling
    return <div className='p-dropdown-item'>{text}</div>;
  };
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <span className={`p-float-label ${spanClassName}`}>
          <Dropdown
            id={name}
            {...field}
            options={options}
            filter={filter}
            emptyMessage={t('dropdownEmptyMessage')}
            optionLabel={optionLabel}
            itemTemplate={
              internationalization ? option => displayOption(option) : undefined
            }
            valueTemplate={
              internationalization ? option => displayOption(option) : undefined
            }
            optionValue={optionValue}
            className={classNames(
              { 'p-invalid': error },
              'p-dropdown-item-container' // Add PrimeReact's container class
            )}
            disabled={disabled}
            placeholder={placeholder}
            style={{ minHeight: '2.2em', ...dropdownStyle }} // Set a minimum height
            {...rest}
          />
          <label htmlFor={name}>{label}</label>
          {error && <small className='p-error h'>{error.message}</small>}
        </span>
      )}
    />
  );
};

export default DropdownWrapper;
