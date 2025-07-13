import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
//import { exportToPDF } from './billsPdf';
import { billTypes, programOptions } from '../../contracts/utilsAndConsts';
import { childrenOptions } from '../utils/utilsAndConstants';

const CombinedBillsForm = () => {
  const { t } = useTranslation();
  const toast = useRef(null);

  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      bills: childrenOptions.map((child, index) => ({
        originalIndex: index,
        disabled: true,
        names: child.names,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0],
      })),
      program: '',
      date: new Date(),
      time: new Date(),
      billUpload: billTypes.map(billType => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0
      }))
    }
  });

  const { fields: childFields, update: updateChild } = useFieldArray({
    control,
    name: 'bills'
  });

  const { fields: billFields } = useFieldArray({
    control,
    name: 'billUpload'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [exportableCount, setExportableCount] = useState(0);
  const [totalSum, setTotalSum] = useState(0);

  const onSubmit = (data) => {
    if (totalSum <= 0) {
      toast.current.show({ severity: 'error', summary: t('bills.empty'), detail: t('bills.emptyDetail') });
      return;
    }

    data.bills.forEach((bill, index) => {
      updateChild(index, { ...bill, total: Number(bill.cash) + Number(bill.check) });
    });

    // Add the code to send the data to the backend here

    toast.current.show({ severity: 'success', summary: t('bills.saved'), detail: t('bills.savedDetail') });
  };

  const recalculateFields = useCallback((newFields = childFields) => {
    const count = newFields.filter(bill => (bill.cash && bill.cash > 0) || (bill.check && bill.check > 0)).length;
    setExportableCount(count);
  }, [childFields]);

  useEffect(() => {
    recalculateFields();
  }, [recalculateFields]);

  useEffect(() => {
    const sum = billFields.reduce((sum, bill) => {
      const amount = parseFloat(bill.amount) || 0;
      const value = parseFloat(bill.value) || 0;
      return sum + (amount * value);
    }, 0);
    setTotalSum(sum);
  }, [billFields]);

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  const calculateSums = () => {
    
    return childFields.reduce((acc, bill) => {
      acc.cash += Number(bill.cash) || 0;
      acc.check += Number(bill.check) || 0;
      acc.total += Number(bill.total) || 0;
      return acc;
    }, { cash: 0, check: 0, total: 0 });
  };

  const sums = calculateSums();

  const filteredFields = childFields.filter(field => field.names.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-fluid form-container">
      <Toast ref={toast} />

      <i className="pi pi-receipt p-overlay-badge" style={{ fontSize: '2rem', position: "fixed", right: "20px", top: "20px" }}>
        <Badge value={exportableCount} severity="info" />
      </i>

      <div className="p-float-label" style={{ marginBottom: "3rem" }}>
        <InputText
          id="child-browser"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor={`child-browser`}>{t('bills.searchPlaceholder')}</label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-field p-col-4">
          <span className="p-float-label">
            <Controller
              name="program"
              control={control}
              rules={{ required: t('program_required') }}
              render={({ field }) => (
                <Dropdown
                  id={field.name}
                  {...field}
                  style={{ minWidth: "15rem" }}
                  options={programOptions}
                  placeholder={t('select_program')}
                />
              )}
            />
            <label htmlFor="program">{t('program')}</label>
          </span>
          {errors.program && <span className="p-error">{errors.program.message}</span>}
        </div>

        <div className="p-field p-col-4">
          <span className="p-float-label">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Calendar id={field.name} {...field} showIcon dateFormat="mm/dd/yy" />
              )}
            />
            <label htmlFor="date">{t('date')}</label>
          </span>
        </div>

        <div className="p-field p-col-4">
          <span className="p-float-label">
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <Calendar id={field.name} {...field} showTime timeOnly showIcon />
              )}
            />
            <label htmlFor="time">{t('time')}</label>
          </span>
        </div>

        {filteredFields.map((bill) => (
          <div key={bill.id} className="child-form">
            <Controller
              name={`bills[${bill.originalIndex}].names`}
              control={control}
              rules={{ required: t('bills.namesRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`names-${bill.originalIndex}`}
                    {...field}
                    disabled={bill.disabled}
                    className={classNames({ 'p-invalid': errors.bills && errors.bills[bill.originalIndex] && errors.bills[bill.originalIndex].names })}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  <label htmlFor={`names-${bill.originalIndex}`}>{t('bills.names')}</label>
                  {getFormErrorMessage(`bills[${bill.originalIndex}].names`)}
                </span>
              )}
            />
            <div className="p-grid">
              <div className="p-col">
                <Controller
                  name={`bills[${bill.originalIndex}].cash`}
                  control={control}
                  rules={{ required: t('bills.cashRequired') }}
                  render={({ field }) => (
                    <span className="p-float-label">
                      <InputText id={`cash-${bill.originalIndex}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[bill.originalIndex] && errors.bills[bill.originalIndex].cash })} keyfilter="num" onChange={(e) => field.onChange(e.target.value)} />
                      <label htmlFor={`cash-${bill.originalIndex}`}>{t('bills.cash')}</label>
                      {getFormErrorMessage(`bills[${bill.originalIndex}].cash`)}
                    </span>
                  )}
                />
              </div>
              <div className="p-col">
                <Controller
                  name={`bills[${bill.originalIndex}].check`}
                  control={control}
                  rules={{ required: t('bills.checkRequired') }}
                  render={({ field }) => (
                    <span className="p-float-label">
                      <InputText id={`check-${bill.originalIndex}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[bill.originalIndex] && errors.bills[bill.originalIndex].check })} keyfilter="num" onChange={(e) => field.onChange(e.target.value)} />
                      <label htmlFor={`check-${bill.originalIndex}`}>{t('bills.check')}</label>
                      {getFormErrorMessage(`bills[${bill.originalIndex}].check`)}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="p-col-12">
          <div className="p-d-flex p-jc-end">
            <Button type="submit" label={t('bills.submit')} icon="pi pi-check" />
          </div>
        </div>
      </form>

      <div className="p-mt-4">
        <h3>{t('bills.totalSum')}: {totalSum.toFixed(2)}</h3>
        <h3>{t('bills.cashTotal')}: {sums.cash.toFixed(2)}</h3>
        <h3>{t('bills.checkTotal')}: {sums.check.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default CombinedBillsForm;
