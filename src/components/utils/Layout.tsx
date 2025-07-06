// src/Layout.tsx
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import useCustomNavigate from '../../utils/customHooks/useCustomNavigate';
import { LayoutModels } from './LayoutModels';

// Define the props for the Layout component
interface LayoutProps {
  insideAuthApplication?: boolean; // Optional prop
}

const Layout: React.FC<LayoutProps> = ({ insideAuthApplication = false }) => {
  const customNavigate = useCustomNavigate();
  const navigate = useNavigate();
  // TODO use when auth actived
  // const { logout } = useAuth();
  const { t, i18n } = useTranslation();

  const handleHomeClick = () => {
    customNavigate('/homepage');
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const basicItems = [
    LayoutModels.iconModel,
    LayoutModels.languageModel(handleLanguageChange, t),
  ];

  const items : MenuItem[]= [
    LayoutModels.iconModel,
    LayoutModels.homeModel(handleHomeClick),
    {label: t('Admin user'), items: [
      {label: t('New user'), command: () => customNavigate('/users')},
      
    ]},
    {
      label: t('contracts'), // Ensure this is a string
      items: [
        { label: t('generateContract'), command: () => customNavigate('/contracts') },
        { label: t('reviewContracts'), command: () => customNavigate('/review-contracts') },
      ],
    },
    {
      label: t('deposits'), // Ensure this is a string
      items: [
        { label: t('manageBills'), command: () => customNavigate('/bills') },
        { label: t('migrateBills'), command: () => customNavigate('/migrate/bills') },
        { label: t('cashRegister.title'), command: () => customNavigate('/deposits/cash-register') },
      ],
    },
    {
      label: t('logout'), // Ensure this is a string
      className: 'c-logout-item',
      command: () => {
        // TODO active when auth is actived
        // logout();
        navigate('/childadmin/admin');
      },
    },
    LayoutModels.languageModel(handleLanguageChange, t),
  ];

  return (
    <div className="layout">
      <Menubar model={insideAuthApplication ? items : basicItems} style={{ justifyContent: 'center', zIndex: "1000" }} className='c-menubar' />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
