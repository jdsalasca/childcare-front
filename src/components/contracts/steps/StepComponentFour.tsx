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
import { DoctorInformationCard } from './cards/DoctorInformationCard';
import { WorkInformationCard } from './cards/WorkInformationCard';


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
      guardians: contractInformation.guardians?.map(guardian => ({
        ...guardian,
        workInformation: guardian.workInformation || {
          employer: '',
          address: '',
          city: '',
          phone: ''
        }
      })),
      doctorInformation: contractInformation.doctorInformation || {
        name: '',
        address: '',
        city: '',
        phone: ''
      }
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
    try {
      // Format payment data
      const paymentData = {
        contract_id: data.contract_id,
        start_date: data.start_date,
        end_date: data.end_date,
        payment_method_id: data.payment_method_id,
        total_to_pay: data.total_to_pay ? parseFloat(data.total_to_pay).toFixed(2) : '',
        weekly_payment: data.weekly_payment ? parseFloat(data.weekly_payment).toFixed(2) : ''
      };
  
      if (paymentData.contract_id == null) {
        ToastInterpreterUtils.toastInterpreter(toast, 'info', 'info', t('contractInformationRequiredMessage'), 3000);
        return;
      }
  
      // Update guardians with work information
      const updatedGuardians = contractInformation.guardians?.map((guardian, index) => ({
        ...guardian,
        workInformation: data.guardians?.[index]?.workInformation || guardian.workInformation
      }));
  
      // Create the updated contract information
      const updatedContractInfo = {
        ...contractInformation,
        ...paymentData,
        guardians: updatedGuardians,
        doctorInformation: data.doctorInformation
      };
  
      // Update contract information in state
      setContractInformation(updatedContractInfo);
  
      // Save payment details to backend
      await ContractAPI.updateContractPaymentDetails(paymentData);
      
      ToastInterpreterUtils.toastInterpreter(toast, 'success', t('success'), t('termsUpdated'));
      setActiveIndex(4);
    } catch (error) {
      console.error('Error in form submission:', error);
      ToastInterpreterUtils.toastInterpreter(toast, 'error', t('error'), t('failedToUpdateInformation'));
    }
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
        {contractInformation.guardians?.map((guardian, index) => (
        <div key={index}>
          <WorkInformationCard 
            control={control}
            index={index}
            guardianType={guardian.guardian_type_id === 1 ? t('father') : t('mother')}
          />
        </div>
      ))}
      
      <DoctorInformationCard control={control} />
      </form>

      
    </div>
  );
};

export default StepComponentFour;
