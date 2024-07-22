import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleHomeClick = () => {
    navigate('/');
  };

  const items = [
    {
        label: <div onClick={handleHomeClick} className="home-item"><i className="pi pi-home"></i></div>,
        className: 'home-item',
      },
    {
      label: 'Cajas',
      items: []
    },
    {
      label: 'Contratos',
      items: [
        { label: 'Generar contrato', command: () => navigate('/contracts') },
        { label: 'Active Users Report', command: () => navigate('/active-users-report') },
      ]
    },
    {
      label: 'Depósitos',
      items: [
        { label: 'Manage Students', command: () => navigate('/manage-students') }
      ]
    },
    {
      label: 'Logout',
      className: 'logout-item',
      command: () => {
        logout();
        navigate('/login');
      }
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
