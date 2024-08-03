import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import { Dropdown } from 'primereact/dropdown';
import * as XLSX from 'xlsx';

import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import { exportToPDF } from './billsPdf';
import { formatDateToYYYYMMDD } from '../utilsAndConsts';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next';
import { childrenOptions, defaultChild } from './utils/utilsAndConstants';
import { Badge } from 'primereact/badge';

const Bills = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm({
    defaultValues: {
      bills: childrenOptions.map(child => ({
        disabled:true, 
        names: child.names,
        cash: '',
        check: '',
        date: formatDateToYYYYMMDD(new Date())
      }))
    }
  });
  const toast = useRef(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills'
  });

  const [exportableCount, setExportableCount] = useState(0);

  useEffect(() => {
    recalculateFields()
  }, [fields]);
  const recalculateFields = (newFields = fields) =>{
    const count = newFields.filter(bill =>( bill.cash && bill.cash > 0 ) || (bill.check  && bill.check > 0 )).length;
    setExportableCount(count);
  }

  const onSubmit = (data) => {
    console.log('====================================');
    console.log("data",data);
    console.log('====================================');
    const count = fields.filter(bill => bill.total).length;
    setExportableCount(count);
    data.bills.forEach((bill, index) => {
      update(index, { ...bill, total: Number(bill.cash) + Number(bill.check) });
    });

    toast.current.show({ severity: 'success', summary: t('bills.saved'), detail: t('bills.savedDetail') });
  };

  const addNewBill = () => {
    append(defaultChild);
  };

  const handleFileUpload = (e) => {
    const file = e.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const newBills = jsonData.slice(1).map(row => {
        const [names, cash, check, date] = row;
        if (!names || !cash || !check) {
          return null; // Skip rows with errors
        }
        return { names, cash, check, date: formatDateToYYYYMMDD(date ? new Date(date) : new Date()) };
      }).filter(bill => bill !== null);

      newBills.forEach(bill => append(bill));

      toast.current.show({ severity: 'success', summary: t('bills.imported'), detail: t('bills.importedDetail') });
    };

    reader.readAsArrayBuffer(file);
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

  return (
    <div className="p-fluid form-container">
      <Toast ref={toast} />
      <i className="pi pi-receipt p-overlay-badge" style={{ fontSize: '2rem', position: "fixed", right: "20px",top: "20px" }}>
      <Badge value={exportableCount} severity="info" />
      </i>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((bill, index) => (
          <div key={bill.id} className="child-form">
            <Controller
              name={`bills[${index}].names`}
              control={control}
              rules={{ required: t('bills.namesRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText
                    id={`names-${index}`}
                    {...field}
                    //options={childrenOptions}
                    //optionLabel="names"
                    disabled= {bill.disabled}
                    // placeholder={t('bills.selectChild')}
                    className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].names })}
                    value={field.value} // Ensure Dropdown value is set correctly
                    onChange={(e) => field.onChange(e.value)} // Handle change event
                  />
                  <label htmlFor={`names-${index}`}>{t('bills.names')}</label>
                  {getFormErrorMessage(`bills[${index}].names`)}
                </span>
              )}
            />
            <Controller
              name={`bills[${index}].cash`}
              control={control}
              rules={{ required: t('bills.cashRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`cash-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].cash })} keyfilter="num" onChange={(e) => field.onChange(e)} />
                  <label htmlFor={`cash-${index}`}>{t('bills.cash')}</label>
                  {getFormErrorMessage(`bills[${index}].cash`)}
                </span>
              )}
            />
            <Controller
              name={`bills[${index}].check`}
              control={control}
              rules={{ required: t('bills.checkRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`check-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].check })} keyfilter="num" onChange={(e) => field.onChange(e)} />
                  <label htmlFor={`check-${index}`}>{t('bills.check')}</label>
                  {getFormErrorMessage(`bills[${index}].check`)}
                </span>
              )}
            />
            <Controller
              name={`bills[${index}].total`}
              control={control}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`total-${index}`} value={(Number(bill.cash) + Number(bill.check)).toFixed(2)} readOnly className="p-disabled" />
                  <label htmlFor={`total-${index}`}>{t('bills.total')}</label>
                </span>
              )}
            />
            <Button icon="pi pi-save" className="p-button-success p-button-text" onClick={() => {
              recalculateFields(getValues()?.bills)
              update(index, { ...getValues(`bills[${index}]`), total: (Number(bill.cash) + Number(bill.check)).toFixed(2) })}} />
            <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => remove(index)} />
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
            <InputText id="total-total" value={(sums.cash +sums.check).toFixed(2)} readOnly className="p-disabled" />
            <label htmlFor="total-total">{t('bills.total')}</label>
          </span>
        </div>
        <div className="button-group p-mt-2">
          <Button type="submit"  label={t('bills.save')} icon="pi pi-save" className="p-mr-2 p-button-primary" style={{display:"none"}} />
          <Button type="button" label={t('bills.addNew')} icon="pi pi-plus" onClick={addNewBill} className="p-mr-2 p-button-secondary" />
          <Button label={`${t('bills.exportPDF')} (${exportableCount})`} icon="pi pi-file-pdf" onClick={e =>{
          e.preventDefault()
          e.stopPropagation()
           exportToPDF(fields)}} className="p-mr-2 p-button-primary" />
          <FileUpload mode="basic" name="demo[]" url="./upload" accept=".xlsx" maxFileSize={1000000} onUpload={handleFileUpload} auto className="p-mr-2" style={{display:"none"}} />
          <ExcelFile element={<Button label={t('bills.downloadTemplate')} icon="pi pi-download" className="p-button-primary"  style={{display:"none"}}/>}>
            <ExcelSheet data={[]} name="Bills">
              <ExcelColumn label={t('bills.names')} value="names" />
              <ExcelColumn label={t('bills.cash')} value="cash" />
              <ExcelColumn label={t('bills.check')} value="check" />
            </ExcelSheet>
          </ExcelFile>
        </div>
      </form>
    </div>
  );
};

export default Bills;

