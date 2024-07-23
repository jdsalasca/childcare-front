import React, { useEffect, useState } from 'react';
import contractGenerator from '../utils/contractPdfUtils';
import { Button } from 'primereact/button';

const StepComponentFour = () => {
    const [receiptBase64, setReceiptBase64] = useState(undefined)
    useEffect(() => {
        handleDownloadPdf()
        return () => {
            
        };
    }, []);


    const handleDownloadPdf = () => {
        setReceiptBase64(contractGenerator());
    };

    return (
        <>
  <iframe src={receiptBase64 + '#page=1'} width="100%" height="500px" title="PDF Preview"></iframe>
  <div className="p-d-flex p-jc-center">
            <Button 
                label="Download Contract PDF" 
                icon="pi pi-download" 
                className="p-button-primary button-form-pdf"
                onClick={handleDownloadPdf} 
            />
        </div>

        </>

    );
};

export default StepComponentFour;
