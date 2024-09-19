import { Button } from 'primereact/button'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { customLogger } from '../../../configs/logger.js'
import { ContractPermissionsAPI } from '../../../models/ContractPermissionsAPI.js'
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

  const onSubmit = async (data) => {
    customLogger.debug('contractInformation', contractInformation)

    if (contractInformation.contract_id == null) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'info',
        'info',
        t('contractInformationRequiredMessage'),
        3000
      )
      return
    }
    console.log('data', data)

    const termsRegistry = { ...data.terms, contract_id: contractInformation.contract_id }
    console.log('termsRegistry', termsRegistry)

    const permissionsCreated = await ContractPermissionsAPI.createContractPermissions(termsRegistry)
    if (permissionsCreated.httpStatus !== 200) {
      ToastInterpreterUtils.toastInterpreter( 
        toast,
        'error',
        t('permissionsCreationFailed'),
        t('permissionsCreationFailedMessage')
      )
      return
    }

    setContractInformation({ ...contractInformation, terms: permissionsCreated.response })
    ToastInterpreterUtils.toastInterpreter(
      toast,
      'success',
      t('termsUpdated'),
      t('termsUpdatedMessage')
    )
    setActiveIndex(3)
  }

  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        {[
          'share_photos_with_families',
          'allow_other_parents_to_take_photos',
          'use_photos_for_art_and_activities',
          'use_photos_for_promotion',
          'walk_around_neighborhood',
          'walk_to_park_or_transport',
          'walk_in_school',
          'guardian_received_manual'
        ].map((term) => (
          <CheckboxWrapper
            key={term}
            name={`terms.${term}`}
            control={control}
            label={t(term)}
            labelClassName='c-label-checkbox right'
            labelPosition='right'
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
        </div>
      </form>
    </div>
  )
}

// Define propTypes for StepComponentThree
StepComponentThree.propTypes = {
  setActiveIndex: PropTypes.func.isRequired,
  contractInformation: PropTypes.shape({
    terms: PropTypes.object.isRequired,
    contract_id: PropTypes.number
  }).isRequired,
  setContractInformation: PropTypes.func.isRequired,
  toast: PropTypes.object.isRequired
}

export default StepComponentThree
