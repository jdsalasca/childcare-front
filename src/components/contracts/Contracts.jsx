import React, { useEffect, useRef, useState, version } from 'react';
import { generateContractPdf } from './utils/contractPdfUtils'; // Adjust the path as per your file structure
import { Steps } from 'primereact/steps';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentTwo from './steps/StepComponentTwo';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentSeven from './steps/StepComponentSeven';
import { Toast } from 'primereact/toast';
import { defaultContractInfo, formatTime, validateSchedule } from './utilsAndConsts';
import StepComponentFour from './steps/StepComponentFour';

import { useTranslation } from 'react-i18next';
import StepComponentFive from './steps/StepComponentFive';
import StepComponentSix from './steps/StepComponentSix';
import { contractFake } from './utils/testContract';
import { loadingDefault } from '../../utils/constans';
import Loader from '../utils/Loader';
export const Contracts = () => {
  /**
   * @param setLoadingInfo :: defaultObject loadingDefault
   */
  const [loadingInfo, setLoadingInfo] = useState(loadingDefault)

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

  useEffect(() => {
    const { schedule } = contractInformation;
    let shouldUpdate = false;
    const updatedSchedule = {};
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].forEach(day => {
      const startKey = `${day}Start`;
      const endKey = `${day}End`;
      const startDate = new Date(schedule[startKey]);
      const endDate = new Date(schedule[endKey]);
      if (schedule[`${day}StartLabel`] !== formatTime(startDate) || schedule[`${day}EndLabel`] !== formatTime(endDate)) {
        updatedSchedule[startKey] = schedule[startKey];
        updatedSchedule[endKey] = schedule[endKey];
        updatedSchedule[`${day}StartLabel`] = formatTime(startDate);
        updatedSchedule[`${day}EndLabel`] = formatTime(endDate);
        shouldUpdate = true;
      }
    });
    console.log('====================================');
    console.log("updatedSchedule", updatedSchedule);
    console.log('====================================');
    if (shouldUpdate) {
      setContractInformation(prevContractInfo => ({
        ...prevContractInfo,
        schedule: {
          ...prevContractInfo.schedule,
          ...updatedSchedule
        }
      }));
    }
  }, [contractInformation.schedule]);

  const countChildrenWithMedicalInfo = () => {
    contractInformation?.children.forEach(child => console.log("child", child))
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
        return validateSchedule(contractInformation.schedule) ? 'step-valid' : 'step-invalid';
      case 5:
        return  countChildrenWithMedicalInfo() === contractInformation.children.length  ? 'step-valid' : 'step-invalid'; // Disable if no children
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
      label: t('schedule'),
      command: (event) => setActiveIndex(4)
    },
    {
      label: `${t('medicalInformation')} (${countChildrenWithMedicalInfo()}/${contractInformation.children.length})`,
      command: (event) => setActiveIndex(5),
      disabled: contractInformation.children.length === 0 // Disable tab if no children
    },
    {
      label: t('contractGenerator'),
      command: (event) => setActiveIndex(6)
    }
  ];
  
  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <StepComponentOne  setLoadingInfo={setLoadingInfo} toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 1:
        return <StepComponentTwo toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 2:
        return <StepComponentThree toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 3:
        return <StepComponentFour toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 4:
        return <StepComponentFive toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 5:
        return <StepComponentSix toast={toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
      case 6:
        return <StepComponentSeven toast={toast} setActiveIndex={setActiveIndex} 
        // contractInformation={contractInformation} 
        contractInformation={contractFake}
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