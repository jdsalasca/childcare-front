import React, { useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Message } from 'primereact/message';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { OpenRegisterRequest } from '../../../types/cashRegister';
import { useQuery, useMutation } from '@tanstack/react-query';
import { BILL_TYPES, calculateBillTotal } from './constants';

interface Props {
  date: string;
  onSuccess: () => void;
}

const OpenRegisterForm: React.FC<Props> = ({ date, onSuccess }) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OpenRegisterRequest>({
    defaultValues: {
      date,
      cashier_id: undefined,
      bills: [{ bill_type_id: 1, quantity: 0 }],
    },
  });

  // Actualizar la fecha si cambia el prop
  useEffect(() => {
    setValue('date', date);
  }, [date, setValue]);

  // Fetch cajeros
  const { data: cashiersData, isLoading: loadingCashiers } = useQuery({
    queryKey: ['cashiers'],
    queryFn: CashRegisterAPI.getCashiers,
  });

  // Manejo de billetes dinámicos
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bills',
  });

  // Mutación para abrir caja
  const mutation = useMutation({
    mutationFn: (data: OpenRegisterRequest) =>
      CashRegisterAPI.openRegister(data),
    onSuccess,
  });

  const onSubmit = (data: OpenRegisterRequest) => {
    // Filtrar billetes con cantidad > 0 y consolidar duplicados
    const consolidated: Record<number, number> = {};
    data.bills.forEach(bill => {
      const quantity = Number(bill.quantity) || 0;
      if (quantity > 0) {
        consolidated[bill.bill_type_id] =
          (consolidated[bill.bill_type_id] || 0) + quantity;
      }
    });
    data.bills = Object.entries(consolidated).map(
      ([bill_type_id, quantity]) => ({
        bill_type_id: Number(bill_type_id),
        quantity: Number(quantity),
      })
    );
    mutation.mutate(data);
  };

  const watchedBills = watch('bills');

  // Debugging para identificar el problema

  // Ensure watchedBills is always an array with valid values
  const safeBills = Array.isArray(watchedBills)
    ? watchedBills.map(bill => ({
        bill_type_id: Number(bill?.bill_type_id) || 1,
        quantity: Number(bill?.quantity) || 0,
      }))
    : [];

  const totalAmount = calculateBillTotal(safeBills);

  // Debugging del resultado

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Header */}
      <div className='text-center'>
        <h3 className='text-2xl font-bold text-gray-800 mb-2'>
          {t('cashRegister.openRegister')}
        </h3>
        <p className='text-gray-600'>
          {t('cashRegister.date')}: <span className='font-medium'>{date}</span>
        </p>
      </div>

      <Divider />

      {/* Cashier Selection */}
      <div className='space-y-4'>
        <div>
          <label
            htmlFor='cashier-select'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            {t('cashRegister.cashier')} *
          </label>
          <Controller
            name='cashier_id'
            control={control}
            rules={{ required: t('cashRegister.pleaseSelectCashier') }}
            render={({ field }) => (
              <Dropdown
                {...field}
                id='cashier-select'
                options={cashiersData?.data || []}
                optionLabel='name'
                optionValue='id'
                placeholder={t('cashRegister.selectCashier')}
                loading={loadingCashiers}
                className={`w-full ${errors.cashier_id ? 'p-invalid' : ''}`}
              />
            )}
          />
          {errors.cashier_id && (
            <small className='p-error block mt-1'>
              {errors.cashier_id.message}
            </small>
          )}
        </div>
      </div>

      <Divider />

      {/* Bills Section */}
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <label className='block text-sm font-medium text-gray-700'>
            {t('cashRegister.bills')} *
          </label>
          <Button
            type='button'
            icon='pi pi-plus'
            label={t('cashRegister.addBill')}
            className='p-button-text p-button-sm'
            onClick={() => append({ bill_type_id: 1, quantity: 0 })}
          />
        </div>

        <div className='space-y-3'>
          {fields.map((field, idx) => (
            <div
              key={field.id}
              className='flex items-center gap-3 p-4 bg-gray-50 rounded-lg'
            >
              <Controller
                name={`bills.${idx}.bill_type_id`}
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={BILL_TYPES}
                    optionLabel='label'
                    optionValue='id'
                    placeholder={t('cashRegister.selectDenomination')}
                    className='w-32'
                  />
                )}
              />
              <Controller
                name={`bills.${idx}.quantity`}
                control={control}
                rules={{ required: true, min: 0 }}
                render={({ field }) => {
                  // Ensure we always have a valid number value
                  const currentValue =
                    field.value === null ||
                    field.value === undefined ||
                    isNaN(Number(field.value))
                      ? 0
                      : Number(field.value);

                  return (
                    <InputNumber
                      min={0}
                      placeholder={t('cashRegister.enterQuantity')}
                      className='w-32'
                      value={currentValue}
                      onValueChange={e => {
                        // Ensure we always set a valid number
                        const newValue =
                          e.value === null ||
                          e.value === undefined ||
                          isNaN(Number(e.value))
                            ? 0
                            : Number(e.value);
                          original: e.value,
                          processed: newValue,
                        });
                        field.onChange(newValue);
                      }}
                      onBlur={() => {
                        // Double-check on blur to ensure valid value
                        const blurValue =
                          field.value === null ||
                          field.value === undefined ||
                          isNaN(Number(field.value))
                            ? 0
                            : Number(field.value);
                        if (blurValue !== field.value) {
                          field.onChange(blurValue);
                        }
                      }}
                    />
                  );
                }}
              />
              <Button
                type='button'
                icon='pi pi-trash'
                className='p-button-text p-button-danger p-button-sm'
                onClick={() => remove(idx)}
                disabled={fields.length === 1}
                aria-label={t('cashRegister.removeBill')}
              />
            </div>
          ))}
        </div>

        {/* Total Amount */}
        <Card className='bg-blue-50 border-blue-200'>
          <div className='text-center'>
            <p className='text-sm text-gray-600 mb-1'>
              {t('cashRegister.openingAmount')}
            </p>
            <p className='text-2xl font-bold text-blue-800'>
              $
              {isNaN(totalAmount) ||
              totalAmount === null ||
              totalAmount === undefined
                ? '0'
                : totalAmount.toLocaleString()}
            </p>
          </div>
        </Card>
      </div>

      <Divider />

      {/* Submit Button */}
      <div className='flex justify-center'>
        <Button
          type='submit'
          label={t('cashRegister.openRegister')}
          loading={mutation.isPending}
          className='px-8 py-3'
          disabled={mutation.isPending}
        />
      </div>

      {/* Messages */}
      {mutation.isSuccess && (
        <Message
          severity='success'
          text={t('cashRegister.registerOpenedSuccessfully')}
          className='w-full'
        />
      )}
      {mutation.isError && (
        <Message
          severity='error'
          text={
            mutation.error instanceof Error
              ? mutation.error.message
              : t('cashRegister.error')
          }
          className='w-full'
        />
      )}
    </form>
  );
};

export default OpenRegisterForm;
