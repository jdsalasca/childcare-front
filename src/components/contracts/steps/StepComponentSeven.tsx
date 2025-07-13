import { LoadingInfo } from '@models/AppModels';
import { PDFDocument, rgb } from 'pdf-lib';
import { Card } from 'primereact/card';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';
import { customLogger } from '../../../configs/logger';
import { ContractInfo, Language } from '../types/ContractInfo';
import { FormGob } from '../types/formGob';
import { ContractPdf } from '../utils/contractPdfUtils';
import useGenerateContract from '../viewModels/useGenerateContract';
import { Functions } from '@utils/functions';
import { mockContract } from '../../../data/mockContract';

interface StepComponentSevenProps {
  contractInformation?: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
  setActiveIndex: (index: number) => void;
  setLoadingInfo: (info: LoadingInfo) => void;
  toast: React.RefObject<any>; // Adjust the type as necessary for your toast object
}

const StepComponentSeven: React.FC<StepComponentSevenProps> = ({
  contractInformation = mockContract,
  toast,
}) => {
  const { t } = useTranslation();
  const [receiptBase64, setReceiptBase64] = useState<string | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { contractBuilder } = useGenerateContract({
    contractInformation,
    toast,
  });

  useEffect(() => {
    let isSubscribed = true;

    const handleLanguage = async () => {
      if (isSubscribed) {
        await handleLanguageSelection();
      }
    };

    handleLanguage();

    return () => {
      isSubscribed = false;
    };
  }, []);
  const handleLanguageSelection = async () => {
    const result = await Swal.fire({
      title: t('selectLanguageContract'),
      text: t('selectLanguageContractMessage'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: t('english'),
      cancelButtonText: t('spanish'),
    });
    if (result.isConfirmed) {
      handleDownloadPdf(Language.English);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      handleDownloadPdf(Language.Spanish);
    }
  };

  const onGenerateContractWithGob = async (
    contractInformation: ContractInfo,
    language: Language
  ) => {
    customLogger.debug('onGenerateContractWithGob');
    // Prepare guardian names
    const guardianNames = contractInformation.guardians
      ?.map(guardian => guardian.name + ' ' + guardian.last_name)
      .join(', ');

    // Generate initial contract
    const contractWi = await ContractPdf.contractBuilder(
      contractInformation,
      language
    ).output('arraybuffer');
    const jsPdfDocument = await PDFDocument.load(contractWi);

    // Load original form
    const originalPdf = await PDFDocument.load(FormGob.contractVersion1);

    // For each child, create a complete set of forms
    for (const child of contractInformation.children || []) {
      // Instead of creating a new PDF, copy the original one for each child
      const childPdf = await PDFDocument.load(FormGob.contractVersion1); // Load a fresh copy for each child
      const childForm = childPdf.getForm();

      // Fill form fields for this child
      const currentDate = Functions.formatDateToMMDDYY(new Date());
      // Add after line 179, before Emergency Contacts section
      // Provider and Staff Information

      // Basic Information
      childForm
        .getTextField('Childrens Name')
        ?.setText(`${child.first_name} ${child.last_name}`);
      childForm
        .getTextField('Birthdates')
        ?.setText(Functions.formatDateToMMDDYY(child.born_date!));
      childForm
        .getTextField('Enrollment Date 1')
        ?.setText(
          Functions.formatDateToMMDDYY(contractInformation.start_date!)
        );
      childForm
        .getTextField('Date Care Ceased')
        ?.setText(Functions.formatDateToMMDDYY(contractInformation.end_date!));

      // Guardian Information
      const father = contractInformation.guardians?.find(
        g => g.guardian_type_id === 1
      );
      const guardian = contractInformation.guardians?.find(
        g => g.guardian_type_id === 3
      );
      if (father) {
        childForm.getTextField('Name 1')?.setText(father.name || '');
        childForm.getTextField('Address 1')?.setText(father.address || '');
        childForm.getTextField('City 1')?.setText(father.city || '');
        childForm.getTextField('Phone 1')?.setText(father.phone || '');
      } else if (guardian) {
        childForm.getTextField('Name 1')?.setText(guardian.name || '');
        childForm.getTextField('Address 1')?.setText(guardian.address || '');
        childForm.getTextField('City 1')?.setText(guardian.city || '');
        childForm.getTextField('Phone 1')?.setText(guardian.phone || '');
        childForm
          .getTextField('Employer 3')
          ?.setText(guardian.workInformation?.employer ?? '');
        childForm
          .getTextField('Address_3')
          ?.setText(guardian.workInformation?.address ?? '');
        childForm
          .getTextField('City_3')
          ?.setText(guardian.workInformation?.city ?? '');
        childForm
          .getTextField('Phone_3')
          ?.setText(guardian.workInformation?.phone ?? '');
      }

      const mother = contractInformation.guardians?.find(
        g => g.guardian_type_id === 2
      );
      if (mother) {
        childForm.getTextField('Name_2')?.setText(mother.name || '');
        childForm.getTextField('Address_2')?.setText(mother.address || '');
        childForm.getTextField('City 2')?.setText(mother.city || '');
        childForm.getTextField('Phone_2')?.setText(mother.phone || '');
      } else if (guardian && father) {
        childForm.getTextField('Name_2')?.setText(guardian.name || '');
        childForm.getTextField('Address_2')?.setText(guardian.address || '');
        childForm.getTextField('City 2')?.setText(guardian.city || '');
        childForm.getTextField('Phone_2')?.setText(guardian.phone || '');
        childForm
          .getTextField('Employer_4')
          ?.setText(guardian.workInformation?.employer ?? '');
        childForm
          .getTextField('Address_4')
          ?.setText(guardian.workInformation?.address ?? '');
        childForm
          .getTextField('City_4')
          ?.setText(guardian.workInformation?.city ?? '');
        childForm
          .getTextField('Phone_4')
          ?.setText(guardian.workInformation?.phone ?? '');
      }
      // Work Information - Father
      if (father?.workInformation) {
        childForm
          .getTextField('Employer 3')
          ?.setText(father.workInformation.employer || '');
        childForm
          .getTextField('Address_3')
          ?.setText(father.workInformation.address || '');
        childForm
          .getTextField('City_3')
          ?.setText(father.workInformation.city || '');
        childForm
          .getTextField('Phone_3')
          ?.setText(father.workInformation.phone || '');
      }

      // Work Information - Mother
      if (mother?.workInformation) {
        childForm
          .getTextField('Employer_4')
          ?.setText(mother.workInformation.employer || '');
        childForm
          .getTextField('Address_4')
          ?.setText(mother.workInformation.address || '');
        childForm
          .getTextField('City_4')
          ?.setText(mother.workInformation.city || '');
        childForm
          .getTextField('Phone_4')
          ?.setText(mother.workInformation.phone || '');
      }

      // Doctor Information
      if (contractInformation.doctorInformation) {
        childForm
          .getTextField('Contact doctor')
          ?.setText(contractInformation.doctorInformation.name || '');
        childForm
          .getTextField('Contact phone')
          ?.setText(contractInformation.doctorInformation.phone || '');
        childForm
          .getTextField('Contact address')
          ?.setText(contractInformation.doctorInformation.address || '');
        childForm
          .getTextField('Doctor(s), clinics or hospital')
          ?.setText(contractInformation.doctorInformation.clinic || '');
      }

      // Released To Persons
      const totalReleaseFields = 4; // Total number of release person fields in the form
      for (let i = 0; i < totalReleaseFields; i++) {
        const abs = i + 5;
        const contact = contractInformation.emergencyContacts?.[i];
        const fieldPrefix = `Name_${abs}`;

        // Fill with contact info if exists, otherwise fill with "none"
        childForm.getTextField(fieldPrefix)?.setText(contact?.name || 'none');
        childForm
          .getTextField(`Address_${abs}`)
          ?.setText(contact?.address || 'none');
        childForm
          .getTextField(abs === 6 ? `City ${abs}` : `City_${abs}`)
          ?.setText(contact?.city || 'none');
        childForm
          .getTextField(`Phone_${abs}`)
          ?.setText(contact?.phone || 'none');
      }

      // Released To Persons
      contractInformation.releasedToPersons?.forEach((contact, index) => {
        const fieldPrefix = `Name_${index + 9}`;
        childForm.getTextField(fieldPrefix)?.setText(contact.name || '');
        childForm
          .getTextField(`Address_${index + 9}`)
          ?.setText(contact.address || '');
        childForm
          .getTextField(`City_${index + 9}`)
          ?.setText(contact.city || '');
        childForm
          .getTextField(`Phone_${index + 9}`)
          ?.setText(contact.phone || '');
      });
      // Dates
      childForm
        .getTextField('Consent date')
        ?.setText('              ' + currentDate);
      childForm
        .getTextField('Signature date')
        ?.setText('                     ' + currentDate);
      childForm
        .getTextField('Date of Signature of Parent or Guardian for form')
        ?.setText('                                    ' + currentDate);

      // Medical Information
      // Update the medical information section
      if (child.medicalInformation) {
        childForm
          .getTextField('Health status')
          ?.setText(child.medicalInformation.healthStatus || '');
        childForm
          .getTextField('Allergies')
          ?.setText(child.medicalInformation.allergies || '');
        childForm
          .getTextField('Special Concerns')
          ?.setText(child.medicalInformation.instructions || '');
        childForm
          .getTextField('Medication')
          ?.setText(child.medicalInformation.medication || '');
        childForm
          .getTextField('Provider/Director/Staff')
          ?.setText(child.medicalInformation.provider_director_staff || '');
        childForm
          .getTextField('Any activities children should NOT engage in')
          ?.setText(child.medicalInformation.restricted_activities || '');
        childForm
          .getTextField(
            'Company providing health andor accident insurance coverage Optional'
          )
          ?.setText(child.medicalInformation.insurance_company || '');
        childForm
          .getTextField('Consent to')
          ?.setText(child.medicalInformation.caregiver_name || '');
      }

      childForm
        .getTextField('I (name)')
        ?.setText(contractInformation.titularName || '');

      // Flatten the form before copying pages
      childForm.flatten();

      // Get pages 0-2 from the filled childPdf
      const filledPages = await jsPdfDocument.copyPages(childPdf, [0, 1, 2]);

      const page1 = filledPages[1];
      const { height: height1, width: width1 } = page1.getSize();

      // Define the common parameters for the rectangles

      // Define the y positions and corresponding heights for each rectangle
      const rectangles = [
        {
          x: 330,
          y: height1 - 350,
          height: 10,
          width: width1 - 200,
          color: 'white',
        }, // Special Concerns section
        {
          x: 110,
          y: height1 - 430,
          height: 10,
          width: width1 - 140,
          color: 'white',
        }, // Activities section
        {
          x: 306,
          y: height1 - 523,
          height: 10,
          width: width1 - 240,
          color: 'white',
        }, // Insurance section
        {
          x: 260,
          y: height1 - 569,
          height: 10,
          width: width1 - 270,
          color: 'white',
        }, // Certification section
        {
          x: 239,
          y: height1 - 615,
          height: 10,
          width: width1 - 270,
          color: 'white',
        }, // Certification section
      ];

      // Draw white rectangles over the black lines
      rectangles.forEach(rect => {
        page1.drawRectangle({
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height,
          color: rect.color ? rgb(1, 1, 1) : rgb(0, 0, 0), // Changed to white (1,1,1) to cover black lines
          opacity: 1, // Ensure full opacity
        });
      });

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

    const { guardians, children, total_to_pay, payment_method_id, start_date } =
      contractInfo;

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
    <div className='step-component-seven'>
      {errorMessage ? (
        <div className='error-container'>
          <Card title={t('ups')} className='error-card'>
            <p>{errorMessage}</p>
          </Card>
        </div>
      ) : receiptBase64 === undefined ? (
        <div className='waiting-container'>
          <Card title={t('waitingForDecision')} className='waiting-card'>
            <p>{t('waitingForDecisionMessage')}</p>
          </Card>
        </div>
      ) : (
        <div className='pdf-container'>
          <iframe
            src={`${receiptBase64}#page=30`}
            className='pdf-iframe'
            title='PDF Preview'
          />
        </div>
      )}
    </div>
  );
};

export default StepComponentSeven;
