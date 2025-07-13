import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { motion } from 'framer-motion';

// Local constants for now
const billTypes = [
  { id: 1, label: 'Hundred', name: 'Hundred', value: 100 },
  { id: 2, label: 'Fifty', name: 'Fifty', value: 50 },
  { id: 3, label: 'Twenty', name: 'Twenty', value: 20 },
  { id: 4, label: 'Ten', name: 'Ten', value: 10 },
  { id: 5, label: 'Five', name: 'Five', value: 5 },
  { id: 6, label: 'One', name: 'One', value: 1 },
];

const programOptions = [
  { label: 'Infant', value: 'Infant', minWeek: 0, maxWeek: 78 },
  { label: 'Toddler', value: 'Toddler', minWeek: 78, maxWeek: 156 },
  { label: 'Pre-school', value: 'Preschool', minWeek: 156, maxWeek: 234 },
];

const childrenOptions = [
  { id: 1, name: 'Child 1', label: 'Child 1' },
  { id: 2, name: 'Child 2', label: 'Child 2' },
  { id: 3, name: 'Child 3', label: 'Child 3' },
];

interface FormData {
  bills: Array<{
    child: any;
    amount: string;
    value: string;
  }>;
  program: string;
  date: Date;
  time: Date;
  billUpload: Array<{
    billType: any;
    quantity: string;
  }>;
}

const CombinedBillsForm: React.FC = () => {
  const toast = useRef<Toast>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      bills: childrenOptions.map((child: any, index: number) => ({
        child: child.id,
        amount: '',
        value: '',
      })),
      program: '',
      date: new Date(),
      time: new Date(),
      billUpload: billTypes.map((billType: any) => ({
        billType: billType.id,
        quantity: '',
      })),
    },
  });

  const onSubmit = (data: FormData) => {
    try {
      console.log('Form data:', data);
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

  const handleAmountChange = (index: number, value: string) => {
    setValue(`bills.${index}.amount`, value);
  };

  const handleValueChange = (index: number, value: string) => {
    setValue(`bills.${index}.value`, value);
  };

  const handleQuantityChange = (index: number, value: string) => {
    setValue(`billUpload.${index}.quantity`, value);
  };

  const getFormErrorMessage = (name: string) => {
    return (
      errors[name as keyof FormData] && (
        <small className='p-error'>
          {errors[name as keyof FormData]?.message}
        </small>
      )
    );
  };

  return (
    <div className='max-w-4xl mx-auto w-full p-4'>
      <Toast ref={toast} />
      <Card title='Upload Bills' className='mb-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* Children Bills Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              Children Bills
            </h3>
            {childrenOptions.map((child: any, index: number) => (
              <div key={child.id} className='bg-gray-50 rounded-lg p-6 mb-4'>
                <h4 className='text-md font-medium text-gray-700 mb-4'>
                  {child.name}
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Amount
                    </label>
                    <InputText
                      {...register(`bills.${index}.amount` as const)}
                      className='w-full'
                      placeholder='Enter amount'
                      onChange={e => handleAmountChange(index, e.target.value)}
                    />
                    {getFormErrorMessage(`bills.${index}.amount`)}
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Value
                    </label>
                    <InputText
                      {...register(`bills.${index}.value` as const)}
                      className='w-full'
                      placeholder='Enter value'
                      onChange={e => handleValueChange(index, e.target.value)}
                    />
                    {getFormErrorMessage(`bills.${index}.value`)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Program Selection */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Program
            </label>
            <Dropdown
              options={programOptions}
              optionLabel='label'
              optionValue='value'
              placeholder='Select a program'
              className='w-full'
              {...register('program')}
            />
            {getFormErrorMessage('program')}
          </div>

          {/* Date and Time */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Date
              </label>
              <Calendar
                value={watch('date')}
                onChange={e => setValue('date', e.value as Date)}
                className='w-full'
                showIcon
              />
              {getFormErrorMessage('date')}
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Time
              </label>
              <Calendar
                value={watch('time')}
                onChange={e => setValue('time', e.value as Date)}
                className='w-full'
                timeOnly
                showIcon
              />
              {getFormErrorMessage('time')}
            </div>
          </div>

          {/* Bill Upload Section */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Bill Upload</h3>
            {billTypes.map((billType: any, index: number) => (
              <div key={billType.id} className='bg-gray-50 rounded-lg p-6 mb-4'>
                <h4 className='text-md font-medium text-gray-700 mb-4'>
                  {billType.label}
                </h4>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Quantity
                  </label>
                  <InputText
                    {...register(`billUpload.${index}.quantity` as const)}
                    className='w-full'
                    placeholder='Enter quantity'
                    onChange={e => handleQuantityChange(index, e.target.value)}
                  />
                  {getFormErrorMessage(`billUpload.${index}.quantity`)}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className='flex justify-end'>
            <Button
              type='submit'
              label='Upload Bills'
              icon='pi pi-upload'
              className='bg-blue-600 hover:bg-blue-700'
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CombinedBillsForm;
