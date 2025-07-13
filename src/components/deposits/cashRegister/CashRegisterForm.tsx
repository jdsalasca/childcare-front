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
import { useAuth } from '../../../context/AuthContext';

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
  const { token } = useAuth();
  const [selectedCashier, setSelectedCashier] = useState<any>(null);

  // Form setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
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

  // Watch the cashier_id field for debugging (commented out)
  // const watchedCashierId = watch('cashier_id');
  // console.log('Watched cashier_id:', watchedCashierId);

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
    // Always use the selectedCashier.id directly, don't rely on form data
    const formData = {
      ...data,
      cashier_id: selectedCashier?.id || 0,
    };

    // Validate cashier selection
    if (!formData.cashier_id || formData.cashier_id === 0) {
      console.error(t('cashRegister.cashierRequired'), formData);
      return;
    }

    console.log(t('cashRegister.submittingFormData'), formData);

    try {
      if (isUpdate) {
        const type = status === 'opened' ? 'open' : 'close';
        await updateMutation.mutateAsync({ date, data: formData, type });
      } else {
        await createMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCashierChange = (cashierValue: any) => {
    // The dropdown passes the ID directly (not the object) because of optionValue='id'
    let cashierId = 0;
    let selectedCashierObj = null;

    if (typeof cashierValue === 'number') {
      // If it's a number, it's the ID
      cashierId = cashierValue;
      selectedCashierObj = cashiers?.find(c => c.id === cashierValue);
    } else if (cashierValue && typeof cashierValue === 'object') {
      // If it's an object, extract the ID
      cashierId = cashierValue.id || 0;
      selectedCashierObj = cashierValue;
    }

    setSelectedCashier(selectedCashierObj);
    setValue('cashier_id', cashierId, { shouldValidate: true });
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

  const handleAddBill = () => {
    if (billTypes && billTypes.length > 0) {
      append({
        bill_type_id: billTypes[0].id,
        quantity: 0,
      });
    }
  };

  const isLoading = cashiersLoading || billTypesLoading || isSubmitting;

  if (isLoading) {
    return (
      <Card className='shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50'>
        <div className='flex items-center justify-center py-16'>
          <ProgressSpinner
            style={{ width: '60px', height: '60px' }}
            strokeWidth='4'
            className='text-blue-600'
          />
          <span className='ml-4 text-lg font-medium text-gray-700'>
            {t('cashRegister.loading')}
          </span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className='shadow-lg border-0 bg-white rounded-xl'>
        <div className='mb-8'>
          {/* Enhanced Status and Update Information */}
          <div className='space-y-4 mb-6'>
            {/* Status Badge */}
            <div className='flex items-center gap-3'>
              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  status === 'not_started'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    : status === 'opened'
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {status === 'not_started' &&
                  t('cashRegister.status_not_started')}
                {status === 'opened' && t('cashRegister.status_opened')}
                {status === 'closed' && t('cashRegister.status_closed')}
              </div>
              {isUpdate && (
                <div className='px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200'>
                  {t('common.edit')}
                </div>
              )}
            </div>

            {/* Update Mode Indicator */}
            {isUpdate && (
              <div
                className={`p-4 rounded-lg border-2 ${
                  status === 'opened'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div
                    className={`p-2 rounded-full ${
                      status === 'opened'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    <i
                      className={`pi ${
                        status === 'opened' ? 'pi-pencil' : 'pi-times-circle'
                      }`}
                    ></i>
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-bold text-gray-900 mb-1'>
                      {status === 'opened'
                        ? t('cashRegister.editOpeningData')
                        : t('cashRegister.editClosingData')}
                    </h3>
                    <p className='text-sm text-gray-600 mb-2'>
                      {status === 'opened'
                        ? t('cashRegister.editOpeningDescription')
                        : t('cashRegister.editClosingDescription')}
                    </p>
                    <div className='flex items-center gap-2 text-xs text-gray-500'>
                      <i className='pi pi-calendar'></i>
                      <span>
                        {t('cashRegister.date')}:{' '}
                        {new Date(date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Title */}
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            {isUpdate
              ? status === 'opened'
                ? t('cashRegister.editOpening')
                : t('cashRegister.editClosing')
              : status === 'not_started'
                ? t('cashRegister.openRegister')
                : t('cashRegister.closeRegister')}
          </h2>

          {/* Operation Description for New Operations */}
          {!isUpdate && (
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200 mb-4'>
              <div className='flex items-start gap-3'>
                <div
                  className={`p-2 rounded-full ${
                    status === 'not_started'
                      ? 'bg-yellow-500 text-white'
                      : status === 'opened'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                  }`}
                >
                  <i
                    className={`pi ${
                      status === 'not_started'
                        ? 'pi-plus-circle'
                        : status === 'opened'
                          ? 'pi-check-circle'
                          : 'pi-times-circle'
                    }`}
                  ></i>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    {status === 'not_started' && t('cashRegister.opening')}
                    {status === 'opened' && t('cashRegister.closing')}
                    {status === 'closed' && t('cashRegister.closing')}
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    {t('cashRegister.formDescription')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          {/* Cashier Selection */}
          <div className='space-y-6'>
            <div className='space-y-3'>
              <div className='flex items-center gap-2 mb-3'>
                <div className='p-2 bg-blue-100 rounded-full'>
                  <i className='pi pi-user text-blue-600'></i>
                </div>
                <label className='block text-sm font-semibold text-gray-700'>
                  {isUpdate
                    ? status === 'opened'
                      ? t('cashRegister.editOpeningCashier')
                      : t('cashRegister.editClosingCashier')
                    : t('cashRegister.selectCashier')}
                </label>
                {isUpdate && (
                  <div className='px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium border border-orange-200'>
                    {t('common.edit')}
                  </div>
                )}
              </div>
              <Dropdown
                value={selectedCashier}
                onChange={e => handleCashierChange(e.value)}
                options={cashiers}
                optionLabel='name'
                optionValue='id'
                placeholder={t('cashRegister.selectCashier')}
                className={`w-full transition-all duration-200 ${
                  !selectedCashier
                    ? 'p-invalid border-red-300 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                disabled={isUpdate && status === 'closed'}
                showClear
              />
              {!selectedCashier && (
                <Message
                  severity='error'
                  text={t('cashRegister.cashierRequired')}
                  className='mt-3 animate-pulse'
                />
              )}
              {selectedCashier && (
                <div className='flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                  <i className='pi pi-check-circle text-green-600'></i>
                  <span className='text-sm text-green-800'>
                    {t('cashRegister.cashier')}:{' '}
                    <strong>{selectedCashier.name}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <Divider className='my-8' />

          {/* Bills Management */}
          <div className='space-y-6'>
            <div className='flex items-center justify-between mb-6'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-green-100 rounded-full'>
                  <i className='pi pi-money-bill text-green-600'></i>
                </div>
                <h3 className='text-xl font-bold text-gray-900'>
                  {t('cashRegister.billsManagement')}
                </h3>
              </div>
              <Button
                type='button'
                icon='pi pi-plus'
                label={t('cashRegister.addBill')}
                className='p-button-primary p-button-sm shadow-md hover:shadow-lg transition-all duration-200'
                onClick={handleAddBill}
                disabled={!billTypes || billTypes.length === 0}
              />
            </div>

            <div className='space-y-6'>
              {fields.map((field, index) => {
                const billType = billTypes?.find(
                  bt => bt.id === field.bill_type_id
                );

                return (
                  <div
                    key={field.id}
                    className='flex flex-col lg:flex-row items-stretch lg:items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200'
                  >
                    <div className='flex-1 space-y-3'>
                      <label className='block text-sm font-semibold text-gray-700'>
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
                        className='w-full border-gray-300 focus:border-blue-500 transition-all duration-200'
                      />
                    </div>

                    <div className='flex-1 space-y-3'>
                      <label className='block text-sm font-semibold text-gray-700'>
                        {t('cashRegister.quantity')}
                      </label>
                      <InputNumber
                        value={field.quantity}
                        onValueChange={e =>
                          handleBillQuantityChange(index, e.value || 0)
                        }
                        min={0}
                        className='w-full border-gray-300 focus:border-blue-500 transition-all duration-200'
                        placeholder={t('cashRegister.enterQuantity')}
                      />
                    </div>

                    <div className='flex-1 space-y-3'>
                      <label className='block text-sm font-semibold text-gray-700'>
                        {t('cashRegister.total')}
                      </label>
                      <div className='p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
                        <span className='text-gray-800 font-bold text-lg'>
                          {formatCurrency(
                            (field.quantity || 0) * (billType?.value || 0)
                          )}
                        </span>
                      </div>
                    </div>

                    <div className='flex items-end lg:items-center'>
                      <Button
                        type='button'
                        icon='pi pi-trash'
                        className='p-button-danger p-button-text p-button-sm hover:bg-red-50 transition-all duration-200'
                        onClick={() => remove(index)}
                        tooltip={t('cashRegister.removeBill')}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {fields.length === 0 && (
              <div className='text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300'>
                <i className='pi pi-money-bill text-6xl mb-4 text-gray-400'></i>
                <p className='text-lg font-medium'>
                  {t('cashRegister.noBillsAdded')}
                </p>
                <p className='text-sm mt-2'>
                  {t('cashRegister.addBillsToContinue')}
                </p>
              </div>
            )}
          </div>

          {/* Total Summary */}
          {fields.length > 0 && (
            <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-lg'>
              <div className='flex items-center justify-between'>
                <span className='text-xl font-bold text-gray-900'>
                  {t('cashRegister.totalAmount')}:
                </span>
                <span className='text-3xl font-bold text-blue-600'>
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
              className='w-full animate-pulse'
            />
          )}

          {/* Form Actions */}
          <div className='flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200'>
            <Button
              type='button'
              label={t('common.cancel')}
              className='p-button-text p-button-lg hover:bg-gray-100 transition-all duration-200'
              onClick={handleCancel}
              disabled={isSubmitting}
            />
            <Button
              type='submit'
              label={
                isUpdate
                  ? status === 'opened'
                    ? t('cashRegister.updateOpening')
                    : t('cashRegister.updateClosing')
                  : status === 'not_started'
                    ? t('cashRegister.openRegister')
                    : t('cashRegister.closeRegister')
              }
              icon={
                isUpdate
                  ? 'pi pi-save'
                  : status === 'not_started'
                    ? 'pi pi-plus-circle'
                    : status === 'opened'
                      ? 'pi pi-times-circle'
                      : 'pi pi-check'
              }
              loading={isSubmitting}
              disabled={fields.length === 0 || !selectedCashier}
              className={`p-button-lg shadow-md hover:shadow-lg transition-all duration-200 ${
                isUpdate
                  ? 'p-button-warning'
                  : status === 'not_started'
                    ? 'p-button-success'
                    : status === 'opened'
                      ? 'p-button-danger'
                      : 'p-button-primary'
              }`}
            />
          </div>
        </form>
      </Card>

      <ConfirmDialog />
    </>
  );
};

export default CashRegisterForm;
