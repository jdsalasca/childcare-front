import React from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../utils/ErrorBoundary';

const DepositsMenu: React.FC = () => {
  // const { t } = useTranslation(); // Unused variable removed

  return (
    <ErrorBoundary>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Navigation Header */}

        {/* Content Area */}
        <div className='min-h-[400px]'>
          <Outlet />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DepositsMenu;
