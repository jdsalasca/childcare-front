import React, { useState, useRef, useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; // Import ConfirmDialog

import { exportToPDF } from './billsPdf';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next';
import { Badge } from 'primereact/badge';
import { Calendar } from 'primereact/calendar';
import { billTypes, programOptions } from '../contracts/utilsAndConsts';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import ChildrenAPI from '../../models/childrens';
import { formatDate } from './utils/utilsAndConstants';

const Bills = () => {


  const [childrenOptions, setChildrenOptions] = useState([])
 useEffect(() => {
  const fetchChildren = async () => {
    try {
      const response = await ChildrenAPI.getChildren();
      const students = response.map(child => ({
        ...child,
        childName: child.first_name + " " + child.last_name
      }));
      setChildrenOptions(students);
         // Initialize form values after data is fetched
         reset({
          bills: students.map((child, index) => ({
            id: child.id,
            originalIndex: index,
            disabled: true,
            names: child.childName,
            cash: '',
            check: '',
            date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD
          })),
          billTypes: billTypes.map(billType => ({
            bill: billType.label,
            amount: 0,
            value: billType.value,
            total: 0
          })),
          date: null
        });
      console.log('====================================');
      console.log("response", response);
      console.log('====================================');
      // setChildren(response);
    } catch (err) {
      // setError(err);
    } finally {
      // setLoading(false);
    }
  };

  fetchChildren();
}, []);


  const { t } = useTranslation(); // Initialize translation hook
  const { control, handleSubmit, formState: { errors }, reset, getValues, watch } = useForm({
    defaultValues: {
      bills: childrenOptions.map((child, index) => ({
        originalIndex: index, // Add original index
        disabled: true,
        names: child.names,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD

      })),
      billTypes: billTypes.map(billType => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0
      })),
      date: null
    }
  });

  const toast = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills'
  });

  const { fields: billTypeFields, update: updateBillType } = useFieldArray({
    control,
    name: 'billTypes'
  });

  const [exportableCount, setExportableCount] = useState(0);

  useEffect(() => {
    recalculateFields();
  }, [fields]);



  const recalculateFields = (newFields = fields) => {
    const count = newFields.filter(bill => (bill.cash && bill.cash > 0) || (bill.check && bill.check > 0)).length;
    setExportableCount(count);
  };

  const onSubmit = async (data) => {
    data.bills.forEach((bill, index) => {
      update(index, { ...bill, total: Number(bill.cash) + Number(bill.check) });
    });
    if(data.date == null){
      toast.current.show({ severity: 'info', summary: t('bills.dateRequired'), detail: t('bills.dateRequiredDetails') })
      return;
    }
    

    const response  = await  confirmDialog({
      message: t('bills.confirmExportPDF'),
      header: t('bills.confirmation'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('yes'),
      rejectLabel: t('no'),
      accept: () => exportToPDF(fields),
      reject: () => toast.current.show({ severity: 'success', summary: t('bills.saved'), detail: t('bills.savedDetail') }),
    });
    let  dataFormatted = data;
    dataFormatted=  {
      ...data,
      date : formatDate(data.date),
      bills: data.bills.filter(student => (student.cash != null && student.cash > 0 ) || (student.check != null && student.check > 0 )  )
    }
    console.log('====================================');
    console.log("response", dataFormatted);
    console.log('====================================');
    
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
  const [totalSum, setTotalSum] = useState(0);
  const billTypesController = watch("billTypes");
  useEffect(() => {
    const sum = billTypesController.reduce((sum, bill) => {
      const amount = parseFloat(bill.amount) || 0;
      const value = parseFloat(bill.value) || 0;
      return sum + (amount * value);
    }, 0);
    setTotalSum(sum);
  }, [billTypesController]);

  const filteredFields = fields.filter(field => field.names.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAmountChange = (index, value) => {
    console.log('====================================');
    console.log("handleAmountChange", index, value);
    console.log('====================================');
    const amount = parseFloat(value) || 0;
    const billValue = billTypeFields[index].value;
    const total = amount * billValue;

    updateBillType(index, { ...billTypeFields[index], amount, total });

    const newTotalSum = billTypeFields.reduce((sum, bill, idx) => {
      if (idx === index) {
        return sum + total;
      }
      const billAmount = parseFloat(bill.amount) || 0;
      const billValue = parseFloat(bill.value) || 0;
      return sum + (billAmount * billValue);
    }, 0);
    setTotalSum(newTotalSum);
  };

  return (
    <div className="p-fluid form-container">
      <Toast ref={toast} />
      <ConfirmDialog /> {/* Include ConfirmDialog component */}
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
      <div className="form-row" style={{ "paddingRight": "5rem", "paddingLeft": "5rem" }}>
        {/* <div className="p-field p-col-4">
              <span className="p-float-label">
                <Controller
                  name="program"
                  control={control}
                  rules={{ required: t('program_required') }}
                  render={({ field }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      style={{minWidth:"15rem"}}
                      options={programOptions}
                      placeholder={t('select_program')}
                    />
                  )}
                />
                <label htmlFor="program">{t('program')}</label>
              </span>
              {errors.program && <span className="p-error">{errors.program.message}</span>}
            </div> */}

        <div className="p-field p-col-4">
          <span className="p-float-label">
            <Controller
              name="date"
              // rules={{ required: t('bills.cashRequired') }}

              control={control}
              render={({ field }) => (
                <Calendar id={field.name} {...field} showIcon dateFormat="mm/dd/yy" />
              )}
            />
            <label htmlFor="date">{t('date')}</label>
          </span>
        </div>
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
              // rules={{ required: t('bills.cashRequired') }}
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
              // rules={{ required: t('bills.checkRequired') }}
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
        <div className="bills-container">
  {billTypeFields.map((bill, index) => (
    <div className="bill-card" key={index}>
      <span className="p-float-label">
        <Controller
          name={`billTypes.${index}.amount`}
          control={control}
          render={({ field }) => (
            <div className='row' >
              <div className="p-float-label" style={{maxWidth:"33%"}}>
                <InputText id={`billTypes.${index}.bill`} value={bill.bill} readOnly />
                <label htmlFor={`check-${bill.originalIndex}`}>{t('denominación')}</label>

              </div>
              <div className="p-float-label" style={{maxWidth:"33%"}}>

                <InputNumber id={`billTypes.${index}.amount`} value={field.value} onValueChange={(e) => handleAmountChange(index, e.value)} />
                <label htmlFor={`check-${bill.originalIndex}`}>{t('quantity')}</label>

              </div>
              <div className="p-float-label" style={{maxWidth:"33%"}}>

                <InputText id={`billTypes.${index}.total`} value={`$${(billTypesController[index].amount * billTypesController[index].value).toFixed(2)}`} readOnly />
                <label htmlFor={`check-${bill.originalIndex}`}>{t('total')}</label>
              
              </div>
            </div>
          )}
        />
      </span>
    </div>
  ))}
</div>

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
        <Button type="submit" label={t('bills.save')} icon="pi pi-save" className="p-mr-2 p-button-primary" />
         
          {/* <Button label={`${t('bills.exportPDF')} (${exportableCount})`} icon="pi pi-file-pdf" onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            exportToPDF(fields)
          }} className="p-mr-2 p-button-primary" /> */}

          <Button type="button" label={t('bills.addNew')} icon="pi pi-plus" className="p-button-secondary" onClick={addNewBill} />
        </div>
      </form>
    </div>
  );
};

export default Bills;