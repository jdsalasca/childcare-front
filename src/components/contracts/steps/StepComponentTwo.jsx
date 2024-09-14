/* eslint-disable no-unused-vars */
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import { customLogger } from '../../../configs/logger.js'
import { HeaderProps, LoadingInfo, ToastRules } from '../../../models/AppModels.js'
import GuardiansAPI from '../../../models/GuardiansAPI.js'
import useGuardianOptions from '../../../utils/customHooks/useGuardianOptions.js'
import useGuardianTypeOptions from '../../../utils/customHooks/useGuardianTypeOptions.js'
import { Validations } from '../../../utils/validations.js'
import CheckboxWrapper from '../../formsComponents/CheckboxWrapper.jsx'
import DropdownWrapper from '../../formsComponents/DropdownWrapper.jsx'
import InputTextWrapper from '../../formsComponents/InputTextWrapper'
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils.js'
import { ContractService } from '../contractModelView.js'
import { GuardiansValidations } from '../utils/contractValidations.js'
import { defaultGuardian } from '../utilsAndConstants.js'
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
  ...props
}) => {
  const { t } = useTranslation()
  const [guardianOptions, setGuardianOptions] = useState([])
  const { guardianTypeOptions } = useGuardianTypeOptions()
  const { guardianOptions: guardians } = useGuardianOptions()

  useEffect(() => {
    if (guardians?.length > 0) {
      setGuardianOptions(
        guardians.map(guardian => ({
          ...guardian,
          label: guardian.name, // Adjust according to your data structure
          value: guardian.id // Adjust according to your data structure
        }))
      )
    }
  }, [guardians])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      guardians: contractInformation.guardians || []
    }
  })
  const { fields, append } = useFieldArray({
    control,
    name: 'guardians'
  })
  const onCreateGuardian = async data => {
    console.log('data on create', data)

    try {
      const response = await GuardiansAPI.createGuardian(data)
      console.log('Guardian created:', response)
      if (response.httpStatus === 200) {
        return response.response // Return the new guardian object
      }
    } catch (error) {
      console.error('Error creating guardian', error)
      throw error
    }
  }

  const onUpdateGuardian = async (id, data) => {
    try {
      const response = await GuardiansAPI.updateGuardian(id, data)
      console.log('Guardian updated:', response)
      if (response.httpStatus === 200) {
        return response.response // Return the updated guardian object
      }
    } catch (error) {
      console.error('Error updating guardian', error)
      throw error
    }
  }

  const onHandlerGuardianBackendAsync = async data => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreSavingGuardiansInformation')
    })

    // Create an array of promises for creating/updating guardians
    const promises = data.guardians.map(guardian => {
      console.log('guardian', guardian)

      if (guardian.id == null || guardian.id === '') {
        // Create guardian if ID is null
        return onCreateGuardian(guardian)
      } else {
        // Update guardian if ID is present
        return onUpdateGuardian(guardian.id, guardian)
      }
    })

    try {
      // Wait for all promises to resolve
      const responses = await Promise.all(promises)
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      })
      console.log('All guardians responses received', responses)

      return responses
    } catch (error) {
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      })
      console.error('Error processing guardians data', error)
      throw error
    }
  }
  /**
   * This function checks if the guardians are valid
   * @param {*} data
   * @returns
   */
  const onProcessGuardiansValidation = async data => {
    if (data.guardians.length === 1 && !data.guardians[0].titular) {
      console.log('data.guardians[0].titular', data.guardians[0].titular)
      // Alert if no guardian is titular
      const result = await Swal.fire({
        title: t('noTitularAlertTitle'),
        text: t('noTitularAlertText', {
          guardian: data.guardians[0].name + ' ' + data.guardians[0].last_name
        }),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes'),
        cancelButtonText: t('no')
      })

      if (result.isConfirmed) {
        // Update the guardian to be titular
        const updatedGuardians = data.guardians.map(guardian => ({
          ...guardian,
          titular: true
        }))
        // Set the updated guardians in the form state
        setValue('guardians', updatedGuardians)
      } else {
        return false
      }
    } else if (
      !GuardiansValidations.allHaveUniqueGuardianTypes(data.guardians)
    ) {
      await Swal.fire({
        title: t('NoMoreThanOneGuardianOfTheSameType'),
        text: t('NoMoreThanOneGuardianOfTheSameTypeText'),
        icon: 'warning',
        confirmButtonText: t('ok')
      })
      return false
    } else if (data.guardians.length > 1) {
      const titularGuardians = data.guardians.filter(g => g.titular)

      if (titularGuardians.length === 0) {
        // Alert if no guardian is titular
        await Swal.fire({
          title: t('noTitularAlertTitle'),
          text: t('titularRequiredAlertText'),
          icon: 'warning',
          confirmButtonText: t('ok')
        })
        return false
      } else if (titularGuardians.length > 1) {
        // Alert if more than one guardian is titular
        await Swal.fire({
          title: t('multipleTitularsAlertTitle'),
          text: t('multipleTitularsAlertText'),
          icon: 'warning',
          confirmButtonText: t('ok')
        })
        return false
      }
    }
    return true
  }

  //#region contract creation
  const onCreateContract = async (children, guardians) => {
    console.log('============')
    console.log('children', children)
    console.log('guardians', guardians)
    const response = await Swal.fire({
      title: t('areYouSure'),
      text: t('areYouSureContractCreation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no')
    })

    if (response.isConfirmed) {
      setLoadingInfo({loading: true,loadingMessage: t('weAreSavingContract')})
      setLoadingInfo( new LoadingInfo(true, t('weAreSavingContract')))


      ToastRules.showStandard(); 
      const header = new HeaderProps(t('contractInformation'), t('childcare'), [])
console.log(header)


      const contractResponseParent = await ContractService.createContract(
        children,
        guardians,
        t,
        contractInformation
      )
      const contractResponse = contractResponseParent.guardianChildren
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      })

      console.log('contract', contractResponseParent)
      console.log('contractResponse', contractResponse)
      let error
      if (Array.isArray(contractResponse)) {
        error = contractResponse.some(response => response.httpStatus !== 200)
      } else {
        error = contractResponse?.httpStatus !== 200
      }
      let message

      if (Array.isArray(contractResponse)) {
        message = contractResponse
          .map(response => response.response?.message)
          .join(', ')
      } else {
        message =
          contractResponse?.response?.message ?? contractResponse?.message
      }

      if (error) {
        ToastInterpreterUtils.toastInterpreter(
          toast,
          'error',
          t('contractCreationFailed'),
          t('contractCreationFailed', { response: message })
        )
      } else {

        
        setContractInformation({
          ...contractInformation,
          guardians: guardians,
          contract_number:
            contractResponseParent?.contractInfo?.response?.contract_number ??
            contractInformation.contract_number,
          contract_id: contractResponseParent?.contractInfo?.response?.id ?? contractInformation.contract_id
        })

        ToastInterpreterUtils.toastInterpreter(
          toast,
          'success',
          t('contractCreated')
        )

        //#region new form step
        setActiveIndex(2)
      }
      return contractResponseParent
    }
  }
  /**
   * This function checks if the form data is valid
   * @param {*} data Form data
   * @returns
   */

  //#region  onSubmit form
  // TODO  improve table guardian_children add contract_id and program_id
  const onSubmit = async data => {
    if (ContractService.isInvalidFormData(data,contractInformation)) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'info',
        t('info'),
        t('addAtLeastOneGuardianAndAtLeastOneChild'),
        3000
      )
      return
    }
    try {
      console.log('data', data)

      if (!(await onProcessGuardiansValidation(data))) {
        return
      }
      //  Handle creating/updating guardians asynchronously
      const guardiansAsync = await onHandlerGuardianBackendAsync(data)
      console.log('Guardians responses', guardiansAsync)
      //  Update parent component with the new guardians data

      console.log('contractInformation', contractInformation)
      const contract = await onCreateContract(
        contractInformation.children,
        guardiansAsync
      )
      console.log('contract', contract)

      // ToastInterpreterUtils.toastInterpreter(toast,'success',t('guardiansInformationSaved'))

      // Optionally update active index or handle other logic
      //setActiveIndex(2);
    } catch (error) {
      console.error('Error processing guardians data', error)
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'error',
        t('guardiansInformationSaveFailed')
      )
    }
  }

  const addGuardian = () => {
    const updatedGuardians = [...getValues('guardians'), { ...defaultGuardian }]
    setValue('guardians', updatedGuardians)
  }

  const removeGuardian = index => {
    const updatedGuardians = getValues('guardians').filter(
      (_, i) => i !== index
    )
    setValue('guardians', updatedGuardians)
  }

  const getAvailableGuardianTypes = index => {
    const selectedTypes = getValues('guardians').map((g, i) =>
      i !== index ? g.guardianType : null
    )
    return guardianTypeOptions.filter(
      option => !selectedTypes.includes(option.value)
    )
  }

  /**
   * this function is called when the user selects a guardian from the dropdown
   * @param {*} selectedGuardianIndex
   */
  //#region select guardian
  const handleGuardianSelect = e => {
    const selectedGuardian = e.value
    const selectedGuardianObject = guardianOptions.find(g => g.id === e.value)

    // Check if the guardian already exists in the fields
    const existingGuardianIndex = fields.findIndex(
      guardian => guardian.email === selectedGuardianObject.email
    )
    customLogger.debug('existingGuardianIndex', existingGuardianIndex)
    customLogger.debug('fields', fields)
    customLogger.debug('selectedGuardian', selectedGuardian)
    customLogger.debug('selectedGuardianObject', selectedGuardianObject)
    if (existingGuardianIndex === -1) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'success',
        t('success'),
        t('guardianInfoLoaded'),
        3000
      )

      append({
        ...selectedGuardianObject
      })
    } else {
      // If the guardian exists, populate the form with the guardian's data
      Object.keys(selectedGuardianObject).forEach(key => {
        setValue(
          `guardians[${existingGuardianIndex}].${key}`,
          selectedGuardianObject[key]
        )
      })
    }
  }
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
              rules={{ required: t('guardianNameRequired') }}
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

export default StepComponentTwo
