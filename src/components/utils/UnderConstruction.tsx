import Lottie from "lottie-react";
import { useTranslation } from 'react-i18next';
import animationData from '../../assets/lottie/person_paper.json';

const UnderConstruction: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="c-under-construction">
      <Lottie animationData={animationData} width={20} height={10} className='c-lottie-animation standard' />
      <h2>{t('under_construction.title')}</h2>
      <p>{t('under_construction.message')}</p>
    </div>
  );
};

export { UnderConstruction };

