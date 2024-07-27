import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { paymentMethods } from '../utilsAndConsts';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next';

export const StepComponentFour = ({ setActiveIndex, contractInformation, setContractInformation, toast }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, setValue, watch, setError, clearErrors, formState: { errors } } = useForm({
        defaultValues: {
            startDate: contractInformation.startDate || null,
            endDate: contractInformation.endDate || null,
            paymentMethod: contractInformation.paymentMethod || '',
            totalAmount: contractInformation.totalAmount || ''
        }
    });

    const startDate = watch('startDate');
    const endDate = watch('endDate');

    const formatAmount = (amount) => {
        if (!amount) return '';
        return amount.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    useEffect(() => {
        if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
            setError('endDate', {
                type: 'manual',
                message: t('endDateAfterStartDate')
            });
        } else {
            clearErrors('endDate');
        }
    }, [startDate, endDate, setError, clearErrors, t]);

    const onSubmit = (data) => {
        setContractInformation({ ...contractInformation, ...data });
        toast.current.show({ severity: 'success', summary: t('success'), detail: t('termsUpdated') });
        setActiveIndex(4); // Move to the next step or handle as needed
    };

    return (
        <div className="form-container terms">
            <form className='child-form' onSubmit={handleSubmit(onSubmit)}>
                <div className="field">
                    <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => (
                            <span className="p-float-label">
                                <Calendar
                                    id="startDate"
                                    {...field}
                                    dateFormat="yy-mm-dd"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    showIcon
                                    className={classNames({ 'p-invalid': errors.startDate })}
                                />
                                <label htmlFor="startDate">{t('contractStartDate')}</label>
                            </span>
                        )}
                    />
                    {errors.startDate && <small className="p-error">{errors.startDate.message}</small>}
                </div>
                <div className="field">
                    <Controller
                        name="endDate"
                        control={control}
                        render={({ field }) => (
                            <span className="p-float-label">
                                <Calendar
                                    id="endDate"
                                    {...field}
                                    dateFormat="yy-mm-dd"
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.value)}
                                    showIcon
                                    className={classNames({ 'p-invalid': errors.endDate })}
                                />
                                <label htmlFor="endDate">{t('contractEndDate')}</label>
                            </span>
                        )}
                    />
                    {errors.endDate && <small className="p-error">{errors.endDate.message}</small>}
                </div>
                <div className="field p-float-label">
                    <Controller
                        name="paymentMethod"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                {...field}
                                id="paymentMethod"
                                options={paymentMethods}
                                optionLabel="label"
                                style={{ minWidth: "15rem" }}
                                placeholder={t('selectPaymentMethod')}
                            />
                        )}
                    />
                    <label htmlFor="paymentMethod">{t('paymentMethod')}</label>
                </div>
                <div className="field p-float-label">
                    <Controller
                        name="totalAmount"
                        control={control}
                        render={({ field }) => (
                            <InputText
                                {...field}
                                id="totalAmount"
                                type="text"
                                style={{ minWidth: "15rem" }}
                                value={formatAmount(field.value)}
                                onChange={(e) => setValue('totalAmount', e.target.value.replace(/,/g, ''))}
                            />
                        )}
                    />
                    <label htmlFor="totalAmount">{t('totalAmount')}</label>
                </div>
                <div className="button-group">
                    <Button type="submit" label={t('save')} className="p-button-primary rounded-button" />
                    <Button label={t('returnToPreviousStep')} className="p-button-secondary rounded-button" onClick={() => setActiveIndex(2)} />
                    <Button label={t('nextStep')} className="p-button-success rounded-button" onClick={() => setActiveIndex(4)} />
                </div>
            </form>
        </div>
    );
};

export default StepComponentFour;
