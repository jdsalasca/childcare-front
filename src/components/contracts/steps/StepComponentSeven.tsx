import { LoadingInfo } from '@models/AppModels';
import { PDFDocument, PDFForm, rgb } from 'pdf-lib';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { customLogger } from '../../../configs/logger';
import { ContractInfo, defaultContractInfoFinished, Language } from '../types/ContractInfo';
import { FormGob } from '../types/formGob';
import { ContractPdf } from '../utils/contractPdfUtils';
import useGenerateContract from '../viewModels/useGenerateContract';
import { Functions } from '@utils/functions';
import { ChildMedicalInformation } from 'types/childMedicalInformation';
import { Guardian } from 'types/guardian';
import { MedicalInformation } from 'types/child';



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
  const fillFormFields = (form: PDFForm, contractInformation: ContractInfo) => {
    try {
      // Children Information
      const allChildrenNames = contractInformation.children
        ?.map(child => `${child.first_name} ${child.last_name}`)
        .join(', ');
      const allChildrenBirthDates = contractInformation.children
        ?.map(child => Functions.formatDateToMMDDYY(child.born_date))
        .join(', ');
  
      // Basic Contract Information
      form.getTextField('Childrens Name')?.setText(allChildrenNames || '');
      form.getTextField('Birthdates')?.setText(allChildrenBirthDates || '');
      form.getTextField('Enrollment Date 1')?.setText(Functions.formatDateToMMDDYY(contractInformation.start_date!) || '');
      form.getTextField('Date Care Ceased')?.setText(Functions.formatDateToMMDDYY(contractInformation.end_date!) || '');
  
      fillGuardianInformation(form, contractInformation.guardians);
      fillDates(form);
      //fillMedicalInformation(form, contractInformation.children?.[0]?.medicalInformation);
      form.getTextField('I (name)')?.setText(contractInformation.titularName || '');
      
      form.flatten();
    } catch (error) {
      customLogger.error('Error filling form fields:', error);
    }
  };
  
  const fillGuardianInformation = (form: PDFForm, guardians?: Guardian[]) => {
    const father = guardians?.find(g => g.guardian_type_id === 1);
    if (father) {
      form.getTextField('Name 1')?.setText(father.name || '');
      form.getTextField('Address 1')?.setText(father.address || '');
      form.getTextField('City 1')?.setText(father.city || '');
      form.getTextField('Phone 1')?.setText(father.phone || '');
    }
  
    const mother = guardians?.find(g => g.guardian_type_id === 2);
    if (mother) {
      form.getTextField('Name_2')?.setText(mother.name || '');
      form.getTextField('Address_2')?.setText(mother.address || '');
      form.getTextField('City 2')?.setText(mother.city || '');
      form.getTextField('Phone_2')?.setText(mother.phone || '');
    }
  };
  
  const fillDates = (form: PDFForm) => {
    const currentDate = Functions.formatDateToMMDDYY(new Date());
    form.getTextField('Consent date')?.setText("              "+currentDate || '');
    form.getTextField('Signature date')?.setText("                     "+currentDate || '');
    form.getTextField('Date of Signature of Parent or Guardian for form')?.setText("                                    "+currentDate || '');
  };
  
  const fillMedicalInformation = (form: PDFForm, medInfo?: MedicalInformation) => {
    if (medInfo) {
      form.getTextField('Health status')?.setText(medInfo.healthStatus || '');
      form.getTextField('Allergies')?.setText(medInfo.allergies || '');
      form.getTextField('Special Concerns')?.setText(medInfo.instructions || '');
    }
  };

  
  const onGenerateContractWithGob = async (contractInformation: ContractInfo, language: Language) => {
    customLogger.debug('onGenerateContractWithGob');
  
    // Generate initial contract
    const contractWi = await ContractPdf.contractBuilder(contractInformation, language).output("arraybuffer");
    const jsPdfDocument = await PDFDocument.load(contractWi);
  
    // Load and prepare external form
    const externalPdf = await PDFDocument.load(FormGob.contractVersion1);
    const form = externalPdf.getForm();
  
    // Remove the original page 3
    
  
    // Prepare guardian names
    const guardianNames = contractInformation.guardians
      ?.map(guardian => guardian.name + " " + guardian.last_name)
      .join(', ');
  
    // Duplicate page 3 for each child and insert after page 2
    let insertionIndex = 3; // Start after page 2
    for (const child of contractInformation.children || []) {
      // Copy page 3 for each child
      const [newPage] = await externalPdf.copyPages(externalPdf, [2]);
  
      // Get the size of the new page to ensure correct placement
      const { width, height } = newPage.getSize();

      newPage.drawText(child.classroom || '', {
        x: 200, // Adjust this value
        y: height - 621, // Adjust this value
        size: 12,
        color: rgb(0, 0, 0),
      });   
  
      // Add only the current child's name
      newPage.drawText(`${child.first_name} ${child.last_name}`, {
        x: 200, // Adjust this value
        y: height - 657, // Adjust this value
        size: 12,
        color: rgb(0, 0, 0),
      });
  
      // Add guardian names
      newPage.drawText(guardianNames || '', {
        x: 200, // Adjust this value
        y: height - 697, // Adjust this value
        size: 12,
        color: rgb(0, 0, 0),
      });
  
      // Insert the new page at the current insertion index
      externalPdf.insertPage(insertionIndex, newPage);
      insertionIndex++; // Increment the index for the next child
    }

  externalPdf.removePage(2);
    // Fill form fields
    fillFormFields(form, contractInformation);
  
    // Merge documents
    const copiedPages = await jsPdfDocument.copyPages(externalPdf, externalPdf.getPageIndices());
    copiedPages.forEach(page => jsPdfDocument.addPage(page));
  
    // Save and return result
    const mergedPdfBytes = await jsPdfDocument.saveAsBase64({ dataUri: true });
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
    } else {
      setErrorMessage(null);
      onGenerateContractWithGob(contractInfo, language);
    }
  };

  return (
    <div className="step-component-seven">
      {errorMessage ? (
        <div className="error-container">
          <Card
            title={t('ups')}
            className="error-card"
          >
            <p>{errorMessage}</p>
          </Card>
        </div>
      ) : receiptBase64 === undefined ? (
        <div className="waiting-container">
          <Card
            title={t('waitingForDecision')}
            className="waiting-card"
          >
            <p>{t('waitingForDecisionMessage')}</p>
          </Card>
        </div>
      ) : (
        <div className="pdf-container">
          <iframe
            src={`${receiptBase64}#page=1`}
            className="pdf-iframe"
            title="PDF Preview"
          />
        </div>
      )}
    </div>
  );
};

export default StepComponentSeven;

