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
import { ChildType, MedicalInformation } from 'types/child';



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
        ?.map(child => Functions.formatDateToMMDDYY(child.born_date!))
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

  const fillFormFieldsForChild = async (form: PDFForm, contractInfo: ContractInfo, currentChild: ChildType) => {
    try {
      console.log("test", form.getFields());
       
      // Basic Child Information
      form.getTextField('Childrens Name')?.setText(`${currentChild.first_name} ${currentChild.last_name}`);
      form.getTextField('Birthdates')?.setText(Functions.formatDateToMMDDYY(currentChild.born_date!));
      
      // Contract Dates
      form.getTextField('Enrollment Date 1')?.setText(Functions.formatDateToMMDDYY(contractInfo.start_date!));
      form.getTextField('Date Care Ceased')?.setText(Functions.formatDateToMMDDYY(contractInfo.end_date!));
  
      // Guardian Information
      const father = contractInfo.guardians?.find(g => g.guardian_type_id === 1);
      if (father) {
        form.getTextField('Name 1')?.setText(father.name || '');
        form.getTextField('Address 1')?.setText(father.address || '');
        form.getTextField('City 1')?.setText(father.city || '');
        form.getTextField('Phone 1')?.setText(father.phone || '');
      }
  
      const mother = contractInfo.guardians?.find(g => g.guardian_type_id === 2);
      if (mother) {
        form.getTextField('Name_2')?.setText(mother.name || '');
        form.getTextField('Address_2')?.setText(mother.address || '');
        form.getTextField('City 2')?.setText(mother.city || '');
        form.getTextField('Phone_2')?.setText(mother.phone || '');
      }
  // Work Information - Father
if (father?.workInformation) {
  form.getTextField('Employer 3')?.setText(father.workInformation.employer || '');
  form.getTextField('Address_3')?.setText(father.workInformation.address || '');
  form.getTextField('City_3')?.setText(father.workInformation.city || '');
  form.getTextField('Phone_3')?.setText(father.workInformation.phone || '');
}

// Work Information - Mother
if (mother?.workInformation) {
  form.getTextField('Employer_4')?.setText(mother.workInformation.employer || '');
  form.getTextField('Address_4')?.setText(mother.workInformation.address || '');
  form.getTextField('City_4')?.setText(mother.workInformation.city || '');
  form.getTextField('Phone_4')?.setText(mother.workInformation.phone || '');
}

// Doctor Information
if (contractInformation.doctorInformation) {
  form.getTextField('Contact doctor')?.setText(contractInformation.doctorInformation.name || '');
  form.getTextField('Contact phone')?.setText(contractInformation.doctorInformation.phone || '');
  form.getTextField('Contact address')?.setText(contractInformation.doctorInformation.address || '');
      form.getTextField('Doctor(s), clinics or hospital')?.setText(contractInformation.doctorInformation.clinic || '');
    }
      // Medical Information
      if (currentChild.medicalInformation) {
        form.getTextField('Health status')?.setText(currentChild.medicalInformation.healthStatus || '');
        form.getTextField('Allergies')?.setText(currentChild.medicalInformation.allergies || '');
        form.getTextField('Special Concerns')?.setText(currentChild.medicalInformation.instructions || '');
      }
  
      // Current Date Fields
      const currentDate = Functions.formatDateToMMDDYY(new Date());
      form.getTextField('Consent date')?.setText("              " + currentDate);
      form.getTextField('Signature date')?.setText("                     " + currentDate);
      form.getTextField('Date of Signature of Parent or Guardian for form')?.setText("                                    " + currentDate);
  
      // Contract Holder Name
      form.getTextField('I (name)')?.setText(contractInfo.titularName || '');
  
    } catch (error) {
      customLogger.error('Error filling form fields for child:', error);
      throw new Error(`Error filling form fields for child: ${error}`);
    }
  };
  const onGenerateContractWithGob = async (contractInformation: ContractInfo, language: Language) => {
    customLogger.debug('onGenerateContractWithGob');
   // Prepare guardian names
   const guardianNames = contractInformation.guardians
   ?.map(guardian => guardian.name + " " + guardian.last_name)
   .join(', ');

    // Generate initial contract
    const contractWi = await ContractPdf.contractBuilder(contractInformation, language).output("arraybuffer");
    const jsPdfDocument = await PDFDocument.load(contractWi);
  
    // Load original form
    const originalPdf = await PDFDocument.load(FormGob.contractVersion1);
    
    // For each child, create a complete set of forms
    for (const child of contractInformation.children || []) {
      // Instead of creating a new PDF, copy the original one for each child
      const childPdf = await PDFDocument.load(FormGob.contractVersion1); // Load a fresh copy for each child
      const childForm = childPdf.getForm();
      console.log("childForm", childForm.getFields().map(field => field.getName()));
      
      // Fill form fields for this child
      const currentDate = Functions.formatDateToMMDDYY(new Date());
      
      // Basic Information
      childForm.getTextField('Childrens Name')?.setText(`${child.first_name} ${child.last_name}`);
      childForm.getTextField('Birthdates')?.setText(Functions.formatDateToMMDDYY(child.born_date!));
      childForm.getTextField('Enrollment Date 1')?.setText(Functions.formatDateToMMDDYY(contractInformation.start_date!));
      childForm.getTextField('Date Care Ceased')?.setText(Functions.formatDateToMMDDYY(contractInformation.end_date!));
      
      // Guardian Information
      const father = contractInformation.guardians?.find(g => g.guardian_type_id === 1);
      if (father) {
        childForm.getTextField('Name 1')?.setText(father.name || '');
        childForm.getTextField('Address 1')?.setText(father.address || '');
        childForm.getTextField('City 1')?.setText(father.city || '');
        childForm.getTextField('Phone 1')?.setText(father.phone || '');
      }
  
      const mother = contractInformation.guardians?.find(g => g.guardian_type_id === 2);
      if (mother) {
        childForm.getTextField('Name_2')?.setText(mother.name || '');
        childForm.getTextField('Address_2')?.setText(mother.address || '');
        childForm.getTextField('City 2')?.setText(mother.city || '');
        childForm.getTextField('Phone_2')?.setText(mother.phone || '');
      }
  
      // Dates
      childForm.getTextField('Consent date')?.setText("              " + currentDate);
      childForm.getTextField('Signature date')?.setText("                     " + currentDate);
      childForm.getTextField('Date of Signature of Parent or Guardian for form')?.setText("                                    " + currentDate);
      
      // Medical Information
      if (child.medicalInformation) {
        childForm.getTextField('Health status')?.setText(child.medicalInformation.healthStatus || '');
        childForm.getTextField('Allergies')?.setText(child.medicalInformation.allergies || '');
        childForm.getTextField('Special Concerns')?.setText(child.medicalInformation.instructions || '');
      }
  
      childForm.getTextField('I (name)')?.setText(contractInformation.titularName || '');
  
      // Flatten the form before copying pages
      childForm.flatten();
  
      // Get pages 0-2 from the filled childPdf
      const filledPages = await jsPdfDocument.copyPages(childPdf, [0, 1, 2]);
      
      // Add manual text to page 2
      const page2 = filledPages[2];
      const { height } = page2.getSize();
      page2.drawText(child.classroom || '', {
        x: 200,
        y: height - 621,
        size: 12,
        color: rgb(0, 0, 0),
      });   
  
      page2.drawText(`${child.first_name} ${child.last_name}`, {
        x: 200,
        y: height - 657,
        size: 12,
        color: rgb(0, 0, 0),
      });
  
      page2.drawText(guardianNames || '', {
        x: 200,
        y: height - 697,
        size: 12,
        color: rgb(0, 0, 0),
      });
  
  
      // Add pages to final document
      filledPages.forEach(page => jsPdfDocument.addPage(page));
    }
  
    // Add the last page
    const [lastPage] = await jsPdfDocument.copyPages(originalPdf, [3]);
    jsPdfDocument.addPage(lastPage);
  
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

