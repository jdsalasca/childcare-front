// components/contracts/steps/cards/WorkInformationCard.tsx
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { Control } from 'react-hook-form';

interface WorkInformationCardProps {
  control: Control<any>;
  index: number;
  guardianType: string;
}

export const WorkInformationCard: React.FC<WorkInformationCardProps> = ({
  control,
  index,
  guardianType
}) => {
  const { t } = useTranslation();

  return (
    <Card className="mb-4">
      <h5>{t('workInformation')} - {guardianType}</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputTextWrapper
          name={`guardians[${index}].workInformation.employer`}
          control={control}
          label={t('employer')}
        />
        <InputTextWrapper
          name={`guardians[${index}].workInformation.address`}
          control={control}
          label={t('workAddress')}
        />
        <InputTextWrapper
          name={`guardians[${index}].workInformation.city`}
          control={control}
          label={t('workCity')}
        />
        <InputTextWrapper
          name={`guardians[${index}].workInformation.phone`}
          control={control}
          label={t('workPhone')}
        />
      </div>
    </Card>
  );
};