import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';
import * as XLSX from 'xlsx';

import ExcelSheet from "react-export-excel/dist/ExcelPlugin/elements/ExcelSheet";
import ExcelFile from "react-export-excel/dist/ExcelPlugin/components/ExcelFile";
import ExcelColumn from "react-export-excel/dist/ExcelPlugin/elements/ExcelColumn";
import { exportToPDF } from './billsPdf';
import { formatDateToYYYYMMDD } from '../utilsAndConsts';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next';

const Bills = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      bills: [{
        cash: '100',
        check: '200',
        subtotal: '300',
        received: '150',
        total: '150',
        date: formatDateToYYYYMMDD(new Date())
      }]
    }
  });
  const toast = useRef(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills'
  });

  const [exportableCount, setExportableCount] = useState(0);

  useEffect(() => {
    const count = fields.filter(bill => bill.total).length;
    setExportableCount(count);
  }, [fields]);

  const onSubmit = (data) => {
    data.bills.forEach((bill, index) => {
      update(index, bill);
    });

    toast.current.show({ severity: 'success', summary: t('bills.saved'), detail: t('bills.savedDetail') });
  };

  const addNewBill = () => {
    append({
      cash: '',
      check: '',
      subtotal: '',
      received: '',
      total: '',
      date: formatDateToYYYYMMDD(new Date())
    });
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
        console.log('====================================');
        console.log("row", row);
        console.log('====================================');
        const [cash, check, subtotal, received, total, date] = row;
        if (!cash || !check || !subtotal || !received || !total) {
          return null; // Skip rows with errors
        }
        return { cash, check, subtotal, received, total, date: formatDateToYYYYMMDD(date ? new Date(date) : new Date()) };
      }).filter(bill => bill !== null);

      newBills.forEach(bill => append(bill));

      toast.current.show({ severity: 'success', summary: t('bills.imported'), detail: t('bills.importedDetail') });
    };

    reader.readAsArrayBuffer(file);
  };

  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  return (
    <div className="p-fluid form-container">
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((bill, index) => (
          <div key={bill.id} className="child-form">
            <Controller
              name={`bills[${index}].cash`}
              control={control}
              rules={{ required: t('bills.cashRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`cash-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].cash })} keyfilter="num" />
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
                  <InputText id={`check-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].check })} keyfilter="num" />
                  <label htmlFor={`check-${index}`}>{t('bills.check')}</label>
                  {getFormErrorMessage(`bills[${index}].check`)}
                </span>
              )}
            />
            <Controller
              name={`bills[${index}].subtotal`}
              control={control}
              rules={{ required: t('bills.subtotalRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`subtotal-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].subtotal })} keyfilter="num" />
                  <label htmlFor={`subtotal-${index}`}>{t('bills.subtotal')}</label>
                  {getFormErrorMessage(`bills[${index}].subtotal`)}
                </span>
              )}
            />
            <Controller
              name={`bills[${index}].received`}
              control={control}
              rules={{ required: t('bills.receivedRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`received-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].received })} keyfilter="num" />
                  <label htmlFor={`received-${index}`}>{t('bills.received')}</label>
                  {getFormErrorMessage(`bills[${index}].received`)}
                </span>
              )}
            />
            <Controller
              name={`bills[${index}].total`}
              control={control}
              rules={{ required: t('bills.totalRequired') }}
              render={({ field }) => (
                <span className="p-float-label">
                  <InputText id={`total-${index}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[index] && errors.bills[index].total })} keyfilter="num" />
                  <label htmlFor={`total-${index}`}>{t('bills.total')}</label>
                  {getFormErrorMessage(`bills[${index}].total`)}
                </span>
              )}
            />
            <Button icon="pi pi-trash" className="p-button-danger p-button-text" onClick={() => remove(index)} />
          </div>
        ))}
        <div className="button-group p-mt-2">
          <Button type="submit" label={t('bills.save')} icon="pi pi-save" className="p-mr-2 p-button-primary" />
          <Button type="button" label={t('bills.addNew')} icon="pi pi-plus" onClick={addNewBill} className="p-mr-2 p-button-secondary" />
          <Button label={`${t('bills.exportPDF')} (${exportableCount})`} icon="pi pi-file-pdf" onClick={() => exportToPDF(fields)} className="p-mr-2 p-button-primary" />
          <FileUpload mode="basic" name="demo[]" url="./upload" accept=".xlsx" maxFileSize={1000000} onUpload={handleFileUpload} auto className="p-mr-2" />
          <ExcelFile element={<Button label={t('bills.downloadTemplate')} icon="pi pi-download" className="p-button-primary" />}>
            <ExcelSheet data={[]} name="Bills">
              <ExcelColumn label={t('bills.cash')} value="cash" />
              <ExcelColumn label={t('bills.check')} value="check" />
              <ExcelColumn label={t('bills.subtotal')} value="subtotal" />
              <ExcelColumn label={t('bills.received')} value="received" />
              <ExcelColumn label={t('bills.total')} value="total" />
            </ExcelSheet>
          </ExcelFile>
        </div>
      </form>
    </div>
  );
};

export default Bills;