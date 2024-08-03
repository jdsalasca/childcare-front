import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';
import { capitalizeFirstLetter, defaultGuardian, guardianTypeOptions } from '../utilsAndConsts';
import { useTranslation } from 'react-i18next';


export const StepComponentTwo = ({ setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const { control, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm({
    defaultValues: {
      guardians: contractInformation.guardians
    }
  });

  const { t } = useTranslation();
  const [validForm, setValidForm] = useState(false);

  const onSubmit = (data) => {
    setValidForm(true);
    setContractInformation({ ...contractInformation, guardians: data.guardians });
    toast.current.show({ severity: 'success', summary: t('success'), detail: t('guardiansInformationSaved'), life: 3000 });
    setActiveIndex(2)
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

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {watch('guardians').map((guardian, index) => (
          <div key={index} className="child-form">
            <Controller
              name={`guardians[${index}].name`}
              control={control}
              rules={{ required: t('guardianNameRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`guardian-name-${index}`}
                    {...field}
                    onChange={(e) => {
                      const formattedValue = capitalizeFirstLetter(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].name })}
                  />
                  <label htmlFor={`guardian-name-${index}`}>{t('guardianName')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].name && (
                    <small className="p-error">{errors.guardians[index].name.message}</small>
                  )}
                </span>
              )}
            />

            <Controller
              name={`guardians[${index}].address`}
              control={control}
              rules={{ required: t('addressRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`guardian-address-${index}`}
                    {...field}
                    onChange={(e) => {
                      const formattedValue = capitalizeFirstLetter(e.target.value);
                      field.onChange(formattedValue);
                    }}
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].address })}
                  />
                  <label htmlFor={`guardian-address-${index}`}>{t('address')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].address && (
                    <small className="p-error">{errors.guardians[index].address.message}</small>
                  )}
                </span>
              )}
            />

            <Controller
              name={`guardians[${index}].city`}
              control={control}
              rules={{ required: t('cityRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`guardian-city-${index}`}
                    {...field}
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].city })}
                  />
                  <label htmlFor={`guardian-city-${index}`}>{t('city')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].city && (
                    <small className="p-error">{errors.guardians[index].city.message}</small>
                  )}
                </span>
              )}
            />

            <Controller
              name={`guardians[${index}].email`}
              control={control}
              rules={{ required: t('emailRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`guardian-email-${index}`}
                    {...field}
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].city })}
                  />
                  <label htmlFor={`guardian-email-${index}`}>{t('email')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].city && (
                    <small className="p-error">{errors.guardians[index].email.message}</small>
                  )}
                </span>
              )}
            />


            <Controller
              name={`guardians[${index}].phone`}
              control={control}
              rules={{
                required: t('phoneNumberRequired'),
                pattern: {
                  value: /^[+]?[\d]+$/,
                  message: t('phoneNumberPattern')
                }
              }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`guardian-phone-${index}`}
                    {...field}
                    keyfilter={/^[\d+]*$/}  // Allow numbers and "+"
                    className={classNames({ 'p-invalid': errors.guardians && errors.guardians[index] && errors.guardians[index].phone })}
                  />
                  <label htmlFor={`guardian-phone-${index}`}>{t('phoneNumber')}</label>
                  {errors.guardians && errors.guardians[index] && errors.guardians[index].phone && (
                    <small className="p-error">{errors.guardians[index].phone.message}</small>
                  )}
                </span>
              )}
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