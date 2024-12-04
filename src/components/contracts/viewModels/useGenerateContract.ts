import { useTranslation } from "react-i18next";
import { customLogger } from "../../../configs/logger";
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils";
import { ContractInfo } from "../types/ContractInfo";
import { mockContract } from 'data/mockContract';
interface UseGenerateContractProps {
  contractInformation?: ContractInfo;
  toast: any; // Adjust type as necessary
  [key: string]: any; // For additional props
}

const useGenerateContract = ({
  contractInformation  = mockContract,
  toast,
  ...props
}: UseGenerateContractProps) => {
  const { t } = useTranslation();

  const contractBuilder = () : ContractInfo => {
    customLogger.debug('contractInformation on contractBuilder', contractInformation);
    if (contractInformation.contract_id == null) {
      ToastInterpreterUtils.toastInterpreter(toast, 'info', 'info', t('contractInformationRequiredMessage'), 3000);
      throw new Error('Contract information is required');
    }
    customLogger.debug('Guardians on contractBuilder', contractInformation.guardians);
    const contractBuilderTemp: ContractInfo = { ...contractInformation }; // Create a copy

    const titularGuardian = contractInformation.guardians.find(guardian => guardian.titular);
    contractBuilderTemp.titularName = titularGuardian ? `${titularGuardian.name} ${titularGuardian.last_name}` : "Titular_not_Defined";
    
    customLogger.debug('dataSaver', contractBuilderTemp);
    return contractBuilderTemp;
  };

  return { contractBuilder };
};

export default useGenerateContract;
