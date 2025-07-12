import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { CashRegisterStatusResponse } from '../../../types/cashRegister';
import OpenRegisterForm from './OpenRegisterForm';
import CloseRegisterForm from './CloseRegisterForm';
import RegisterDetailsPanel from './RegisterDetailsPanel';
import ExcelReportButton from './ExcelReportButton';

const CashRegister: React.FC = () => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Date range state for reports
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const formattedDate = selectedDate ? selectedDate.toISOString().slice(0, 10) : undefined;

  // Status filter options
  const statusOptions = [
    { label: t('cashRegister.all'), value: '' },
    { label: t('cashRegister.status_opened'), value: 'opened' },
    { label: t('cashRegister.status_closed'), value: 'closed' },
    { label: t('cashRegister.status_both'), value: 'both' },
    { label: t('cashRegister.status_not_started'), value: 'not_started' },
  ];

  // Generate filters for reports
  const reportFilters = {
    start_date: startDate ? startDate.toISOString().slice(0, 10) : undefined,
    end_date: endDate ? endDate.toISOString().slice(0, 10) : undefined,
    status: statusFilter || undefined,
  };

  const hasData = (data: any): data is CashRegisterStatusResponse => {
    return data && typeof data === 'object' && 'data' in data;
  };

  const {
    data: statusData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['cashRegisterStatus', formattedDate],
    queryFn: () => formattedDate ? CashRegisterAPI.getStatus(formattedDate) : undefined,
    enabled: !!formattedDate,
    retry: false,
  });

  const getStatusSeverity = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'warning';
      case 'opened':
        return 'info';
      case 'closed':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">


      {/* Date Range Report Section */}
      <Card className="mb-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t('cashRegister.dateRangeReports')}
          </h2>
          <p className="text-gray-600 text-sm">
            {t('cashRegister.generateReportsForDateRange')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-2">
              {t('cashRegister.startDate')}
            </label>
            <Calendar
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.value ?? null)}
              dateFormat="yy-mm-dd"
              showIcon
              className="w-full"
              placeholder={t('cashRegister.selectStartDate')}
              maxDate={endDate || undefined}
            />
          </div>
          
          <div>
            <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-2">
              {t('cashRegister.endDate')}
            </label>
            <Calendar
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.value ?? null)}
              dateFormat="yy-mm-dd"
              showIcon
              className="w-full"
              placeholder={t('cashRegister.selectEndDate')}
              minDate={startDate || undefined}
            />
          </div>
          
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
              {t('cashRegister.statusFilter')}
            </label>
            <Dropdown
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.value)}
              options={statusOptions}
              placeholder={t('cashRegister.selectStatus')}
              className="w-full"
            />
          </div>
          
          <div className="flex items-end">
            <ExcelReportButton 
              filters={reportFilters}
              className="w-full"
            />
          </div>
        </div>
        
        {(startDate || endDate || statusFilter) && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-600">{t('cashRegister.activeFilters')}:</span>
            {startDate && (
              <Tag 
                value={`${t('cashRegister.from')}: ${startDate.toLocaleDateString()}`}
                className="text-xs"
              />
            )}
            {endDate && (
              <Tag 
                value={`${t('cashRegister.to')}: ${endDate.toLocaleDateString()}`}
                className="text-xs"
              />
            )}
            {statusFilter && (
              <Tag 
                value={statusOptions.find(opt => opt.value === statusFilter)?.label}
                className="text-xs"
              />
            )}
            <Button
              icon="pi pi-times"
              className="p-button-text p-button-sm"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setStatusFilter('');
              }}
              tooltip={t('cashRegister.clearFilters')}
            />
          </div>
        )}
      </Card>

      <Divider />

      {/* Individual Day Management */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {t('cashRegister.dailyManagement')}
        </h2>
      </div>

      {/* Date Selection */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <label htmlFor="date-picker" className="block text-sm font-medium text-gray-700 mb-2">
              {t('cashRegister.date')}
            </label>
            <Calendar
              id="date-picker"
              value={selectedDate ?? null}
              onChange={(e) => setSelectedDate(e.value ?? null)}
              dateFormat="yy-mm-dd"
              showIcon
              className="w-full"
              placeholder={t('cashRegister.selectDate')}
            />
          </div>
          {selectedDate && (
            <div className="text-sm text-gray-500">
              {selectedDate.toLocaleDateString()}
            </div>
          )}
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <div className="flex items-center justify-center py-8">
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            <span className="ml-3 text-gray-600">{t('cashRegister.loading')}</span>
          </div>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card>
          <Message 
            severity="error" 
            text={t('cashRegister.error')}
            className="w-full"
          />
        </Card>
      )}

      {/* Status and Actions */}
      {hasData(statusData) && statusData.data && (
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {t('cashRegister.status')}
                </h2>
                <Tag 
                  value={t(`cashRegister.status_${statusData.data.status}`)}
                  severity={getStatusSeverity(statusData.data.status)}
                  className="text-sm"
                />
              </div>
              <div className="text-sm text-gray-500">
                {formattedDate && (
                  <time dateTime={formattedDate}>
                    {new Date(formattedDate).toLocaleDateString()}
                  </time>
                )}
              </div>
            </div>
          </Card>

          {/* Action Forms */}
          {statusData.data.status === 'not_started' && formattedDate && (
            <Card>
              <OpenRegisterForm date={formattedDate} onSuccess={refetch} />
            </Card>
          )}

          {statusData.data.status === 'opened' && formattedDate && (
            <Card>
              <CloseRegisterForm date={formattedDate} onSuccess={refetch} />
            </Card>
          )}

          {statusData.data.status === 'closed' && formattedDate && (
            <Card>
              <RegisterDetailsPanel date={formattedDate} />
            </Card>
          )}
        </div>
      )}

      {/* No Date Selected */}
      {!selectedDate && !isLoading && (
        <Card>
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <i className="pi pi-calendar text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {t('cashRegister.pleaseSelectDate')}
            </h3>
            <p className="text-gray-500">
              {t('cashRegister.selectDate')}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CashRegister; 