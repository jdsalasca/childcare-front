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
  const [action, setAction] = useState<string>('');

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

  // Load existing data when action changes or for updates
  useEffect(() => {
    if ((action && date) || (isUpdate && date)) {
      const loadExistingData = async () => {
        try {
          const details = await CashRegisterAPI.getDetails(date);
          if (details.data) {
            const { opening, closing } = details.data;

            // Determine which data to load based on action or status
            let data = null;
            let dataType = '';

            if (action === 'update-opening' && opening) {
              data = opening;
              dataType = 'opening';
            } else if (action === 'update-closing' && closing) {
              data = closing;
              dataType = 'closing';
            } else if (isUpdate) {
              // Fallback for legacy update logic
              if (status === 'opened' && opening) {
                data = opening;
                dataType = 'opening';
              } else if (status === 'closed' && closing) {
                data = closing;
                dataType = 'closing';
              }
            }

            if (data) {
              console.log(`Loading existing ${dataType} data:`, data);

              // Set cashier data
              if (data.cashier) {
                setValue('cashier_id', data.cashier.id);
                const cashierObj = cashiers?.find(
                  c => c.id === data.cashier.id
                );
                setSelectedCashier(cashierObj);
                console.log('Set cashier:', cashierObj);
              }

              // Set bills data
              if (data.details && data.details.length > 0) {
                const billsData = data.details.map((detail: any) => ({
                  bill_type_id: detail.bill_type_id,
                  quantity: detail.quantity,
                }));
                setValue('bills', billsData);
                console.log('Set bills:', billsData);
              }
            } else {
              console.log(
                `No ${dataType || 'existing'} data found for action:`,
                action
              );
              // Allow updates even if no data exists
              if (action === 'update-opening' || action === 'update-closing') {
                console.log('No existing data - allowing fresh update');
              }
            }
          }
        } catch (error) {
          console.error('Error loading existing data:', error);
        }
      };

      loadExistingData();
    }
  }, [action, isUpdate, date, status, cashiers, setValue]);

  // Initialize bills when bill types are loaded and no action is selected
  useEffect(() => {
    if (billTypes && billTypes.length > 0 && fields.length === 0 && !action) {
      const initialBills = billTypes.map((billType: BillType) => ({
        bill_type_id: billType.id,
        quantity: 0,
      }));
      setValue('bills', initialBills);
    }
  }, [billTypes, fields.length, action, setValue]);

  const onSubmit = async (data: CashRegisterFormData) => {
    // Always use the selectedCashier.id directly, don't rely on form data
    const formData = {
      ...data,
      cashier_id: selectedCashier?.id || 0,
    };

    // Validate cashier selection
    if (!formData.cashier_id || formData.cashier_id === 0) {
      console.error('Cashier is required');
      return;
    }

    // Validate that we have at least one bill with quantity > 0
    const hasValidBills = formData.bills.some(bill => bill.quantity > 0);
    if (!hasValidBills) {
      console.error('At least one bill must have quantity > 0');
      return;
    }

    console.log('Submitting form data:', formData);

    try {
      // Use the selected action to determine what to do
      switch (action) {
        case 'open':
          console.log('Opening register for date:', date);
          await createMutation.mutateAsync(formData);
          break;
        case 'close':
          console.log('Closing register for date:', date);
          await createMutation.mutateAsync(formData);
          break;
        case 'update-opening':
          console.log('Updating opening data for date:', date);
          await updateMutation.mutateAsync({
            date,
            data: formData,
            type: 'open',
          });
          break;
        case 'update-closing':
          console.log('Updating closing data for date:', date);
          await updateMutation.mutateAsync({
            date,
            data: formData,
            type: 'close',
          });
          break;
        default:
          console.error('No action selected');
          return;
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCashierChange = (cashierValue: any) => {
    console.log('Cashier change triggered with:', cashierValue);

    let cashierId = 0;
    let selectedCashierObj = null;

    if (cashierValue === null || cashierValue === undefined) {
      // Clear selection
      cashierId = 0;
      selectedCashierObj = null;
    } else if (typeof cashierValue === 'number') {
      // If it's a number, it's the ID
      cashierId = cashierValue;
      selectedCashierObj = cashiers?.find(c => c.id === cashierValue);
    } else if (cashierValue && typeof cashierValue === 'object') {
      // If it's an object, extract the ID
      cashierId = cashierValue.id || 0;
      selectedCashierObj = cashierValue;
    }

    console.log('Setting cashier:', { cashierId, selectedCashierObj });
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

  // Reusable function to load data based on action
  const loadDataForAction = async (actionType: string, date: string) => {
    try {
      const details = await CashRegisterAPI.getDetails(date);
      if (details.data) {
        const { opening, closing } = details.data;

        let data = null;
        if (actionType === 'update-opening' && opening) {
          data = opening;
        } else if (actionType === 'update-closing' && closing) {
          data = closing;
        }

        return data;
      }
    } catch (error) {
      console.error('Error loading data for action:', error);
    }
    return null;
  };

  // Helper function to reset form when action changes
  const resetFormForAction = () => {
    setSelectedCashier(null);
    setValue('cashier_id', 0);
    setValue('bills', []);
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
          {/* Header with Date and Status */}
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200 mb-6'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='p-3 bg-blue-500 rounded-full'>
                  <i className='pi pi-calendar text-white'></i>
                </div>
                <div>
                  <h3 className='text-lg font-bold text-gray-900'>
                    {new Date(date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </h3>
                  <p className='text-sm text-gray-600'>
                    Cash Register Management
                  </p>
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-600 mb-1'>Status</div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status === 'not_started'
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                      : status === 'opened'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {status === 'not_started'
                    ? '⏳ Not Started'
                    : status === 'opened'
                      ? '✅ Opened'
                      : '🔒 Closed'}
                </span>
              </div>
            </div>

            {/* Action Selection */}
            <div className='space-y-3'>
              <h4 className='font-semibold text-gray-800 mb-3'>
                What would you like to do?
              </h4>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
                {status === 'not_started' && (
                  <button
                    onClick={() => {
                      resetFormForAction();
                      setAction('open');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      action === 'open'
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-green-500 rounded-full'>
                        <i className='pi pi-plus text-white'></i>
                      </div>
                      <div className='text-left'>
                        <div className='font-semibold'>Open Register</div>
                        <div className='text-xs text-gray-600'>
                          Start the day with initial cash
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {status === 'opened' && (
                  <>
                    <button
                      onClick={() => {
                        resetFormForAction();
                        setAction('update-opening');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        action === 'update-opening'
                          ? 'border-orange-500 bg-orange-50 text-orange-800'
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-orange-500 rounded-full'>
                          <i className='pi pi-pencil text-white'></i>
                        </div>
                        <div className='text-left'>
                          <div className='font-semibold'>Update Opening</div>
                          <div className='text-xs text-gray-600'>
                            Edit opening cash amounts
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        resetFormForAction();
                        setAction('close');
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        action === 'close'
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <div className='p-2 bg-red-500 rounded-full'>
                          <i className='pi pi-times text-white'></i>
                        </div>
                        <div className='text-left'>
                          <div className='font-semibold'>Close Register</div>
                          <div className='text-xs text-gray-600'>
                            End the day with final cash
                          </div>
                        </div>
                      </div>
                    </button>
                  </>
                )}

                {status === 'closed' && (
                  <button
                    onClick={() => {
                      resetFormForAction();
                      setAction('update-closing');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      action === 'update-closing'
                        ? 'border-orange-500 bg-orange-50 text-orange-800'
                        : 'border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className='flex items-center gap-3'>
                      <div className='p-2 bg-orange-500 rounded-full'>
                        <i className='pi pi-pencil text-white'></i>
                      </div>
                      <div className='text-left'>
                        <div className='font-semibold'>Update Closing</div>
                        <div className='text-xs text-gray-600'>
                          Edit closing cash amounts
                        </div>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Form Title */}
          <h2 className='text-2xl font-bold text-gray-900 mb-3'>
            Cash Register - {new Date(date).toLocaleDateString()}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
          {/* Cashier Selection */}
          {action && (
            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='p-2 bg-blue-100 rounded-full'>
                    <i className='pi pi-user text-blue-600'></i>
                  </div>
                  <div>
                    <label className='block text-sm font-semibold text-gray-700'>
                      Select Cashier
                    </label>
                    <p className='text-xs text-gray-500 mt-1'>
                      Choose who will be responsible for this operation
                    </p>
                  </div>
                </div>
                <Dropdown
                  value={selectedCashier}
                  onChange={e => handleCashierChange(e.value)}
                  options={cashiers}
                  optionLabel='name'
                  placeholder={t('cashRegister.selectCashier')}
                  className={`w-full transition-all duration-200 ${
                    !selectedCashier
                      ? 'p-invalid border-red-300 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
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
          )}

          <Divider className='my-8' />

          {/* Bills Management */}
          {action && (
            <div className='space-y-6'>
              <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2 bg-green-100 rounded-full'>
                      <i className='pi pi-money-bill text-green-600'></i>
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        Cash Bills
                      </h3>
                      <p className='text-xs text-gray-500'>
                        Enter the quantities for each bill denomination
                      </p>
                    </div>
                  </div>
                  <Button
                    type='button'
                    icon='pi pi-plus'
                    label='Add Bill'
                    className='p-button-primary p-button-sm'
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
                        className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'
                      >
                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Bill Type
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
                            placeholder='Select bill type'
                            className='w-full'
                          />
                        </div>

                        <div className='flex-1'>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Quantity
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
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Total
                          </label>
                          <div className='p-2 bg-white rounded border'>
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
                            tooltip='Remove bill'
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {fields.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    <i className='pi pi-money-bill text-4xl mb-2'></i>
                    <p>No bills added yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Total Summary */}
          {action && fields.length > 0 && (
            <div className='bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-green-500 rounded-full'>
                    <i className='pi pi-calculator text-white'></i>
                  </div>
                  <div>
                    <span className='font-semibold text-gray-800'>
                      Total Amount
                    </span>
                    <p className='text-xs text-gray-600'>
                      Sum of all bill denominations
                    </p>
                  </div>
                </div>
                <span className='text-2xl font-bold text-green-600'>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {(createMutation.error || updateMutation.error) && (
            <Message
              severity='error'
              text={
                createMutation.error?.message ||
                updateMutation.error?.message ||
                t('cashRegister.formError')
              }
              className='w-full animate-pulse'
            />
          )}

          {/* Validation Messages */}
          {fields.length > 0 && !fields.some(field => field.quantity > 0) && (
            <Message
              severity='warn'
              text={t('cashRegister.atLeastOneBillRequired')}
              className='w-full'
            />
          )}

          {/* Form Actions */}
          {action ? (
            <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-blue-100 rounded-full'>
                    <i className='pi pi-send text-blue-600'></i>
                  </div>
                  <div>
                    <h4 className='font-semibold text-gray-800'>
                      {action === 'open'
                        ? 'Ready to Open Register'
                        : action === 'close'
                          ? 'Ready to Close Register'
                          : action === 'update-opening'
                            ? 'Ready to Update Opening'
                            : action === 'update-closing'
                              ? 'Ready to Update Closing'
                              : 'Ready to Submit'}
                    </h4>
                    <p className='text-xs text-gray-500'>
                      Review your information and submit
                    </p>
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Button
                    type='button'
                    label='Cancel'
                    className='p-button-text'
                    onClick={() => {
                      setAction('');
                      handleCancel();
                    }}
                    disabled={isSubmitting}
                  />
                  <Button
                    type='submit'
                    label={
                      action === 'open'
                        ? 'Open Register'
                        : action === 'close'
                          ? 'Close Register'
                          : action === 'update-opening'
                            ? 'Update Opening'
                            : action === 'update-closing'
                              ? 'Update Closing'
                              : 'Submit'
                    }
                    loading={isSubmitting}
                    disabled={fields.length === 0 || !selectedCashier}
                    className='p-button-primary'
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center py-12 text-gray-500'>
              <div className='p-4 bg-gray-50 rounded-lg border border-gray-200'>
                <i className='pi pi-arrow-up text-4xl mb-3 text-gray-400'></i>
                <p className='font-medium'>
                  Select an action above to continue
                </p>
                <p className='text-sm mt-1'>
                  Choose what you want to do with this day's register
                </p>
              </div>
            </div>
          )}
        </form>
      </Card>

      <ConfirmDialog />
    </>
  );
};

export default CashRegisterForm;
