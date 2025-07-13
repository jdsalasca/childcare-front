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
import { motion } from 'framer-motion';
const calculateAgeCounts = (children: ChildType[]) => {
    return children.reduce((acc, child) => {
      const birthDate = new Date(child.born_date!);
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
  
  const { control, handleSubmit, setValue, watch } = useForm({
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
  }, [contractInformation.children, hasExistingCounts, setValue]);

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-4"
    >
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-6"
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          whileHover={{ scale: 1.005 }}
          transition={{ duration: 0.2 }}
        >
          <motion.h3 
            className="text-xl font-semibold text-center text-gray-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {t('priceCalculation')}
          </motion.h3>
  
          <div className="space-y-4">
            {/* Initial Fees Section */}
            <motion.div
              className="bg-gray-50 rounded-xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-base font-medium text-gray-700 mb-3">{t('initialFees')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'registrationCount', label: t('registrationFee'), rate: PRICES.REGISTRATION_FEE },
                  { name: 'activityCount', label: t('activityFee'), rate: PRICES.ACTIVITY_FEE }
                ].map((fee, index) => (
                  <motion.div
                    key={fee.name}
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-[120px]">
                        <div className="font-medium text-gray-700 text-sm">{fee.label}</div>
                        <div className="text-xs text-gray-500">${fee.rate}/{t('perChild')}</div>
                      </div>
                      <InputTextWrapper
                        control={control}
                        name={fee.name}
                        label=""
                        min={0}
                        showButtons
                        className="w-24"
                      />
                      <div className="text-right font-medium text-gray-900 min-w-[80px]">
                        ${(watchAllFields[fee.name as keyof typeof watchAllFields] * fee.rate).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
  
            {/* Care Services Section */}
            <motion.div
              className="bg-gray-50 rounded-xl p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-base font-medium text-gray-700 mb-3">{t('careServices')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'infantCount', label: t('infantCare'), rate: PRICES.RATES.INFANT },
                  { name: 'toddlerCount', label: t('toddlerCare'), rate: PRICES.RATES.TODDLER },
                  { name: 'preschoolCount', label: t('preschoolCare'), rate: PRICES.RATES.PRESCHOOL },
                  { name: 'schoolCount', label: t('schoolCare'), rate: PRICES.RATES.SCHOOL },
                  { name: 'transportationCount', label: t('transportation'), rate: PRICES.TRANSPORTATION }
                ].map((service, index) => (
                  <motion.div
                    key={service.name}
                    className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
                    whileHover={{ scale: 1.01 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-[120px]">
                        <div className="font-medium text-gray-700 text-sm">{service.label}</div>
                        <div className="text-xs text-gray-500">${service.rate}/{t('perChild')}</div>
                      </div>
                      <InputTextWrapper
                        control={control}
                        name={service.name}
                        label=""
                        min={0}
                        showButtons
                        className="w-24"
                      />
                      <div className="text-right font-medium text-gray-900 min-w-[80px]">
                        ${(watchAllFields[service.name as keyof typeof watchAllFields] * service.rate).toFixed(2)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
  
            {/* Total Section */}
            <motion.div
              className="bg-blue-50 rounded-xl p-4 shadow-md mt-6"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-lg font-bold text-gray-900 text-right">
                {t('estimatedTotal')}: ${total.toFixed(2)}
              </div>
            </motion.div>
          </div>
        </motion.div>
  
        <motion.div 
          className="flex justify-end gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            type="submit"
            label={t('save')}
            className="p-button-primary px-6 py-2 text-sm font-medium rounded-lg 
              hover:shadow-lg transition-all duration-200 hover:scale-105"
          />
          <Button
            label={t('returnToPreviousStep')}
            className="p-button-secondary px-6 py-2 text-sm font-medium rounded-lg 
              hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => setActiveIndex(3)}
          />
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default StepComponentPricing;