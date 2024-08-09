import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

import { exportToPDF } from './billsPdf';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next';
import { Badge } from 'primereact/badge';
import { childrenOptions } from '../bills/utils/utilsAndConstants';

const Bills = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    defaultValues: {
      bills: childrenOptions.map((child, index) => ({
        originalIndex: index, // Add original index
        disabled: true,
        names: child.names,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD
      }))
    }
  });

  const toast = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills'
  });

  const [exportableCount, setExportableCount] = useState(0);

  useEffect(() => {
    recalculateFields();
  }, [fields]);

  const recalculateFields = (newFields = fields) => {
    const count = newFields.filter(bill => (bill.cash && bill.cash > 0) || (bill.check && bill.check > 0)).length;
    setExportableCount(count);
  };

  const onSubmit = (data) => {
    console.log('====================================');
    console.log("data", data);
    console.log('====================================');
    data.bills.forEach((bill, index) => {
      update(index, { ...bill, total: Number(bill.cash) + Number(bill.check) });
    });

    toast.current.show({ severity: 'success', summary: t('bills.saved'), detail: t('bills.savedDetail') });
  };

  const addNewBill = () => {
    append({
      originalIndex: fields.length, // Ensure unique originalIndex
      disabled: false,
      names: '',
      cash: '',
      check: '',
      date: new Date().toISOString().split('T')[0] // Format date to YYYY-MM-DD
    });
  };

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  const calculateSums = () => {
    return fields.reduce((acc, bill) => {
      acc.cash += Number(bill.cash) || 0;
      acc.check += Number(bill.check) || 0;
      acc.total += Number(bill.total) || 0;
      return acc;
    }, { cash: 0, check: 0, total: 0 });
  };

  const sums = calculateSums();

  const filteredFields = fields.filter(field => field.names.toLowerCase().includes(searchTerm.toLowerCase()));

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
        {filteredFields.map((bill, index) => (
          <div key={bill.id} className="child-form">
            <Controller
              name={`bills[${bill.originalIndex}].names`} // Use originalIndex
              control={control}
              rules={{ required: t('bills.namesRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`names-${bill.originalIndex}`} // Use originalIndex
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
            <Controller
              name={`bills[${bill.originalIndex}].cash`} // Use originalIndex
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
            <Controller
              name={`bills[${bill.originalIndex}].check`} // Use originalIndex
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
            <Controller
              name={`bills[${bill.originalIndex}].total`} // Use originalIndex
              control={control}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`total-${bill.originalIndex}`} value={(Number(bill.cash) + Number(bill.check)).toFixed(2)} readOnly className="p-disabled" />
                  <label htmlFor={`total-${bill.originalIndex}`}>{t('bills.total')}</label>
                </span>
              )}
            />
            <Button icon="pi pi-save" className="p-button-success p-button-text" onClick={() => {
              update(bill.originalIndex, { ...getValues(`bills[${bill.originalIndex}]`), total: (Number(bill.cash) + Number(bill.check)).toFixed(2) });
              recalculateFields(getValues('bills'));
            }} />
            <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => remove(bill.originalIndex)} />
          </div>
        ))}
        <div className="child-form">
          <span className="p-float-label">
            <InputText id="cash-total" value={sums.cash.toFixed(2)} readOnly className="p-disabled" />
            <label htmlFor="cash-total">{t('bills.totalCash')}</label>
          </span>
          <span className="p-float-label">
            <InputText id="check-total" value={sums.check.toFixed(2)} readOnly className="p-disabled" />
            <label htmlFor="check-total">{t('bills.totalCheck')}</label>
          </span>
          <span className="p-float-label">
            <InputText id="total-total" value={(sums.cash + sums.check).toFixed(2)} readOnly className="p-disabled" />
            <label htmlFor="total-total">{t('bills.total')}</label>
          </span>
        </div>
        <div className="button-group p-mt-2">
        <Button label={`${t('bills.exportPDF')} (${exportableCount})`} icon="pi pi-file-pdf" onClick={e =>{
          e.preventDefault()
          e.stopPropagation()
           exportToPDF(fields)}} className="p-mr-2 p-button-primary" />
          
          <Button type="button" label={t('bills.addNew')} icon="pi pi-plus" className="p-button-secondary" onClick={addNewBill} />
        </div>
      </form>
    </div>
  );
};

export default Bills;