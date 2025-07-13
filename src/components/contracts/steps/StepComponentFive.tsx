import { Button } from 'primereact/button';
import { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { customLogger } from '../../../configs/logger';
import { ContractDaySchedule } from '../../../models/ApiModels';
import { LoadingInfo } from '../../../models/AppModels';
import useDays from '../../../models/customHooks/useDays';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { ContractService } from '../contractModelView';
import { ContractInfo } from '../types/ContractInfo';

// Create an interface to handle the dynamic fields for check_in and check_out
interface ScheduleFormValues {
  [key: string]: Date; // Dynamically named fields like "monday check_in", "monday check_out", etc.
}

interface StepComponentFiveProps {
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
  toast: any; // Type this appropriately based on your toast implementation
}

export const StepComponentFive: React.FC<StepComponentFiveProps> = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  setLoadingInfo,
  toast,
}) => {
  const { t } = useTranslation();
  const { laboralDays: daysCache } = useDays();

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    reset,
    formState: { errors, isValid },
    getValues,
  } = useForm<ScheduleFormValues>({
    defaultValues: {} as ScheduleFormValues, // Initially empty or predefined
    
  });

  // INITIALIZATION OF THE COMPONENT
  useEffect(() => {
    if (daysCache) {
      if (!contractInformation.schedule || contractInformation.schedule.length === 0) {
        
        const initialValues = daysCache.reduce((acc, day) => {
          const currentDate = new Date();
          const checkInTime = new Date(currentDate.setHours(8, 0, 0, 0));
          const checkOutTime = new Date(currentDate.setHours(17, 0, 0, 0));
          acc[`${day.name.toLowerCase()}check_in`] = checkInTime;
          acc[`${day.name.toLowerCase()}check_out`] = checkOutTime;
          return acc;
        }, {} as ScheduleFormValues);
        reset(initialValues);
      } else {
        customLogger.debug('contractInformation.schedule', contractInformation.schedule);
        customLogger.debug('daysCache', daysCache);
        const formattedSchedule = contractInformation.schedule.reduce((acc, entry) => {
          // Fix: Coerce both IDs to string for comparison to avoid type mismatch bugs
          const day = daysCache.find((day) => String(day.id) === String(entry.day_id));
          if (day) {
            const [checkInHours, checkInMinutes] = entry.check_in.split(':').map(Number);
            const [checkOutHours, checkOutMinutes] = entry.check_out.split(':').map(Number);

            const checkInDate = new Date();
            checkInDate.setHours(checkInHours, checkInMinutes, 0, 0);

            const checkOutDate = new Date();
            checkOutDate.setHours(checkOutHours, checkOutMinutes, 0, 0);

            acc[`${day.name.toLowerCase()}check_in`] = checkInDate;
            acc[`${day.name.toLowerCase()}check_out`] = checkOutDate;
          }
          return acc;
        }, {} as ScheduleFormValues);
        customLogger.debug('formattedSchedule', formattedSchedule);
        reset(formattedSchedule);
      }
    }
  }, [daysCache, contractInformation.schedule, reset]);

  const watchFields = daysCache.reduce((acc, day) => {
    acc.push(`${day.name.toLowerCase()}check_in`, `${day.name.toLowerCase()}check_out`);
    return acc;
  }, [] as string[]);

  const watchValues = watch(watchFields);
  const prevWatchValues = useRef(watchValues);

  const customValidation = () => {
    let formIsValid = true;
    daysCache.forEach((day) => {
      const checkIn = getValues()?.[`${day.name.toLowerCase()}check_in`];
      const checkOut = getValues()?.[`${day.name.toLowerCase()}check_out`];
      if (checkIn && checkOut) {
        const checkInTime = new Date(checkIn);
        const checkOutTime = new Date(checkOut);
        if (checkInTime >= checkOutTime) {
          setError(`${day.name.toLowerCase()}check_out`, {
            type: 'manual',
            message: t('checkOutAfterCheckInMessage'),
          });
          formIsValid = false;
        }else {
          clearErrors(`${day.name.toLowerCase()}check_out`);
        }
      }
    });
    return formIsValid;
  };

  useEffect(() => {
    if (JSON.stringify(prevWatchValues.current) !== JSON.stringify(watchValues)) {
      customValidation();
      prevWatchValues.current = watchValues; // Update ref to current values
    }
  }, [daysCache, getValues, setError, clearErrors, t, watchValues]);

  const onSubmit: SubmitHandler<ScheduleFormValues> = async (data) => {
    if (!await customValidation()) {
      customLogger.error('Form has validation errors:', errors);
      return; // Stop submission if there are errors
    }
    const scheduleData = daysCache.map((day) => {
      const checkInKey = `${day.name.toLowerCase()}check_in`;
      const checkOutKey = `${day.name.toLowerCase()}check_out`;
      let checkIn = data[checkInKey];
      let checkOut = data[checkOutKey];
      // Fallback to default times if missing or invalid
      let checkInStr = '08:00';
      let checkOutStr = '17:00';
      if (checkIn instanceof Date && !isNaN(checkIn.getTime())) {
        checkInStr = checkIn.toTimeString().slice(0, 5);
      }
      if (checkOut instanceof Date && !isNaN(checkOut.getTime())) {
        checkOutStr = checkOut.toTimeString().slice(0, 5);
      }
      return new ContractDaySchedule(
        contractInformation.contract_id || 13,
        String(day.id), // Always pass string for day_id
        checkInStr,
        checkOutStr
      );
    });
    
    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreSavingContract'),
    });
    const days = await ContractService.createContractSchedule(scheduleData);
    setLoadingInfo(LoadingInfo.DEFAULT_MESSAGE);
    const newSchedule = days.map((day) => day.response);
    setContractInformation({ ...contractInformation, schedule: newSchedule });
    ToastInterpreterUtils.toastInterpreter(toast, 'success', t('success'), t('scheduleUpdated'), 3000);
    setActiveIndex(6); // Move to the next step or handle as needed
  };

  return !daysCache ? (
    <div>Loading...</div>
  ) : (
    <div className='form-container schedule'>
      <form className='child-form' onSubmit={handleSubmit(onSubmit)}>
        <div className='form-days'>
          {daysCache.map((day) => (
            <div key={day.id} className='day-schedule'>
              <p className='label-day'>
                {t('schedule')} {t(day.translationLabel)}
              </p>
              <CalendarWrapper
                name={`${day.name.toLowerCase()}check_in`}
                control={control}
                dateFormat='mm/dd/yy'
                timeOnly
                label={`${t(day.translationLabel)} ${t('checkIn')}`}
                spanClassName='p-float-label'
                icon='pi pi-clock'
                showIcon
                rules={{ required: t('checkInMandatoryMessage') }}
              />
              <CalendarWrapper
                name={`${day.name.toLowerCase()}check_out`}
                control={control}
                timeOnly
                label={`${t(day.translationLabel)} ${t('checkOut')}`}
                spanClassName='p-float-label'
                icon='pi pi-clock'
                showIcon
                rules={{ required: t('checkOutMandatoryMessage') }}
              />
            </div>
          ))}
        </div>
        <div className='button-group'>
          <Button
            type='submit'
            disabled={!isValid || Object.keys(errors).length > 0}
            label={t('save')}
            className='p-button-primary p-ml-2'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary p-ml-2'
            onClick={() => setActiveIndex(3)}
          />
        </div>
      </form>
    </div>
  );
};

export default StepComponentFive;
