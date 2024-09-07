import React, { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { capitalizeFirstLetter, defaultGuardian } from '../utilsAndConsts';
import { useTranslation } from 'react-i18next';
import { useGuardianOptions } from '../../../utils/customHooks/useGuardianOptions.js';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper.jsx';
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper.jsx';
import GuardiansAPI from '../../../models/GuardiansAPI.js';
import useGenderOptions from '../../../utils/customHooks/useGenderOptions.js';
import useGuardianTypeOptions from '../../../utils/customHooks/useGuardianTypeOptions.js';


export const StepComponentTwo = ({ setActiveIndex, contractInformation, setContractInformation, setLoadingInfo, toast, ...props }) => {
  const { t } = useTranslation();
  const [guardianOptions, setGuardianOptions] = useState([]);
  const { guardianTypeOptions } = useGuardianTypeOptions();
  const { data: guardians } = useGuardianOptions()

  console.log("guardianTypeOptions",guardianTypeOptions);
  
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
  const onCreateGuardian = async (data) => {
    console.log("data on create", data);
    
    try {
      const response = await GuardiansAPI.createGuardian(data);
      console.log("Guardian created:", response);
      if (response.httpStatus === 200) {
        return response.response; // Return the new guardian object
      }
    } catch (error) {
      console.error("Error creating guardian", error);
      throw error;
    }
  };
  
  const onUpdateGuardian = async (id, data) => {
    try {
      const response = await GuardiansAPI.updateGuardian(id, data);
      console.log("Guardian updated:", response);
      if (response.httpStatus === 200) {
        return response.response; // Return the updated guardian object
      }
    } catch (error) {
      console.error("Error updating guardian", error);
      throw error;
    }
  };
  
  const onHandlerGuardianBackendAsync = async (data) => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t("weAreSavingGuardiansInformation")
    });
  
    // Create an array of promises for creating/updating guardians
    const promises = data.guardians.map(guardian => {
      console.log("guardian", guardian);
      
      if (guardian.id == null || guardian.id ==="") {
        // Create guardian if ID is null
        return onCreateGuardian(guardian);
      } else {
        // Update guardian if ID is present
        return onUpdateGuardian(guardian.id,guardian);
      }
    });
  
    try {
      // Wait for all promises to resolve
      const responses = await Promise.all(promises);
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      });
      console.log("All guardians responses received", responses);
      
      return responses;
    } catch (error) {
      setLoadingInfo({
        loading: false,
        loadingMessage: ""
      });
      console.error('Error processing guardians data', error);
      throw error;
    }
  };
  
  const onSubmit = async (data) => {
    try {
      console.log("data", data);
  
      // Handle creating/updating guardians asynchronously
      const guardiansAsync = await onHandlerGuardianBackendAsync(data);
      console.log("Guardians responses", guardiansAsync);
  
      // Update parent component with the new guardians data
      setContractInformation({ ...contractInformation, guardians: guardiansAsync });
  
      // Show success toast message
      toast.current.show({ severity: 'success', summary: 'Success', detail: t('guardiansInformationSaved'), life: 3000 });
  
      // Optionally update active index or handle other logic
      //setActiveIndex(2);
    } catch (error) {
      console.error('Error processing guardians data', error);
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
            emptyMessage={t('dropdownEmptyMessage')}
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
              onChangeCustom={(value) => capitalizeFirstLetter(value)}/>
          <InputTextWrapper
              name={`guardians[${index}].last_name`}
              control={control}
              rules={{ required: t('guardianLastNameRequired') }}
              label={t('guardianLastName')}
              onChangeCustom={(value) => capitalizeFirstLetter(value)}/>
            <InputTextWrapper
              name={`guardians[${index}].address`}
              control={control}
              rules={{ required: t('addressRequired') }}
              label={t('address')}
              onChangeCustom={(value) => capitalizeFirstLetter(value)}/>
            <InputTextWrapper
              name={`guardians[${index}].city`}
              control={control}
              rules={{ required: t('cityRequired') }}
              label={t('city')}/>
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
              rules={{required: t('phoneNumberRequired'), pattern: {value: /^[+]?[\d]+$/,message: t('phoneNumberPattern')}}}
              label={t('phoneNumber')}
              keyFilter="int"
              spanClassName='c-small-field r-10'
            />
            <DropdownWrapper
              name={`guardians[${index}].guardian_type_id`}
              control={control}
              options={getAvailableGuardianTypes(index)}
              optionValue="id"
              optionLabel="label"
              label={t('guardianType')}
              rules={{ required: t('guardianTypeRequired') }} 
                spanClassName="c-small-field r-10"
              />
            <CheckboxWrapper
              name={`guardians[${index}].titular`}
              control={control}
              label={t('titular')}
              labelPosition='left'

                
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