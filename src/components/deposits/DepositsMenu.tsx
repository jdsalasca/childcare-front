import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';

const DepositsMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation Header */}
   
      {/* Content Area */}
      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};

export default DepositsMenu; 