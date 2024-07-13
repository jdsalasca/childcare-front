// src/pages/HomePage.js
import React from 'react';
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';

const HomePage = () => {
  const navigate = useNavigate();

  const items = [
    {
      label: 'Reports',
      items: [
        { label: 'Payments by Date', command: () => navigate('/report-payments-by-date') },
        { label: 'Teachers', command: () => navigate('/report-teachers') },
        { label: 'Students', command: () => navigate('/report-students') }
      ]
    },
    {
      label: 'Users',
      items: [
        { label: 'Manage Users', command: () => navigate('/manage-users') },
        { label: 'Active Users Report', command: () => navigate('/active-users-report') },
        { label: 'Manage Guardians', command: () => navigate('/manage-guardians') }
      ]
    },
    {
      label: 'Students',
      items: [
        { label: 'Manage Students', command: () => navigate('/manage-students') },
        { label: 'New Contract', command: () => navigate('/new-contract') },
        { label: 'Contract Reports', command: () => navigate('/contract-reports') }
      ]
    },
    {
      label: 'Teachers',
      items: [
        { label: 'Manage Teachers', command: () => navigate('/manage-teachers') }
      ]
    },
    {
      label: 'Payments',
      items: [
        { label: 'Register Payment Form', command: () => navigate('/register-payment-form') },
        { label: 'Register Payments Excel', command: () => navigate('/register-payments-excel') }
      ]
    }
  ];

  return (
    <div className="homepage">
      <h1 className="homepage-title">Educando - generador de reportes</h1>
      <Menubar model={items}  style={{justifyContent:"center"}} />

      <div className="container-homepage-background" style={{marginTop:"10px"}}>
      <img src={`${process.env.PUBLIC_URL}/homepage_image.jpg`} 
      alt="Cover"
      style={{ maxWidth: '900px', maxHeight: '600px', 
      display: 'block', 
      margin: 'auto' }}
      />
      </div>
    </div>
  );
};

export default HomePage;
