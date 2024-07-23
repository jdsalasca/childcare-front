import React, { useRef, useState, version } from 'react';
import { generateContractPdf } from './utils/contractPdfUtils'; // Adjust the path as per your file structure
import { Steps } from 'primereact/steps';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentTwo from './steps/StepComponentTwo';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentFour from './steps/StepComponentFour';
import { Toast } from 'primereact/toast';


const contractInformationDefault = {
    children: [{ name: '', age: '', id: '' }], // Initialize with empty fields
    guardians: [{ name: '', relationship: '', id: '' }], // Initialize with empty fields
    terms: {
        walkAroundNeighborhood: false,
        walkToThePark: false,
        walkAroundSchool: false,
        receiveManual: false,
        photosAllowed: false,
        externalPhotosAllowed: false,
        specialExternalUsage: false,
        externalUsageAllowed: false,
    }
};
export const Contracts = () => {

  const [activeIndex, setActiveIndex] = useState(0);
  const [contractInformation, setContractInformation] = useState(contractInformationDefault);
  const toast = useRef(null);

  const items = [
      {
          label: 'Children',
          command: (event) => {
              setActiveIndex(0);
          }
      },
      {
          label: 'Guardians',
          command: (event) => {
              setActiveIndex(1);
          }
      },
      {
          label: 'Permissions',
          command: (event) => {
              setActiveIndex(2);
          }
      },
      {
          label: 'Generador de contrato',
          command: (event) => {
              setActiveIndex(3);
          }
      }
  ];
  const renderContent = () => {
    switch (activeIndex) {
        case 0:
            return <StepComponentOne
            toast = {toast}
            setActiveIndex={setActiveIndex} 
            contractInformation={contractInformation} 
            setContractInformation={setContractInformation} 
            
            />;
        case 1:
            return <StepComponentTwo toast = {toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
        case 2:
            return <StepComponentThree  toast = {toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
        case 3:
            return <StepComponentFour toast = {toast} setActiveIndex={setActiveIndex} contractInformation={contractInformation} setContractInformation={setContractInformation} />;
        default:
            return null;
    }
};

  return (

    <>
    <Toast ref={toast} />
    <Steps model={items} 

    activeIndex={activeIndex} 
     readOnly={false}
    
     onClick={((e)=> {

      setActiveIndex(e)})} 

      />
    {renderContent()}
    </>
  );
};
