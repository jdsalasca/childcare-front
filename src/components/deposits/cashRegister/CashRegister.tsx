import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { TabView, TabPanel } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ErrorBoundary from '../../utils/ErrorBoundary';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { CashRegisterStatusResponse } from '../../../types/cashRegister';
import CashRegisterForm from './CashRegisterForm';
import RegisterDetailsPanel from './RegisterDetailsPanel';
import ExcelReportButton from './ExcelReportButton';

interface CashRegisterProps {}

const CashRegister: React.FC<CashRegisterProps> = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // State management
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // Date range state for reports
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const formattedDate = selectedDate
    ? selectedDate.toISOString().slice(0, 10)
    : undefined;

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

  // Queries
  const {
    data: statusData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['cashRegisterStatus', formattedDate],
    queryFn: () =>
      formattedDate ? CashRegisterAPI.getStatus(formattedDate) : undefined,
    enabled: !!formattedDate,
    retry: false,
  });

  const { data: reportData, isLoading: reportLoading } = useQuery({
    queryKey: ['cashRegisterReport', reportFilters],
    queryFn: () => CashRegisterAPI.getReport(reportFilters),
    enabled: !!(startDate || endDate || statusFilter),
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({
      date,
      data,
      type,
    }: {
      date: string;
      data: any;
      type: 'open' | 'close';
    }) => {
      if (type === 'open') {
        return CashRegisterAPI.updateOpenRegister(date, data);
      } else {
        return CashRegisterAPI.updateCloseRegister(date, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashRegisterStatus'] });
      setIsEditing(false);
    },
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

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    confirmDialog({
      message: t('cashRegister.confirmCancelEdit'),
      header: t('cashRegister.confirmCancelEditHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => setIsEditing(false),
      reject: () => {},
    });
  }, [t]);

  const handleFormSuccess = useCallback(() => {
    refetch();
    setIsEditing(false);
  }, [refetch]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const renderStatusCard = () => {
    if (!hasData(statusData) || !statusData.data) return null;

    const { status, date } = statusData.data;

    return (
      <Card className='mb-6 shadow-sm border-l-4 border-l-blue-500'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex-shrink-0'>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  status === 'not_started'
                    ? 'bg-yellow-100'
                    : status === 'opened'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                }`}
              >
                <i
                  className={`pi ${
                    status === 'not_started'
                      ? 'pi-clock text-yellow-600'
                      : status === 'opened'
                        ? 'pi-unlock text-blue-600'
                        : 'pi-check text-green-600'
                  } text-xl`}
                ></i>
              </div>
            </div>
            <div>
              <h3 className='text-lg font-semibold text-gray-800'>
                {t(`cashRegister.status_${status}`)}
              </h3>
              <p className='text-sm text-gray-600'>
                {formattedDate && new Date(formattedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Tag
              value={t(`cashRegister.status_${status}`)}
              severity={getStatusSeverity(status)}
              className='text-sm font-medium'
            />
            {status !== 'not_started' && (
              <Button
                icon='pi pi-pencil'
                className='p-button-text p-button-sm'
                onClick={handleEdit}
                tooltip={t('cashRegister.editRegister')}
              />
            )}
          </div>
        </div>
      </Card>
    );
  };

  const renderDateSelector = () => (
    <Card className='mb-6 shadow-sm'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex-1'>
          <label
            htmlFor='date-picker'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            {t('cashRegister.selectDate')}
          </label>
          <Calendar
            id='date-picker'
            value={selectedDate}
            onChange={e => setSelectedDate(e.value || null)}
            dateFormat='yy-mm-dd'
            showIcon
            className='w-full'
            placeholder={t('cashRegister.selectDate')}
            maxDate={new Date()}
          />
        </div>
        {selectedDate && (
          <div className='text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg'>
            <i className='pi pi-calendar mr-2'></i>
            {selectedDate.toLocaleDateString()}
          </div>
        )}
      </div>
    </Card>
  );

  const renderReportSection = () => (
    <Card className='mb-6 shadow-sm'>
      <div className='mb-4'>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          {t('cashRegister.dateRangeReports')}
        </h2>
        <p className='text-gray-600 text-sm'>
          {t('cashRegister.generateReportsForDateRange')}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('cashRegister.startDate')}
          </label>
          <Calendar
            value={startDate}
            onChange={e => setStartDate(e.value || null)}
            dateFormat='yy-mm-dd'
            showIcon
            className='w-full'
            placeholder={t('cashRegister.selectStartDate')}
            maxDate={endDate || undefined}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('cashRegister.endDate')}
          </label>
          <Calendar
            value={endDate}
            onChange={e => setEndDate(e.value || null)}
            dateFormat='yy-mm-dd'
            showIcon
            className='w-full'
            placeholder={t('cashRegister.selectEndDate')}
            minDate={startDate || undefined}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('cashRegister.statusFilter')}
          </label>
          <Dropdown
            value={statusFilter}
            onChange={e => setStatusFilter(e.value)}
            options={statusOptions}
            placeholder={t('cashRegister.selectStatus')}
            className='w-full'
          />
        </div>

        <div className='flex items-end'>
          <ExcelReportButton filters={reportFilters} className='w-full' />
        </div>
      </div>

      {(startDate || endDate || statusFilter) && (
        <div className='flex flex-wrap gap-2 mt-4'>
          <span className='text-sm text-gray-600'>
            {t('cashRegister.activeFilters')}:
          </span>
          {startDate && (
            <Tag
              value={`${t('cashRegister.from')}: ${startDate.toLocaleDateString()}`}
              className='text-xs'
            />
          )}
          {endDate && (
            <Tag
              value={`${t('cashRegister.to')}: ${endDate.toLocaleDateString()}`}
              className='text-xs'
            />
          )}
          {statusFilter && (
            <Tag
              value={
                statusOptions.find(opt => opt.value === statusFilter)?.label
              }
              className='text-xs'
            />
          )}
          <Button
            icon='pi pi-times'
            className='p-button-text p-button-sm'
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
  );

  const renderReportTable = () => {
    if (!reportData?.data?.days) return null;

    return (
      <Card className='shadow-sm'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {t('cashRegister.reportResults')}
          </h3>
          <p className='text-sm text-gray-600'>
            {t('cashRegister.totalRecords')}: {reportData.total_records}
          </p>
        </div>

        <DataTable
          value={reportData.data.days}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          className='shadow-sm'
          emptyMessage={t('cashRegister.noDataFound')}
          loading={reportLoading}
        >
          <Column
            field='date'
            header={t('cashRegister.date')}
            sortable
            body={rowData => new Date(rowData.date).toLocaleDateString()}
          />
          <Column
            field='status'
            header={t('cashRegister.status')}
            sortable
            body={rowData => (
              <Tag
                value={t(`cashRegister.status_${rowData.status}`)}
                severity={getStatusSeverity(rowData.status)}
                className='text-xs'
              />
            )}
          />
          <Column
            field='opening.amount'
            header={t('cashRegister.openingAmount')}
            sortable
            body={rowData => formatCurrency(rowData.opening?.amount || 0)}
          />
          <Column
            field='closing.amount'
            header={t('cashRegister.closingAmount')}
            sortable
            body={rowData => formatCurrency(rowData.closing?.amount || 0)}
          />
          <Column
            field='difference'
            header={t('cashRegister.difference')}
            sortable
            body={rowData => (
              <span
                className={
                  rowData.difference >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {formatCurrency(rowData.difference)}
              </span>
            )}
          />
        </DataTable>
      </Card>
    );
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <Card>
          <div className='flex items-center justify-center py-12'>
            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            <span className='ml-3 text-gray-600'>
              {t('cashRegister.loading')}
            </span>
          </div>
        </Card>
      );
    }

    if (isError) {
      return (
        <Card>
          <Message
            severity='error'
            text={t('cashRegister.error')}
            className='w-full'
          />
        </Card>
      );
    }

    if (!selectedDate) {
      return (
        <Card>
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <i className='pi pi-calendar text-6xl'></i>
            </div>
            <h3 className='text-xl font-medium text-gray-600 mb-2'>
              {t('cashRegister.pleaseSelectDate')}
            </h3>
            <p className='text-gray-500'>
              {t('cashRegister.selectDateToContinue')}
            </p>
          </div>
        </Card>
      );
    }

    if (!hasData(statusData) || !statusData.data) {
      return (
        <Card>
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <i className='pi pi-exclamation-triangle text-6xl'></i>
            </div>
            <h3 className='text-xl font-medium text-gray-600 mb-2'>
              {t('cashRegister.noDataFound')}
            </h3>
            <p className='text-gray-500'>{t('cashRegister.tryAnotherDate')}</p>
          </div>
        </Card>
      );
    }

    return (
      <div className='space-y-6'>
        {renderStatusCard()}

        {isEditing ? (
          <CashRegisterForm
            date={formattedDate!}
            status={statusData.data.status}
            onSuccess={handleFormSuccess}
            onCancel={handleCancelEdit}
            isUpdate={true}
          />
        ) : (
          <>
            {statusData.data.status === 'not_started' && (
              <CashRegisterForm
                date={formattedDate!}
                status={statusData.data.status}
                onSuccess={handleFormSuccess}
                onCancel={handleCancelEdit}
                isUpdate={false}
              />
            )}

            {statusData.data.status === 'opened' && (
              <CashRegisterForm
                date={formattedDate!}
                status={statusData.data.status}
                onSuccess={handleFormSuccess}
                onCancel={handleCancelEdit}
                isUpdate={false}
              />
            )}

            {statusData.data.status === 'closed' && (
              <RegisterDetailsPanel date={formattedDate!} />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <ErrorBoundary>
      <div className='max-w-7xl mx-auto p-6'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            {t('cashRegister.title')}
          </h1>
          <p className='text-gray-600'>{t('cashRegister.description')}</p>
        </div>

        <TabView
          activeIndex={activeTabIndex}
          onTabChange={e => setActiveTabIndex(e.index)}
          className='shadow-sm'
        >
          <TabPanel header={t('cashRegister.dailyManagement')}>
            <div className='space-y-6'>
              {renderDateSelector()}
              {renderMainContent()}
            </div>
          </TabPanel>

          <TabPanel header={t('cashRegister.reports')}>
            <div className='space-y-6'>
              {renderReportSection()}
              {renderReportTable()}
            </div>
          </TabPanel>
        </TabView>

        <ConfirmDialog />
      </div>
    </ErrorBoundary>
  );
};

export default CashRegister;
