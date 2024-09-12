import React from 'react';
import { Controller } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
/**
 * this component renders the bills by nomination
 * 
 */
const BillsByNomination = ({ bill, index, control, handleAmountChange, billTypesController }) => {
  const { t } = useTranslation();

  return (
    <div className="bill-card">
      <span className="p-field">
        <Controller
          name={`billTypes.${index}.billTypeId`}
          control={control}
          render={({ field }) => (
            <p style={{ minWidth: "10rem" }}>
              {t('bill')} {bill.bill}
            </p>
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
            <p style={{ minWidth: "10rem" }}>
              {t('total')} ${((billTypesController[index].amount || 0) * (billTypesController[index].value || 0)).toFixed(2)}
            </p>
          )}
        />
      </span>
    </div>
  );
};



const BillsContainer = ({ billTypeFields, billTypesController, handleAmountChange, show, control }) => {
    
    return (
        <div className="bills-container" style={{ display: show ? 'block' : 'none' }}>
        <h4>Payment Information</h4>
        {billTypeFields.map((bill, index) => (
          <BillsByNomination
            key={bill.id}
            bill={bill}
            index={index}
            control={control}
            handleAmountChange={handleAmountChange}
            billTypesController={billTypesController}
            show={show} // Pass the `show` prop here
          />
        ))}
      </div>
    );
};

  export  {BillsContainer, BillsByNomination};