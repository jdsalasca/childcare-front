import React, { useState, version } from 'react';
import { generateContractPdf } from './utils/contractPdfUtils'; // Adjust the path as per your file structure
import { Steps } from 'primereact/steps';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentTwo from './steps/StepComponentTwo';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentFour from './steps/StepComponentFour';
export const Contracts = () => {

  const [activeIndex, setActiveIndex] = useState(0);

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
            return <StepComponentOne setActiveIndex={setActiveIndex} />;
        case 1:
            return <StepComponentTwo setActiveIndex={setActiveIndex} />;
        case 2:
            return <StepComponentThree setActiveIndex={setActiveIndex} />;
        case 3:
            return <StepComponentFour setActiveIndex={setActiveIndex} />;
        default:
            return null;
    }
};  

  return (

    <>
    <Steps model={items} 
    activeIndex={activeIndex} 
     readOnly={false}
    
     onClick={((e)=> {

      setActiveIndex(e)})} />
    {renderContent()}
    </>
  );
};
