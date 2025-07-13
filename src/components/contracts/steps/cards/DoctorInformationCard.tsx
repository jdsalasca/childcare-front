// components/contracts/steps/cards/DoctorInformationCard.tsx
import { Card } from 'primereact/card';
import { useTranslation } from 'react-i18next';
import InputTextWrapper from '@components/formsComponents/InputTextWrapper';
import { Control } from 'react-hook-form';

interface DoctorInformationCardProps {
  control: Control<any>;
}

export const DoctorInformationCard: React.FC<DoctorInformationCardProps> = ({
  control,
}) => {
  const { t } = useTranslation();

  return (
    <Card className='mb-4'>
      <h5>{t('doctorInformation')}</h5>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <InputTextWrapper
          name='doctorInformation.name'
          control={control}
          label={t('doctorName')}
        />
        <InputTextWrapper
          name='doctorInformation.phone'
          control={control}
          label={t('doctorPhone')}
        />
        <InputTextWrapper
          name='doctorInformation.address'
          control={control}
          label={t('doctorAddress')}
        />
        <InputTextWrapper
          name='doctorInformation.city'
          control={control}
          label={t('doctorCity')}
        />
        <InputTextWrapper
          name='doctorInformation.clinic'
          control={control}
          label={t('clinic')}
        />
      </div>
    </Card>
  );
};
