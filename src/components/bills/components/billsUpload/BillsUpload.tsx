import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { customLogger } from '../../../../configs/logger';
import ChildrenAPI from '../../../../models/ChildrenAPI';
import {
  billTypes,
  programOptions,
} from '../../../contracts/utilsAndConstants';

const BillsUpload = () => {
  const toast = useRef<Toast>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      bills: billTypes.map(billType => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0,
      })),
      program: '',
      date: new Date(),
      time: new Date(),
    },
  });
  const [totalSum, setTotalSum] = useState(0);
  const { fields, update } = useFieldArray({
    control,
    name: 'bills',
  });

  const { t } = useTranslation();

  // Watch bills for changes
  const bills = watch('bills');

  // Fetch children data on component mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await ChildrenAPI.getChildren();

        // setChildren(response);
      } catch (err) {
        customLogger.error('Error fetching children:', err);
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Calculate total sum whenever bills change
  useEffect(() => {
    const sum = bills.reduce((sum, bill) => {
      const amount = parseFloat(String(bill.amount)) || 0;
      const value = parseFloat(String(bill.value)) || 0;
      return sum + amount * value;
    }, 0);
    setTotalSum(sum);
  }, [bills]);

  const handleAmountChange = (index: number, value: number | null) => {
    const amount = value ?? 0;
    setValue(`bills.${index}.amount`, amount);
  };

  const onSubmit = (data: any) => {
    try {

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Bills uploaded successfully',
        life: 3000,
      });
    } catch (error) {
      console.error('Error uploading bills:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to upload bills',
        life: 3000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='form-container'>
      <Toast ref={toast} />

      <div className='p-fluid p-formgrid p-grid'>
        <div
          className='form-row'
          style={{ paddingRight: '5rem', paddingLeft: '5rem' }}
        >
          <div className='p-field p-col-4'>
            <span className='p-float-label'>
              <Controller
                name='program'
                control={control}
                rules={{ required: t('program_required') }}
                render={({ field }) => (
                  <Dropdown
                    id={field.name}
                    {...field}
                    style={{ minWidth: '15rem' }}
                    options={programOptions}
                    placeholder={t('select_program')}
                  />
                )}
              />
              <label htmlFor='program'>{t('program')}</label>
            </span>
            {errors.program && (
              <span className='p-error'>{errors.program.message}</span>
            )}
          </div>

          <div className='p-field p-col-4'>
            <span className='p-float-label'>
              <Controller
                name='date'
                control={control}
                render={({ field }) => (
                  <Calendar
                    id={field.name}
                    {...field}
                    showIcon
                    dateFormat='mm/dd/yy'
                  />
                )}
              />
              <label htmlFor='date'>{t('date')}</label>
            </span>
          </div>

          <div className='p-field p-col-4'>
            <span className='p-float-label'>
              <Controller
                name='time'
                control={control}
                render={({ field }) => (
                  <Calendar
                    id={field.name}
                    {...field}
                    showTime
                    timeOnly
                    showIcon
                  />
                )}
              />
              <label htmlFor='time'>{t('time')}</label>
            </span>
          </div>
        </div>

        <div className='bills-container p-grid'>
          {fields.map((bill, index) => (
            <div className='bill-card p-col' key={index}>
              <span className='p-float-label'>
                <Controller
                  name={`bills.${index}.amount`}
                  control={control}
                  render={({ field }) => (
                    <>
                      <div className='p-field p-col-4'>
                        <InputText
                          id={`bills.${index}.bill`}
                          value={bill.bill}
                          readOnly
                        />
                      </div>
                      <div className='p-field p-col-4'>
                        <InputNumber
                          id={`bills.${index}.amount`}
                          value={field.value}
                          onValueChange={e =>
                            handleAmountChange(index, e.value as number | null)
                          }
                        />
                      </div>
                      <div className='p-field p-col-4'>
                        <InputText
                          id={`bills.${index}.total`}
                          value={`$${(bills[index].amount * bills[index].value).toFixed(2)}`}
                          readOnly
                        />
                      </div>
                    </>
                  )}
                />
              </span>
            </div>
          ))}
        </div>

        <div className='total-container'>
          <div className='p-field p-col-12'>
            <span className='p-float-label'>
              <InputText value={`$${totalSum.toFixed(2)}`} readOnly />
              <label htmlFor='totalSum'>{t('total')}</label>
            </span>
          </div>

          <div className='p-col-12'>
            <Button
              label={t('submit')}
              className='p-button-primary submit-button'
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default BillsUpload;
