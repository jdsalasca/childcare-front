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
import { billTypes, formatDateToYYYYMMDD, programOptions } from '../contracts/utilsAndConsts';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import ChildrenAPI, { useChildren } from '../../models/ChildrenAPI';
import { formatDate } from './utils/utilsAndConstants';
import { BillTypeAPI, useBillTypesByCurrencyCode } from '../../models/BillTypeAPI';
import { CashAPI } from '../../models/CashAPI';
import Loader from '../utils/Loader';
import { exportBoxesToPDF } from './utils/boxesPdf';
import { dummyData } from './utils/testDataBoxes';
import { loadingDefault } from '../../utils/constans';


const Bills = () => {
  const { data: currenciesInformation, error, isLoading } = useBillTypesByCurrencyCode("USD");
  const { data: children, error: errorChild, isLoading: loadingChildren } = useChildren();
  const [loadingInfo, setLoadingInfo] = useState(loadingDefault)
  const { t } = useTranslation(); // Initialize translation hook
  const isFetching = useRef(false);
  const toast = useRef(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedProgram, SetSearchedProgram] = useState(null) 
  const [exportableCount, setExportableCount] = useState(0);
  
  const [totalSum, setTotalSum] = useState(0);
  const { control, handleSubmit, formState: { errors }, reset, getValues, watch } = useForm({
    defaultValues: {
      bills: [].map((child, index) => ({
        originalIndex: index, // Add original index
        disabled: true,
        names: child.names,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD,
        classroom: child.classroom

      })),
      billTypes: [].map(billType => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0
      })),
      date: null
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills'
  });

  const { fields: billTypeFields, update: updateBillType } = useFieldArray({
    control,
    name: 'billTypes'
  });

 

  useEffect(() => {
    recalculateFields();
  }, [fields]);
  //#region method to calculate sums
  const calculateSums = () => {
    return fields.reduce((acc, bill) => {
      acc.cash += Number(bill.cash) || 0;
      acc.check += Number(bill.check) || 0;
      acc.total += Number(bill.total) || 0;
      return acc;
    }, { cash: 0, check: 0, total: 0 });
  };
  //#endregion
  const sums = calculateSums();
  const billTypesController = watch("billTypes");
  const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>;
  };

  useEffect(() => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t("weAreLookingForChildrenInformation")
    })
    if (children != null && currenciesInformation != null) {
      onStartForm()
      setLoadingInfo(loadingDefault)
    }
    return () => {
    };
  }, [currenciesInformation, children]);
  const fetchChildren = async () => {
    try {
      const response = children.response
      //const response = await ChildrenAPI.getChildren();
      const students = response?.map(child => ({
        ...child,
        childName: child.first_name + " " + child.last_name
      }));
      return students;
    } catch (err) {
    } finally {

    }
  };

  const onStartForm = async () => {
    const students = await fetchChildren();

    reset({
      bills: students?.map((child, index) => ({
        id: child.id,
        originalIndex: index,
        disabled: true,
        names: child.childName,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD,
        classroom: child.classroom
      })),
      billTypes: currenciesInformation?.response?.map(billType => ({
        bill: billType.label,
        amount: Number(0),
        value: billType.value,
        total: 0,
        id: billType.id,
        billTypeId: billType.id,
      })),
      date: getValues("date")
    });
  }




  const recalculateFields = (newFields = fields) => {
    const count = newFields.filter(bill => (bill.cash && bill.cash > 0) || (bill.check && bill.check > 0)).length;
    setExportableCount(count);
  };

  /**
   * Method to save the day payments information on database
   * @param {*} data 
   */
  const saveInformation = async (data) => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('savingPaymentInfo') + " " + data.date
    })
    const response = await CashAPI.processCashData(data);
    setLoadingInfo(loadingDefault)

    if (response.httpStatus === 200) {
      toast.current.show({ severity: 'success', summary: t('bills.saved'), detail: t('bills.savedDetail') })
    }

  }

  

  /**
   * @description : TODO method to handler amount changed to recalculated fields and also to add the new quantity of 
   *  filled bills.
   * @param {*} index  :: which position have the child on the list of children 
   * @param {*} bill  :: the data inserted by user on the row for that specific children
   * @param {*} data  ::  the defaultValues that saves the children and bills information
   */
  const onRecalculateAll = async (
    index = 0,
    bill = null,  
   
  ) => {
    if(
       bill.id ==null
      || bill.originalIndex ==null
      || index == null

    ){
      console.error("Error on onRecalculateAll usage. You're sending an empty data object ");
      
    }
    const data =  getValues("bills")
    update(bill.originalIndex, { ...getValues(`bills[${bill.originalIndex}]`), total: (Number(bill.cash) + Number(bill.check)).toFixed(2) });

    
    recalculateFields(data)
  }

  const onDownloadBoxedPdf  =() =>{
    const data = getValues();
    if (data.date == null) {
      toast.current.show({ severity: 'info', summary: t('bills.dateRequired'), detail: t('bills.dateRequiredDetails') })
      return;
    }
    recalculateFields(data.bills)
    
    let dataFormatted = {
      ...data,
      date: formatDate(data.date),
      bills: data.bills.filter(student => (student.cash != null && student.cash > 0) || (student.check != null && student.check > 0))
    }
    exportBoxesToPDF(dataFormatted)
    console.log('printing boxes', dataFormatted);
  }
  
  //#region  method to send information
  const onSubmit = async (data) => {
    data.bills.forEach((bill, index) => {
      update(index, { ...bill, total: Number(bill.cash) + Number(bill.check) });
    });
    if (data.date == null) {
      toast.current.show({ severity: 'info', summary: t('bills.dateRequired'), detail: t('bills.dateRequiredDetails') })
      return;
    }
    let dataFormatted = {
      ...data,
      date: formatDate(data.date),
      bills: data.bills.filter(student => (student.cash != null && student.cash > 0) || (student.check != null && student.check > 0))
    }
    //#endregion

    console.log("information", fields, dataFormatted);
    confirmDialog({
      message: t('bills.confirmExportPDF'),
      header: t('bills.confirmation'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('yes'),
      rejectLabel: t('no'),
      accept: () => {
        exportToPDF(fields)
        saveInformation(dataFormatted)
      },
      reject: () => saveInformation(dataFormatted),
    });
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



const onHandlerDateChanged = async (date) => {
  if (isFetching.current) return;

  isFetching.current = true;
  const formattedDate = formatDateToYYYYMMDD(date);
  const formattedDateUSA = formatDate(date);

  try {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('lookingForPaymentInfo', { date: formatDate(getValues("date")) })
    });

    const dayInformation = await CashAPI.getDetailsByDate(formattedDate);

    if (dayInformation?.httpStatus === 200) {
      await onStartForm();

      toast.current.show({
        severity: 'success',
        summary: t('informationFound'),
        detail: t('dataAddedForPickedDay', { date: formattedDateUSA })
      });

      const { daily_cash_details, child_cash_records } = dayInformation.response;

      const updatedChildren = getValues('bills').map(child => {
        const matchedChildRecord = child_cash_records.find(record => record.child_id === child.id);
        return {
          ...child,
          cash: matchedChildRecord?.cash || "",
          check: matchedChildRecord?.check || "",
        };
      });

      const updatedBillTypes = getValues('billTypes').map(billType => {
        const matchedBillDetail = daily_cash_details.find(detail => detail.bill_type_id === billType.billTypeId);
        return {
          ...billType,
          amount: matchedBillDetail?.amount || "",
          total: matchedBillDetail?.total || "",
        };
      });

      reset({
        bills: updatedChildren,
        billTypes: updatedBillTypes,
        date: date,
      });
    } else {
      await onStartForm();

      toast.current.show({
        severity: 'info',
        summary: t('noInformationFound'),
        detail: t('noDataForPickedDay', { date: formattedDateUSA })
      });
    }

    setLoadingInfo(loadingDefault);
  } catch (error) {
    setLoadingInfo(loadingDefault);
  } finally {
    isFetching.current = false; // Reset the flag when done
  }
};


  useEffect(() => {
    const sum = billTypesController?.reduce((sum, bill) => {
      const amount = parseFloat(bill.amount) || 0;
      const value = parseFloat(bill.value) || 0;
      return sum + (amount * value);
    }, 0);
    setTotalSum(sum);
  }, [billTypesController]);


  const handleAmountChange = (index, value) => {

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

//#region return del componente de react
//#region method to filter children

  //#region  method to filter children
  const filteredFields = fields.filter(field => 
    field.names.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (searchedProgram ? field.classroom?.toLowerCase().includes(searchedProgram.toLowerCase()) : true)
  );
  
  //#endregion

//#endregion


//#region  Component Return
  return (
    <div className="p-fluid form-container">
      {loadingInfo.loading && <Loader message={loadingInfo.loadingMessage} />}

      <Toast ref={toast} />
      <ConfirmDialog /> {/* Include ConfirmDialog component */}
      <i className="pi pi-receipt p-overlay-badge"  onClick={onDownloadBoxedPdf}  style={{ fontSize: '2rem', position: "fixed", right: "20px", top: "20px" }}>
        <Badge value={exportableCount} severity="info"/>
      </i>
      <div className="p-float-label" style={{ marginBottom: "3rem" }}>
        <InputText
          id="child-browser"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor={`child-browser`}>{t('bills.searchPlaceholder')}</label>
      </div>
      <div className="form-row" 
      //style={{ "paddingRight": "5rem", "paddingLeft": "5rem" }}
      >
       <div className="p-field p-col-4">
              <span className="p-float-label">
                <Controller
                  name="program"
                  control={control}
                  //  rules={{ required: t('program_required') }}
                  render={({ field }) => (
                    <Dropdown
                      id={field.name}
                      {...field}
                      showClear 
                      onChange={(e) => {
                        SetSearchedProgram(e.value)
                      field.onChange(e.value)
                      }}
                      style={{minWidth:"15rem"}}
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
  <span className="c-panel-media p-float-label">
    <Controller
      name="date"
      control={control}
      render={({ field }) => (
        <Calendar
          id={field.name}
          {...field}
          onChange={e => {
            field.onChange(e.value);
            onHandlerDateChanged(e.value);
          }}
          showIcon
          dateFormat="mm/dd/yy"
          mask="99/99/9999"
          // Disable focus-triggered popup
          showOnFocus={false}
          // Disable the calendar dropdown, only trigger on icon click
          hideOnDateTimeSelect={true}
        />
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
              // rules={{ required: t('bills.namesRequired') }}
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
                  <InputText id={`cash-${bill.originalIndex}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[bill.originalIndex] && errors.bills[bill.originalIndex].cash })} keyfilter="num"
                   onChange={(e) => {
                  //  const updatedBill = {
                  //   ...bill,
                  //   cash: e.target.value

                  //  }
                   field.onChange(e.target.value)
                   // onRecalculateAll(bill.originalIndex, updatedBill)
                   
                  }  }
                  onBlur={()  =>{
                  onRecalculateAll(bill.originalIndex, bill)
                  }}
                   />
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
                  <InputText id={`check-${bill.originalIndex}`} {...field} className={classNames({ 'p-invalid': errors.bills && errors.bills[bill.originalIndex] && errors.bills[bill.originalIndex].check })} keyfilter="num"
                   onChange={(e) => {

                   field.onChange(e.target.value)
                   
                  } }
                  onBlur={()  =>{
                  onRecalculateAll(bill.originalIndex, bill)
                  }}
                    />
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

            <Button icon="pi pi-trash" className="c-button-media p-button-danger p-button-text" onClick={() => remove(bill.originalIndex)} />
          </div>
        ))}
        <div className="bills-container">
          <h4> {t('paymentInformation')} </h4>
          {billTypeFields.map((bill, index) => (
            <div className="bill-card" key={bill.id}>
              <span className="p-field">
                <Controller
                  name={`billTypes.${index}.billTypeId`}
                  control={control}
                  render={({ field }) => (
                    <p style={{ minWidth: "10rem" }}>   bill {t('bill')}      {bill.bill}   </p>
                  )}
                />

              </span>

              <span className="p-float-label">
                <Controller
                  name={`billTypes.${index}.amount`}
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      id={`billTypes.${index}.amount`}
                      value={field.value}
                      onValueChange={(e) => handleAmountChange(index, e.value)}
                    />
                  )}
                />
                <label htmlFor={`billTypes.${index}.amount`}>{t('quantity')}</label>
              </span>

              <span className="p-field">
                <Controller
                  name={`billTypes.${index}.total`}
                  control={control}
                  render={({ field }) => (
                    <p style={{ minWidth: "10rem"}}>  {t('total')}    {`$${(billTypesController[index].amount * billTypesController[index].value).toFixed(2)}`}  </p>

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
          <Button type="button" label={t('bills.addNew')} icon="pi pi-plus" className="p-button-secondary" onClick={addNewBill} />
        </div>
      </form>
    </div>
  );
};

export default Bills;