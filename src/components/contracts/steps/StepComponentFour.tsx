import { LoadingInfo } from '@models/AppModels';
import { Button } from 'primereact/button';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ContractAPI } from '../../../models/ContractAPI';
import usePaymentMethodsOptions from '../../../utils/customHooks/usePaymentMethodsOptions';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import DropdownWrapper from '../../formsComponents/DropdownWrapper';
import InputTextWrapper from '../../formsComponents/InputTextWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { ContractInfo } from '../types/ContractInfo';


interface StepComponentFourProps {
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  toast: any; // Adjust this type based on your toast implementation
  setLoadingInfo: (info: LoadingInfo) => void;
}

const StepComponentFour: React.FC<StepComponentFourProps> = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  toast,
}) => {
  const { paymentMethodsOptions: paymentMethodsCache, isLoading } = usePaymentMethodsOptions();
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; translationLabel: string; method: string }[]>([]);

  useEffect(() => {
    if (paymentMethodsCache && !isLoading) {
      setPaymentMethods(paymentMethodsCache.map(paymentMethod => ({
        ...paymentMethod,
        label: paymentMethod.translationLabel,
        value: paymentMethod.id,
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
    formState: { errors },
  } = useForm({
    defaultValues: {
      contract_id: contractInformation.contract_id || null,
      start_date: contractInformation.start_date || null,
      end_date: contractInformation.end_date || null,
      payment_method_id: contractInformation.payment_method_id || '',
      total_to_pay: contractInformation.total_to_pay || '',
      weekly_payment: contractInformation.weekly_payment || '',
    },
  });

  const startDate = watch('start_date');
  const endDate = watch('end_date');

  useEffect(() => {
    if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
      setError('end_date', {
        type: 'manual',
        message: t('endDateAfterStartDate'),
      });
    } else {
      clearErrors('end_date');
    }
  }, [startDate, endDate, setError, clearErrors, t]);

  const onSubmit = async (data: any) => {
    if (data.total_to_pay) {
      data.total_to_pay = parseFloat(data.total_to_pay as string).toFixed(2);
    }
    if (data.contract_id == null) {
      ToastInterpreterUtils.toastInterpreter(toast, 'info', 'info', t('contractInformationRequiredMessage'), 3000);
      return;
    }
    setContractInformation({ ...contractInformation, ...data });
    await ContractAPI.updateContractPaymentDetails(data);
    ToastInterpreterUtils.toastInterpreter(toast, 'success', t('success'), t('termsUpdated'));

    setActiveIndex(4);
  };

  const formatValue = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = getValues('total_to_pay');
    const cleanValue = value?.toString().replace(/[^0-9.]/g, '');
    const numberValue = parseFloat(cleanValue as string);

    if (isNaN(numberValue)) {
      return '';
    }
    const formattedValue = numberValue.toFixed(2).replace(/\.00$/, '');
    setValue('total_to_pay', formattedValue);
    return formattedValue;
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
       {/*  <CalendarWrapper
          name="end_date"
          control={control}
          dateFormat="mm/dd/yy"
          label={t('contractEndDate')}
          spanClassName="p-float-label"
          showIcon
          rules={{ required: t('contractEndDateRequired') }}
        /> */}
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
                <InputTextWrapper
          name="weekly_payment"
          control={control}
          rules={{ required: t('weeklyPaymentRequired'), min: { value: 0, message: t('weeklyPaymentRequired') } }}
          label={t('weeklyPayment')}
          keyFilter={/^[0-9.]*$/}
          onBlur={formatValue}
          spanClassName="p-float-label"
        />
        <div className="button-group">
          <Button type="submit" label={t('save')} className="p-button-primary p-ml-2" />
          <Button label={t('returnToPreviousStep')} className="p-button-secondary p-ml-2" onClick={() => setActiveIndex(2)} />
        </div>
      </form>
    </div>
  );
};

export default StepComponentFour;
