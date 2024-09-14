import { useTranslation } from "react-i18next";
import { customLogger } from "../../../configs/logger";
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils";
import { defaultContractInfoFinished } from "../utilsAndConstants";
// TODO on the body of gurdians I have to return the information about if is titular or not
// FIXME to guardians add first_name instead of name
/* eslint-disable no-unused-vars */
const useGenerateContract = ({contractInformation = defaultContractInfoFinished,toast, ...props}) => {
    const { t } = useTranslation();
    const contractBuilder = () => {

        customLogger.debug('contractInformation on contractBuilder', contractInformation)
        if(contractInformation.contract_id == null) {
            ToastInterpreterUtils.toastInterpreter(toast,'info','info',t('contractInformationRequiredMessage'),3000)
            return
        }
        customLogger.debug('Guardians on contractBuilder', contractInformation.guardians)
        const contractBuilderTemp = contractInformation;
        contractBuilderTemp.titularName = contractInformation?.guardians?.find(guardian => guardian.titular)?.name ?? "Titular_not_Defined"
        customLogger.debug('dataSaver', contractBuilderTemp)
        return contractBuilderTemp;


        
    }
    return {contractBuilder}


    };


export default useGenerateContract;