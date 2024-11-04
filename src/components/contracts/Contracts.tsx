import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { useCallback, useMemo, useRef, useState } from 'react';
import StepComponentFour from './steps/StepComponentFour';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentSeven from './steps/StepComponentSeven';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentTwo from './steps/StepComponentTwo';
import { validateSchedule } from './utilsAndConstants';

import { customLogger } from 'configs/logger';
import { useTranslation } from 'react-i18next';
import { LoadingInfo } from '../../models/AppModels';
import { ContractModel } from '../../models/ContractAPI';
import { ContractPermissionsValidator } from '../../models/ContractPermissionsAPI';
import useDays from '../../models/customHooks/useDays';
import Loader from '../utils/Loader';
import StepComponentFive from './steps/StepComponentFive';
import { contractDone, ContractInfo, defaultContractInfo, defaultContractInfoFinished } from './types/ContractInfo';
import { mockContract } from '../../data/mockContract';

// Define the props type for the component
type ContractsProps = {
  // Add any additional props if needed
};

export const Contracts: React.FC<ContractsProps> = () => {
  const [loadingInfo, setLoadingInfo] = useState(LoadingInfo.DEFAULT_MESSAGE);
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [contractInformation, setContractInformation] = useState<ContractInfo>(defaultContractInfo);
  const { laboralDays: daysCache } = useDays();
  const toast = useRef<Toast | null>(null);

  const getAcceptedPermissionsCount = useCallback(() => {
    const permissions = contractInformation?.terms;
    if (!permissions) {
      return `0/${ContractModel.CONTRACT_PERMISSIONS.length}`;
    }
    const totalPermissions = ContractModel.CONTRACT_PERMISSIONS.length;
    customLogger.debug("permissions", permissions);
    return `${ContractPermissionsValidator.getValidContractPermissions(permissions)}/${totalPermissions}`;
  }, [contractInformation]);

  const countChildrenWithMedicalInfo = useMemo(() => {
    return contractInformation?.children.filter(child => 
      
      child?.medicalInformation?.healthStatus !== '' &&
      child?.medicalInformation?.healthStatus != null &&
      child?.medicalInformation?.instructions !== '' &&
      child?.medicalInformation?.instructions != null
    ).length;
  }, [contractInformation]);

  const getStepClass = useCallback((stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return contractInformation.children[0]?.first_name ? 'step-valid' : 'step-invalid';
      case 1:
        return contractInformation.guardians[0]?.name ? 'step-valid' : 'step-invalid';
      case 2:
        return (ContractPermissionsValidator.getValidContractPermissions(contractInformation.terms) > 1) ? 'step-valid' : 'step-invalid';
      case 3:
        const { total_to_pay, payment_method_id, start_date, end_date } = contractInformation;
        const isStep3Valid = (total_to_pay && payment_method_id && start_date && end_date) && start_date < end_date;
        return isStep3Valid ? 'step-valid' : 'step-invalid';
      case 4:
        return validateSchedule(contractInformation?.schedule, daysCache) ? 'step-valid' : 'step-invalid';
      case 5:
        return countChildrenWithMedicalInfo === contractInformation.children.length ? 'step-default block' : 'step-default block';
      case 6:
        return validateSchedule(contractInformation?.schedule, daysCache) ? 'step-valid' : 'step-default';
      default:
        return 'step-default';
    }
  }, [contractInformation, daysCache, countChildrenWithMedicalInfo]);

  const items = useMemo(() => [
    {
      label: `${t('children')} (${contractInformation.children.length})`,
      command: () => setActiveIndex(0),
    },
    {
      label: `${t('guardians')} (${contractInformation.guardians.length})`,
      command: () => setActiveIndex(1),
    },
    {
      label: `${t('permissions')} (${getAcceptedPermissionsCount()})`,
      command: () => setActiveIndex(2),
    },
    {
      label: t('contract'),
      command: () => setActiveIndex(3),
    },
    {
      label: t('schedule'),
      command: () => setActiveIndex(4),
    },
    {
      label: `${t('medicalInformation')} (${countChildrenWithMedicalInfo}/${contractInformation.children.length})`,
      command: () => setActiveIndex(5),
      disabled: contractInformation.children.length === 0,
    },
    {
      label: t('contractGenerator'),
      command: () => setActiveIndex(6),
    },
  ], [contractInformation, t, countChildrenWithMedicalInfo, getAcceptedPermissionsCount]);

  const renderContent = useMemo(() => {
    switch (activeIndex) {
      case 0:
        return <StepComponentOne loadingInfo={loadingInfo} setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 1:
        return <StepComponentTwo setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 2:
        return <StepComponentThree setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 3:
        return <StepComponentFour setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 4:
        return <StepComponentFive setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 5:
        // return <StepComponentSix setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 6:
        return <StepComponentSeven setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      default:
        return null;
    }
  }, [activeIndex, contractInformation, setLoadingInfo, toast, setContractInformation]);

  return (
    <>
      <Toast ref={toast} />
      {loadingInfo.loading && <Loader message={loadingInfo.loadingMessage} />}
      <Steps
        model={items.map((item, index) => ({
          ...item,
          className: getStepClass(index),
        }))}
        className='c-steps-component'
        activeIndex={activeIndex}
        readOnly={false}
        onSelect={(e) => setActiveIndex(e.index)}
      />
      {renderContent}
    </>
  );
};
