import { Bill } from '@components/bills/viewModels/useBillsViewModel';
import classNames from 'classnames'; // Ensure classNames is imported
import { Button } from 'primereact/button'; // Ensure Button is imported from the correct location
import { InputText } from 'primereact/inputtext'; // Ensure InputText is imported from the correct location
import { Tooltip } from 'primereact/tooltip';
import { FC, useCallback, memo, useEffect, useRef, useState } from 'react';
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
    // Refs to track previous values and prevent infinite updates
    const prevBillRef = useRef(bill);
    
    // Ensure bill values are always numbers, not undefined
    const cash = typeof bill.cash === 'number' ? bill.cash : 
                 typeof bill.cash === 'string' && bill.cash !== '' ? parseFloat(bill.cash) : 0;
    const check = typeof bill.check === 'number' ? bill.check : 
                  typeof bill.check === 'string' && bill.check !== '' ? parseFloat(bill.check) : 0;
    
    // Calculate the displayed total (don't use state to avoid re-render cycles)
    const displayTotal = (cash + check).toFixed(2);
    
    // Update total only when necessary to prevent infinite updates
    useEffect(() => {
        // Skip initial render
        if (prevBillRef.current === bill) {
            return;
        }
        
        // Compare cash and check values to see if they changed
        const prevCash = typeof prevBillRef.current.cash === 'number' ? prevBillRef.current.cash : 
                         typeof prevBillRef.current.cash === 'string' && prevBillRef.current.cash !== '' ? 
                         parseFloat(prevBillRef.current.cash) : 0;
        
        const prevCheck = typeof prevBillRef.current.check === 'number' ? prevBillRef.current.check : 
                          typeof prevBillRef.current.check === 'string' && prevBillRef.current.check !== '' ? 
                          parseFloat(prevBillRef.current.check) : 0;
        
        // Only update if cash or check values have changed
        if (cash !== prevCash || check !== prevCheck) {
            // Update our reference
            prevBillRef.current = bill;
            
            // Only update the form if we have a valid bill with ID
            if (bill.id) {
                // Create a new bill object with updated total
                const updatedBill = {
                    ...bill,
                    total: cash + check
                };
                
                // Call the recalculate function with the updated bill
                onRecalculateAll(index, updatedBill);
            }
        }
    }, [bill.cash, bill.check, bill.id, cash, check, index, onRecalculateAll]);
    
    // Memoize the remove handler to prevent re-renders
    const handleRemove = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        remove(index);
    }, [index, remove]);
    
    // Function to convert input value to number or 0 if invalid
    const toNumberOrZero = useCallback((value: string): number => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    }, []);

    // Memoize the blur handler
    const handleBlur = useCallback(() => {
        // Extract values from bill
        const cashValue = typeof bill.cash === 'number' ? bill.cash : 
                         typeof bill.cash === 'string' && bill.cash !== '' ? parseFloat(bill.cash) : 0;
        const checkValue = typeof bill.check === 'number' ? bill.check : 
                          typeof bill.check === 'string' && bill.check !== '' ? parseFloat(bill.check) : 0;
        
        // Create a new bill with the total set
        const updatedBill = {
            ...bill,
            total: cashValue + checkValue
        };
        
        // Only call if we have a valid bill
        if (bill.id) {
            onRecalculateAll(index, updatedBill);
        }
    }, [bill, index, onRecalculateAll]);

    // Handle cash change
    const handleCashChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void) => {
        // Allow empty string during typing, but convert to 0 on blur
        const value = e.target.value === '' ? '' : e.target.value;
        onChange(value);
    }, []);

    return (
        <div id={`child-form-alert-${index}`} className="child-form">
            {blockContent && <Tooltip target={`#child-form-alert-${index}`} 
            content={t('bills.blockContent')} position='top' />}
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
                            value={field.value || ''}
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
                    <span id={`wrapper-cash-${index}`} className="p-float-label">
                        <InputText
                            id={`cash-${index}`}
                            {...field}
                            disabled={blockContent}
                            className={classNames({
                                'p-invalid': errors.bills?.[index]?.cash,
                            })}
                            keyfilter="num"
                            value={field.value !== undefined ? field.value : ''}
                            onChange={(e) => handleCashChange(e, field.onChange)}
                            onBlur={(e) => {
                                // Keep empty values as empty
                                if (e.target.value === '') {
                                    field.onChange('');
                                }
                                handleBlur();
                            }}
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
                            value={field.value !== undefined ? field.value : ''}
                            onChange={(e) => handleCashChange(e, field.onChange)}
                            onBlur={(e) => {
                                // Keep empty values as empty
                                if (e.target.value === '') {
                                    field.onChange('');
                                }
                                handleBlur();
                            }}
                        />
                        <label htmlFor={`check-${index}`}>{t('bills.check')}</label>
                        {getFormErrorMessage(`bills[${index}].check`)}
                    </span>
                )}
            />
            <Controller
                name={`bills[${index}].total`}
                control={control}
                defaultValue={0}
                render={() => (
                    <span className="p-float-label">
                        <InputText
                            id={`total-${index}`}
                            value={displayTotal}
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
                onClick={handleRemove}
                tooltip={t('bills.removeThisBill')}
                tooltipOptions={{ position: 'left' }}
            />
        </div>
    );
};

// Use memo to prevent unnecessary re-renders
export default memo(ChildFormField);
