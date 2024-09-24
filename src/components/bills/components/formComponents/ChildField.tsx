import { Bill } from '@components/bills/viewModels/useBillsViewModel';
import classNames from 'classnames'; // Ensure classNames is imported
import { Button } from 'primereact/button'; // Ensure Button is imported from the correct location
import { InputText } from 'primereact/inputtext'; // Ensure InputText is imported from the correct location
import { Tooltip } from 'primereact/tooltip';
import { FC } from 'react';
import { Controller } from 'react-hook-form';


// Define the props for the ChildFormField component
interface ChildFormFieldProps {
    bill: Bill;
    index: number;
    control: any; // Replace `any` with the correct type from react-hook-form if possible
    errors: any; // Replace `any` with the correct type if possible
    t: (key: string) => string; // Translation function type
    onRecalculateAll: (index: number, bill: Bill) => void;
    remove: (index: number) => void;
    getFormErrorMessage: (name: string) => React.ReactNode; // Adjust type as needed
    blockContent: boolean;
}

const ChildFormField: FC<ChildFormFieldProps> = ({
    bill,
    index,
    control,
    errors,
    t,
    onRecalculateAll,
    remove,
    getFormErrorMessage,
    blockContent,
}) => {
    return (
        <div id='child-form-alert' className="child-form">
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
                            value={((Number(bill.cash) || 0) + (Number(bill.check) || 0)).toFixed(2)} // Use || 0 to avoid NaN
               
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
