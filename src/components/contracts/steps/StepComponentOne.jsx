import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { calculateAge, calculateWeeksOld, capitalizeFirstLetter, determineProgram, programOptions } from '../utilsAndConsts';

export const StepComponentOne = ({ setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const [validForm, setValidForm] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, getValues, clearErrors } = useForm({
    defaultValues: {
      children: contractInformation.children || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children'
  });

  useEffect(() => {
  }, []);

  const onSubmit = (data) => {
    setValidForm(true);
    setContractInformation({ ...contractInformation, children: data.children });
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Children information saved', life: 3000 });
  };

  const addChild = () => {
    append({ name: '', age: '', bornDate: null, program: '' });
  };

  const removeChild = (index) => {
    remove(index);
  };

  const handleBornDateChange = (date, index) => {
    const weeksOld = calculateWeeksOld(date);
    const program = determineProgram(weeksOld);
    const age = calculateAge(date);
    setValue(`children[${index}].program`, program);
    setValue(`children[${index}].age`, age);
    return date;
  };

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  const goToNextStep = () => {
    setActiveIndex(1);
  };

  
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((child, index) => (
          <div key={child.id} className="child-form">
            <Controller
              name={`children[${index}].name`}
              control={control}
              rules={{ required: 'Child name is required' }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText 
                    id={`child-name-${index}`} 
                    {...field} 
                    onChange={(e) => {
                      const formattedValue = capitalizeFirstLetter(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].name })}
                    keyfilter={/^[a-zA-ZñÑ.,\s]*$/}
                  />
                  <label htmlFor={`child-name-${index}`}>Child's Name</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].name`)}

            <Controller
              name={`children[${index}].bornDate`}
              control={control}
              rules={{ required: 'Born date is required' }}
              render={({ field }) => (
                <span className="p-float-label">
                  <Calendar 
                    id={`child-bornDate-${index}`} 
                    yearNavigator 
                    monthNavigator 
                    {...field} 
                    value={field.value} 
                    dateFormat="yy-mm-dd"
                    showIcon
                    onChange={(e) => field.onChange(handleBornDateChange(e.value, index))}
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].bornDate })}
                  />
                  <label htmlFor={`child-bornDate-${index}`}>Born Date</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].bornDate`)}

            <Controller
              name={`children[${index}].age`}
              control={control}
              rules={{ required: 'Child age is required', min: { value: 0, message: 'Age must be greater than zero' } }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText 
                    id={`child-age-${index}`} 
                    {...field} 
                    type="number" 
                    disabled
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].age })}
                    keyfilter="int"
                  />
                  <label htmlFor={`child-age-${index}`}>Child's Age</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].age`)}

            <Controller
              name={`children[${index}].program`}
              control={control}
              render={({ field }) => (
                <span className="p-float-label">
                  <Dropdown
                    style={{ minWidth: "10rem" }}
                    id={`child-program-${index}`}
                    {...field}
                    options={programOptions}
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].program })}
                    disabled
                  />
                  <label htmlFor={`child-program-${index}`}>Program</label>
                </span>
              )}
            />

            <Button 
              icon="pi pi-trash" 
              className="p-button-danger p-button-text p-ml-2" 
              onClick={() => removeChild(index)} 
            />
          </div>
        ))}
        <div className="button-group">
          <Button icon="pi pi-plus" label="Add Child" className="p-button-success" onClick={(e) => {
            e.preventDefault();
            addChild();
          }} />
          <Button type="submit" label="Save" className="p-button-primary p-ml-2" />
          <Button label={!validForm ? "Fill the form" : "Next"} className="p-button-secondary p-ml-2" onClick={goToNextStep} disabled={!validForm} />
        </div>
      </form>
    </div>
  );
};

export default StepComponentOne;