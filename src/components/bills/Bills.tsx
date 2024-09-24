import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { programOptions } from '../contracts/utilsAndConstants';
import Loader from '../utils/Loader';
import ChildFormField from './components/formComponents/ChildField';
import { useBillsViewModel } from './viewModels/useBillsViewModel';

// FIXME REVIEW ALERTS ON DATE CHANGE
// FIXME REVIEW UTC DATE CONVERSION TO AVOID THE -5 UTC DIFFERENCE


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
    onHandlerDateChanged,
    onRecalculateAll,
    remove,
    onSubmit,
    sums,
    filteredBills,
    blockContent,
    addNewBill
  } = useBillsViewModel();

  const { t } = useTranslation(); // Initialize translation hook

  const getFormErrorMessage = (name: keyof Bill, index: number) => {
    return errors.bills?.[index]?.[name] && (
      <small className='p-error'>{errors.bills[index][name].message}</small>
    );
  }
  const getFormErrorMessageWrapper = (name: string) => {
    // You can use a default index if necessary
    const defaultIndex = 0; // or any other default value
    return getFormErrorMessage(name as keyof Bill, defaultIndex);
  };
  

  //#region  Component Return
  return (
    <div className='p-fluid form-container'>
      {loadingInfo.loading && <Loader message={loadingInfo.loadingMessage} />}
      <Toast ref={toast} />
      <ConfirmDialog />
      <div>
        {/* Tooltip component */}
        <Tooltip target=".tooltip-icon" position='left' content="Register report" />

        {/* Icon with tooltip */}
        <i
          className='pi pi-receipt p-overlay-badge tooltip-icon'
          onClick={onDownloadBoxedPdf}
          style={{
            fontSize: '2rem',
            position: 'fixed',
            right: '20px',
            top: '20px'
          }}
        >
          <Badge value={exportableCount} severity='info' />
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
          <ChildFormField
            key={bill.id}
            bill={bill}
            index={index}
            blockContent={blockContent}
            control={control}
            errors={errors}
            t={t}
            onRecalculateAll={onRecalculateAll}
            remove={remove}
            getFormErrorMessage={getFormErrorMessageWrapper}
          />
        ))}


        <div className='child-form'>
          <span className='p-float-label'>
            <InputText
              id='cash-total'
              value={sums.cash_on_hand?.toFixed(2) || '0.00'}
              readOnly
              className='p-disabled'
            />
            <label htmlFor='cash-total'>{t('bills.cash_on_hand')}</label>
          </span>

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
              id='total-total'
              value={(sums.cash + sums.check).toFixed(2)}
              readOnly
              className='p-disabled'
            />
            <label htmlFor='total-total'>{t('bills.total')}</label>
          </span>
          <span className='p-float-label'>
            <InputText
              id='total-total'
              value={sums.total_cash_on_hand.toFixed(2)}
              readOnly
              className='p-disabled'
            />
            <label htmlFor='total-total'>{t('bills.total_not_cash_on_hand')}</label>
          </span>
        </div>

        <div className='button-group p-mt-2'>
          <Button
            type='submit'
            label={t('bills.save')}
            icon='pi pi-save'
            className='p-mr-2 p-button-primary'
          />
          <Button
            type='button'
            label={t('bills.addNew')}
            icon='pi pi-plus'
            className='p-button-secondary'
            onClick={addNewBill}
          />
        </div>
      </form>
    </div>
  );
}


