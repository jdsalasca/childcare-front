
// src/Layout.js
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import useCustomNavigate from '../../utils/customHooks/useCustomNavigate';

const Layout = ({ children }) => {
  const navigate = useCustomNavigate()
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
      label: (
        <div className="logo-container">
          <img src={`${process.env.PUBLIC_URL}/educando_dashboard_logo.png`} alt="Cover" />
        </div>
      ),
      className: 'home-item',
    },
    {
      label: <div onClick={handleHomeClick} className="home-item"><i className="pi pi-home"></i></div>,
      className: 'home-item',
    },
    // {
    //   label: t('boxes'),
    //   items: []
    // },
    {
      label: <span className="menu-item-contracts">{t('contracts')}</span>,
      items: [
        { label: <span className="menu-item-contracts">{t('generateContract')}</span>, command: () => navigate('/contracts') },
        { label: <span className="menu-item-contracts">{t('reviewContracts')}</span>, command: () => navigate('/review-contracts') },
      ]
    },
    {
      label: <span className="menu-item-deposits">{t('deposits')}</span>,
      items: [
        { label: <span className="menu-item-deposits">{t('manageBills')}</span>, command: () => navigate('/bills') },
       
        // { label: t('uploadInvoices'), command: () => navigate('/bills-upload') }
      ]
    },
    {
      label: t('logout'),
      className: 'c-logout-item',
      command: () => {
        logout();
        navigate('/login');
      }
    },
    {
      label:  t('language'),
      className: 'c-logout-item',
      items: [
        { label: 'English', command: () => handleLanguageChange('en') },
        { label: 'Español', command: () => handleLanguageChange('es') },
      ]
    }
  ];

  return (
    <div className="layout">
      <Menubar model={items} style={{ justifyContent: 'center', zIndex:"1000" }} className='c-menubar' />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
