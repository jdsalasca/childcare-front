import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { PRICES, AGE_RANGES } from '../data/prices';
import { ContractInfo } from '../types/ContractInfo';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { Toast } from 'primereact/toast';
import { LoadingInfo } from '@models/AppModels';
import { ChildType } from 'types/child';
const calculateAgeCounts = (children: ChildType[]) => {
    return children.reduce((acc, child) => {
      const birthDate = new Date(child.born_date);
      const today = new Date();
      const ageInYears = (today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  
      // Reset activityCount to 0 initially
      acc.activityCount = children.length;
      acc.registrationCount = children.length;
      acc.transportationCount = children.length;
      console.log("ageInYears", ageInYears);
      
  
      if (ageInYears < AGE_RANGES.INFANT.max) {
        acc.infantCount++;
      } else if (ageInYears >= AGE_RANGES.TODDLER.min && ageInYears < AGE_RANGES.TODDLER.max) {
        acc.toddlerCount++;
      } else if (ageInYears >= AGE_RANGES.PRESCHOOL.min && ageInYears < AGE_RANGES.PRESCHOOL.max) {
        acc.preschoolCount++;
      } else if (ageInYears >= AGE_RANGES.SCHOOL.min) {
        acc.schoolCount++;
      }
      return acc;
    }, {
      registrationCount: children.length,
      activityCount: 0,
      infantCount: 0,
      toddlerCount: 0,
      preschoolCount: 0,
      schoolCount: 0,
      transportationCount: 0
    });
  };
interface StepComponentPricingProps {
  setLoadingInfo: (info: LoadingInfo) => void
  toast: React.RefObject<Toast>,
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (info: ContractInfo) => void;
}

const StepComponentPricing: React.FC<StepComponentPricingProps> = ({
  setActiveIndex,
  toast,
  contractInformation,
  setContractInformation,
}) => {
  const { t } = useTranslation();
  const hasExistingCounts = contractInformation.serviceCounts && Object.keys(contractInformation.serviceCounts).length > 0;
  
  const { control, handleSubmit, setValue, watch, formState: { isValid, errors } } = useForm({
    defaultValues: hasExistingCounts 
      ? contractInformation.serviceCounts 
      : calculateAgeCounts(contractInformation.children || [])
  });

  // Auto-calculate initial counts based on children's ages
  useEffect(() => {
    if (contractInformation.children && !hasExistingCounts) {
      const counts = contractInformation.children.reduce((acc, child) => {
        const age = child.age || 0;
        if (age >= AGE_RANGES.INFANT.min && age < AGE_RANGES.INFANT.max) acc.infantCount++;
        else if (age >= AGE_RANGES.TODDLER.min && age < AGE_RANGES.TODDLER.max) acc.toddlerCount++;
        else if (age >= AGE_RANGES.PRESCHOOL.min && age < AGE_RANGES.PRESCHOOL.max) acc.preschoolCount++;
        else if (age >= AGE_RANGES.SCHOOL.min && age <= AGE_RANGES.SCHOOL.max) acc.schoolCount++;
        return acc;
      }, { infantCount: 0, toddlerCount: 0, preschoolCount: 0, schoolCount: 0 });
  
      Object.entries(counts).forEach(([key, value]) => {
        setValue(key as any, value);
      });
    }
  }, [contractInformation.children, setValue, hasExistingCounts]);

  // Watch all fields to calculate total
  const watchAllFields = watch();
  const total = (
    watchAllFields.registrationCount * PRICES.REGISTRATION_FEE +
    watchAllFields.activityCount * PRICES.ACTIVITY_FEE +
    watchAllFields.infantCount * PRICES.RATES.INFANT +
    watchAllFields.toddlerCount * PRICES.RATES.TODDLER +
    watchAllFields.preschoolCount * PRICES.RATES.PRESCHOOL +
    watchAllFields.schoolCount * PRICES.RATES.SCHOOL +
    watchAllFields.transportationCount * PRICES.TRANSPORTATION
  );

 
  const onSubmit = (data: any) => {
    const priceBreakdown = {
      registrationFees: data.registrationCount * PRICES.REGISTRATION_FEE,
      activityFees: data.activityCount * PRICES.ACTIVITY_FEE,
      infantCare: data.infantCount * PRICES.RATES.INFANT,
      toddlerCare: data.toddlerCount * PRICES.RATES.TODDLER,
      preschoolCare: data.preschoolCount * PRICES.RATES.PRESCHOOL,
      schoolCare: data.schoolCount * PRICES.RATES.SCHOOL,
      transportation: data.transportationCount * PRICES.TRANSPORTATION,
    };
  
    const serviceCounts = {
      registrationCount: data.registrationCount,
      activityCount: data.activityCount,
      infantCount: data.infantCount,
      toddlerCount: data.toddlerCount,
      preschoolCount: data.preschoolCount,
      schoolCount: data.schoolCount,
      transportationCount: data.transportationCount
    };
  
    setContractInformation({
      ...contractInformation,
      priceBreakdown,
      serviceCounts,
      total_to_pay: total.toFixed(2),
    });
  
    toast.current?.show({
      severity: 'success',
      summary: t('success'),
      detail: t('priceCalculationSaved'),
      life: 3000
    });
  
    setActiveIndex(5);
  };
  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">{t('priceCalculation')}</h3>
        
        <div className="space-y-4">
          {/* Registration Fee Row */}
          <div className="grid grid-cols-3 items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <span className="block font-medium text-gray-700">{t('registrationFee')}</span>
              <span className="text-sm text-gray-500">${PRICES.REGISTRATION_FEE}/child</span>
            </div>
            <InputTextWrapper
              control={control}
              name="registrationCount"
              label=""
              min={0}
              showButtons
              className="w-full"
            />
            <div className="text-right font-medium text-gray-900">
              ${(watchAllFields.registrationCount * PRICES.REGISTRATION_FEE).toFixed(2)}
            </div>
          </div>

          {/* Activity Fee Row */}
          <div className="grid grid-cols-3 items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <span className="block font-medium text-gray-700">{t('activityFee')}</span>
              <span className="text-sm text-gray-500">${PRICES.ACTIVITY_FEE}/child</span>
            </div>
            <InputTextWrapper
              control={control}
              name="activityCount"
              label=""
              min={0}
              showButtons
              className="w-full"
            />
            <div className="text-right font-medium text-gray-900">
              ${(watchAllFields.activityCount * PRICES.ACTIVITY_FEE).toFixed(2)}
            </div>
          </div>

          {/* Care Type Rows */}
          {[
            { name: 'infantCount', label: t('infantCare'), rate: PRICES.RATES.INFANT },
            { name: 'toddlerCount', label: t('toddlerCare'), rate: PRICES.RATES.TODDLER },
            { name: 'preschoolCount', label: t('preschoolCare'), rate: PRICES.RATES.PRESCHOOL },
            { name: 'schoolCount', label: t('schoolCare'), rate: PRICES.RATES.SCHOOL },
            { name: 'transportationCount', label: t('transportation'), rate: PRICES.TRANSPORTATION },
          ].map(({ name, label, rate }) => (
            <div key={name} className="grid grid-cols-3 items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <span className="block font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">${rate}/child</span>
              </div>
              <InputTextWrapper
                control={control}
                name={name}
                label=""
                min={0}
                showButtons
                className="w-full"
              />
              <div className="text-right font-medium text-gray-900">
                ${(watchAllFields[name as keyof typeof watchAllFields] * rate).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6">
          <div className="text-xl font-bold text-gray-900 text-right">
            {t('estimatedTotal')}: ${total.toFixed(2)}
          </div>
        </div>

        <div className='button-group'>
        <Button
            type='submit'
            label={t('save')}
            className='p-button-primary p-ml-2'
          />
          <Button
            label={t('returnToPreviousStep')}
            className='p-button-secondary p-ml-2'
            onClick={() => {
              setActiveIndex(3);
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default StepComponentPricing;