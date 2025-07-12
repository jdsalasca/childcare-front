import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useEffect, useRef, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { customLogger } from '../../../../configs/logger';
import ChildrenAPI from '../../../../models/ChildrenAPI';
import { billTypes, programOptions } from '../../../contracts/utilsAndConstants';

const BillsUpload = () => {
  const toast = useRef(null);
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      bills: billTypes.map(billType => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0
      })),
      program: '',
      date: new Date(),
      time: new Date()
    }
  });
  const [totalSum, setTotalSum] = useState(0);
  const { fields, update } = useFieldArray({
    control,
    name: 'bills'
  });

  const { t } = useTranslation();

  // Watch bills for changes
  const bills = watch("bills");

  // Fetch children data on component mount
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await ChildrenAPI.getChildren();
        console.log('====================================');
        console.log("response", response);
        console.log('====================================');
        // setChildren(response);
      } catch (err) {
        customLogger.error('Error fetching children:', err);
        // setError(err);
      } finally {
        // setLoading(false);
      }
    };

    fetchChildren();
  }, []);

  // Calculate total sum whenever bills change
  useEffect(() => {
    const sum = bills.reduce((sum, bill) => {
      const amount = parseFloat(bill.amount) || 0;
      const value = parseFloat(bill.value) || 0;
      return sum + (amount * value);
    }, 0);
    setTotalSum(sum);
  }, [bills]);

  const onSubmit = (data) => {
    console.log("Sending information Total:", totalSum);
    if (totalSum <= 0) {
      toast.current?.show({ 
        severity: 'error', 
        summary: t('bills.empty'), 
        detail: t('bills.emptyDetail') 
      });
      return;
    }

    console.log(data);
    // Add your form submission logic here
  };
  
    const handleAmountChange = (index, value) => {
      const amount = parseFloat(value) || 0;
      const billValue = bills[index].value;
      const total = amount * billValue;
  
      update(index, { ...bills[index], amount, total });
  
      const newTotalSum = bills.reduce((sum, bill, idx) => {
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
      <form onSubmit={handleSubmit(onSubmit)} className="form-container" >
      <Toast ref={toast} />

        <div className="p-fluid p-formgrid p-grid">
          <div className="form-row" style={{"paddingRight":"5rem", "paddingLeft": "5rem"}}> 
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
          </div>
  
          <div className="bills-container p-grid">
            {fields.map((bill, index) => (
              <div className="bill-card p-col" key={index}>
                <span className="p-float-label">
                  <Controller
                    name={`bills.${index}.amount`}
                    control={control}
                    render={({ field }) => (
                      <>
                        <div className="p-field p-col-4">
                          <InputText id={`bills.${index}.bill`} value={bill.bill} readOnly />
                        </div>
                        <div className="p-field p-col-4">
                          <InputNumber id={`bills.${index}.amount`} value={field.value} onValueChange={(e) => handleAmountChange(index, e.value)} />
                        </div>
                        <div className="p-field p-col-4">
                          <InputText id={`bills.${index}.total`} value={`$${(bills[index].amount * bills[index].value).toFixed(2)}`} readOnly />
                        </div>
                      </>
                    )}
                  />
                </span>
              </div>
            ))}
          </div>
  
          <div className="total-container">
            <div className="p-field p-col-12">
              <span className="p-float-label">
                <InputText value={`$${totalSum.toFixed(2)}`} readOnly />
                <label htmlFor="totalSum">{t('total')}</label>
              </span>
            </div>
  
            <div className="p-col-12">
              <Button label={t('submit')} className="p-button-primary submit-button" />
            </div>
          </div>
        </div>
      </form>
    );
  };

  export default BillsUpload;