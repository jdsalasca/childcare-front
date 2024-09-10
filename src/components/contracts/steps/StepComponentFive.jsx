import React, { useEffect } from 'react';
import { useForm} from 'react-hook-form';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next'
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import useDays from '../../../models/customHooks/useDays';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import { ContractService } from '../contractModelView';
import { loadingDefault } from '../../../utils/constants';
/**
 * This component renders the StepComponentFive component which is responsible for handling the schedule information of the contract.
 * @param {Object} props - Component props.
 * @param {number} props.setActiveIndex - Callback function to set the active index of the current step.
 * @param {Object} props.contractInformation - Object containing the contract information.
 * @param {Object} props.setContractInformation - Callback function to set the contract information.
 * @param {Object} props.toast - Toast object from react-toastify.      
 */
export const StepComponentFive = ({ setActiveIndex, contractInformation, setContractInformation,setLoadingInfo, toast }) => {
    const { t } = useTranslation();
    let { laboralDays: daysCache } = useDays();

    const { control, handleSubmit, setError, clearErrors, watch,reset, formState: { errors } } = useForm({defaultValues: contractInformation.schedule});

    const schedule = watch('schedule');

    useEffect(() => {
        if (daysCache) {
            if (!contractInformation.schedule) {
                console.log("Applying default schedule");
                reset(daysCache.reduce((acc, day) => {
                    const currentDate = new Date();
                    const checkInTime = new Date(currentDate.setHours(8, 0, 0, 0));
                    const checkOutTime = new Date(currentDate.setHours(17, 0, 0, 0));
    
                    acc[`${day.name.toLowerCase()}check_in`] = checkInTime;
                    acc[`${day.name.toLowerCase()}check_out`] = checkOutTime;
    
                    return acc;
                }, {}));
            } else {
                console.log("Setting information from contractInformation.schedule", contractInformation.schedule);
                const formattedSchedule = contractInformation.schedule.reduce((acc, entry) => {
                    const day = daysCache.find(day => day.id === entry.day_id);
                    if (day) {
                        const checkInDate = new Date();
                        const [checkInHours, checkInMinutes] = entry.check_in.split(':').map(Number);
                        checkInDate.setHours(checkInHours, checkInMinutes, 0, 0);
    
                        const checkOutDate = new Date();
                        const [checkOutHours, checkOutMinutes] = entry.check_out.split(':').map(Number);
                        checkOutDate.setHours(checkOutHours, checkOutMinutes, 0, 0);
    
                        acc[`${day.name.toLowerCase()}check_in`] = checkInDate;
                        acc[`${day.name.toLowerCase()}check_out`] = checkOutDate;
                    }
                    return acc;
                }, {});
    
                reset(formattedSchedule);
            }
        }
    }, [daysCache, contractInformation.schedule, reset]);
    
    useEffect(() => {
        daysCache.forEach(day => {
            const checkIn = schedule?.[`${day.name.toLowerCase()}check_in`];
            const checkOut = schedule?.[`${day.name.toLowerCase()}check_out`];

            if (checkIn && checkOut) {
                const checkInTime = new Date(checkIn);
                const checkOutTime = new Date(checkOut);

                if (checkInTime >= checkOutTime) {
                    setError(`${day.name.toLowerCase()}check_out`, {
                        type: 'manual',
                        message: t('checkOutAfterCheckInMessage')
                    });
                } else if ((checkOutTime - checkInTime) / (1000 * 60 * 60) > 9) {
                    setError(`${day.name.toLowerCase()}check_out`, {
                        type: 'manual',
                        message: t('hourQuotaExceededMessage')
                    });
                } else {
                    clearErrors(`${day.name.toLowerCase()}check_out`);
                }
            }
        });
    }, [schedule, setError, clearErrors, t, daysCache]);
    //#region onSubmit method
    const onSubmit =async (data) => {
        console.log('data', data)
        const scheduleData = daysCache.map(day => ({
            contract_id: contractInformation.contract_id || 13,
            day_id: day.id,
            check_in: new Date(data[`${day.name.toLowerCase()}check_in`]).toTimeString().slice(0, 5), // format as HH:MM
            check_out: new Date(data[`${day.name.toLowerCase()}check_out`]).toTimeString().slice(0, 5)
        }));

        console.log('Prepared Schedule Data:', scheduleData);
    
        setLoadingInfo({
            loading: true,
            loadingMessage: t('weAreSavingContract')
        });
       const days =  await ContractService.createContractSchedule(scheduleData);
       setLoadingInfo(loadingDefault);
       console.log('backend response', days)
       const newSchedule = days.map(day => day.response)
       console.log('backend response formatted',newSchedule)
       setContractInformation({ ...contractInformation, schedule:newSchedule });
        ToastInterpreterUtils.toastInterpreter(toast,'success',t('success'),t('scheduleUpdated'),3000);
    //#region move to the next step
    setActiveIndex(6); // Move to the next step or handle as needed

    };


    //#region return component
    return (
        !daysCache ? (<div>Loading...</div>) :( <>
            <div className="form-container schedule">
                <form className='child-form' onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-days'>
                        {daysCache.map((day) => (
                            <div key={day.id} className="day-schedule">
                                <p className='label-day'>{t('schedule')} {t(day.translationLabel)}</p>
                                {/* Check-in field */}
                                            <CalendarWrapper
                                                name={`${day.name.toLowerCase()}check_in`}
                                                control={control}
                                                dateFormat="mm/dd/yy"
                                                timeOnly
                                                label={`${t(day.translationLabel)} ${t('checkIn')}`}
                                                spanClassName='p-float-label'
                                                icon='pi pi-clock'
                                                showIcon
                                                disabled={false} // You can set this dynamically if needed
                                                rules={{ required: t('checkInMandatoryMessage') }}  
                                            />
                                {/* Check-out field */}
                                <CalendarWrapper
                                        name={`${day.name.toLowerCase()}check_out`}
                                        control={control}
                                       dateFormat="mm/dd/yy"
                                        timeOnly
                                        label={`${t(day.translationLabel)} ${t('checkOut')}`}
                                        spanClassName='p-float-label'
                                        icon='pi pi-clock'
                                        showIcon
                                        disabled={false} // You can set this dynamically if needed
                                        rules={{ required: t('checkOutMandatoryMessage') }}
                                        />
                            </div>
                        ))}
                    </div>
                    <div className="button-group">
                        <Button type="submit" label={t('save')} className="p-button-primary rounded-button" />
                        <Button label={t('returnToPreviousStep')} className="p-button-secondary rounded-button" onClick={() => setActiveIndex(2)} />
                    </div>
                </form>
            </div>
        </>)
       
    );
};
export default StepComponentFive;
