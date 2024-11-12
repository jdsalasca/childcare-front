import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Controller, useForm } from 'react-hook-form';

import { Checkbox } from 'primereact/checkbox';
import { useTranslation } from 'react-i18next';
import { MedicalInfo } from '../types/MedicalInfo';
import { ContractInfo } from '../types/ContractInfo';
import { Toast } from 'primereact/toast';
import { InputTextAreaWrapper } from '@components/formsComponents/InputTextAreaWrapper';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import CheckboxWrapper from '@components/formsComponents/CheckboxWrapper';
import { ChildType } from 'types/child';
import { LoadingInfo } from '@models/AppModels';
import { customLogger } from 'configs/logger';

const defaultHealthInfo: MedicalInfo = {
  childName: '',
  healthStatus: '',
  treatment: '',
  allergies: '',
  instructions: '',
  formula: '',
  feedingTimes: ['', '', '', ''],
  maxBottleTime: '',
  minBottleTime: '',
  bottleAmount: '',
  feedingInstructions: '',
  otherFood: '',
  foodAllergies: '',
  followMealProgram: null,
  permissions: {
    soap: false,
    sanitizer: false,
    rashCream: false,
    teethingMedicine: false,
    sunscreen: false,
    insectRepellent: false,
    other: ''
  }
}

interface StepComponentSixProps {
  setActiveIndex: (index: number) => void;
  contractInformation: ContractInfo;
  setContractInformation: (contract: ContractInfo) => void;
  toast: React.RefObject<Toast>;
  setLoadingInfo: (info: LoadingInfo) => void;

}

