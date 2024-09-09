import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { useTranslation } from 'react-i18next'
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper'
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils.js'
import { ContractPermissionsAPI } from '../../../models/ContractPermissionsAPI.js'

/**
 * This component is responsible for displaying the third step of the contract generation process.
 * It includes a form with checkboxes for each permission.
 * 
 * @param {Object} props
 * @param {number} props.setActiveIndex - The active index of the stepper.
 * @param {Object} props.contractInformation - The contract information object.
 * @param {Function} props.setContractInformation - The function to set the contract information.     
 * @param {Object} props.toast - The toast reference. 
 * @returns 
 */
export const StepComponentThree = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  toast
}) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      terms: contractInformation.terms
    }
  })
  const { t } = useTranslation()
  
  //#region onSubmit method
  /**
   * This function checks if the form data is valid
   * @param {*} data 
   * @returns 
   */
  const onSubmit = async(data) => {
    console.log("contractInformation", contractInformation)
    if(contractInformation.contract_id == null){
      ToastInterpreterUtils.toastInterpreter(toast,'info','info',t('contractInformationRequiredMessage'),3000)
      return
    }
    console.log("data", data)

    const termsRegistry = {...data.terms, contract_id: contractInformation.contract_id}
    console.log("termsRegistry", termsRegistry)

    const permissionsCreated = await ContractPermissionsAPI.createContractPermissions(termsRegistry)
    if(permissionsCreated.httpStatus !== 200){
      ToastInterpreterUtils.toastInterpreter(toast,'error',t('permissionsCreationFailed'),t('permissionsCreationFailedMessage'))
      return
    }

    setContractInformation({ ...contractInformation, terms: permissionsCreated.response })
    ToastInterpreterUtils.toastInterpreter(toast,'success',t('termsUpdated'),t('termsUpdatedMessage'))
    // #region new form step
    setActiveIndex(3) // Move to the next step or handle as needed
  }

  //#region form return
  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {[
          'walk_around_neighborhood',
          'walk_to_park_or_transport',
          'walk_in_school', // 'walkAroundSchool',
          'share_media_with_families',

          'guardian_received_manual'
        ].map(term => (
          <CheckboxWrapper
            key={term}
            name={`terms.${term}`}
            control={control}
            label={t(term)}
            labelClassName='c-label-checkbox right'
            // rules={{ required: t(`${term}Required`) }}
            labelPosition='right' // or 'left' depending on your preference
          />
        ))}
        <div className='button-group'>
          <Button
            type='submit'
            label={t('save')}
            className='p-button-primary rounded-button'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary rounded-button'
            onClick={() => setActiveIndex(1)}
          />
          {/* <Button label={t('nextStep')} className="p-button-success rounded-button" onClick={() => setActiveIndex(4)} /> */}
        </div>
      </form>
    </div>
  )
}

export default StepComponentThree

