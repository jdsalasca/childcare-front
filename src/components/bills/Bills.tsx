import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import React, { memo, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { programOptions } from '../contracts/utilsAndConstants';
import Loader from '../utils/Loader';
import ChildFormField from './components/formComponents/ChildField';
import { useBillsViewModel } from './viewModels/useBillsViewModel';

// FIXME REVIEW ALERTS ON DATE CHANGE
// FIXME REVIEW UTC DATE CONVERSION TO AVOID THE -5 UTC DIFFERENCE

// Use React.memo to prevent unnecessary re-renders 
const MemoizedChildFormField = memo(ChildFormField);

export const Bills: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    loadingInfo,
    searchTerm,
    setSearchTerm,
    SetSearchedProgram,
    exportableCount,
    toast,
    billTypeFields,
    onDownloadBoxedPdf,
    onDownloadFirstPartPdf,
    onHandlerDateChanged,
    onRecalculateAll,
    safeRemove,
    onSubmit,
    sums,
    filteredBills,
    blockContent,
    addNewBill,
    getValues
  } = useBillsViewModel();

  const { t } = useTranslation(); // Initialize translation hook

  // Memoize the error message functions to prevent unnecessary re-renders
  const getFormErrorMessage = useMemo(() => (name: keyof Bill, index: number) => {
    return errors.bills?.[index]?.[name] && (
      <small className='p-error'>{errors.bills[index][name].message}</small>
    );
  }, [errors.bills]);
  
  const getFormErrorMessageWrapper = useMemo(() => (name: string) => {
    // You can use a default index if necessary
    const defaultIndex = 0; // or any other default value
    return getFormErrorMessage(name as keyof Bill, defaultIndex);
  }, [getFormErrorMessage]);

  // Memoize buttons for performance
  const actionButtons = useMemo(() => (
    <div className='button-group p-mt-2'>
      <Button
        type='submit'
        label={t('bills.save')}
        icon='pi pi-save'
        className='p-mr-2 p-button-primary'
      />
      <Button
        type='button'
        label={t('bills.summaryReport')}
        icon='pi pi-file-pdf'
        className='p-mr-2 p-button-help'
        onClick={onDownloadFirstPartPdf}
      />
      <Button
        type='button'
        label={t('bills.fullReport')}
        icon='pi pi-receipt'
        className='p-mr-2 p-button-warning'
        onClick={onDownloadBoxedPdf}
      />
      <Button
        type='button'
        label={t('bills.addNew')}
        icon='pi pi-plus'
        className='p-button-success'
        onClick={addNewBill}
      />
    </div>
  ), [t, onDownloadFirstPartPdf, onDownloadBoxedPdf, addNewBill]);

  // Memoize the summary section for performance
  const summarySection = useMemo(() => (
    <div className='child-form'>
      {/* <span className='p-float-label'>
        <InputText
          id='cash-on-hand'
          value={getValues('cashOnHand')+""}
          readOnly
          className='p-disabled'
        />
        <label htmlFor='cash-on-hand'>{t('bills.cash_on_hand')}</label>
      </span> */}

      <span className='p-float-label'>
        <InputText
          id='cash-total'
          value={sums.cash.toFixed(2)}
          readOnly
          className='p-disabled'
        />
        <label htmlFor='cash-total'>{t('bills.totalCash')}</label>
      </span>
      <span className='p-float-label'>
        <InputText
          id='check-total'
          value={sums.check.toFixed(2)}
          readOnly
          className='p-disabled'
        />
        <label htmlFor='check-total'>{t('bills.totalCheck')}</label>
      </span>
      <span className='p-float-label'>
        <InputText
          id='total-overall'
          value={(sums.cash + sums.check).toFixed(2)}
          readOnly
          className='p-disabled'
        />
        <label htmlFor='total-overall'>{t('bills.total')}</label>
      </span>
      <span className='p-float-label'>
        <InputText
          id='total-not-cash'
          value={sums.total_cash_on_hand.toFixed(2)}
          readOnly
          className='p-disabled'
        />
        <label htmlFor='total-not-cash'>{t('bills.total_not_cash_on_hand')}</label>
      </span>
    </div>
  ), [getValues, t, sums]);

  return (
    <div className='p-fluid form-container'>
      {loadingInfo.loading && <Loader message={loadingInfo.loadingMessage} />}
      <Toast ref={toast} />
      <ConfirmDialog />
      <div>
        {/* Tooltip component */}
        <Tooltip target=".tooltip-icon" position='left' content={t('bills.registerReport')} />
        <Tooltip target=".tooltip-icon-summary" position='left' content={t('bills.summaryReport')} />

        {/* Icon with tooltip for full report */}
        <i
          className='pi pi-receipt p-overlay-badge tooltip-icon'
          onClick={onDownloadBoxedPdf}
          style={{
            fontSize: '2rem',
            position: 'fixed',
            right: '20px',
            top: '70px',
            zIndex: 999,
            cursor: 'pointer',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <Badge value={exportableCount} severity='info' />
        </i>
        
        {/* Icon with tooltip for summary report */}
        <i
          className='pi pi-file-pdf p-overlay-badge tooltip-icon-summary'
          onClick={onDownloadFirstPartPdf}
          style={{
            fontSize: '2rem',
            position: 'fixed',
            right: '20px',
            top: '130px',
            zIndex: 999,
            cursor: 'pointer',
            backgroundColor: 'white',
            padding: '8px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
          }}
        >
          <Badge value={exportableCount} severity='success' />
        </i>
      </div>
      <div className='p-float-label' style={{ marginBottom: '3rem' }}>
        <InputText
          id='child-browser'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <label htmlFor={`child-browser`}>{t('bills.searchPlaceholder')}</label>
      </div>
      <div className='form-row'>
        <div className='p-field p-col-4'>
          <span className='p-float-label'>
            <Controller
              name='program'
              control={control}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  {...field}
                  showClear
                  onChange={e => {
                    SetSearchedProgram(e.value);
                    field.onChange(e.value);
                  }}
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
          <span className='c-panel-media p-float-label'>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <Calendar
                  id={field.name}
                  value={field.value ? new Date(field.value) : null} // Ensure value is a Date or null
                  onChange={e => {
                    const dateValue = e.value ? new Date(e.value) : null; // Convert to Date
                    field.onChange(dateValue);
                    onHandlerDateChanged(dateValue);
                  }}
                  showIcon
                  dateFormat='mm/dd/yy'
                  mask='99/99/9999'
                  showOnFocus={false}
                  hideOnDateTimeSelect={true}
                />
              )}
            />
            <label htmlFor='date'>{t('date')}</label>
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {filteredBills.map((bill, index) => (
          <MemoizedChildFormField
            key={bill.id || `bill-${index}`}
            bill={bill}
            index={bill.originalIndex}
            blockContent={blockContent}
            control={control}
            errors={errors}
            t={t}
            onRecalculateAll={onRecalculateAll}
            remove={safeRemove}
            getFormErrorMessage={getFormErrorMessageWrapper}
          />
        ))}

        {summarySection}

        {actionButtons}
      </form>
    </div>
  );
}


