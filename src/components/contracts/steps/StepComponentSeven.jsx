import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { customLogger } from '../../../configs/logger';
import contractGenerator from '../utils/contractPdfUtils';
import { defaultContractInfoFinished } from '../utilsAndConstants';

/**
 * TThis component renders the StepComponentSeven component which is responsible for handling the contract generation.
 * @param {Object} props - Component props.
 * @param {number} props.setActiveIndex - Callback function to set the active index of the current step.
 * @param {Object} props.contractInformation - Object containing the contract information.
 * @param {Object} props.setContractInformation - Callback function to set the contract information.        
 * @param {Object} props.toast - Toast object from primereact/toast.
 * @returns 
 */

//TODO improve children management on contract generation
// TODO define a default contract for the pages 3-6
// FIXME  improve the contract generation
const StepComponentSeven = ({ setActiveIndex, contractInformation = defaultContractInfoFinished, setContractInformation, toast, ...props }) => {
    const { t } = useTranslation();
    const [receiptBase64, setReceiptBase64] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        handleLanguageSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLanguageSelection = async () => {
        let language = 'en';
        const result = await Swal.fire({
            title: t('selectLanguageContract'),
            text: t('selectLanguageContractMessage'),
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: t('english'),
            cancelButtonText: t('spanish'),
        });

        if (result.isConfirmed) {
            language='en';
            handleDownloadPdf(language);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            language='es';
            handleDownloadPdf(language);
        }
    };

    /**
     * Method to handle the download of the contract PDF
     * @param {*} language 
     */
    //#region handleDownloadPdf
    const handleDownloadPdf = (language = 'en') => {
        customLogger.debug("contractInformation", contractInformation);
        
        const { guardians, children, total_to_pay, payment_method_id, start_date, end_date } = contractInformation;

        if (!guardians || guardians.length === 0 || guardians[0].name ==null || guardians[0].name === "" ) {
            setErrorMessage(t('noGuardians'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('noGuardians'), life: 3000 });
        } else if (!children || children.length === 0  || children[0].first_name ==null || children[0].first_name === "") {
            setErrorMessage(t('noChildren'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('noChildren'), life: 3000 });
        } else if (!total_to_pay) {
            setErrorMessage(t('totalAmountRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('totalAmountRequired'), life: 3000 });
        } else if (!payment_method_id) {
            setErrorMessage(t('paymentMethodRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('paymentMethodRequired'), life: 3000 });
        } else if (!start_date) {
            setErrorMessage(t('startDateRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('startDateRequired'), life: 3000 });
        } else if (!end_date) {
            setErrorMessage(t('endDateRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('endDateRequired'), life: 3000 });
        } else if (new Date(start_date) >= new Date(end_date)) {
            setErrorMessage(t('endDateAfterStartDate'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('endDateAfterStartDate'), life: 3000 });
        } else {
            setErrorMessage(null);
            setReceiptBase64(contractGenerator(contractInformation));
        }
    };

    return (
        <>
            {errorMessage ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Card title={t('ups')} style={{ width: '100%', marginBottom: '2em', marginTop: '5em', maxWidth: '50%' }}>
                        <p>{errorMessage}</p>
                    </Card>
                </div>
            ) : receiptBase64 === undefined ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Card title={t('waitingForDecision')} style={{ width: '100%', marginBottom: '2em', marginTop: '5em', maxWidth: '50%' }}>
                        <p>{t('waitingForDecisionMessage')}</p>
                    </Card>
                </div>
            ) : (
                <iframe src={receiptBase64 + '#page=1'} width="100%" height="500px" title="PDF Preview"></iframe>
            )}
            <div className="p-d-flex p-jc-center">
                <Button
                    label={t('downloadContractPdf')}
                    icon="pi pi-download"
                    className="p-button-primary button-form-pdf"
                    onClick={handleDownloadPdf}
                />
            </div>
        </>
    );
};

export default StepComponentSeven;