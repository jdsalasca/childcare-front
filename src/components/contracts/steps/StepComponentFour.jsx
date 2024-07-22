import React from 'react';
import contractGenerator from '../utils/contractPdfUtils';
import { Button } from 'primereact/button';

const StepComponentFour = () => {
    const handleDownloadPdf = () => {
        contractGenerator();
    };

    return (
        <div className="p-d-flex p-jc-center">
            <Button 

                label="Download Contract PDF" 
                icon="pi pi-download" 
                className="p-button-primary button-form-pdf"
                onClick={handleDownloadPdf} 
            />
        </div>
    );
};

export default StepComponentFour;
