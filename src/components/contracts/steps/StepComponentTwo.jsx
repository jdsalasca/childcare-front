import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import PropTypes from 'prop-types'
import { Validations } from '../../../utils/validations.js'
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper.jsx'
import DropdownWrapper from '../../formsComponents/DropdownWrapper.jsx'
import InputTextWrapper from '../../formsComponents/InputTextWrapper'
import { useViewModelStepGuardians } from '../viewModels/useviewModelStepGuardians.js'
/**
 *@param {Object} props
 * @param {number} props.setActiveIndex - The active index of the stepper.
 * @param {C} props.contractInformation - The contract information object.
 * @param {Function} props.setContractInformation - The function to set the contract information.
 * @param {Object} props.setLoadingInfo - The function to set the loading information.
 * @param {Object} props.toast - The toast reference.
 * @returns
 */

// FIXME  improve the loading of guardian_types
export const StepComponentTwo = ({
  setActiveIndex,
  contractInformation,
  setContractInformation,
  setLoadingInfo,
  toast,
}) => {
  
  const { onSubmit,handleSubmit, guardianOptions, control, fields,
    getValues, addGuardian, removeGuardian, getAvailableGuardianTypes, handleGuardianSelect,t } = 
    useViewModelStepGuardians({toast, setActiveIndex,contractInformation, setContractInformation, setLoadingInfo})

  //#region form return
  return (
    <div className='form-container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div
          className='field p-float-label'
          style={{ marginBottom: '30px', maxWidth: '15rem' }}
        >
          <Dropdown
            id='names-dropdown-child'
            filter
            optionLabel='label'
            emptyMessage={t('dropdownEmptyMessage')}
            options={guardianOptions}
            onChange={handleGuardianSelect}
          />
          <label htmlFor='names-dropdown-child' style={{ paddingTop: '0px' }}>
            {t('pickAGuardian')}
          </label>
        </div>
        {fields.map((guardian, index) => (
          <div key={index} className='child-form'>
            <InputTextWrapper
              name={`guardians[${index}].name`}
              control={control}
              rules={{ required: t('guardianNameRequired')}}
              label={t('guardianName')}
              onChangeCustom={value => Validations.capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].last_name`}
              control={control}
              rules={{ required: t('guardianLastNameRequired') }}
              label={t('guardianLastName')}
              onChangeCustom={value => Validations.capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].address`}
              control={control}
              rules={{ required: t('addressRequired') }}
              label={t('address')}
              onChangeCustom={value => Validations.capitalizeFirstLetter(value)}
            />
            <InputTextWrapper
              name={`guardians[${index}].city`}
              control={control}
              rules={{ required: t('cityRequired') }}
              label={t('city')}
            />
            <InputTextWrapper
              name={`guardians[${index}].email`}
              control={control}
              keyFilter='email'
              rules={{
                required: t('emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('emailInvalid')
                }
              }}
              label={t('email')}
              spanClassName='c-small-field r-m-13'
            />
            <InputTextWrapper
              name={`guardians[${index}].phone`}
              control={control}
              rules={{
                
                required: t('phoneNumberRequired'),
                pattern: {
                  value: /^[+]?[\d]+$/,
                  message: t('phoneNumberPattern')
                }
              }}
              label={t('phoneNumber')}
              keyFilter={/^[0-9+]*$/}
              spanClassName='c-small-field r-m-10'
            />
            <DropdownWrapper
              options={getAvailableGuardianTypes(index)}
              optionValue={'id'}
              optionLabel='name'
              label={t('guardianType')}
              spanClassName='c-small-field r-10'
              name={`guardians[${index}].guardian_type_id`}
              control={control}
              rules={{ required: t('guardianTypeRequired') }}
            />
            <CheckboxWrapper
              name={`guardians[${index}].titular`}
              control={control}
              label={t('titular')}
              labelClassName='c-label-checkbox left'
              labelPosition='left'
            />
            <Button
              icon='pi pi-trash'
              className='p-button-danger p-button-text p-ml-2'
              onClick={e => { e.preventDefault(), e.stopPropagation(), removeGuardian(index)}}
            />
          </div>
        ))}

        <div className='button-group'>
          <Button
            icon='pi pi-plus'
            label={t('addGuardian')}
            className='p-button-success'
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              addGuardian()
            }}
            disabled={getValues('guardians')?.length > 2}
          />
          <Button
            type='submit'
            label={t('save')}
            className='p-button-primary p-ml-2'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary p-ml-2'
            onClick={() => {
              setActiveIndex(0)
            }}
          />
          {/* <Button label={!validForm ? t('fillTheForm') : t('next')} className="p-button-secondary p-ml-2" onClick={() => setActiveIndex(2)} disabled={!validForm} /> */}
        </div>
      </form>
    </div>
  )
}

StepComponentTwo.propTypes = {
  setActiveIndex: PropTypes.func.isRequired,
  contractInformation: PropTypes.object.isRequired,
  setContractInformation: PropTypes.func.isRequired,
  setLoadingInfo: PropTypes.func.isRequired,
  toast: PropTypes.object.isRequired
}


export default StepComponentTwo
