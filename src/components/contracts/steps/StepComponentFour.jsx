import React, { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { classNames } from 'primereact/utils'
import { useTranslation } from 'react-i18next'
import { ContractAPI } from '../../../models/ContractAPI'
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils'
import CalendarWrapper from '../../formsComponents/CalendarWrapper'
import DropdownWrapper from '../../formsComponents/DropdownWrapper'
import InputTextWrapper from '../../formsComponents/InputTextWrapper'
import usePaymentMethodsOptions from '../../../utils/customHooks/usePaymentMethodsOptions'

/**
 * StepComponentFour component this is for the contract dates and payment details.
 *
 * @param {Object} props - Component props.
 * @param {number} props.setActiveIndex - Callback function to set the active index of the current step.
 * @param {Object} props.contractInformation - Object containing the contract information.
 * @param {Object} props.setContractInformation - Callback function to set the contract information.
 * @param {Object} props.toast - Toast object from react-toastify.
 * 
 * @returns {React.Element} The rendered StepComponentFour component.
 */ 
export const StepComponentFour = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  toast
}) => {
   let {paymentMethodsOptions: paymentMethodsCache, error, isLoading} = usePaymentMethodsOptions();
   const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    console.log("paymentMethodsCache", paymentMethodsCache)
    
    if (paymentMethodsCache && !isLoading) {
      setPaymentMethods(paymentMethodsCache?.map(paymentMethod => ({
        ...paymentMethod,
        label: paymentMethod.translationLabel, // Adjust according to your data structure
        value: paymentMethod.id      // Adjust according to your data structure
      })));
    }
  }, [paymentMethodsCache, isLoading]);

  const { t } = useTranslation()
  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      contract_id: contractInformation.contract_id || null,
      start_date: contractInformation.start_date || null,
      end_date: contractInformation.end_date || null,
      payment_method_id: contractInformation.paymentMethod || '',
      totalAmount: contractInformation.totalAmount || ''
    }
  })

  const startDate = watch('start_date')
  const endDate = watch('end_date')

  //#region onSetDoubleNotation
  const onSetDoubleNotation = (value) => {
    return value;

  };
  
  useEffect(() => {
    // console.log('startDate', startDate)
    // console.log('endDate', endDate)
    if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
      console.log('setError')
      setError('endDate', {
        type: 'manual',
        message: t('endDateAfterStartDate')
      })
    } else {
      clearErrors('endDate')
    }
  }, [startDate, endDate, setError, clearErrors, t])

  //#region onSubmit method
  const onSubmit = async data => {
    
    if (data.total_to_pay) {
      data.total_to_pay = parseFloat(data.total_to_pay).toFixed(2);
  }
    if(data.contract_id == null){
      ToastInterpreterUtils.toastInterpreter(toast,'info','info',t('contractInformationRequiredMessage'),3000)
      return
    }
    setContractInformation({ ...contractInformation, ...data })

    const response =await  ContractAPI.updateContractPaymentDetails(data)
    console.log("response", response)
    
    ToastInterpreterUtils.toastInterpreter(
      toast,
      'success',
      t('success'),
      t('termsUpdated')
    )

    // #region move to the next step
    setActiveIndex(4); // Move to the next step or handle as needed
  }

  //#region return component
  return (
    <div className='form-container terms'>
      <form className='child-form' onSubmit={handleSubmit(onSubmit)}>
        <CalendarWrapper
          name='start_date'
          control={control}
          dateFormat='yy-mm-dd'
          label={t('contractStartDate')}
          spanClassName='p-float-label'
          showIcon
          disabled={false} // You can set this dynamically if needed
          rules={{ required: t('contractStartDateRequired') }}
        />
        <CalendarWrapper
          name='end_date'
          control={control}
          dateFormat='yy-mm-dd'
          label={t('contractEndDate')}
          spanClassName='p-float-label'
          showIcon
          disabled={false} // You can set this dynamically if needed
          rules={{ required: t('contractEndDateRequired') }}
        />

        <DropdownWrapper
          name='payment_method_id'
          control={control}
          filter
          options={paymentMethods}
          optionValue='id'
          optionLabel='method'
          label={t('paymentMethod')}
          rules={{ required: t('paymentMethodRequired') }}
          spanClassName='p-float-label c-dropdown-field m-r-inherit'
        />
        <InputTextWrapper
          name='total_to_pay'
          control={control}
          rules={{ required: t('totalAmountRequired') }}
          label={t('totalAmount')}
          keyFilter={/^[0-9.]*$/}
          onChangeCustom={(value) => onSetDoubleNotation(value)}

          spanClassName='p-float-label'

        />
        <div className='button-group'>
          <Button
            type='submit'
            label={t('save')}
            className='p-button-primary rounded-button'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary rounded-button'
            onClick={() => setActiveIndex(2)}
          />
          {/* <Button label={t('nextStep')} className="p-button-success rounded-button" onClick={() => setActiveIndex(4)} /> */}
        </div>
      </form>
    </div>
  )
}

export default StepComponentFour
