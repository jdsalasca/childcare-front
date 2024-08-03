import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { paymentMethods } from '../utilsAndConsts';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useTranslation } from 'react-i18next'

export const StepComponentFive = ({ setActiveIndex, contractInformation, setContractInformation, toast }) => {
    const { t } = useTranslation();
    const { control, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm({
        defaultValues: {
            schedule: contractInformation.schedule || {
                mondayStart: new Date().setHours(8, 0, 0, 0),
                mondayEnd: new Date().setHours(17, 0, 0, 0),
                tuesdayStart: new Date().setHours(8, 0, 0, 0),
                tuesdayEnd: new Date().setHours(17, 0, 0, 0),
                wednesdayStart: new Date().setHours(8, 0, 0, 0),
                wednesdayEnd: new Date().setHours(17, 0, 0, 0),
                thursdayStart: new Date().setHours(8, 0, 0, 0),
                thursdayEnd: new Date().setHours(17, 0, 0, 0),
                fridayStart: new Date().setHours(8, 0, 0, 0),
                fridayEnd: new Date().setHours(17, 0, 0, 0)
            }
        }
    });

    const schedule = watch('schedule');

    useEffect(() => {
        ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].forEach(day => {
            const start = schedule?.[`${day.toLowerCase()}Start`];
            const end = schedule?.[`${day.toLowerCase()}End`];

            if (start && end) {
                const startTime = new Date(start);
                const endTime = new Date(end);

                if (startTime >= endTime) {
                    setError(`schedule.${day.toLowerCase()}End`, {
                        type: 'manual',
                        message: t('endTimeAfterStartTime')
                    });
                } else if ((endTime - startTime) / (1000 * 60 * 60) > 9) {
                    setError(`schedule.${day.toLowerCase()}End`, {
                        type: 'manual',
                        message: t('hourQuotaExceededMessage')
                    });
                } else {
                    clearErrors(`schedule.${day.toLowerCase()}End`);
                }
            }
        });
    }, [schedule, setError, clearErrors, t]);

    const onSubmit = (data) => {
        const newSchedule = {
            schedule: data.schedule
        };
        setContractInformation({ ...contractInformation, ...newSchedule });
        toast.current.show({ severity: 'success', summary: t('success'), detail: t('scheduleUpdated') });
        setActiveIndex(5); // Move to the next step or handle as needed
    };

    return (
        <>
            <h4 className="form-title">{t('childrenSchedule')}</h4>
            <div className="form-container schedule">
                <form className='child-form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-days'>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                            <div key={day} className="day-schedule">
                                <p className='label-day'>{t("schedule")} {t(day)}</p>
                                <div className="field p-float-label">
                                    <Controller
                                        name={`schedule.${day.toLowerCase()}Start`}
                                        control={control}
                                        rules={{ required: { value: true, message: t('scheduleMandatoryMessage') } }}
                                        render={({ field }) => (
                                            <span className="p-float-label">
                                                <Calendar
                                                    {...field}
                                                    id={`${day.toLowerCase()}Start`}
                                                    timeOnly
                                                    hourFormat="24"
                                                    showIcon
                                                    value={field.value ? new Date(field.value) : null}
                                                    className={classNames({ 'p-invalid': errors?.schedule?.[`${day.toLowerCase()}Start`] })}
                                                />
                                                <label htmlFor={`${day.toLowerCase()}Start`}>{`${t(day)} ${t('start')}`}</label>
                                            </span>
                                        )}
                                    />
                                    {errors?.schedule?.[`${day.toLowerCase()}Start`] && <small className="p-error">{errors.schedule[`${day.toLowerCase()}Start`].message}</small>}
                                </div>
                                <div className="field p-float-label">
                                    <Controller
                                        name={`schedule.${day.toLowerCase()}End`}
                                        control={control}
                                        rules={{ 
                                            required: { value: true, message: t('scheduleMandatoryMessage') },
                                            validate: {
                                                isAfterStart: value => {
                                                    const startTime = new Date(schedule?.[`${day.toLowerCase()}Start`]);
                                                    const endTime = new Date(value);
                                                    return endTime > startTime || t('endTimeAfterStartTime');
                                                },
                                                withinNineHours: value => {
                                                    const startTime = new Date(schedule?.[`${day.toLowerCase()}Start`]);
                                                    const endTime = new Date(value);
                                                    return (endTime - startTime) / (1000 * 60 * 60) <= 9 || t('hourQuotaExceededMessage');
                                                }
                                            }
                                        }}
                                        render={({ field }) => (
                                            <span className="p-float-label">
                                                <Calendar
                                                    {...field}
                                                    id={`${day.toLowerCase()}End`}
                                                    timeOnly
                                                    hourFormat="24"
                                                    showIcon
                                                    value={field.value ? new Date(field.value) : null}
                                                    className={classNames({ 'p-invalid': errors?.schedule?.[`${day.toLowerCase()}End`] })}
                                                />
                                                <label htmlFor={`${day.toLowerCase()}End`}>{`${t(day)} ${t('end')}`}</label>
                                            </span>
                                        )}
                                    />
                                    {errors?.schedule?.[`${day.toLowerCase()}End`] && <small className="p-error">{errors.schedule[`${day.toLowerCase()}End`].message}</small>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="button-group">
                        <Button type="submit" label={t('save')} className="p-button-primary rounded-button" />
                        <Button label={t('returnToPreviousStep')} className="p-button-secondary rounded-button" onClick={() => setActiveIndex(2)} />
                        {/* <Button label={t('nextStep')} className="p-button-success rounded-button" onClick={() => setActiveIndex(4)} /> */}
                    </div>
                </form>
            </div>
        </>
    );
};

export default StepComponentFive;