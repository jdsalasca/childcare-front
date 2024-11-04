import { ApiResponse } from "models/API"
import React, { useEffect, useState } from "react"
import { Control, FieldArrayWithId, useFieldArray, useForm, UseFormGetValues, UseFormReturn } from "react-hook-form"
import { useTranslation } from "react-i18next"
import Swal from "sweetalert2"
import { LoadingInfo } from "../../../models/AppModels"
import { GuardiansAPI } from "../../../models/GuardiansAPI"
import { defaultGuardian, Guardian } from "../../../types/guardian"
import useGuardianOptions from "../../../utils/customHooks/useGuardianOptions"
import useGuardianTypeOptions from "../../../utils/customHooks/useGuardianTypeOptions"
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils"
import { ContractService } from "../contractModelView"
import { ContractInfo } from "../types/ContractInfo"
import { GuardiansValidations } from "../utils/contractValidations"
import { log } from "loglevel"
import { GuardiansFactory } from "@models/factories/GuardiansFactory"

// Improved type definitions
interface GuardianFormData {
  guardians: Guardian[];
}
interface ExtendedGuardian extends Guardian {
  label?: string;
  value?: number;
}


interface UseViewModelStepGuardiansProps {
  toast: any; // Consider using a specific toast type
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
}

interface UseViewModelStepGuardiansReturn {
  onSubmit: (data: GuardianFormData) => Promise<void>;
  addGuardian: () => void;
  errors: Record<string, any>;
  removeGuardian: (index: number) => void;
  getAvailableGuardianTypes: (index: number) => any[];
  handleGuardianSelect: (e: { value: number }) => void;
  t: (key: string, options?: any) => string;
  guardianOptions: Guardian[];
  control: Control<GuardianFormData>;
  fields: FieldArrayWithId<GuardianFormData, "guardians", "id">[];
  getValues: UseFormGetValues<GuardianFormData>;
  handleSubmit: UseFormReturn<GuardianFormData>['handleSubmit'];
}

