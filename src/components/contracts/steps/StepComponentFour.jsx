/* eslint-disable no-unused-vars */
import { Button } from 'primereact/button';
import PropTypes from 'prop-types'; // Import PropTypes
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContractAPI } from '../../../models/ContractAPI';
import usePaymentMethodsOptions from '../../../utils/customHooks/usePaymentMethodsOptions';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';

/**
 * StepComponentFour component - Handles contract dates and payment details.
 */
export const StepComponentFour = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  toast
}) => {
  let { paymentMethodsOptions: paymentMethodsCache, isLoading } = usePaymentMethodsOptions();
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    if (paymentMethodsCache && !isLoading) {
      setPaymentMethods(paymentMethodsCache?.map(paymentMethod => ({
        ...paymentMethod,
        label: paymentMethod.translationLabel, // Adjust based on data structure
        value: paymentMethod.id
      })));
    }
  }, [paymentMethodsCache, isLoading]);

  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    watch,
    getValues,
    setError,
    clearErrors,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      contract_id: contractInformation.contract_id || null,
      start_date: contractInformation.start_date || null,
      end_date: contractInformation.end_date || null,
      payment_method_id: contractInformation.paymentMethod || '',
      totalAmount: contractInformation.totalAmount || ''
    }
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  useEffect(() => {
    if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
      setError('end_date', {
        type: 'manual',
        message: t('endDateAfterStartDate')
      });
    } else {
      clearErrors('endDate');
    }
  }, [startDate, endDate, setError, clearErrors, t]);
  const onSubmit = async (data) => {
    if (data.total_to_pay) {
      data.total_to_pay = parseFloat(data.total_to_pay).toFixed(2);
    }
    if (data.contract_id == null) {
      ToastInterpreterUtils.toastInterpreter(toast, 'info', 'info', t('contractInformationRequiredMessage'), 3000);
      return;
    }
    setContractInformation({ ...contractInformation, ...data });
     await ContractAPI.updateContractPaymentDetails(data);
    ToastInterpreterUtils.toastInterpreter(toast, 'success', t('success'), t('termsUpdated'));

    setActiveIndex(4); // Move to the next step or handle as needed
  };
  // Function to format the value to 2 decimal places
  const formatValue = (event) => {
    const value = getValues('total_to_pay');
    // Remove any non-numeric characters except for decimal point
    const cleanValue = value?.replace(/[^0-9.]/g, '');
    // Convert to number
    const numberValue = parseFloat(cleanValue);

    // If the number is NaN, return an empty string
    if (isNaN(numberValue)) {
      return '';
    }
    const formattedValue = numberValue.toFixed(2).replace(/\.00$/, '');
    setValue('total_to_pay', formattedValue);
    // Format the number to 2 decimal places if needed
     
  };


  return (
    <div className="form-container terms">
      <form className="child-form" onSubmit={handleSubmit(onSubmit)}>
        <CalendarWrapper
          name="start_date"
          control={control}
          dateFormat="mm/dd/yy"
          label={t('contractStartDate')}
          spanClassName="p-float-label"
          showIcon
          rules={{ required: t('contractStartDateRequired') }}
        />
        <CalendarWrapper
          name="end_date"
          control={control}
          dateFormat="mm/dd/yy"
          label={t('contractEndDate')}
          spanClassName="p-float-label"
          showIcon
          rules={{ required: t('contractEndDateRequired') }}
        />
        <DropdownWrapper
          name="payment_method_id"
          control={control}
          filter
          options={paymentMethods}
          optionValue="id"
          optionLabel="method"
          label={t('paymentMethod')}
          rules={{ required: t('paymentMethodRequired') }}
          spanClassName="p-float-label c-dropdown-field m-r-inherit"
        />
        <InputTextWrapper
          name="total_to_pay"
          control={control}
          rules={{ required: t('totalAmountRequired'), min: { value: 0, message: t('totalAmountRequired') } }}
          label={t('totalAmount')}
          keyFilter={/^[0-9.]*$/}
          onBlur={formatValue}
          spanClassName="p-float-label"
        />
        <div className="button-group">
          <Button type="submit" label={t('save')} className="p-button-primary rounded-button" />
          <Button label={t('returnToPreviousStep')} className="p-button-secondary rounded-button" onClick={() => setActiveIndex(2)} />
        </div>
      </form>
    </div>
  );
};

// Prop type validation
StepComponentFour.propTypes = {
  setActiveIndex: PropTypes.func.isRequired, // Function to set active index
  contractInformation: PropTypes.shape({ // Object containing contract information
    contract_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    paymentMethod: PropTypes.string,
    totalAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  setContractInformation: PropTypes.func.isRequired, // Function to set contract information
  toast: PropTypes.object.isRequired // Toast object for notifications
};

export default StepComponentFour;
