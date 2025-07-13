import { Steps } from 'primereact/steps';
import { Toast } from 'primereact/toast';
import { useCallback, useMemo, useRef, useState } from 'react';
import StepComponentFour from './steps/StepComponentFour';
import StepComponentOne from './steps/StepComponentOne';
import StepComponentSeven from './steps/StepComponentSeven';
import StepComponentThree from './steps/StepComponentThree';
import StepComponentTwo from './steps/StepComponentTwo';
import { validateSchedule } from './utilsAndConstants';

import { customLogger } from 'configs/logger';
import { useTranslation } from 'react-i18next';
import { LoadingInfo } from '../../models/AppModels';
import { ContractModel } from '../../models/ContractAPI';
import { ContractPermissionsValidator } from '../../models/ContractPermissionsAPI';
import useDays from '../../models/customHooks/useDays';
import Loader from '../utils/Loader';
import StepComponentFive from './steps/StepComponentFive';
import { ContractInfo, defaultContractInfo } from './types/ContractInfo';
import { MedicalInformationForm } from './steps/medical/MedicalInformationForm';
import { FormulaInformationForm } from './steps/medical/FormulaInformationForm';
import { PermissionsInformationForm } from './steps/medical/PermissionsInformationForm';
import StepComponentPricing from './steps/StepComponentPricing';
import { ContractsErrorBoundary } from './ErrorBoundary';
import { performanceOptimizer } from '../../utils/PerformanceOptimizer';

// Define the props type for the component
type ContractsProps = {
  // Add any additional props if needed
};
// defaultContractInfo mockContract