const useViewModelStepGuardians = ({
  toast,
  setActiveIndex,
  contractInformation,
  setContractInformation,
  setLoadingInfo,
}: UseViewModelStepGuardiansProps): UseViewModelStepGuardiansReturn => {
  const { t } = useTranslation();
  const [guardianOptions, setGuardianOptions] = useState<Guardian[]>([]);
  const { guardianTypeOptions } = useGuardianTypeOptions();
  const { guardianOptions: guardians } = useGuardianOptions();

  const setLoading = (loading: boolean, message: string = '') => {
    setLoadingInfo({
      loading,
      loadingMessage: message ? t(message) : ''
    });
  };

  const showToast = (type: 'success' | 'error' | 'info', titleKey: string, messageKey?: string, duration: number = 3000) => {
    ToastInterpreterUtils.toastInterpreter(
      toast,
      type,
      t(titleKey),
      messageKey ? t(messageKey) : undefined,
      duration
    );
  };

  // Update the handlerGetGuardians function
const handlerGetGuardians = async (): Promise<ExtendedGuardian[]> => {
  try {
    setLoading(true, 'weAreLoadingGuardiansInformation');
    const response = await GuardiansAPI.getGuardians();
    
    if (response?.response?.length > 0) {
      const formattedGuardians: ExtendedGuardian[] = response.response.map(guardian => ({
        ...guardian,
        label: guardian.name,
        value: guardian.id!
      }));
      setGuardianOptions(formattedGuardians);
      return formattedGuardians;
    }
    return [];
  } catch (error) {
    console.error('Error fetching guardians:', error);
    showToast('error', 'error', 'failedToLoadGuardians');
    return [];
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    handlerGetGuardians();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<GuardianFormData>({
    defaultValues: {
      guardians: contractInformation.guardians || []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'guardians'
  });
// Update the onCreateGuardian function return type
const onCreateGuardian = async (data: Guardian): Promise<ExtendedGuardian | undefined> => {
  try {
    const response = await GuardiansAPI.createGuardian(data);
    
    if (response.httpStatus === 200 && response.response) {
      return {
        ...response.response,
        titular: data.titular,
        telephone: data.telephone,
        label: response.response.name,
        value: response.response.id!
      };
    }
    throw new Error('Invalid response from create guardian');
  } catch (error) {
    console.error('Error creating guardian:', error);
    throw error;
  }
};

  const onUpdateGuardian = async (id: number, data: Guardian): Promise<Guardian | undefined> => {
    try {
      const response = await GuardiansAPI.updateGuardian(id.toString(), data);
      if (response.httpStatus === 200 && response.response) {
        return response.response;
      }
      throw new Error('Invalid response from update guardian');
    } catch (error) {
      console.error('Error updating guardian:', error);
      throw error;
    }
  };

  const onHandlerGuardianBackendAsync = async (data: GuardianFormData): Promise<Guardian[]> => {
    try {
      setLoading(true, 'weAreSavingGuardiansInformation');
      
      const promises = data.guardians.map(guardian => 
        guardian.id == null ? onCreateGuardian(guardian) : onUpdateGuardian(guardian.id, guardian)
      );

      const responses = await Promise.all(promises);
      return responses.filter((response): response is Guardian => response != null);
    } catch (error) {
      console.error('Error processing guardians data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onCreateContract = async (children: any[], guardians: Guardian[]): Promise<any> => {
    try {
    const result = await Swal.fire({
      title: t('areYouSure'),
      text: t('areYouSureContractCreation'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('yes'),
      cancelButtonText: t('no')
    });

    if (!result.isConfirmed) {
      // Early return if user clicks "No"
      showToast('info', 'info', 'contractCreationCancelled');
      return null;
    }

    
      setLoading(true, 'weAreSavingContract');
      const contractResponseParent = await ContractService.createContract(
        children,
        guardians,
        t,
        contractInformation
      );

      const contractResponse = contractResponseParent.guardianChildren;
      
      const hasError = Array.isArray(contractResponse) 
        ? contractResponse.some(response => response.httpStatus !== 200)
        : contractResponse?.httpStatus !== 200;

      const message = Array.isArray(contractResponse)
        ? contractResponse.map(response => response.response?.message).join(', ')
        : contractResponse?.response?.message ?? contractResponse?.message;

      if (hasError) {
        showToast('error', 'contractCreationFailed', 'contractCreationFailed');
        return;
      }

      setContractInformation({
        ...contractInformation,
        guardians,
        contract_number: contractResponseParent?.contractInfo?.response?.contract_number ?? contractInformation.contract_number,
        contract_id: contractResponseParent?.contractInfo?.response?.id ?? contractInformation.contract_id,
        guardian_id_titular: contractResponseParent?.contractInfo?.response?.guardian_id_titular ?? contractInformation.guardian_id_titular,
      });

      showToast('success', 'contractCreated');
      setActiveIndex(2);
      
      return contractResponseParent;
    } finally {
      setLoading(false);
    }
  };
  const validateGuardians = (guardians: Guardian[]): { isValid: boolean; errorKey?: string } => {
    const titularCount = guardians.filter(g => g.titular ===true).length;
    const guardianTypeMap = new Map<number, boolean>();
    
    // Check duplicate types
    const hasDuplicateType = guardians.some(guardian => {
      if (!guardian.guardian_type_id) return false;
      if (guardianTypeMap.has(guardian.guardian_type_id)) return true;
      guardianTypeMap.set(guardian.guardian_type_id, true);
      return false;
    });
  
    if (titularCount === 0) return { isValid: false, errorKey: 'noTitularSelected' };
    if (titularCount > 1) return { isValid: false, errorKey: 'multipleTitularSelected' };
    if (hasDuplicateType) return { isValid: false, errorKey: 'duplicateGuardianTypeFound' };
  
    return { isValid: true };
  };
  const onSubmit = async (data: GuardianFormData): Promise<void> => {
    try {
      // Basic validation
      if (ContractService.isInvalidFormData(data, contractInformation)) {
        showToast('info', 'info', 'addAtLeastOneGuardianAndAtLeastOneChild');
        return;
      }

      const validation = validateGuardians(data.guardians);
    if (!validation.isValid) {
      showToast('error', 'error', validation.errorKey!);
      return;
    }
      setLoading(true, 'weAreSavingGuardiansInformation');

      // Save guardians
      const updatedGuardians = await onHandlerGuardianBackendAsync(data);
      if (updatedGuardians.length === 0) {
        showToast('error', 'error', 'failedToSaveGuardians');
        return;
      }
      console.log('updatedGuardians', updatedGuardians);
      

      // Create contract
      const contractResponse = await onCreateContract(
        contractInformation.children,
        updatedGuardians
      );
      if(contractResponse){
        showToast('success', 'success', 'contractCreated');
        setActiveIndex(2);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      showToast('error', 'error', error instanceof Error ? error.message : 'failedToSaveGuardians');
    } finally {
      setLoading(false);
    }
  };
  const addGuardian = () => {
    append(defaultGuardian);
  };

  const removeGuardian = (index: number) => {
    if (fields.length === 1) {
      showToast('error', 'error', 'cannotRemoveAllGuardians');
      return;
    }
    remove(index);
  };

  const getAvailableGuardianTypes = React.useCallback((index: number) => {
    const guardians = getValues('guardians');
    return GuardiansValidations.availableGuardianTypes(guardianTypeOptions, guardians, index);
  }, [getValues, guardianTypeOptions]);

  const handleGuardianSelect = (e: { value: number }): void => {
    const selectedGuardian = guardianOptions.find(g => g.id === e.value);
    if (!selectedGuardian) return;

    console.log("fields", fields);
    console.log("selectedGuardian", selectedGuardian);
    
    const isGuardianAlreadyAdded = fields.some(
      guardian => guardian.value === selectedGuardian.id
    );

    if (!isGuardianAlreadyAdded) {
      showToast('success', 'success', 'guardianInfoLoaded');
      append(selectedGuardian);
    } else {
      showToast('info', 'info', 'guardianAlreadyAdded');
    }
  };

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
  };
};

export default useViewModelStepGuardians;