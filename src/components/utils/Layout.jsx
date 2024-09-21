
// src/Layout.js
import { Menubar } from 'primereact/menubar';
import PropTypes from 'prop-types'; // Import PropTypes
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useCustomNavigate from '../../utils/customHooks/useCustomNavigate';
import { LayoutModels } from './LayoutModels';

const Layout = ({ insideAuthApplication = false }) => {
  const customNavigate = useCustomNavigate();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  const basicItems = [
    LayoutModels.iconModel,
    LayoutModels.languageModel(handleLanguageChange, t),
  ]
  const items = [

    LayoutModels.iconModel,
    LayoutModels.homeModel(handleHomeClick),

    {
      label: <span className="menu-item-contracts">{t('contracts')}</span>,
      items: [
        { label: <span className="menu-item-contracts">{t('generateContract')}</span>, command: () => customNavigate('/contracts') },
        { label: <span className="menu-item-contracts">{t('reviewContracts')}</span>, command: () => customNavigate('/review-contracts') },
      ]
    },
    {
      label: <span className="menu-item-deposits">{t('deposits')}</span>,
      items: 
      [
        { label: <span className="menu-item-deposits">{t('manageBills')}</span>, command: () => customNavigate('/bills') },
        { label: <span className="menu-item-deposits">{t('migrateBills')}</span>, command: () => customNavigate('/migrate/bills') },
        // { label: t('uploadInvoices'), command: () => navigate('/bills-upload') }
      ]
    },
    {
      label: t('logout'),
      className: 'c-logout-item',
      command: () => {
        logout();
        navigate('auth/childadmin/admin/login');
      }
    },
    LayoutModels.languageModel(handleLanguageChange, t)
  ];

  return (
    <div className="layout">
      <Menubar model={insideAuthApplication? items : basicItems } style={{ justifyContent: 'center', zIndex:"1000" }} className='c-menubar' />
      <div className="main-content">
      <Outlet />
      </div>
    </div>
  );
};

Layout.propTypes = {
  // children: PropTypes.node.isRequired,
  insideAuthApplication: PropTypes.bool,
  
};  

export default Layout;
