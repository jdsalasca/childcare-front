import { Button } from 'primereact/button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const SessionExpired: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <div className="c-section-logout">
      <div className="message-container">
        <h3 id="title">{t('sessionExpired')}</h3> {/* Use t for translation */}
        <p>{t('sessionExpiredMessage')}</p> {/* Use t for translation */}
        <Button 
          type="button" 
          label={t('logIn')} // Use t for translation
          className="p-button-success p-button-lg" 
          onClick={() => navigate('/login')} 
        />
      </div>
    </div>
  );
};

export default SessionExpired;
