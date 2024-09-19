/* eslint-disable no-case-declarations */
import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import StepComponentFour from './steps/StepComponentFour';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentSeven from './steps/StepComponentSeven';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentTwo from './steps/StepComponentTwo';
import { defaultContractInfo, validateSchedule } from './utilsAndConstants';

import { useTranslation } from 'react-i18next';
import useDays from '../../models/customHooks/useDays';
import { loadingDefault } from '../../utils/constants';
import Loader from '../utils/Loader';
import StepComponentFive from './steps/StepComponentFive';
import StepComponentSix from './steps/StepComponentSix';
export const Contracts = () => {
  /**
   * @param setLoadingInfo :: defaultObject loadingDefault
   */
  const [loadingInfo, setLoadingInfo] = useState(loadingDefault)

  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [contractInformation, setContractInformation] = useState(defaultContractInfo);
  const {laboralDays: daysCache} = useDays();
  const toast = useRef(null);

  // Function to calculate the number of accepted permissions
  const getAcceptedPermissionsCount = () => {
    const permissions = contractInformation?.terms;
    if (!permissions) {
      return '0/10';
    }
    const totalPermissions = Object.keys(permissions).length;
    const acceptedPermissions = Object.values(permissions).filter(value => value).length;
    return `${acceptedPermissions}/${totalPermissions}`;
  };

 

  const countChildrenWithMedicalInfo = () => {
    //contractInformation?.children.forEach(child => console.log("child", child))
    return contractInformation?.children.filter(child => 
      child?.medicalInformation?.healthStatus !== '' &&
      child?.medicalInformation?.healthStatus != null &&
      child?.medicalInformation?.instructions !== '' &&
      child?.medicalInformation?.instructions != null
    ).length;
  };
  

  const getStepClass = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return contractInformation.children[0]?.name ? 'step-valid' : 'step-invalid';
      case 1:
        return contractInformation.guardians[0]?.name ? 'step-valid' : 'step-invalid';
      case 2:
        const permissions = contractInformation.terms;
        const allPermissionsAccepted = Object.values(permissions)?.every(value => value);
        return allPermissionsAccepted ? 'step-valid' : 'step-default';
      case 3:
        const { totalAmount, paymentMethod, startDate, endDate } = contractInformation;
        const isStep3Valid = (totalAmount && paymentMethod && startDate && endDate) && startDate < endDate;
        return isStep3Valid ? 'step-valid' : 'step-invalid';
      case 4:
        return validateSchedule(contractInformation?.schedule,daysCache) ? 'step-valid' : 'step-invalid';
      case 5:
        return  countChildrenWithMedicalInfo() === contractInformation.children.length  ? 'step-valid' : 'step-invalid'; // Disable if no children
      default:
        return 'step-default';
    }
  };
  const items = [
    {
      label: `${t('children')} (${contractInformation.children.length})`,
      command: () => setActiveIndex(0)
    },
    {
      label: `${t('guardians')} (${contractInformation.guardians.length})`,
      command: () => setActiveIndex(1)
    },
    {
      label: `${t('permissions')} (${getAcceptedPermissionsCount()})`,
      command: () => setActiveIndex(2)
    },
    {
      label: t('contract'),
      command: () => setActiveIndex(3)
    },
    {
      label: t('schedule'),
      command: () => setActiveIndex(4)
    },
    {
      label: `${t('medicalInformation')} (${countChildrenWithMedicalInfo()}/${contractInformation.children.length})`,
      command: () => setActiveIndex(5),
      disabled: contractInformation.children.length === 0 // Disable tab if no children
    },
    {
      label: t('contractGenerator'),
      command: () => setActiveIndex(6)
    }
  ];
  
  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <StepComponentOne  setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 1:
        return <StepComponentTwo setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 2:
        return <StepComponentThree  setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 3:
        return <StepComponentFour setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 4:
        return <StepComponentFive setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 5:
        return <StepComponentSix setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 6:
        return <StepComponentSeven setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} 
        // contractInformation={contractInformation} 
         contractInformation={contractInformation}
        setContractInformation={setContractInformation} />;
      default:
        return null;
    }
  };

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
      {renderContent()}
    </>
  );
};