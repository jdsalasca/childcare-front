import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { customLogger } from "../../../configs/logger"
import { LoadingInfo } from "../../../models/AppModels"
import { GuardiansAPI, GuardiansFactory } from "../../../models/GuardiansAPI"
import useGuardianOptions from "../../../utils/customHooks/useGuardianOptions"
import useGuardianTypeOptions from "../../../utils/customHooks/useGuardianTypeOptions"
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils"
import { ContractService } from "../contractModelView"
import { GuardiansValidations } from "../utils/contractValidations"
import { defaultGuardian } from "../utilsAndConstants"

const useViewModelStepGuardians = ({toast, setActiveIndex,
     contractInformation, setContractInformation, setLoadingInfo}) => {
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
        await onCreateContract(contractInformation.children,GuardiansFactory.mergeAndCreateWithTitularStatus(await onHandlerGuardianBackendAsync(data), GuardiansFactory.createGuardiansAllWithTitularStatus(data?.guardians)))
          return false;
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
      const response = await Swal.fire({
        title: t('areYouSure'),
        text: t('areYouSureContractCreation'),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('yes'),
        cancelButtonText: t('no')
      })
      if (response.isConfirmed) {
        setLoadingInfo( new LoadingInfo(true, t('weAreSavingContract')))
        const contractResponseParent = await ContractService.createContract(
          children,
          guardians,
          t,
          contractInformation
        )
        const contractResponse = contractResponseParent.guardianChildren
        setLoadingInfo(LoadingInfo.DEFAULT_MESSAGE)
        let error
        if (Array.isArray(contractResponse)) {
          error = contractResponse.some(response => response.httpStatus !== 200)
        } else {
          error = contractResponse?.httpStatus !== 200
        }
        let message
  
        if(Array.isArray(contractResponse)) {
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
            contract_id: contractResponseParent?.contractInfo?.response?.id ?? contractInformation.contract_id,
            guardian_id_titular: 
            contractResponseParent?.contractInfo?.response?.guardian_id_titular ??
            contractInformation.guardian_id_titular,
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
        if (!(await onProcessGuardiansValidation(data))) {
          return
        } 
        //  Handle creating/updating guardians asynchronously
        await onCreateContract(contractInformation.children,GuardiansFactory.mergeAndCreateWithTitularStatus(await onHandlerGuardianBackendAsync(data), data?.guardians))
      } catch (error) {
        setLoadingInfo(LoadingInfo.DEFAULT_MESSAGE)
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
      // TODO is secure to use email as key?????
      // Check if the guardian already exists in the fields
      const existingGuardianIndex = fields.findIndex(
        guardian => guardian.id_static === selectedGuardianObject.id_static
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
      }
    }

    return { 
        onSubmit,
        addGuardian, 
        errors,
        removeGuardian,
        getAvailableGuardianTypes, 
        handleGuardianSelect,
         t, guardianOptions, control, fields, getValues, handleSubmit }
}



export { useViewModelStepGuardians }

