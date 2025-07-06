import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card } from 'primereact/card';

const DepositsMenu: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Navigation Header */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {t('deposits')}
            </h1>
            <p className="text-gray-600">
              Gestión de depósitos y caja registradora
            </p>
          </div>
          <nav className="flex flex-wrap gap-2">
            <NavLink
              to="cash-register"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                }`
              }
            >
              <i className="pi pi-calculator mr-2"></i>
              {t('cashRegister.title')}
            </NavLink>
            {/* Aquí puedes agregar más enlaces a otros submódulos de depósitos en el futuro */}
          </nav>
        </div>
      </Card>

      {/* Content Area */}
      <div className="min-h-[400px]">
        <Outlet />
      </div>
    </div>
  );
};

export default DepositsMenu; 