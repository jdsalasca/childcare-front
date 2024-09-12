import React from 'react';
import { Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext'; // Ensure InputText is imported from the correct location
import { Button } from 'primereact/button'; // Ensure Button is imported from the correct location
import classNames from 'classnames'; // Ensure classNames is imported

const ChildFormField = ({ bill, index, control, errors, t, onRecalculateAll, remove,getFormErrorMessage }) => {
  return (
    <div className="child-form">
      <Controller
        name={`bills[${index}].names`}
        control={control}
        render={({ field }) => (
          <span className="p-float-label">
            <InputText
              id={`names-${index}`}
              {...field}
              disabled={bill.disabled}
              className={classNames({
                'p-invalid': errors.bills?.[index]?.names,
              })}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
            <label htmlFor={`names-${index}`}>{t('bills.names')}</label>
            {/* Assume `getFormErrorMessage` is available in the parent component */}
            {getFormErrorMessage(`bills[${index}].names`)}
          </span>
        )}
      />
      <Controller
        name={`bills[${index}].cash`}
        control={control}
        render={({ field }) => (
          <span className="p-float-label">
            <InputText
              id={`cash-${index}`}
              {...field}
              className={classNames({
                'p-invalid': errors.bills?.[index]?.cash,
              })}
              keyfilter="num"
              onChange={(e) => {
                field.onChange(e.target.value);
                // Optional: Uncomment and modify the line below if needed
                // onRecalculateAll(index, { ...bill, cash: e.target.value });
              }}
              onBlur={() => onRecalculateAll(index, bill)}
            />
            <label htmlFor={`cash-${index}`}>{t('bills.cash')}</label>
            {getFormErrorMessage(`bills[${index}].cash`)}
          </span>
        )}
      />
      <Controller
        name={`bills[${index}].check`}
        control={control}
        render={({ field }) => (
          <span className="p-float-label">
            <InputText
              id={`check-${index}`}
              {...field}
              className={classNames({
                'p-invalid': errors.bills?.[index]?.check,
              })}
              keyfilter="num"
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={() => onRecalculateAll(index, bill)}
            />
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
            <InputText
              id={`total-${index}`}
              value={(Number(bill.cash) + Number(bill.check)).toFixed(2)}
              readOnly
              className="p-disabled"
            />
            <label htmlFor={`total-${index}`}>{t('bills.total')}</label>
          </span>
        )}
      />
      <Button
        icon="pi pi-trash"
        className="c-button-media p-button-danger p-button-text"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          remove(index);
        }}
      />
    </div>
  );
};

export default ChildFormField;