export const Contracts: React.FC<ContractsProps> = () => {
  const [loadingInfo, setLoadingInfo] = useState(LoadingInfo.DEFAULT_MESSAGE);
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [contractInformation, setContractInformation] =
    useState<ContractInfo>(defaultContractInfo);
  const { laboralDays: daysCache } = useDays();
  const toast = useRef<Toast | null>(null);

  const getAcceptedPermissionsCount = useCallback(() => {
    const permissions = contractInformation?.terms;
    if (!permissions) {
      return `0/${ContractModel.CONTRACT_PERMISSIONS.length}`;
    }
    const totalPermissions = ContractModel.CONTRACT_PERMISSIONS.length;
    customLogger.debug('permissions', permissions);
    return `${ContractPermissionsValidator.getValidContractPermissions(permissions)}/${totalPermissions}`;
  }, [contractInformation?.terms]);

  const countChildrenWithMedicalInfo =
    performanceOptimizer.useOptimizedCalculation(
      () => {
        return (
          contractInformation?.children?.filter(
            child =>
              child?.medicalInformation?.healthStatus !== '' &&
              child?.medicalInformation?.healthStatus != null &&
              child?.medicalInformation?.instructions !== '' &&
              child?.medicalInformation?.instructions != null
          ).length || 0
        );
      },
      [contractInformation?.children],
      'medicalInfo'
    );

  const countChildrenWithFormulaInfo =
    performanceOptimizer.useOptimizedCalculation(
      () => {
        return (
          contractInformation?.children?.filter(
            child =>
              child?.formulaInformation?.formula !== '' &&
              child?.formulaInformation?.formula != null
          ).length || 0
        );
      },
      [contractInformation?.children],
      'formulaInfo'
    );

  const countChildrenWithPermissionsInfo =
    performanceOptimizer.useOptimizedCalculation(
      () => {
        return (
          contractInformation?.children?.filter(child => {
            const permissions = child?.permissionsInformation;
            return (
              permissions &&
              Object.entries(permissions)
                .filter(([key]) => key !== 'other')
                .some(([, value]) => value === true)
            );
          }).length || 0
        );
      },
      [contractInformation?.children],
      'permissionsInfo'
    );

  const getStepClass = useCallback(
    (stepIndex: number) => {
      switch (stepIndex) {
        case 0:
          return contractInformation.children?.[0]?.first_name
            ? 'step-valid'
            : 'step-invalid';
        case 1:
          return contractInformation.guardians?.[0]?.name
            ? 'step-valid'
            : 'step-invalid';
        case 2:
          return ContractPermissionsValidator.getValidContractPermissions(
            contractInformation.terms
          ) > 1
            ? 'step-valid'
            : 'step-invalid';
        case 3:
          const { total_to_pay, payment_method_id, start_date } =
            contractInformation;
          const isStep3Valid = total_to_pay && payment_method_id && start_date;
          return isStep3Valid ? 'step-valid' : 'step-invalid';
        case 4:
          return contractInformation.guardians?.[0]?.name
            ? 'step-valid'
            : 'step-valid';
        case 5:
          return validateSchedule(contractInformation?.schedule, daysCache)
            ? 'step-valid'
            : 'step-invalid';
        case 6:
          return countChildrenWithMedicalInfo ===
            (contractInformation.children?.length || 0)
            ? 'step-valid'
            : 'step-invalid';
        case 7:
          return countChildrenWithFormulaInfo ===
            (contractInformation.children?.length || 0)
            ? 'step-valid'
            : 'step-invalid';
        case 8:
          return countChildrenWithPermissionsInfo ===
            (contractInformation.children?.length || 0)
            ? 'step-valid'
            : 'step-invalid';
        case 9:
          return validateSchedule(contractInformation?.schedule, daysCache)
            ? 'step-valid'
            : 'step-invalid';
        default:
          return 'step-default';
      }
    },
    [
      contractInformation.children,
      contractInformation.guardians,
      contractInformation.terms,
      contractInformation.total_to_pay,
      contractInformation.payment_method_id,
      contractInformation.start_date,
      contractInformation.schedule,
      daysCache,
      countChildrenWithMedicalInfo,
      countChildrenWithFormulaInfo,
      countChildrenWithPermissionsInfo,
    ]
  );

  const items = useMemo(
    () => [
      {
        label: `${t('children')} (${contractInformation.children?.length || 0})`,
        command: () => setActiveIndex(0),
      },
      {
        label: `${t('guardians')} (${contractInformation.guardians?.length || 0})`,
        command: () => setActiveIndex(1),
      },
      {
        label: `${t('permissions')} (${getAcceptedPermissionsCount()})`,
        command: () => setActiveIndex(2),
      },
      {
        label: t('contract'),
        command: () => setActiveIndex(3),
      },
      {
        label: t('pricing'),
        command: () => setActiveIndex(4),
      },
      {
        label: t('schedule'),
        command: () => setActiveIndex(5),
      },
      {
        label: `${t('medicalInformation')} (${countChildrenWithMedicalInfo}/${contractInformation.children?.length || 0})`,
        command: () => setActiveIndex(6),
        /* disabled: contractInformation.children.length === 0, */
      },
      {
        label: `${t('formulaInformation')} (${countChildrenWithFormulaInfo}/${contractInformation.children?.length || 0})`,
        command: () => setActiveIndex(7),
        /* disabled: contractInformation.children.length === 0, */
      },
      {
        label: `${t('permissionsInformation')}(${countChildrenWithPermissionsInfo}/${contractInformation.children?.length || 0})`,
        command: () => setActiveIndex(8),
        /* disabled: contractInformation.children.length === 0, */
      },
      {
        label: t('contractGenerator'),
        command: () => setActiveIndex(9),
      },
    ],
    [
      t,
      contractInformation.children?.length,
      contractInformation.guardians?.length,
      getAcceptedPermissionsCount,
      countChildrenWithMedicalInfo,
      countChildrenWithFormulaInfo,
      countChildrenWithPermissionsInfo,
    ]
  );

  const renderContent = useMemo(() => {
    const commonProps = {
      setLoadingInfo,
      toast,
      setActiveIndex,
      contractInformation,
      setContractInformation,
    };

    switch (activeIndex) {
      case 0:
        return <StepComponentOne loadingInfo={loadingInfo} {...commonProps} />;
      case 1:
        return <StepComponentTwo {...commonProps} />;
      case 2:
        return <StepComponentThree {...commonProps} />;
      case 3:
        return <StepComponentFour {...commonProps} />;
      case 4:
        return <StepComponentPricing {...commonProps} />;
      case 5:
        return <StepComponentFive {...commonProps} />;
      case 6:
        return <MedicalInformationForm {...commonProps} />;
      case 7:
        return <FormulaInformationForm {...commonProps} />;
      case 8:
        return <PermissionsInformationForm {...commonProps} />;
      case 9:
        return <StepComponentSeven {...commonProps} />;
      default:
        return null;
    }
  }, [
    activeIndex,
    contractInformation,
    loadingInfo,
    setLoadingInfo,
    toast,
    setContractInformation,
  ]);

  return (
    <ContractsErrorBoundary>
      <Toast ref={toast} />
      {loadingInfo.loading && <Loader message={loadingInfo.loadingMessage} />}
      <div className='steps-wrapper my-2 px-2'>
        <Steps
          model={items.map((item, index) => ({
            ...item,
            className: `${getStepClass(index)} whitespace-nowrap text-xs`, // Added text-xs
          }))}
          className='c-steps-component overflow-x-auto'
          activeIndex={activeIndex}
          readOnly={false}
          onSelect={e => setActiveIndex(e.index)}
          pt={{
            root: { className: 'border-none' },
            step: { className: 'min-w-[120px] px-1' }, // Reduced min-width and padding
            action: { className: 'p-1' }, // Reduced padding
            label: { className: 'text-xs mt-1' }, // Smaller text size
            //number: { className: 'text-xs w-5 h-5 leading-5' }, // Smaller number size
          }}
        />
      </div>
      {renderContent}
    </ContractsErrorBoundary>
  );
};
