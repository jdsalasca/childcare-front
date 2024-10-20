import { LoadingInfo } from '@models/AppModels';
import { PDFDocument } from 'pdf-lib';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { customLogger } from '../../../configs/logger';
import { ContractInfo, defaultContractInfoFinished, Language } from '../types/ContractInfo';
import { FormGob } from '../types/formGob';
import { ContractPdf } from '../utils/contractPdfUtils';
import useGenerateContract from '../viewModels/useGenerateContract';



interface StepComponentSevenProps {
  contractInformation?: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  setActiveIndex: (index: number) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
  toast: React.RefObject<any>; // Adjust the type as necessary for your toast object
}

const StepComponentSeven: React.FC<StepComponentSevenProps> = ({
  contractInformation = defaultContractInfoFinished,
  toast,
}) => {
  const { t } = useTranslation();
  const [receiptBase64, setReceiptBase64] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { contractBuilder } = useGenerateContract({
    contractInformation,
    toast,
  });

  useEffect(() => {
    handleLanguageSelection();
  }, []);

  const handleLanguageSelection = async () => {
    const result = await Swal.fire({
      title: t('selectLanguageContract'),
      text: t('selectLanguageContractMessage'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('english'),
      cancelButtonText: t('spanish')
    })
    if (result.isConfirmed) {
      handleDownloadPdf(Language.English)
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      handleDownloadPdf(Language.Spanish)
    }
  }


  const onGenerateContractWithGob = async (contractInformation: ContractInfo, language : Language) => {
    customLogger.debug('onGenerateContractWithGob');
    defaultContractInfoFinished

    const contractWi = await ContractPdf.contractBuilder(contractInformation, language).output("arraybuffer");
    customLogger.debug('contractWi', contractWi);
    const jsPdfDocument = await PDFDocument.load(contractWi);
    customLogger.debug('jsPdfDocument', jsPdfDocument);
    const externalPdfBytes = FormGob.contractVersion1;
    const externalPdf = await PDFDocument.load(externalPdfBytes);

    const copiedPages = await jsPdfDocument.copyPages(
      externalPdf,
      externalPdf.getPageIndices()
    );
    
    copiedPages.forEach(page => {
      jsPdfDocument.addPage(page);
    });
    
    const mergedPdfBytes = await jsPdfDocument.saveAsBase64({ dataUri: true });
    customLogger.debug('mergedPdfBytes', mergedPdfBytes);
    setReceiptBase64(mergedPdfBytes);
    return jsPdfDocument.save();
  };

  const handleDownloadPdf = async (language: Language) => {
    const contractInfo = contractBuilder();
    customLogger.info('language', language);
    customLogger.debug('contractInformation handleDownloadPdf', contractInfo);
    
    const { guardians, children, total_to_pay, payment_method_id, start_date, end_date } = contractInfo;

    if (!guardians || guardians.length === 0 || !guardians[0].name) {
      setErrorMessage(t('noGuardians'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('noGuardians'),
        life: 3000,
      });
    } else if (!children || children.length === 0 || !children[0].first_name) {
      setErrorMessage(t('noChildren'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('noChildren'),
        life: 3000,
      });
    } else if (!total_to_pay) {
      setErrorMessage(t('totalAmountRequired'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('totalAmountRequired'),
        life: 3000,
      });
    } else if (!payment_method_id) {
      setErrorMessage(t('paymentMethodRequired'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('paymentMethodRequired'),
        life: 3000,
      });
    } else if (!start_date) {
      setErrorMessage(t('startDateRequired'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('startDateRequired'),
        life: 3000,
      });
    } else if (!end_date) {
      setErrorMessage(t('endDateRequired'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('endDateRequired'),
        life: 3000,
      });
    } else if (new Date(start_date) >= new Date(end_date)) {
      setErrorMessage(t('endDateAfterStartDate'));
      toast.current.show({
        severity: 'info',
        summary: t('ups'),
        detail: t('endDateAfterStartDate'),
        life: 3000,
      });
    } else {
      setErrorMessage(null);
      onGenerateContractWithGob(contractInfo, language);
    }
  };

  return (
    <>
      {errorMessage ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Card
            title={t('ups')}
            style={{
              width: '100%',
              marginBottom: '2em',
              marginTop: '5em',
              maxWidth: '50%',
            }}
          >
            <p>{errorMessage}</p>
          </Card>
        </div>
      ) : receiptBase64 === undefined ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            
          }}
        >
          <Card
            title={t('waitingForDecision')}
            style={{
              width: '100%',
              marginBottom: '2em',
              marginTop: '5em',
              maxWidth: '50%',
            }}
          >
            <p>{t('waitingForDecisionMessage')}</p>
          </Card>
        </div>
      ) : (
        <iframe
          src={`${receiptBase64}#page=1`}
          width="100%"
          height="800px"
          title="PDF Preview"
        />
      )}
      <div className="p-d-flex p-jc-center">
        <Button
          label={t('downloadContractPdf')}
          icon="pi pi-download"
          className="p-button-primary button-form-pdf"
          onClick={() => handleDownloadPdf(Language.English)}
        />
      </div>
    </>
  );
};

export default StepComponentSeven;
