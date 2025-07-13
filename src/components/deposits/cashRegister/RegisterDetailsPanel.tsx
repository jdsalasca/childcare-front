import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { RegisterDetailsResponse } from '../../../types/cashRegister';
import { formatCurrency, getStatusIcon } from './constants';

interface RegisterDetailsPanelProps {
  date: string;
}

const RegisterDetailsPanel: React.FC<RegisterDetailsPanelProps> = ({
  date,
}) => {
  const { t } = useTranslation();

  const {
    data: detailsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cashRegisterDetails', date],
    queryFn: () => CashRegisterAPI.getDetails(date),
  });

  const hasData = (data: any): data is RegisterDetailsResponse => {
    return data && typeof data === 'object' && 'data' in data;
  };

  if (isLoading) {
    return (
      <Card className='shadow-sm'>
        <div className='flex items-center justify-center py-12'>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <span className='ml-3 text-gray-600'>
            {t('cashRegister.loadingDetails')}
          </span>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className='shadow-sm'>
        <Message
          severity='error'
          text={t('cashRegister.errorLoadingDetails')}
          className='w-full'
        />
      </Card>
    );
  }

  if (!hasData(detailsData) || !detailsData.data) {
    return (
      <Card className='shadow-sm'>
        <div className='text-center py-12'>
          <div className='text-gray-400 mb-4'>
            <i className='pi pi-exclamation-triangle text-6xl'></i>
          </div>
          <h3 className='text-xl font-medium text-gray-600 mb-2'>
            {t('cashRegister.noDetailsFound')}
          </h3>
          <p className='text-gray-500'>{t('cashRegister.tryAnotherDate')}</p>
        </div>
      </Card>
    );
  }

  const { data } = detailsData;
  const { opening, closing, summary, status } = data;

  const renderStatusSection = () => (
    <Card className='mb-6 shadow-sm border-l-4 border-l-blue-500'>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className='flex items-center gap-4'>
          <div className='flex-shrink-0'>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                status.status === 'not_started'
                  ? 'bg-yellow-100'
                  : status.status === 'opened'
                    ? 'bg-blue-100'
                    : 'bg-green-100'
              }`}
            >
              <i
                className={`pi ${getStatusIcon(status.status)} text-xl ${
                  status.status === 'not_started'
                    ? 'text-yellow-600'
                    : status.status === 'opened'
                      ? 'text-blue-600'
                      : 'text-green-600'
                }`}
              ></i>
            </div>
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-800'>
              {t(`cashRegister.status_${status.status}`)}
            </h3>
            <p className='text-sm text-gray-600'>
              {new Date(date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Tag
            value={t(`cashRegister.status_${status.status}`)}
            severity={
              status.status === 'not_started'
                ? 'warning'
                : status.status === 'opened'
                  ? 'info'
                  : 'success'
            }
            className='text-sm font-medium'
          />
        </div>
      </div>
    </Card>
  );

  const renderOpeningSection = () => {
    if (!opening) return null;

    return (
      <Card className='mb-6 shadow-sm border-l-4 border-l-blue-500'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            {t('cashRegister.openingDetails')}
          </h3>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <i className='pi pi-user'></i>
            <span>{opening.cashier.name}</span>
            <span>•</span>
            <i className='pi pi-clock'></i>
            <span>{new Date(opening.time).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-gray-700 mb-3'>
              {t('cashRegister.billsBreakdown')}
            </h4>
            <DataTable
              value={opening.details}
              className='text-sm'
              emptyMessage={t('cashRegister.noBillsFound')}
            >
              <Column
                field='bill_label'
                header={t('cashRegister.denomination')}
                body={rowData => (
                  <span className='font-medium'>{rowData.bill_label}</span>
                )}
              />
              <Column
                field='quantity'
                header={t('cashRegister.quantity')}
                body={rowData => (
                  <span className='text-right'>{rowData.quantity}</span>
                )}
              />
              <Column
                field='total_amount'
                header={t('cashRegister.total')}
                body={rowData => (
                  <span className='font-medium text-blue-600'>
                    {formatCurrency(Number(rowData.total_amount))}
                  </span>
                )}
              />
            </DataTable>
          </div>

          <div className='flex flex-col justify-center'>
            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='text-center'>
                <p className='text-sm text-gray-600 mb-1'>
                  {t('cashRegister.totalOpeningAmount')}
                </p>
                <p className='text-3xl font-bold text-blue-800'>
                  {formatCurrency(opening.total_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderClosingSection = () => {
    if (!closing) return null;

    return (
      <Card className='mb-6 shadow-sm border-l-4 border-l-green-500'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            {t('cashRegister.closingDetails')}
          </h3>
          <div className='flex items-center gap-2 text-sm text-gray-600'>
            <i className='pi pi-user'></i>
            <span>{closing.cashier.name}</span>
            <span>•</span>
            <i className='pi pi-clock'></i>
            <span>{new Date(closing.time).toLocaleTimeString()}</span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <h4 className='text-sm font-medium text-gray-700 mb-3'>
              {t('cashRegister.billsBreakdown')}
            </h4>
            <DataTable
              value={closing.details}
              className='text-sm'
              emptyMessage={t('cashRegister.noBillsFound')}
            >
              <Column
                field='bill_label'
                header={t('cashRegister.denomination')}
                body={rowData => (
                  <span className='font-medium'>{rowData.bill_label}</span>
                )}
              />
              <Column
                field='quantity'
                header={t('cashRegister.quantity')}
                body={rowData => (
                  <span className='text-right'>{rowData.quantity}</span>
                )}
              />
              <Column
                field='total_amount'
                header={t('cashRegister.total')}
                body={rowData => (
                  <span className='font-medium text-green-600'>
                    {formatCurrency(Number(rowData.total_amount))}
                  </span>
                )}
              />
            </DataTable>
          </div>

          <div className='flex flex-col justify-center'>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <div className='text-center'>
                <p className='text-sm text-gray-600 mb-1'>
                  {t('cashRegister.totalClosingAmount')}
                </p>
                <p className='text-3xl font-bold text-green-800'>
                  {formatCurrency(closing.total_amount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderSummarySection = () => {
    if (!summary) return null;

    const difference = summary.closing_total - summary.opening_total;
    const isPositive = difference >= 0;

    return (
      <Card className='shadow-sm border-l-4 border-l-purple-500'>
        <div className='mb-4'>
          <h3 className='text-lg font-semibold text-gray-800'>
            {t('cashRegister.summary')}
          </h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
            <div className='text-center'>
              <p className='text-sm text-gray-600 mb-1'>
                {t('cashRegister.openingTotal')}
              </p>
              <p className='text-2xl font-bold text-blue-800'>
                {formatCurrency(summary.opening_total)}
              </p>
            </div>
          </div>

          <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
            <div className='text-center'>
              <p className='text-sm text-gray-600 mb-1'>
                {t('cashRegister.closingTotal')}
              </p>
              <p className='text-2xl font-bold text-green-800'>
                {formatCurrency(summary.closing_total)}
              </p>
            </div>
          </div>

          <div
            className={`border rounded-lg p-4 ${
              isPositive
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className='text-center'>
              <p className='text-sm text-gray-600 mb-1'>
                {t('cashRegister.difference')}
              </p>
              <p
                className={`text-2xl font-bold ${
                  isPositive ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {formatCurrency(difference)}
              </p>
              <p
                className={`text-xs mt-1 ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive
                  ? t('cashRegister.surplus')
                  : t('cashRegister.shortage')}
              </p>
            </div>
          </div>
        </div>

        <Divider />

        <div className='flex justify-center'>
          <Button
            icon='pi pi-download'
            label={t('cashRegister.exportReport')}
            className='p-button-outlined'
            onClick={() => {
              // TODO: Implement export functionality
              console.log('Export report for date:', date);
            }}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className='space-y-6'>
      {renderStatusSection()}
      {renderOpeningSection()}
      {renderClosingSection()}
      {renderSummarySection()}
    </div>
  );
};

export default RegisterDetailsPanel;
