import React, { useRef } from 'react'

import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
const programOptions = [
  { label: 'Infant', value: 'Infant', minWeek: 0, maxWeek: 78 }, // 6 weeks to 18 months (78 weeks)
  { label: 'Toddler', value: 'Toddler', minWeek: 78, maxWeek: 156 }, // 18 months to 3 years (156 weeks)
  { label: 'Pre-school', value: 'Pre-school', minWeek: 156, maxWeek: 260 }, // 3 to 5 years (260 weeks)
  { label: 'School age', value: 'School age', minWeek: 260, maxWeek: 624 }, // 5 to 12 years (624 weeks)
  { label: 'Other', value: 'Other', minWeek: 260, maxWeek: 624000}, // 12 and forward ...
]


const calculateWeeksOld = (bornDate) => {
  const today = new Date();
  const birthDate = new Date(bornDate);
  const diffTime = Math.abs(today - birthDate);
  const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks;
};

const determineProgram = (weeksOld) => {
  return programOptions.find(program => weeksOld >= program.minWeek && weeksOld <= program.maxWeek)?.value || '';
};

export const StepComponentOne = ({ setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    defaultValues: {
      children: contractInformation.children
    }
  });

  const onSubmit = (data) => {
    setContractInformation({ ...contractInformation, children: data.children });
    toast.current.show({ severity: 'success', summary: 'Success', detail: 'Children information saved', life: 3000 });
  };

  const addChild = () => {
    const updatedChildren = [...getValues('children'), { name: '', age: '', bornDate: null, program: '' }];
    setValue('children', updatedChildren);
  };

  const removeChild = (index) => {
    const updatedChildren = getValues('children').filter((_, i) => i !== index);
    setValue('children', updatedChildren);
  };

  const handleBornDateChange = (date, index) => {
    const weeksOld = calculateWeeksOld(date);
    const program = determineProgram(weeksOld);
    console.log("date", date, "index", index, "weekOld", weeksOld, "program", program);
    setValue(`children[${index}].program`, program);
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
        {getValues('children').map((child, index) => (
          <div key={index} className="child-form">
            <Controller
              name={`children[${index}].name`}
              control={control}
              rules={{ required: 'Child name is required' }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText 
                    id={`child-name-${index}`} 
                    {...field} 
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].name })}
                    keyfilter={/^[a-zA-ZñÑ.,\s]*$/}
                  />
                  <label htmlFor={`child-name-${index}`}>Child's Name</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].name`)}

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
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].age })}
                    keyfilter="int"
                  />
                  <label htmlFor={`child-age-${index}`}>Child's Age</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].age`)}

            <Controller
              name={`children[${index}].bornDate`}
              control={control}
              rules={{ required: 'Born date is required' }}
              render={({ field }) => (
                <span className="p-float-label">
                  <Calendar 
                    id={`child-bornDate-${index}`} 
                    {...field} 
                    value={field.value} 
                    dateFormat="yy-mm-dd"
                    showIcon
                    yearNavigator 
                    monthNavigator 
                    minDate={new Date(new Date().getFullYear() - 15, 0, 1)}
                    onChange={(e) => handleBornDateChange(e.value, index)}
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].bornDate })}
                  />
                  <label htmlFor={`child-bornDate-${index}`}>Born Date</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].bornDate`)}

            <Controller
              name={`children[${index}].program`}
              control={control}
              render={({ field }) => (
                <span className="p-float-label">
                  <Dropdown
                  style={{minWidth:"10rem"}}
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
          <Button icon="pi pi-plus" label="Add Child" className="p-button-success" onClick={addChild} />
          <Button type="submit" label="Save" className="p-button-primary p-ml-2" />
          <Button label="Next" className="p-button-secondary p-ml-2" onClick={goToNextStep} />
        </div>
      </form>
    </div>
  );
};

export default StepComponentOne;