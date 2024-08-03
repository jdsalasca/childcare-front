import React, { useEffect, useRef, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';

import { useTranslation } from 'react-i18next';
import { Checkbox } from 'primereact/checkbox';

const defaultHealthInfo = {
  childName: '',
      healthStatus: '',
      treatment: '',
      allergies: '',
      instructions: '',
      formula: '',
      feedingTimes: ['', '', '', ''],
      maxBottleTime: '',
      minBottleTime: '',
      bottleAmount: '',
      feedingInstructions: '',
      otherFood: '',
      foodAllergies: '',
      followMealProgram: null,
      permissions: {
        soap: false,
        sanitizer: false,
        rashCream: false,
        teethingMedicine: false,
        sunscreen: false,
        insectRepellent: false,
        other: ''
      }
}

export const StepComponentSix = ({ setActiveIndex, contractInformation, setContractInformation, toast, ...props }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      ...defaultHealthInfo
    }
  });
  const onChangeChild = (selectedChild) => {
    const childInfo =  selectedChild.medicalInformation !=null ? selectedChild :  contractInformation.children.find(({name}) => name === selectedChild)
    const medicalInfo = childInfo?.medicalInformation || {};
    reset({
      childName: selectedChild,
      healthStatus: medicalInfo.healthStatus || '',
      treatment: medicalInfo.treatment || '',
      allergies: medicalInfo.allergies || '',
      instructions: medicalInfo.instructions || '',
      formula: medicalInfo?.formula || '',
      feedingTimes: medicalInfo?.feedingTimes || ['', '', '', ''],
      maxBottleTime: medicalInfo?.maxBottleTime || '',
      minBottleTime: medicalInfo?.minBottleTime || '',
      bottleAmount: medicalInfo?.bottleAmount || '',
      feedingInstructions: medicalInfo?.feedingInstructions || '',
      otherFood: medicalInfo?.otherFood || '',
      foodAllergies: medicalInfo?.foodAllergies || '',
      followMealProgram: medicalInfo?.followMealProgram || null,
      permissions: medicalInfo.permissions || {
        soap: false,
        sanitizer: false,
        rashCream: false,
        teethingMedicine: false,
        sunscreen: false,
        insectRepellent: false,
        other: ''
      }
    });
    return selectedChild;
  }

  const onFormSubmit = (data) => {
    if (data.childName != null && data.childName !== "") {
      const updatedChildren = contractInformation.children.map(child =>
        child.name === data.childName?.name ?? data.childName
          ? { ...child, medicalInformation: data }
          : child
      );
      setContractInformation({
        ...contractInformation,
        children: updatedChildren
      });
      reset({defaultHealthInfo})
      toast.current?.show({ severity: 'success', summary: t('formSubmitted') });
    }
  };

  return (
    <div className='form-container children-health'>

      <form   onSubmit={handleSubmit(onFormSubmit)}>
      <h4>{t('medicalInformation')}</h4>
        <div className="p-fluid">
          <div className="field p-float-label">
            <label htmlFor="childName">{t('childName')}</label>
            <Controller
              name="childName"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) => (
                <Dropdown
                  {...field}
                  id="childName"
                  options={contractInformation.children}
                  optionValue="name"
                  optionLabel="name"
                  
                  value={field.value}
                  onChange={(e) => field.onChange(onChangeChild(e.value)) } placeholder={t('selectChild')}
                />
              )}
            />
            {errors.childName && <small className="p-error">{errors.childName.message}</small>}
          </div>

          <div className="p-field">
            <Controller
              name="healthStatus"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">
               <InputTextarea id="healthStatus" rows={3} {...field} />
            <label htmlFor="healthStatus">{t('healthStatus')}</label>
            {errors.healthStatus && <small className="p-error">{errors.healthStatus.message}</small>}
               </span>
               }
            />
          </div>

          <div className="p-field">
            <Controller
              name="treatment"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">
               <InputText id="treatment" {...field} />
            <label htmlFor="treatment">{t('treatment')}</label>
            {errors.treatment && <small className="p-error">{errors.treatment.message}</small>}
               </span>}
            />
          </div>

          <div className="p-field">
            <Controller
              name="allergies"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) => 
                <span className="p-float-label">
              <InputTextarea id="allergies" rows={3} {...field} />
            <label htmlFor="allergies">{t('allergies')}</label>
            {errors.allergies && <small className="p-error">{errors.allergies.message}</small>}
              </span>
              }
            />
          </div>

          <div className="p-field">
            <Controller
              name="instructions"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">
               <InputTextarea id="instructions" rows={3} {...field} />
            <label htmlFor="instructions">{t('instructions')}</label>
            {errors.instructions && <small className="p-error">{errors.instructions.message}</small>}
               </span>
               }
            />
          </div>




          <h4>{t('babyFormulaAndFeeding')}</h4>

          <div className="p-field">
            <Controller
              name="formula"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">
                  
                 <InputTextarea id="formula" {...field} />
            <label htmlFor="formula">{t('formula')}</label>
            {errors.formula && <small className="p-error">{errors.formula.message}</small>}
                </span>
                 
                 }
            />
          </div>

          <div className="p-field">
            <label htmlFor="feedingTimes">{t('feedingTimes')}</label>
            <Controller
              name="feedingTimes"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) => (
                <div>
                  {field.value.map((time, index) => (
                    <InputText key={index} value={time} onChange={(e) => {
                      const newTimes = [...field.value];
                      newTimes[index] = e.target.value;
                      setValue('feedingTimes', newTimes);
                    }} />
                  ))}
                </div>
              )}
            />
            {errors.feedingTimes && <small className="p-error">{errors.feedingTimes.message}</small>}
          </div>

          <div className="p-field">
            <Controller
              name="maxBottleTime"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">
               <InputText id="maxBottleTime" {...field}  keyfilter="int"/>
            <label htmlFor="maxBottleTime">{t('maxBottleTime')}</label>
            {errors.maxBottleTime && <small className="p-error">{errors.maxBottleTime.message}</small>}
                </span>
               }


                  
            />
          </div>

          <div className="p-field">
            <Controller
              name="minBottleTime"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) => 
                <span className="p-float-label">

              <InputText id="minBottleTime" {...field} keyfilter="int" />
            <label htmlFor="minBottleTime">{t('minBottleTime')}</label>
            {errors.minBottleTime && <small className="p-error">{errors.minBottleTime.message}</small>}
                </span>
              
              }
            />
          </div>

          <div className="p-field">
            <Controller
              name="bottleAmount"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) => 
                <span className="p-float-label">

              <InputText id="bottleAmount" {...field} />
            <label htmlFor="bottleAmount">{t('bottleAmount')}</label>
            {errors.bottleAmount && <small className="p-error">{errors.bottleAmount.message}</small>}
                </span>
              }
            />
          </div>

          <div className="p-field">
            <Controller
              name="feedingInstructions"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">

               <InputTextarea id="feedingInstructions" rows={3} {...field} />
            <label htmlFor="feedingInstructions">{t('feedingInstructions')}</label>
            {errors.feedingInstructions && <small className="p-error">{errors.feedingInstructions.message}</small>}
                </span>
               }
            />
          </div>

          <div className="p-field">
            <Controller
              name="otherFood"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) => 
                <span className="p-float-label">

              <InputTextarea id="otherFood" rows={3} {...field} />
            <label htmlFor="otherFood">{t('otherFood')}</label>
            {errors.otherFood && <small className="p-error">{errors.otherFood.message}</small>}
                </span>
              }
            />
          </div>

          <div className="p-field">
            <Controller
              name="foodAllergies"
              control={control}
              rules={{ required: t('requiredField') }}
              render={({ field }) =>
                <span className="p-float-label">

               <InputTextarea id="foodAllergies" {...field} />
            <label htmlFor="foodAllergies">{t('foodAllergies')}</label>
            {errors.foodAllergies && <small className="p-error">{errors.foodAllergies.message}</small>}
                </span>
               }
            />
          </div>
          <div className="p-field">
            <label htmlFor="followMealProgram">{t('followMealProgram')}</label>
            <Controller
              name="followMealProgram"
              control={control}
              //rules={{ required: t('requiredField') }}
              render={({ field }) => (
                <div>
                  <label>
                    <Checkbox
                      id="followMealProgram"
                      value={true}
                      checked={field.value === true}
                      onChange={(e) => setValue('followMealProgram', e.checked)}
                    />
                    {t('yes')}
                  </label>
                  <label>
                    <Checkbox
                      id="followMealProgram"
                      value={false}
                      checked={field.value === false}
                      onChange={(e) => setValue('followMealProgram', !e.checked)}
                    />
                    {t('no')}
                  </label>
                </div>
              )}
            />
            {errors.followMealProgram && <small className="p-error">{errors.followMealProgram.message}</small>}
          </div>

          <h4>{t('permissionForProducts')}</h4>
          <div className="p-field-checkbox">
            <Controller
              name="permissions.soap"
              control={control}
              render={({ field }) => (
                <div>
                  <Checkbox id="soap" {...field} checked={field.value} />
                  <label htmlFor="soap">{t('soap')}</label>
                </div>
              )}
            />
          </div>
          <div className="p-field-checkbox">
            <Controller
              name="permissions.sanitizer"
              control={control}
              render={({ field }) => (
                <div>
                  <Checkbox id="sanitizer" {...field} checked={field.value} />
                  <label htmlFor="sanitizer">{t('sanitizer')}</label>
                </div>
              )}
            />
          </div>
          <div className="p-field-checkbox">
            <Controller
              name="permissions.rashCream"
              control={control}
              render={({ field }) => (
                <div>
                  <Checkbox id="rashCream" {...field} checked={field.value} />
                  <label htmlFor="rashCream">{t('rashCream')}</label>
                </div>
              )}
            />
          </div>
          <div className="p-field-checkbox">
            <Controller
              name="permissions.teethingMedicine"
              control={control}
              render={({ field }) => (
                <div>
                  <Checkbox id="teethingMedicine" {...field} checked={field.value} />
                  <label htmlFor="teethingMedicine">{t('teethingMedicine')}</label>
                </div>
              )}
            />
          </div>
          <div className="p-field-checkbox">
            <Controller
              name="permissions.sunscreen"
              control={control}
              render={({ field }) => (
                <div>
                  <Checkbox id="sunscreen" {...field} checked={field.value} />
                  <label htmlFor="sunscreen">{t('sunscreen')}</label>
                </div>
              )}
            />
          </div>
          <div className="p-field-checkbox">
            <Controller
              name="permissions.insectRepellent"
              control={control}
              render={({ field }) => (
                <div>
                  <Checkbox id="insectRepellent" {...field} checked={field.value} />
                  <label htmlFor="insectRepellent">{t('insectRepellent')}</label>
                </div>
              )}
            />
          </div>
          <div className="p-field">
            <Controller
              name="permissions.other"
              control={control}
              render={({ field }) => 
                <span className="p-float-label">

              
              <InputText id="permissions.other" {...field} />
            <label htmlFor="permissions.other">{t('other')}</label>
                </span>
              
              }
            />
          </div>

          <Button type="submit" label={t('submit')} />
        </div>
      </form>
    </div>
  );
}

export default StepComponentSix;