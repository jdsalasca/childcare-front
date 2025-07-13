import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Divider } from 'primereact/divider';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import BillTypeAPI from '../../../models/BillTypeAPI';
import { formatCurrency } from './constants';

interface BillType {
  id: number;
  label: string;
  value: number;
  currency_id: number;
}

interface CashRegisterFormData {
  date: string;
  cashier_id: number;
  bills: Array<{
    bill_type_id: number;
    quantity: number;
  }>;
}

interface CashRegisterFormProps {
  date: string;
  status: string;
  onSuccess: () => void;
  onCancel: () => void;
  isUpdate: boolean;
}

const CashRegisterForm: React.FC<CashRegisterFormProps> = ({
  date,
  status,
  onSuccess,
  onCancel,
  isUpdate,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedCashier, setSelectedCashier] = useState<any>(null);

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CashRegisterFormData>({
    defaultValues: {
      date,
      cashier_id: 0,
      bills: [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills',
  });

  // Queries
  const { data: cashiers, isLoading: cashiersLoading } = useQuery({
    queryKey: ['cashiers'],
    queryFn: () => CashRegisterAPI.getCashiers(),
    select: data => data.data || [],
  });

  const { data: billTypes, isLoading: billTypesLoading } = useQuery({
    queryKey: ['billTypes', 'USD'],
    queryFn: () => BillTypeAPI.getBillTypesByCurrencyCode('USD'),
    select: data => data || [],
    enabled: !!token, // Only fetch when user is authenticated
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: CashRegisterFormData) => {
      if (status === 'not_started') {
        return CashRegisterAPI.openRegister(data);
      } else {
        return CashRegisterAPI.closeRegister(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashRegisterStatus'] });
      onSuccess();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      date,
      data,
      type,
    }: {
      date: string;
      data: CashRegisterFormData;
      type: 'open' | 'close';
    }) => {
      if (type === 'open') {
        return CashRegisterAPI.updateOpenRegister(date, data);
      } else {
        return CashRegisterAPI.updateCloseRegister(date, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashRegisterStatus'] });
      onSuccess();
    },
  });

  // Load existing data for updates
  useEffect(() => {
    if (isUpdate && date) {
      const loadExistingData = async () => {
        try {
          const details = await CashRegisterAPI.getDetails(date);
          if (details.data) {
            const { opening, closing } = details.data;
            const data = status === 'opened' ? opening : closing;

            if (data) {
              setValue('cashier_id', data.cashier.id);
              setSelectedCashier(cashiers?.find(c => c.id === data.cashier.id));

              if (data.details && data.details.length > 0) {
                setValue(
                  'bills',
                  data.details.map((detail: any) => ({
                    bill_type_id: detail.bill_type_id,
                    quantity: detail.quantity,
                  }))
                );
              }
            }
          }
        } catch (error) {
          console.error('Error loading existing data:', error);
        }
      };

      loadExistingData();
    }
  }, [isUpdate, date, status, cashiers, setValue]);

  // Initialize bills when bill types are loaded
  useEffect(() => {
    if (billTypes && billTypes.length > 0 && fields.length === 0 && !isUpdate) {
      const initialBills = billTypes.map((billType: BillType) => ({
        bill_type_id: billType.id,
        quantity: 0,
      }));
      setValue('bills', initialBills);
    }
  }, [billTypes, fields.length, isUpdate, setValue]);

  const onSubmit = async (data: CashRegisterFormData) => {
    // Validate cashier selection
    if (!data.cashier_id) {
      console.error('Cashier is required');
      return;
    }

    try {
      if (isUpdate) {
        const type = status === 'opened' ? 'open' : 'close';
        await updateMutation.mutateAsync({ date, data, type });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCashierChange = (cashier: any) => {
    setSelectedCashier(cashier);
    setValue('cashier_id', cashier?.id || 0);
  };

  // Add validation for cashier selection
  const validateCashier = (value: number) => {
    if (!value || value === 0) {
      return t('cashRegister.cashierRequired');
    }
    return true;
  };

  const handleBillQuantityChange = (index: number, quantity: number) => {
    update(index, {
      ...fields[index],
      quantity,
    });
  };

  const calculateTotal = () => {
    return fields.reduce((sum, field) => {
      const billType = billTypes?.find(bt => bt.id === field.bill_type_id);
      return sum + (field.quantity || 0) * (billType?.value || 0);
    }, 0);
  };

  const handleCancel = () => {
    if (fields.some(field => field.quantity > 0)) {
      confirmDialog({
        message: t('cashRegister.confirmCancelForm'),
        header: t('cashRegister.confirmCancelFormHeader'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          reset();
          onCancel();
        },
        reject: () => {},
      });
    } else {
      onCancel();
    }
  };

  const isLoading = cashiersLoading || billTypesLoading || isSubmitting;

  if (isLoading) {
    return (
      <Card className='shadow-sm'>
        <div className='flex items-center justify-center py-12'>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <span className='ml-3 text-gray-600'>
            {t('cashRegister.loading')}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className='shadow-sm'>
        <div className='mb-6'>
          <h2 className='text-xl font-semibold text-gray-800 mb-2'>
            {isUpdate
              ? t('cashRegister.editRegister')
              : status === 'not_started'
                ? t('cashRegister.openRegister')
                : t('cashRegister.closeRegister')}
          </h2>
          <p className='text-gray-600'>{t('cashRegister.formDescription')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Cashier Selection */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('cashRegister.selectCashier')}
              </label>
              <Dropdown
                value={selectedCashier}
                onChange={e => handleCashierChange(e.value)}
                options={cashiers}
                optionLabel='name'
                optionValue='id'
                placeholder={t('cashRegister.selectCashier')}
                className={`w-full ${!selectedCashier ? 'p-invalid' : ''}`}
                disabled={isUpdate && status === 'closed'}
                showClear
              />
              {!selectedCashier && (
                <Message
                  severity='error'
                  text={t('cashRegister.cashierRequired')}
                  className='mt-2'
                />
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('cashRegister.date')}
              </label>
              <div className='p-3 bg-gray-50 rounded-lg border'>
                <span className='text-gray-700'>
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          {/* Bills Management */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-lg font-medium text-gray-800'>
                {t('cashRegister.billsManagement')}
              </h3>
              <Button
                type='button'
                icon='pi pi-plus'
                label={t('cashRegister.addBill')}
                className='p-button-sm'
                onClick={() => {
                  if (billTypes && billTypes.length > 0) {
                    append({
                      bill_type_id: billTypes[0].id,
                      quantity: 0,
                    });
                  }
                }}
              />
            </div>

            <div className='space-y-4'>
              {fields.map((field, index) => {
                const billType = billTypes?.find(
                  bt => bt.id === field.bill_type_id
                );

                return (
                  <div
                    key={field.id}
                    className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'
                  >
                    <div className='flex-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        {t('cashRegister.billType')}
                      </label>
                      <Dropdown
                        value={field.bill_type_id}
                        onChange={e => {
                          update(index, {
                            ...field,
                            bill_type_id: e.value,
                          });
                        }}
                        options={billTypes}
                        optionLabel='label'
                        optionValue='id'
                        placeholder={t('cashRegister.selectBillType')}
                        className='w-full'
                      />
                    </div>

                    <div className='flex-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        {t('cashRegister.quantity')}
                      </label>
                      <InputNumber
                        value={field.quantity}
                        onValueChange={e =>
                          handleBillQuantityChange(index, e.value || 0)
                        }
                        min={0}
                        className='w-full'
                        placeholder='0'
                      />
                    </div>

                    <div className='flex-1'>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        {t('cashRegister.total')}
                      </label>
                      <div className='p-3 bg-white rounded border'>
                        <span className='text-gray-700 font-medium'>
                          {formatCurrency(
                            (field.quantity || 0) * (billType?.value || 0)
                          )}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-end'>
                      <Button
                        type='button'
                        icon='pi pi-trash'
                        className='p-button-danger p-button-text p-button-sm'
                        onClick={() => remove(index)}
                        tooltip={t('cashRegister.removeBill')}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {fields.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                <i className='pi pi-money-bill text-4xl mb-2'></i>
                <p>{t('cashRegister.noBillsAdded')}</p>
              </div>
            )}
          </div>

          {/* Total Summary */}
          {fields.length > 0 && (
            <div className='bg-blue-50 p-4 rounded-lg'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-medium text-gray-800'>
                  {t('cashRegister.totalAmount')}:
                </span>
                <span className='text-2xl font-bold text-blue-600'>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(createMutation.error || updateMutation.error) && (
            <Message
              severity='error'
              text={t('cashRegister.formError')}
              className='w-full'
            />
          )}

          {/* Form Actions */}
          <div className='flex justify-end gap-3 pt-6 border-t'>
            <Button
              type='button'
              label={t('common.cancel')}
              className='p-button-text'
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            <Button
              type='submit'
              label={isUpdate ? t('common.update') : t('common.save')}
              icon='pi pi-check'
              loading={isSubmitting}
              disabled={fields.length === 0 || !selectedCashier}
            />
          </div>
        </form>
      </Card>

      <ConfirmDialog />
    </>
  );
};

export default CashRegisterForm;
