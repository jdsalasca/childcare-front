import React, { useEffect, useState } from 'react';
import contractGenerator from '../utils/contractPdfUtils';
import { Button } from 'primereact/button';
import { defaultContractInfo } from '../utilsAndConsts';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';
const StepComponentFive = ({ setActiveIndex, contractInformation = defaultContractInfo, setContractInformation, toast, ...props }) => {
    const { t } = useTranslation();
    const [receiptBase64, setReceiptBase64] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        handleDownloadPdf();
        return () => {};
    }, []);

    const handleDownloadPdf = () => {
        const { guardians, children, totalAmount, paymentMethod, startDate, endDate } = contractInformation;

        if (!guardians || guardians.length === 0 || guardians[0].name ==null || guardians[0].name === "" ) {
            setErrorMessage(t('noGuardians'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('noGuardians'), life: 3000 });
        } else if (!children || children.length === 0  || children[0].name ==null || children[0].name === "") {
            setErrorMessage(t('noChildren'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('noChildren'), life: 3000 });
        } else if (!totalAmount) {
            setErrorMessage(t('totalAmountRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('totalAmountRequired'), life: 3000 });
        } else if (!paymentMethod) {
            setErrorMessage(t('paymentMethodRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('paymentMethodRequired'), life: 3000 });
        } else if (!startDate) {
            setErrorMessage(t('startDateRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('startDateRequired'), life: 3000 });
        } else if (!endDate) {
            setErrorMessage(t('endDateRequired'));
            toast.current.show({ severity: 'info', summary: t('ups'), detail: t('endDateRequired'), life: 3000 });
        } else if (new Date(startDate) >= new Date(endDate)) {
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

export default StepComponentFive;