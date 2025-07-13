import React, { useCallback, useEffect, useMemo } from "react"
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
import { Child, ContractResponse } from "../../../types/contract"
import { GuardianType } from "../../../types/guardianType"

// Improved type definitions
interface GuardianFormData {
  guardians: Guardian[];
}
interface ExtendedGuardian extends Guardian {
  label?: string;
  value?: number;
}


interface UseViewModelStepGuardiansProps {
  toast: React.RefObject<{ show: (options: { severity: string; summary: string; detail?: string; life?: number }) => void }>;
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
}

interface UseViewModelStepGuardiansReturn {
  onSubmit: (data: GuardianFormData) => Promise<void>;
  addGuardian: () => void;
  errors: Record<string, unknown>;
  removeGuardian: (index: number) => void;
  getAvailableGuardianTypes: (index: number) => GuardianType[];
  handleGuardianSelect: (e: { value: number }) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
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
  const { guardianTypeOptions } = useGuardianTypeOptions();
  
  // Use the existing guardian options hook instead of duplicating the logic
  const { guardianOptions: guardianOptionsFromHook, isLoading: isLoadingGuardians } = useGuardianOptions();

  // Memoize the setLoading function to prevent unnecessary re-renders
  const setLoading = useCallback((loading: boolean, message: string = '') => {
    setLoadingInfo({
      loading,
      loadingMessage: message ? t(message) : ''
    });
  }, [setLoadingInfo, t]);

  // Memoize the showToast function to prevent unnecessary re-renders
  const showToast = useCallback((type: 'success' | 'error' | 'info', titleKey: string, messageKey?: string, duration: number = 3000) => {
    ToastInterpreterUtils.toastInterpreter(
      toast,
      type,
      t(titleKey),
      messageKey ? t(messageKey) : undefined,
      duration
    );
  }, [toast, t]);

  // Transform guardian options to the expected format
  const guardianOptions = useMemo(() => {
    if (!guardianOptionsFromHook || isLoadingGuardians) return [];
    
    return guardianOptionsFromHook.map(guardian => ({
      ...guardian,
      label: guardian.name,
      value: guardian.id!
    }));
  }, [guardianOptionsFromHook, isLoadingGuardians]);

  // Update loading state when guardians are loading
  useEffect(() => {
    if (isLoadingGuardians) {
      setLoading(true, 'weAreLoadingGuardiansInformation');
    } else {
      setLoading(false);
    }
  }, [isLoadingGuardians, setLoading]);

  const {
    control,
    handleSubmit,
    formState: { errors },
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

  const onCreateContract = async (children: Child[], guardians: Guardian[]): Promise<ContractResponse | null> => {
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
  const onSubmit = useCallback(async (data: GuardianFormData): Promise<void> => {
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
  }, [contractInformation, showToast, setLoading, setActiveIndex]);
  const addGuardian = useCallback(() => {
    append(defaultGuardian);
  }, [append]);

  const removeGuardian = useCallback((index: number) => {
    if (fields.length === 1) {
      showToast('error', 'error', 'cannotRemoveAllGuardians');
      return;
    }
    remove(index);
  }, [fields.length, showToast, remove]);

  const getAvailableGuardianTypes = React.useCallback((index: number) => {
    const guardians = getValues('guardians');
    return GuardiansValidations.availableGuardianTypes(guardianTypeOptions, guardians, index);
  }, [getValues, guardianTypeOptions]);

  const handleGuardianSelect = useCallback((e: { value: number }): void => {
    const selectedGuardian = guardianOptions.find(g => g.id === e.value);
    if (!selectedGuardian) return;

    
    const isGuardianAlreadyAdded = fields.some(
      guardian => guardian.value === selectedGuardian.id
    );

    if (!isGuardianAlreadyAdded) {
      showToast('success', 'success', 'guardianInfoLoaded');
      append(selectedGuardian);
    } else {
      showToast('info', 'info', 'guardianAlreadyAdded');
    }
  }, [guardianOptions, fields, showToast, append]);

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