export const StepComponentSix: React.FC<StepComponentSixProps> =
  ({ setActiveIndex, contractInformation, setContractInformation, toast, ...props }: StepComponentSixProps) => {
    const { t } = useTranslation();
    const { control, handleSubmit, setValue, formState: { errors }, reset } = useForm({
      defaultValues: {
        ...defaultHealthInfo
      }
    });
    const onChangeChild = (selectedChild: string) => {
      const childInfo = contractInformation.children.find(child =>
        `${child.first_name} ${child.last_name}` === selectedChild
      );

      if (childInfo) {
        reset({
          ...(childInfo.medicalInformation || defaultHealthInfo),
          childName: selectedChild
        });
      }
      return selectedChild;
    };


    const onSubmit = (data: MedicalInfo & { childName: string }) => {
      customLogger.info('onSubmit INFORMATION', data);
      if (data.childName) {
        const updatedChildren = contractInformation.children.map(child => {
          const fullName = `${child.first_name} ${child.last_name}`;
          if (fullName === data.childName) {
            return {
              ...child,
              medicalInformation: {
                healthStatus: data.healthStatus,
                treatment: data.treatment,
                allergies: data.allergies,
                instructions: data.instructions,
                formula: data.formula,
                feedingTimes: data.feedingTimes,
                maxBottleTime: data.maxBottleTime,
                minBottleTime: data.minBottleTime,
                bottleAmount: data.bottleAmount,
                feedingInstructions: data.feedingInstructions,
                otherFood: data.otherFood,
                foodAllergies: data.foodAllergies,
                followMealProgram: data.followMealProgram,
                permissions: data.permissions
              }
            };
          }
          return child;
        });

        setContractInformation({
          ...contractInformation,
          children: updatedChildren as ChildType[]
        });

        reset(defaultHealthInfo);
        toast.current?.show({ severity: 'success', summary: t('formSubmitted') });
      }
    };
    return (
      <div className='form-container children-health'>

        <form onSubmit={handleSubmit(onSubmit)}>
          <h4>{t('medicalInformation')}</h4>
          <div className="p-fluid">
            <div className="mb-4">
              <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                {t('childName')}
              </label>
              <Controller
                name="childName"
                control={control}
                rules={{ required: t('requiredField') }}
                render={({ field }) => (
                  <Dropdown
                    id="childName"
                    options={contractInformation.children.map(child => ({
                      label: `${child.first_name} ${child.last_name}`,
                      value: `${child.first_name} ${child.last_name}`
                    }))}
                    value={field.value}
                    onChange={(e) => field.onChange(onChangeChild(e.value))}
                    placeholder={t('selectChild')}
                    className={`w-full p-2 border rounded-md ${errors.childName ? 'border-red-500' : 'border-gray-300'}`}
                  />
                )}
              />
              {errors.childName && (
                <small className="text-red-500 text-xs mt-1">{errors.childName.message}</small>
              )}
            </div>
            <InputTextAreaWrapper
              name="healthStatus"
              control={control}
              label={t('healthStatus')}
              rules={{ required: t('requiredField') }}
            />

            <InputTextWrapper
              name="treatment"
              control={control}
              label={t('treatment')}
              rules={{ required: t('requiredField') }}
            />

            <InputTextAreaWrapper
              name="allergies"
              control={control}
              label={t('allergies')}
              rules={{ required: t('requiredField') }}
            />

            <InputTextAreaWrapper
              name="instructions"
              control={control}
              label={t('instructions')}
              rules={{ required: t('requiredField') }}
            />



            <h4>{t('babyFormulaAndFeeding')}</h4>


            <InputTextAreaWrapper
              name="formula"
              control={control}
              label={t('formula')}
              rules={{ required: t('requiredField') }}
            />

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {t('feedingTimes')}
  </label>
  <Controller
    name="feedingTimes"
    control={control}
    rules={{ required: t('requiredField') }}
    render={({ field }) => (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {field.value.map((time, index) => (
          <InputText
            key={index}
            value={time}
            onChange={(e) => {
              const newTimes = [...field.value];
              newTimes[index] = e.target.value;
              setValue('feedingTimes', newTimes);
            }}
            className="p-2 border rounded-md"
            placeholder={`${t('feeding')} ${index + 1}`}
          />
        ))}
      </div>
    )}
  />
  {errors.feedingTimes && (
    <small className="text-red-500 text-xs mt-1">{errors.feedingTimes.message}</small>
  )}
</div>

            <InputTextWrapper
              name="maxBottleTime"
              control={control}
              label={t('maxBottleTime')}
              rules={{ required: t('requiredField') }}
              keyfilter="int"
            />

            <InputTextWrapper
              name="minBottleTime"
              control={control}
              label={t('minBottleTime')}
              rules={{ required: t('requiredField') }}
              keyfilter="int"
            />

            <InputTextWrapper
              name="bottleAmount"
              control={control}
              label={t('bottleAmount')}
              rules={{ required: t('requiredField') }}
            />

            <InputTextAreaWrapper
              name="feedingInstructions"
              control={control}
              label={t('feedingInstructions')}
              rules={{ required: t('requiredField') }}
            />

            <InputTextAreaWrapper
              name="otherFood"
              control={control}
              label={t('otherFood')}
              rules={{ required: t('requiredField') }}
            />

            <InputTextAreaWrapper
              name="foodAllergies"
              control={control}
              label={t('foodAllergies')}
              rules={{ required: t('requiredField') }}
            />

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    {t('followMealProgram')}
  </label>
  <Controller
    name="followMealProgram"
    control={control}
    rules={{ required: t('requiredField') }}
    render={({ field }) => (
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <Checkbox
            checked={field.value === true}
            onChange={(e) => setValue('followMealProgram', e.checked ? true : null)}
            className="w-4 h-4"
          />
          <span className="text-sm">{t('yes')}</span>
        </label>
        <label className="flex items-center gap-2">
          <Checkbox
            checked={field.value === false}
            onChange={(e) => setValue('followMealProgram', e.checked ? false : null)}
            className="w-4 h-4"
          />
          <span className="text-sm">{t('no')}</span>
        </label>
      </div>
    )}
  />
  {errors.followMealProgram && (
    <small className="text-red-500 text-xs mt-1">{errors.followMealProgram.message}</small>
  )}
</div>

            <h4>{t('permissionForProducts')}</h4>

            <CheckboxWrapper
              name="permissions.soap"
              control={control}
              label={t('soap')}
            />

            <CheckboxWrapper
              name="permissions.sanitizer"
              control={control}
              label={t('sanitizer')}
            />

            <CheckboxWrapper
              name="permissions.rashCream"
              control={control}
              label={t('rashCream')}
            />

            <CheckboxWrapper
              name="permissions.teethingMedicine"
              control={control}
              label={t('teethingMedicine')}
            />

            <CheckboxWrapper
              name="permissions.sunscreen"
              control={control}
              label={t('sunscreen')}
            />

            <CheckboxWrapper
              name="permissions.insectRepellent"
              control={control}
              label={t('insectRepellent')}
            />

            <InputTextWrapper
              name="permissions.other"
              control={control}
              label={t('other')}
            />

            <Button type="submit" label={t('submit')} />
          </div>
        </form>
      </div>
    );
  }

export default StepComponentSix;