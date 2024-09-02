import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { capitalizeFirstLetter, defaultGuardian, guardianTypeOptions } from '../utilsAndConsts';
import { useTranslation } from 'react-i18next';
import { useGuardianOptions } from '../../../utils/customHooks/useGuardianOptions.js';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';


export const StepComponentTwo = ({ setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const { t } = useTranslation();
  const [guardianOptions, setGuardianOptions] = useState([]);
  const { data: guardians } = useGuardianOptions()

  useEffect(() => {
    if (guardians?.response) {
      setGuardianOptions(
        guardians.response.map(type => ({
          ...type,
          label: type.name,  // Adjust according to your data structure
          value: type.id     // Adjust according to your data structure
        }))
      );
    }
  }, [guardians]);

  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm({
    defaultValues: {
      guardians: contractInformation.guardians || []
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guardians'
  });
  const onSubmit = async (data) => {
    try {
      // You can call the API to save the data here
      console.log("Submitted data", data);
      // Update parent component with the new guardians data
      setContractInformation({ ...contractInformation, guardians: data.guardians });
      // Show success toast message
      toast.current.show({ severity: 'success', summary: 'Success', detail: t('guardiansInformationSaved'), life: 3000 });
      // Move to the next step
      // setActiveIndex(2);
    } catch (error) {
      console.error('Error saving guardians data', error);
      toast.current.show({ severity: 'error', summary: 'Error', detail: t('guardiansInformationSaveFailed'), life: 3000 });
    }
  };

  const addGuardian = () => {
    const updatedGuardians = [...getValues('guardians'), { ...defaultGuardian }];
    setValue('guardians', updatedGuardians);
  };

  const removeGuardian = (index) => {
    const updatedGuardians = getValues('guardians').filter((_, i) => i !== index);
    setValue('guardians', updatedGuardians);
  };

  const getAvailableGuardianTypes = (index) => {
    const selectedTypes = getValues('guardians').map((g, i) => i !== index ? g.guardianType : null);
    return guardianTypeOptions.filter(option => !selectedTypes.includes(option.value));
  };

  const handleGuardianSelect = (e) => {
    const selectedGuardian = e.value;
    console.log("selectedGuardian", selectedGuardian);

    toast.current.show({ severity: 'success', summary: 'Success', detail: t('guardianInfoLoaded'), life: 3000 });

    // Check if the guardian already exists in the fields
    const existingGuardianIndex = fields.findIndex(guardian => guardian.email === selectedGuardian.email);

    if (existingGuardianIndex === -1) {
      // If the guardian does not exist, add it to the fields
      append({
        ...selectedGuardian,
        name: selectedGuardian.name || '',
        address: selectedGuardian.address || '',
        city: selectedGuardian.city || '',
        email: selectedGuardian.email || '',
        phone: selectedGuardian.phone || '',
        guardianType: selectedGuardian.guardianType || '',
        titular: selectedGuardian.titular || false,
      });
    } else {
      // If the guardian exists, populate the form with the guardian's data
      setValue(`guardians[${existingGuardianIndex}].name`, selectedGuardian.name || '');
      setValue(`guardians[${existingGuardianIndex}].address`, selectedGuardian.address || '');
      setValue(`guardians[${existingGuardianIndex}].city`, selectedGuardian.city || '');
      setValue(`guardians[${existingGuardianIndex}].email`, selectedGuardian.email || '');
      setValue(`guardians[${existingGuardianIndex}].phone`, selectedGuardian.phone || '');
      setValue(`guardians[${existingGuardianIndex}].guardianType`, selectedGuardian.guardianType || '');
      setValue(`guardians[${existingGuardianIndex}].titular`, selectedGuardian.titular || false);
    }
  };
  //#region form return
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field p-float-label" style={{ marginBottom: "30px", maxWidth: "15rem" }}>
          <Dropdown
            id="names-dropdown-child"
            filter
            options={guardianOptions}
            onChange={handleGuardianSelect}
            optionLabel="fullName"
          />
          <label htmlFor="names-dropdown-child" style={{ paddingTop: "0px" }}>{t('pickAGuardian')}</label>
        </div>

        {fields.map((guardian, index) => (
          <div key={index} className="child-form">
            <InputTextWrapper
              name={`guardians[${index}].name`}
              control={control}
              rules={{ required: t('guardianNameRequired') }}
              label={t('guardianName')}
              onChangeCustom={(value) => capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].address`}
              control={control}
              rules={{ required: t('addressRequired') }}
              label={t('address')}
              onChangeCustom={(value) => capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].city`}
              control={control}
              rules={{ required: t('cityRequired') }}
              label={t('city')}
            />
            <InputTextWrapper
              name={`guardians[${index}].email`}
              control={control}
              keyFilter="email"
              rules={{ required: t('emailRequired') }}
              label={t('email')}
            />
            <InputTextWrapper
              name={`guardians[${index}].phone`}
              control={control}
              rules={{
                required: t('phoneNumberRequired'),
                pattern: {
                  value: /^[+]?[\d]+$/,
                  message: t('phoneNumberPattern')
                }
              }}
              label={t('phoneNumber')}
              keyFilter="int"
            />

            <Controller
              name={`guardians[${index}].guardianType`}
              control={control}
              rules={{ required: t('guardianTypeRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <Dropdown
                    id={`guardian-type-${index}`}
                    {...field}
                    style={{ minWidth: "10rem" }}
                    options={getAvailableGuardianTypes(index)}
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].guardianType })}
                  />
                  <label htmlFor={`guardian-type-${index}`}>{t('guardianType')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].guardianType && (
                    <small className="p-error">{errors.guardians[index].guardianType.message}</small>
                  )}
                </span>
              )}
            />

            <Controller
              name={`guardians[${index}].titular`}
              control={control}
              render={({ field }) => (
                <span className="p-float-label">
                  <Checkbox
                    id={`guardian-titular-${index}`}
                    {...field}
                    checked={field.value}
                    defaultChecked
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].titular })}
                  />
                  <label htmlFor={`guardian-titular-${index}`}>{t('titular')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].titular && (
                    <small className="p-error">{errors.guardians[index].titular.message}</small>
                  )}
                </span>
              )}
            />

            <Button
              icon="pi pi-trash"
              className="p-button-danger p-button-text p-ml-2"
              onClick={() => removeGuardian(index)}
            />
          </div>
        ))}

        <div className="button-group">
          <Button icon="pi pi-plus" label={t('addGuardian')} className="p-button-success" onClick={
            e => {
              e.preventDefault();
              e.stopPropagation();
              addGuardian();
            }} disabled={getValues("guardians")?.length > 2} />
          <Button type="submit" label={t('save')} className="p-button-primary p-ml-2" />
          <Button label={t('returnToPreviousStep')} className="p-button-secondary p-ml-2" onClick={e => {

            setActiveIndex(0)
          }} />
          {/* <Button label={!validForm ? t('fillTheForm') : t('next')} className="p-button-secondary p-ml-2" onClick={() => setActiveIndex(2)} disabled={!validForm} /> */}
        </div>
      </form>
    </div>
  );
};

export default StepComponentTwo;