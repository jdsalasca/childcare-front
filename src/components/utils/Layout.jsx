
// src/Layout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const items = [
    {
      label: <div onClick={handleHomeClick} className="home-item"><i className="pi pi-home"></i></div>,
      className: 'home-item',
    },
    {
      label: t('boxes'),
      items: []
    },
    {
      label: t('contracts'),
      items: [
        { label: t('generateContract'), command: () => navigate('/contracts') },
        { label: t('reviewContracts'), command: () => navigate('/review-contracts') },
      ]
    },
    {
      label: t('deposits'),
      items: [
        { label: t('manageBills'), command: () => navigate('/bills') },
        { label: t('uploadInvoices'), command: () => navigate('/bills-upload') }
      ]
    },
    {
      label: t('logout'),
      className: 'logout-item',
      command: () => {
        logout();
        navigate('/login');
      }
    },
    {
      label: 'Language',
      className: 'logout-item',
      items: [
        { label: 'English', command: () => handleLanguageChange('en') },
        { label: 'Español', command: () => handleLanguageChange('es') },
      ]
    }
  ];

  return (
    <div className="layout">
      <Menubar model={items} style={{ justifyContent: 'center' }} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
