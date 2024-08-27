import React, { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { calculateAge, calculateWeeksOld, capitalizeFirstLetter, determineProgram, programOptions } from '../utilsAndConsts';
import { useChildren } from '../../../models/ChildrenAPI';

/**
 * 
 * @param {setLoadingInfo}  setLoadingInfo :: Arg used to set an error message
 * @returns 
 */
export const StepComponentOne = ({setLoadingInfo, setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const { t } = useTranslation();
  const [validForm, setValidForm] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childrenOptions, setChildrenOptions] = useState([]);

  const { data: children, error: errorChild, isLoading: loadingChildren } = useChildren();

  useEffect(() => {
    console.log(children);
    if(children?.response != null && children?.httpStatus ===200){

        setChildrenOptions(
          children?.response?.map(child => ({
            ...child,
            fullName: `${child.first_name} ${child.last_name}`}))
        )
      setLoadingInfo({
        loading: false,
        loadingMessage:""
  })
    }
    return () => {
    };
  }, [children]);

  /**
   * Component Initialization
   */
  useEffect(() => {
    setLoadingInfo({
          loading: children == null,
    loadingMessage: t("weAreLookingForChildrenInformation")
    })
    return () => {
      
    };
  }, []);
  const { control, handleSubmit, formState: { errors }, setValue, getValues, clearErrors } = useForm({
    defaultValues: {
      children: contractInformation.children || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'children'
  });

  const onSubmit = (data) => {
    setValidForm(true);
    setContractInformation({ ...contractInformation, children: data.children });
    toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoSaved'), life: 3000 });
    setActiveIndex(1);
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

  const handleChildSelect = (e) => {
    const selectedChild = e.value;
    toast.current.show({ severity: 'success', summary: 'Success', detail: t('childrenInfoLoaded'), life: 3000 });

    // Check if the child already exists in the fields
    const existingChildIndex = fields.findIndex(child => child.name === selectedChild.names);

    if (existingChildIndex === -1) {
      // If the child does not exist, add it to the fields
      append({ name: selectedChild.names,
         age: calculateAge(selectedChild.born_date),
          bornDate: new Date(selectedChild.born_date), program: determineProgram(calculateWeeksOld(selectedChild.born_date)) });
    } else {
      // If the child exists, populate the form with the child's data
      setValue(`children[${existingChildIndex}].bornDate`, new Date(selectedChild.born_date));
    }
  };

  return (
    <div className="form-container">
    
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field p-float-label" style={{marginBottom:"30px", maxWidth:"15rem" }}>
          <Dropdown
            id="names-dropdown-child"
            value={selectedChild}
            filter
            options={childrenOptions}
            onChange={handleChildSelect}
            optionLabel="fullName"
            
          />
          <label htmlFor="names-dropdown-child" style={{paddingTop:"0px"}}>{t('pickAChild')}</label>
        </div>
        {fields.map((child, index) => (
          <div key={child.id} className="child-form">
            <Controller
              name={`children[${index}].name`}
              control={control}
              rules={{ required: t('childNameRequired') }}
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
                  <label htmlFor={`child-name-${index}`}>{t('childName')}</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].name`)}

            <Controller
              name={`children[${index}].bornDate`}
              control={control}
              rules={{ required: t('bornDateRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <Calendar
                    id={`child-bornDate-${index}`}
                    {...field}
                    dateFormat="yy-mm-dd"
                    value={field.value}
                    showIcon
                    onChange={(e) => field.onChange(handleBornDateChange(e.value, index))}
                    className={classNames({ 'p-invalid': errors.children && errors.children[index] && errors.children[index].bornDate })}
                  />
                  <label htmlFor={`child-bornDate-${index}`}>{t('bornDate')}</label>
                </span>
              )}
            />
            {getFormErrorMessage(`children[${index}].bornDate`)}

            <Controller
              name={`children[${index}].age`}
              control={control}
              rules={{ required: t('childAgeRequired'), min: { value: 0, message: t('ageMustBeGreaterThanZero') } }}
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
                  <label htmlFor={`child-age-${index}`}>{t('childAge')}</label>
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
                  <label htmlFor={`child-program-${index}`}>{t('program')}</label>
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
          <Button
            icon="pi pi-plus"
            label={t('addChild')}
            className="p-button-success"
            onClick={(e) => {
              e.preventDefault();
              addChild();
            }}
          />
          <Button type="submit" label={t('save')} className="p-button-primary p-ml-2" />
          {/* <Button label={!validForm ? t('fillTheForm') : t('next')} className="p-button-secondary p-ml-2" onClick={goToNextStep} disabled={!validForm} /> */}
        </div>
      </form>
    </div>
  );
};

export default StepComponentOne;
