import { InputTextarea } from 'primereact/inputtextarea';
import { Controller } from 'react-hook-form';

interface InputTextAreaWrapperProps {
  name: string;
  control: any;
  label: string;
  rules?: object;
  rows?: number;
  className?: string;
}

export const InputTextAreaWrapper: React.FC<InputTextAreaWrapperProps> = ({
  name,
  control,
  label,
  rules,
  rows = 3,
  className = '',
}) => {
  return (
    <div className={"p-field " + className}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <span className="p-float-label">
            <InputTextarea id={name} rows={rows} {...field} />
            <label htmlFor={name}>{label}</label>
            {fieldState.error && (
              <small className="p-error">{fieldState.error.message}</small>
            )}
          </span>
        )}
      />
    </div>
  );
};