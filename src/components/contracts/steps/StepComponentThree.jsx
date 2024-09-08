import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { useTranslation } from 'react-i18next'
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper'
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils.js'

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
  
  const onSubmit = data => {
    console.log("data", data)

    console.log("contractInformation", contractInformation)
    const termsRegistry = {...data.term, contract_id: contractInformation.contract_id}
    console.log("termsRegistry", termsRegistry)


    
    setContractInformation({ ...contractInformation, terms: data.terms })
    ToastInterpreterUtils.toastInterpreter(toast,'success',t('termsUpdated'),t('termsUpdatedMessage'))
    
    // setActiveIndex(3) // Move to the next step or handle as needed
  }

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {[
          'walkAroundNeighborhood',
          'walkToThePark',
          'walkAroundSchool',
          'allowPhotos',
          'allowExternalPhotos',
          'specialExternalUsage',
          'externalUsageAllowed',
          'receiveManual'
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
