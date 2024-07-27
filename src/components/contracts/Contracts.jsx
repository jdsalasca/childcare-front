import React, { useRef, useState, version } from 'react';
import { generateContractPdf } from './utils/contractPdfUtils'; // Adjust the path as per your file structure
import { Steps } from 'primereact/steps';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentTwo from './steps/StepComponentTwo';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentFive from './steps/StepComponentFive';
import { Toast } from 'primereact/toast';
import { defaultContractInfo } from './utilsAndConsts';
import StepComponentFour from './steps/StepComponentFour';

import { useTranslation } from 'react-i18next';

export const Contracts = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [contractInformation, setContractInformation] = useState(defaultContractInfo);
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

  const getStepClass = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return contractInformation.children[0]?.name ? 'step-valid' : 'step-invalid';
      case 1:
        return contractInformation.guardians[0]?.name ? 'step-valid' : 'step-invalid';
      case 2:
        const permissions = contractInformation.terms;
        const allPermissionsAccepted = Object.values(permissions)?.every(value => value);
        return allPermissionsAccepted ? 'step-valid' : 'step-default'; // Green if all permissions are accepted
      case 3:
        const { totalAmount, paymentMethod, startDate, endDate } = contractInformation;
        const isStep3Valid = (totalAmount && paymentMethod && startDate && endDate) && startDate < endDate;
        return isStep3Valid ? 'step-valid' : 'step-invalid';
      case 4:
        return 'step-default'; // Add your validation for step 5 if needed
      default:
        return 'step-default';
    }
  };

  const items = [
    {
      label: `${t('children')} (${contractInformation.children.length})`,
      command: (event) => setActiveIndex(0)
    },
    {
      label: `${t('guardians')} (${contractInformation.guardians.length})`,
      command: (event) => setActiveIndex(1)
    },
    {
      label: `${t('permissions')} (${getAcceptedPermissionsCount()})`,
      command: (event) => setActiveIndex(2)
    },
    {
      label: t('contract'),
      command: (event) => setActiveIndex(3)
    },
    {
      label: t('contractGenerator'),
      command: (event) => setActiveIndex(4)
    }
  ];

  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <StepComponentOne toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 1:
        return <StepComponentTwo toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 2:
        return <StepComponentThree toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 3:
        return <StepComponentFour toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 4:
        return <StepComponentFive toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Steps 
        model={items.map((item, index) => ({
          ...item,
          className: getStepClass(index),
        }))} 
        activeIndex={activeIndex} 
        readOnly={false} 
        onSelect={(e) => setActiveIndex(e.index)} 
      />
      {renderContent()}
    </>
  );
};