import { useCallback, useMemo } from 'react';
import { ContractInfo } from '../types/ContractInfo';
import { ChildType } from 'types/child';
import { Guardian } from 'types/guardian';

interface UseContractOptimizationProps {
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
}

export const useContractOptimization = ({
  contractInformation,
  setContractInformation
}: UseContractOptimizationProps) => {
  
  // Memoized selectors to prevent unnecessary re-renders
  const childrenCount = useMemo(() => 
    contractInformation.children?.length || 0, 
    [contractInformation.children?.length]
  );
  
  const guardiansCount = useMemo(() => 
    contractInformation.guardians?.length || 0, 
    [contractInformation.guardians?.length]
  );
  
  const hasValidContract = useMemo(() => 
    Boolean(contractInformation.contract_id), 
    [contractInformation.contract_id]
  );
  
  const hasPaymentInfo = useMemo(() => 
    Boolean(contractInformation.total_to_pay && contractInformation.payment_method_id), 
    [contractInformation.total_to_pay, contractInformation.payment_method_id]
  );
  
  // Optimized update functions
  const updateChildren = useCallback((children: ChildType[]) => {
    setContractInformation({
      ...contractInformation,
      children
    });
  }, [setContractInformation, contractInformation]);
  
  const updateGuardians = useCallback((guardians: Guardian[]) => {
    setContractInformation({
      ...contractInformation,
      guardians
    });
  }, [setContractInformation, contractInformation]);
  
  const updateContractField = useCallback((field: keyof ContractInfo, value: any) => {
    setContractInformation({
      ...contractInformation,
      [field]: value
    });
  }, [setContractInformation, contractInformation]);
  
  const updateMultipleFields = useCallback((updates: Partial<ContractInfo>) => {
    setContractInformation({
      ...contractInformation,
      ...updates
    });
  }, [setContractInformation, contractInformation]);
  
  // Validation helpers
  const isStepValid = useCallback((stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Children
        return childrenCount > 0 && Boolean(contractInformation.children?.[0]?.first_name);
      case 1: // Guardians
        return guardiansCount > 0 && Boolean(contractInformation.guardians?.[0]?.name);
      case 2: // Permissions
        return Boolean(contractInformation.terms);
      case 3: // Contract Details
        return hasPaymentInfo && Boolean(contractInformation.start_date);
      case 4: // Pricing
        return Boolean(contractInformation.total_to_pay);
      case 5: // Schedule
        return Boolean(contractInformation.schedule?.length);
      default:
        return false;
    }
  }, [
    childrenCount,
    guardiansCount,
    contractInformation.children,
    contractInformation.guardians,
    contractInformation.terms,
    contractInformation.start_date,
    contractInformation.total_to_pay,
    contractInformation.schedule,
    hasPaymentInfo
  ]);
  
  return {
    // Selectors
    childrenCount,
    guardiansCount,
    hasValidContract,
    hasPaymentInfo,
    
    // Update functions
    updateChildren,
    updateGuardians,
    updateContractField,
    updateMultipleFields,
    
    // Validation
    isStepValid
  };
}; 