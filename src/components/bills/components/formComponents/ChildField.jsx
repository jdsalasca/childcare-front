import classNames from 'classnames'; // Ensure classNames is imported
import { Button } from 'primereact/button'; // Ensure Button is imported from the correct location
import { InputText } from 'primereact/inputtext'; // Ensure InputText is imported from the correct location
import { Tooltip } from 'primereact/tooltip';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';

/**
 * This component renders a child form field for the bills component.
 * @param {Object} props - Props for the component.
 * @param {Object} props.bill - The bill object.
 * @param {number} props.index - The index of the bill in the bills array.
 * @param {Object} props.control - The form control object.
 * @param {Object} props.errors - The form errors object.
 * @param {Function} props.t - The translation function.
 * @param {Function} props.onRecalculateAll - The onRecalculateAll function.
 * @param {Function} props.remove - The remove function.
 * @param {Function} props.getFormErrorMessage - The getFormErrorMessage function.
 * @param {boolean} props.blockContent - Whether the content is blocke
 * @returns {React.Element} The rendered child form field.  
 */
const ChildFormField = ({ bill, index, control, errors, t, onRecalculateAll, remove,getFormErrorMessage, blockContent }) => {
  return (
    <div  id='child-form-alert' className="child-form">
   {blockContent && <Tooltip target={`#child-form-alert`} content={t('bills.blockContent')} position='top' />}
      <Controller
        name={`bills[${index}].names`}
        control={control}
        render={({ field }) => (
          <span className="p-float-label">
            <InputText
              id={`names-${index}`}
              {...field}
              
              disabled={blockContent}
              className={classNames({
                'p-invalid': errors.bills?.[index]?.names,
              })}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
            <label htmlFor={`names-${index}`}>{t('bills.names')}</label>
            {getFormErrorMessage(`bills[${index}].names`)}
          </span>
        )}
      />
      <Controller
        name={`bills[${index}].cash`}
        control={control}
        render={({ field }) => (
          <span id='wrapper-cash' className="p-float-label">
            <InputText
              id={`cash-${index}`}
              {...field}
              disabled={blockContent}
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
            disabled={blockContent}
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
        render={() => (
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

ChildFormField.propTypes = {
  bill: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  onRecalculateAll: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  getFormErrorMessage: PropTypes.func.isRequired,
  blockContent: PropTypes.bool.isRequired,
  toast: PropTypes.object,
};

export default ChildFormField;
