import { ApiResponse } from "models/API"
import React, { useEffect, useState } from "react"
import { Control, FieldArrayWithId, useFieldArray, useForm, UseFormGetValues, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { LoadingInfo } from "../../../models/AppModels"
import { GuardiansAPI, GuardiansFactory } from "../../../models/GuardiansAPI"
import { defaultGuardian, Guardian } from "../../../types/guardian"
import useGuardianOptions from "../../../utils/customHooks/useGuardianOptions"
import useGuardianTypeOptions from "../../../utils/customHooks/useGuardianTypeOptions"
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils"
import { ContractService } from "../contractModelView"
import { ContractInfo } from "../types/ContractInfo"
import { GuardiansValidations } from "../utils/contractValidations"



interface UseViewModelStepGuardiansProps {
  toast: any
  setActiveIndex: (index: number) => void
  contractInformation: ContractInfo
  setContractInformation: (info: ContractInfo) => void
  setLoadingInfo: (info: LoadingInfo) => void
}

interface UseViewModelStepGuardiansReturn {
  onSubmit: (data: any) => Promise<void>
  addGuardian: () => void
  errors: Record<string, any>
  removeGuardian: (index: number) => void
  getAvailableGuardianTypes: (index: number) => any[]
  handleGuardianSelect: (e: { value: number }) => void  
  t: (key: string, options?: any) => string
  guardianOptions: Guardian[]
  control: Control<any>
  fields:FieldArrayWithId<{ guardians: Guardian[]; }, "guardians", "id">[]
  getValues: UseFormGetValues<{ guardians: Guardian[]; }>
  handleSubmit: UseFormReturn['handleSubmit']
}

const useViewModelStepGuardians = ({
  toast,
  setActiveIndex,
  contractInformation,
  setContractInformation,
  setLoadingInfo,
}: UseViewModelStepGuardiansProps): UseViewModelStepGuardiansReturn => {
  const { t } = useTranslation()
  const [guardianOptions, setGuardianOptions] = useState<Guardian[]>([])
  const { guardianTypeOptions } = useGuardianTypeOptions()
  const { guardianOptions: guardians } = useGuardianOptions()

  useEffect(() => {
    if (guardians?.length > 0) {
      const guardiansRe = guardians.map(guardian => ({
        ...guardian,
        label: guardian.name,
        value: guardian.id!
      }))
      setGuardianOptions(guardiansRe)
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guardians'
  })

  const onCreateGuardian = async (data: Guardian): Promise<Guardian | undefined> => {
    try {
      const response: ApiResponse<Guardian> = await GuardiansAPI.createGuardian(data);
      if (response.httpStatus === 200) {
        return response.response; // Extract the Guardian from the response
      }
    } catch (error) {
      console.error('Error creating guardian', error);
      throw error; // Consider handling the error or returning undefined instead
    }
    return undefined; // Explicitly return undefined if no valid response
  }
  
  const onUpdateGuardian = async (id: number, data: Guardian): Promise<Guardian | undefined> => {
    try {
      const response: ApiResponse<Guardian> = await GuardiansAPI.updateGuardian(id.toString(), data);
      if (response.httpStatus === 200) {
        return response.response; // Extract the Guardian from the response
      }
    } catch (error) {
      console.error('Error updating guardian', error);
      throw error; // Consider handling the error or returning undefined instead
    }
    return undefined; // Explicitly return undefined if no valid response
  }
  
  const onHandlerGuardianBackendAsync = async (data: { guardians: Guardian[] }): Promise<Guardian[]> => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreSavingGuardiansInformation')
    });
  
    const promises = data.guardians.map(guardian => {
      if (guardian.id == null) {
        return onCreateGuardian(guardian);
      } else {
        return onUpdateGuardian(guardian.id, guardian);
      }
    });
  
    try {
      const responses = await Promise.all(promises);
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      });
      return responses.filter((response): response is Guardian => response != null); // Type guard to filter out undefined
    } catch (error) {
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      });
      console.error('Error processing guardians data', error);
      throw error;
    }
  };

  const onProcessGuardiansValidation = async (data: { guardians: Guardian[] }): Promise<boolean> => {
    if (data.guardians.length === 1 && !data.guardians[0].titular) {
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
        await onCreateContract(
          contractInformation.children,
          GuardiansFactory.mergeAndCreateWithTitularStatus(
            await onHandlerGuardianBackendAsync(data),
            GuardiansFactory.createGuardiansAllWithTitularStatus(data?.guardians)
          )
        )
        return false
      } else {
        return false
      }
    } else if (!GuardiansValidations.allHaveUniqueGuardianTypes(data.guardians)) {
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
        await Swal.fire({
          title: t('noTitularAlertTitle'),
          text: t('titularRequiredAlertText'),
          icon: 'warning',
          confirmButtonText: t('ok')
        })
        return false
      } else if (titularGuardians.length > 1) {
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

  const onCreateContract = async (children: any[], guardians: Guardian[]): Promise<any> => {
    const response = await Swal.fire({
      title: t('areYouSure'),
      text: t('areYouSureContractCreation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no')
    })
    if (response.isConfirmed) {
      setLoadingInfo(new LoadingInfo(true, t('weAreSavingContract')))
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

      let message = Array.isArray(contractResponse)
        ? contractResponse.map(response => response.response?.message).join(', ')
        : contractResponse?.response?.message ?? contractResponse?.message

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
          guardians,
          contract_number: contractResponseParent?.contractInfo?.response?.contract_number ?? contractInformation.contract_number,
          contract_id: contractResponseParent?.contractInfo?.response?.id ?? contractInformation.contract_id,
          guardian_id_titular: contractResponseParent?.contractInfo?.response?.guardian_id_titular ?? contractInformation.guardian_id_titular,
        })

        ToastInterpreterUtils.toastInterpreter(toast, 'success', t('contractCreated'))

        setActiveIndex(2)
      }
      return contractResponseParent
    }
  }


  const onSubmit = async (data: any): Promise<void> => {
    if (ContractService.isInvalidFormData(data, contractInformation)) {
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
  
      // Create or update guardians first
      let updatedGuardians: Guardian[]
      try {
        updatedGuardians = await onHandlerGuardianBackendAsync(data)
      } catch (error) {
        console.error("Error creating/updating guardians:", error)
        ToastInterpreterUtils.toastInterpreter(
          toast,
          'error',
          t('error'),
          t('failedToSaveGuardians'),
          3000
        )
        return // Stop the process here if guardian creation/update fails
      }
  
      // If guardian creation/update is successful, proceed with contract creation
      await onCreateContract(
        contractInformation.children,
        GuardiansFactory.mergeAndCreateWithTitularStatus(
          updatedGuardians,
          GuardiansFactory.createGuardiansAllWithTitularStatus(data?.guardians)
        )
      )
    } catch (error) {
      console.error("Error submitting guardians form:", error)
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'error',
        t('error'),
        t('failedToSaveGuardians'),
        3000
      )
    }
  }

  const addGuardian = () => {
    append(defaultGuardian)
  }

  const removeGuardian = (index: number) => {
    if (fields.length === 1) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'error',
        t('error'),
        t('cannotRemoveAllGuardians'),
        3000
      )
      return
    }
    remove(index)
  }

  const getAvailableGuardianTypes = React.useCallback((index: number) => {
    const guardians = getValues('guardians')
    return GuardiansValidations.availableGuardianTypes(guardianTypeOptions, guardians, index)
  }, [getValues, guardianTypeOptions])

  const handleGuardianSelect = (e: { value: number }) => {
    const selectedGuardianObject = guardianOptions.find(g => g.id === e.value)
    if (!selectedGuardianObject) return
  
    const existingGuardianIndex = fields.findIndex(
      guardian => guardian.id_static === selectedGuardianObject.id_static
    )
  
    if (existingGuardianIndex === -1) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'success',
        t('success'),
        t('guardianInfoLoaded'),
        3000
      )
      append(selectedGuardianObject)
    } else {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        'info',
        t('info'),
        t('guardianAlreadyAdded'),
        3000
      )
    }
  }
  return {
    onSubmit,
    addGuardian,
    errors,
    removeGuardian,
    getAvailableGuardianTypes,
    handleGuardianSelect,
    t,
    guardianOptions,
    control,
    fields,
    getValues,
    handleSubmit,
  }
}
export default useViewModelStepGuardians
