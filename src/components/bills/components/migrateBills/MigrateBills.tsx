import { DailyCashRecordsAPI } from '@models/DailyCashRecordsAPI';
import { DateUtilsImpl } from '@utils/dateUtils';
import { Functions } from '@utils/functions';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { ToastInterpreterUtils } from '../../../../components/utils/ToastInterpreterUtils';
import { customLogger } from '../../../../configs/logger';
import CalendarWrapper from '../../../formsComponents/CalendarWrapper';
import InputTextWrapper from '../../../formsComponents/InputTextWrapper';
import { MigrateBillsModels } from '../../models/MigrateBillsModels';

interface MigrateBillsForm {
  initial_day: Date | null; // Allow null
  total_cash_initial_day: number | null; // Allow null
  total_check_initial_day: number | null; // Allow null
  target_day: Date | null; // Allow null
  total_cash_target_day: number | null; // Allow null
  total_check_target_day: number | null; // Allow null
}

const MigrateBills: React.FC = () => {
  const { t } = useTranslation();
  const [validMigration, setValidMigration] = useState<boolean>(false);
  const initialDayRef = useRef<Date | null>(null);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const toast = useRef<Toast>(null);
  const { control, handleSubmit, setValue, reset, watch } =
    useForm<MigrateBillsForm>({
      defaultValues: MigrateBillsModels.initialStateComponent,
    });
  useEffect(() => {
    onLookUpAvailableDatesToPick();
  }, []);

  useEffect(() => {
    const initialDay = watch('initial_day');
    const targetDay = watch('target_day');

    if (initialDay != null && targetDay != null) {
      setValidMigration(true);
    } else {
      setValidMigration(false);
    }
  }, [watch]);
  const onReloadComponent = async () => {
    customLogger.debug('onReloadComponent');
    initialDayRef.current = null;
    reset(MigrateBillsModels.initialStateComponent);
    await onLookUpAvailableDatesToPick();
  };
  const onLookUpAvailableDatesToPick = async () => {
    // Look up available dates to pick
    customLogger.debug('onLookUpAvailableDatesToPick');
    const dates = await DailyCashRecordsAPI.getAllDates();
    if (dates.httpStatus !== 200) {
      ToastInterpreterUtils.toastBackendInterpreter(
        toast,
        dates,
        'error',
        t('errorLookingUpAvailableDates')
      );
    }
    const parsedDates = dates.response?.map((date: string) =>
      DateUtilsImpl.getInstance().convertToUTC(date)
    ); // Convert to Date objects
    setAvailableDates(parsedDates);
  };
  const normalMigration = async (data: MigrateBillsForm) => {
    const total = await DailyCashRecordsAPI.normalMigration(
      Functions.formatDateToYYYYMMDD(data.initial_day!),
      Functions.formatDateToYYYYMMDD(data.target_day!)
    );
    customLogger.debug('normalMigration', total);
  };
  const mergeMigration = async (data: MigrateBillsForm) => {
    const total = await DailyCashRecordsAPI.mergeMigration(
      Functions.formatDateToYYYYMMDD(data.initial_day!),
      Functions.formatDateToYYYYMMDD(data.target_day!)
    );
    customLogger.debug('mergeMigration', total);
  };
  const overwriteMigration = async (data: MigrateBillsForm) => {
    const total = await DailyCashRecordsAPI.overwriteMigration(
      Functions.formatDateToYYYYMMDD(data.initial_day!),
      Functions.formatDateToYYYYMMDD(data.target_day!)
    );
    customLogger.debug('overwriteMigration', total);
  };

  const onSubmit: SubmitHandler<MigrateBillsForm> = async (
    data: MigrateBillsForm
  ) => {
    customLogger.debug('onSubmit', data);
    if (
      data.total_cash_target_day == null &&
      data.total_check_target_day == null &&
      (data.total_cash_initial_day != null ||
        data.total_check_initial_day != null)
    ) {
      await normalMigration(data);
    } else if (
      (data.total_cash_target_day != null &&
        data.total_check_target_day != null &&
        data.total_cash_initial_day != null) ||
      data.total_check_initial_day != null
    ) {
      const result = await Swal.fire({
        title: t('migrationModes'),
        text: `${t('weFoundDataForBothDaysMessage')}`,
        icon: 'info',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#614880',
        denyButtonColor: '#7851a9',
        confirmButtonText: t('mergeDetailsInTargetDay'),
        cancelButtonText: t('overwriteDetailsInTargetDay'),
        denyButtonText: t('cancel'),
      });
      if (result.isConfirmed) {
        await mergeMigration(data);
        ToastInterpreterUtils.toastInterpreter(
          toast,
          'success',
          t('reloaded'),
          t('billsMigratedSuccessfully')
        );
      } else if (result.isDismissed) {
        await overwriteMigration(data);
        ToastInterpreterUtils.toastInterpreter(
          toast,
          'success',
          t('reloaded'),
          t('billsMigratedSuccessfully')
        );
      } else if (result.isDenied) {
        customLogger.debug('Cancelled');
        return;
      }
    }
    onReloadComponent();
  };
  const onChangeInitialDay = async (value: Date) => {
    // Adjust the type as necessary
    if (
      initialDayRef != null &&
      initialDayRef?.current != null &&
      initialDayRef.current.toDateString() === value.toDateString()
    ) {
      return;
    }
    initialDayRef.current = value;
    const dataByDay = await DailyCashRecordsAPI.getAllRecordByDate(
      Functions.formatDateToYYYYMMDD(value)
    );
    if (
      dataByDay.httpStatus === 200 &&
      dataByDay.response != null &&
      dataByDay.response.length > 0 &&
      dataByDay.response[0].total_cash != null
    ) {
      customLogger.debug('dataByDay', dataByDay.response);
      setValue('total_cash_initial_day', dataByDay.response[0].total_cash);
      setValue('total_check_initial_day', dataByDay.response[0].total_check);
    } else {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'success',
        t('notDataForInitialDayTitle'),
        ''
      );
    }
  };

  const onChangeTargetDay = async (value: Date) => {
    // Adjust the type as necessary
    if (
      value == null ||
      (initialDayRef !== null &&
        initialDayRef.current !== null &&
        initialDayRef.current.toDateString() === value.toDateString())
    ) {
      return value;
    }
    const dataByDay = await DailyCashRecordsAPI.getAllRecordByDate(
      Functions.formatDateToYYYYMMDD(value)
    );
    if (
      dataByDay.httpStatus === 200 &&
      dataByDay.response != null &&
      dataByDay.response.length > 0 &&
      dataByDay.response[0].total_cash != null
    ) {
      customLogger.debug('dataByDay', dataByDay.response);
      setValue('total_cash_target_day', dataByDay.response[0].total_cash);
      setValue('total_check_target_day', dataByDay.response[0].total_check);
    } else {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'success',
        t('notDataForTargetDayTitle'),
        t('notDataForTargetDay')
      );
    }
    initialDayRef.current = value;
    customLogger.debug('onChangeTargetDay', value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='c-form-migrate-bills'>
      <Toast ref={toast} />
      <h3>{t('migrateBills')}</h3>
      <div className='c-form-group'>
        <section>
          <CalendarWrapper
            control={control}
            name='initial_day'
            showIcon
            label={t('initialDay')}
            onChangeCustom={onChangeInitialDay}
            availableDates={availableDates}
          />
          <InputTextWrapper
            control={control}
            name='total_cash_initial_day'
            disabled={true}
            // rules={{ required: t('totalCashRequired') }}
            label={t('totalCashInitialDay')}
          />
          <InputTextWrapper
            disabled
            control={control}
            name='total_check_initial_day'
            label={t('totalCheckInitialDay')}
          />
        </section>
        <section>
          <CalendarWrapper
            control={control}
            name='target_day'
            showIcon
            label={t('targetDay')}
            onChangeCustom={onChangeTargetDay}
          />
          <InputTextWrapper
            control={control}
            disabled
            name='total_cash_target_day'
            label={t('totalCashTargetDay')}
          />
          <InputTextWrapper
            control={control}
            disabled
            name='total_check_target_day'
            label={t('totalCheckTargetDay')}
          />
        </section>
      </div>

      <Button
        type='submit'
        label={t('requestMigration')}
        className='p-button-success'
        disabled={!validMigration}
      />
    </form>
  );
};

export { MigrateBills };
