/* eslint-disable no-unused-vars */
import { Button } from 'primereact/button';
import PropTypes from 'prop-types'; // Import PropTypes
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { customLogger } from '../../../configs/logger';
import useDays from '../../../models/customHooks/useDays';
import { loadingDefault } from '../../../utils/constants';
import CalendarWrapper from '../../formsComponents/CalendarWrapper';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { ContractService } from '../contractModelView';
/**
 * This component renders the StepComponentFive component which is responsible for handling the schedule information of the contract.
 * @param {Object} props - Component props.
 * @param {number} props.setActiveIndex - Callback function to set the active index of the current step.
 * @param {Object} props.contractInformation - Object containing the contract information.
 * @param {Object} props.setContractInformation - Callback function to set the contract information.
 * @param {Object} props.toast - Toast object from react-toastify.
 */

export const StepComponentFive = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  setLoadingInfo,
  toast
}) => {
  const { t } = useTranslation()
  let { laboralDays: daysCache } = useDays()

  const {
    control,
    handleSubmit,
    setError,
    
    clearErrors,
    watch,
    reset,
    formState: { errors,isValid  },
    getValues
  } = useForm({ defaultValues: contractInformation.schedule })
  /**
   * INITIALIZATION OF THE COMPONENT
   */
  //#region  onCreateForm method
  useEffect(() => {
    if (daysCache) {
      if (!contractInformation.schedule) {
        reset(
          daysCache.reduce((acc, day) => {
            const currentDate = new Date()
            const checkInTime = new Date(currentDate.setHours(8, 0, 0, 0))
            const checkOutTime = new Date(currentDate.setHours(17, 0, 0, 0))
            acc[`${day.name.toLowerCase()}check_in`] = checkInTime
            acc[`${day.name.toLowerCase()}check_out`] = checkOutTime
            return acc
          }, {})
        )
      } else {
        const formattedSchedule = contractInformation.schedule.reduce(
          (acc, entry) => {
            const day = daysCache.find(day => day.id === entry.day_id)
            if (day) {
              const checkInDate = new Date()
              const [checkInHours, checkInMinutes] = entry.check_in
                .split(':')
                .map(Number)
              checkInDate.setHours(checkInHours, checkInMinutes, 0, 0)

              const checkOutDate = new Date()
              const [checkOutHours, checkOutMinutes] = entry.check_out
                .split(':')
                .map(Number)
              checkOutDate.setHours(checkOutHours, checkOutMinutes, 0, 0)

              acc[`${day.name.toLowerCase()}check_in`] = checkInDate
              acc[`${day.name.toLowerCase()}check_out`] = checkOutDate
            }
            return acc
          },
          {}
        )
        reset(formattedSchedule)
      }
    }
  }, [daysCache, contractInformation.schedule, reset])
  const watchFields = daysCache.reduce((acc, day) => {
    acc.push(
      `${day.name.toLowerCase()}check_in`,
      `${day.name.toLowerCase()}check_out`
    )
    return acc
  }, [])

  const watchValues = watch(watchFields) // This watches the field values, but we'll handle changes carefully
  const prevWatchValues = useRef(watchValues)
  const customValidation =  () => {
    let formIsValid = true;
    daysCache.forEach(day => {
        const checkIn = getValues()?.[`${day.name.toLowerCase()}check_in`]
        const checkOut = getValues()?.[`${day.name.toLowerCase()}check_out`]
        if (checkIn && checkOut) {
          const checkInTime = new Date(checkIn)
          const checkOutTime = new Date(checkOut)
          if (checkInTime >= checkOutTime) {
            setError(`${day.name.toLowerCase()}check_out`, {
              type: 'required',
              message: t('checkOutAfterCheckInMessage')
            })
            return formIsValid = false;
          } else if ((checkOutTime - checkInTime) / (1000 * 60 * 60) > 9) {
            setError(`${day.name.toLowerCase()}check_out`, {
              type: 'required',
              message: t('hourQuotaExceededMessage')
            })
            return formIsValid = false;
          } else {
            clearErrors(`${day.name.toLowerCase()}check_out`)
          }
        }
      })  
      return formIsValid;
}

  useEffect(() => {
    // Avoid triggering the effect if the values haven't actually changed
    if (
      JSON.stringify(prevWatchValues.current) !== JSON.stringify(watchValues)
    ) {
        customValidation() 
      prevWatchValues.current = watchValues // Update ref to current values
     
    }
  }, [daysCache, getValues, setError, clearErrors, t, watchValues])
  
  //#region onSubmit method
  const onSubmit = async data => {
    if (!await customValidation()) {
        customLogger.error('Form has validation errors:', errors);
        return; // Stop submission if there are errors
      }
    const scheduleData = daysCache.map(day => ({
      contract_id: contractInformation.contract_id || 13,
      day_id: day.id,
      check_in: new Date(data[`${day.name.toLowerCase()}check_in`])
        .toTimeString()
        .slice(0, 5), // format as HH:MM
      check_out: new Date(data[`${day.name.toLowerCase()}check_out`])
        .toTimeString()
        .slice(0, 5)
    }))
    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreSavingContract')
    })
    const days = await ContractService.createContractSchedule(scheduleData)
    setLoadingInfo(loadingDefault)
    const newSchedule = days.map(day => day.response)
    setContractInformation({ ...contractInformation, schedule: newSchedule })
    ToastInterpreterUtils.toastInterpreter(
      toast,
      'success',
      t('success'),
      t('scheduleUpdated'),
      3000
    )
    //#region move to the next step
    setActiveIndex(6) // Move to the next step or handle as needed
  }
  //#region return component
  return !daysCache ? (
    <div>Loading...</div>
  ) : (
    <>
      <div className='form-container schedule'>
        <form className='child-form' onSubmit={handleSubmit(onSubmit)}>
          <div className='form-days'>
            {daysCache.map(day => (
              <div key={day.id} className='day-schedule'>
                <p className='label-day'>
                  {t('schedule')} {t(day.translationLabel)}
                </p>
                {/* Check-in field */}
                <CalendarWrapper
                  name={`${day.name.toLowerCase()}check_in`}
                  control={control}
                  dateFormat='mm/dd/yy'
                  timeOnly
                  label={`${t(day.translationLabel)} ${t('checkIn')}`}
                  spanClassName='p-float-label'
                  icon='pi pi-clock'
                  showIcon
                  rules={{ required: t('checkInMandatoryMessage') }}
                />
                {/* Check-out field */}
                <CalendarWrapper
                  name={`${day.name.toLowerCase()}check_out`}
                  control={control}
                  timeOnly
                  label={`${t(day.translationLabel)} ${t('checkOut')}`}
                  spanClassName='p-float-label'
                  icon='pi pi-clock'
                  showIcon
                  rules={{ required: t('checkOutMandatoryMessage') }}
                />
              </div>
            ))}
          </div>
          <div className='button-group'>
            <Button
              type='submit'
              disabled={!isValid || Object.keys(errors).length > 0} // Disable if there are errors
      
              label={t('save')}
              className='p-button-primary p-ml-2'
            />
            <Button
              label={t('returnToPreviousStep')}
              className='p-button-secondary p-ml-2'
              onClick={() => setActiveIndex(3)}
            />
          </div>
        </form>
      </div>
    </>
  )
}

// Prop type validation
StepComponentFive.propTypes = {
  setActiveIndex: PropTypes.func.isRequired, // Function to set active index
  contractInformation: PropTypes.shape({
    // Object containing contract information
    contract_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    start_date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    end_date: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    payment_method_id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    schedule: PropTypes.object,
    total_to_pay: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  }).isRequired,
  setLoadingInfo: PropTypes.func.isRequired, // Function to set loading state and message
  setContractInformation: PropTypes.func.isRequired, // Function to set contract information
  toast: PropTypes.object.isRequired // Toast object for notifications
}

export default StepComponentFive
