import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { RegisterDetailsResponse, BillDetail } from '../../../types/cashRegister';

interface Props {
  date: string;
}

const RegisterDetailsPanel: React.FC<Props> = ({ date }) => {
  const { t } = useTranslation();

  const { data: detailsData, isLoading, isError } = useQuery<RegisterDetailsResponse>({
    queryKey: ['cashRegisterDetails', date],
    queryFn: () => CashRegisterAPI.getDetails(date),
    enabled: !!date,
  });

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-8">
          <ProgressSpinner style={{ width: '50px', height: '50px' }} />
          <span className="ml-3 text-gray-600">{t('cashRegister.loading')}</span>
        </div>
      </Card>
    );
  }

  if (isError || !detailsData?.success || !detailsData.data) {
    return (
      <Card>
        <Message 
          severity="error" 
          text={t('cashRegister.error')}
          className="w-full"
        />
      </Card>
    );
  }

  const { data } = detailsData;

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString();
  };

  const formatDateTime = (timeString: string) => {
    return new Date(timeString).toLocaleString();
  };

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: data.summary?.currency || 'USD',
    }).format(numAmount);
  };

  const getDifferenceSeverity = (diff: number) => {
    if (diff > 0) return 'success';
    if (diff < 0) return 'danger';
    return 'info';
  };

  const getDifferenceLabel = (diff: number) => {
    if (diff > 0) return t('cashRegister.positiveDifference');
    if (diff < 0) return t('cashRegister.negativeDifference');
    return t('cashRegister.noDifference');
  };

  const billDetailColumns = [
    {
      field: 'bill_label',
      header: t('cashRegister.denomination'),
      body: (rowData: BillDetail) => (
        <span className="font-medium">{rowData.bill_label}</span>
      )
    },
    {
      field: 'quantity',
      header: t('cashRegister.quantity'),
      body: (rowData: BillDetail) => (
        <span className="text-center block font-medium">{rowData.quantity}</span>
      )
    },
    {
      field: 'bill_value',
      header: t('cashRegister.unitValue'),
      body: (rowData: BillDetail) => (
        <span className="text-blue-700 font-medium">
          {formatCurrency(parseFloat(rowData.bill_value))}
        </span>
      )
    },
    {
      field: 'total_amount',
      header: t('cashRegister.subtotal'),
      body: (rowData: BillDetail) => (
        <span className="font-bold text-green-700">
          {formatCurrency(parseFloat(rowData.total_amount))}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {t('cashRegister.viewDetails')}
        </h3>
        <p className="text-gray-600">
          {t('cashRegister.date')}: <span className="font-medium">{date}</span>
        </p>
        <div className="mt-2">
          <Tag 
            value={t(`cashRegister.status_${data.status.status}`)}
            severity="success"
            className="text-sm"
          />
        </div>
      </div>

      <Divider />

      {/* Daily Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {t('cashRegister.dailySummary')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h5 className="text-sm font-medium text-gray-600 mb-1">
              {t('cashRegister.openingAmount')}
            </h5>
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(data.summary.opening_total)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDateTime(data.status.opening_time)}
            </p>
          </div>
          <div className="text-center">
            <h5 className="text-sm font-medium text-gray-600 mb-1">
              {t('cashRegister.closingAmount')}
            </h5>
            <p className="text-2xl font-bold text-green-800">
              {formatCurrency(data.summary.closing_total)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatDateTime(data.status.closing_time)}
            </p>
          </div>
          <div className="text-center">
            <h5 className="text-sm font-medium text-gray-600 mb-1">
              {t('cashRegister.dailyDifference')}
            </h5>
            <Tag 
              value={formatCurrency(data.summary.difference)}
              severity={getDifferenceSeverity(data.summary.difference)}
              className="text-lg font-bold"
            />
            <p className="text-sm text-gray-500 mt-1">
              {getDifferenceLabel(data.summary.difference)}
            </p>
          </div>
        </div>
      </Card>

      {/* Opening Information */}
      {data.opening && (
        <Card>
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <i className="pi pi-play-circle text-blue-600 mr-2"></i>
              {t('cashRegister.opening')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-blue-50 p-4 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.cashier')}:
                </span>
                <p className="text-gray-800 font-medium">{data.opening.cashier.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.time')}:
                </span>
                <p className="text-gray-800 font-medium">{formatDateTime(data.opening.time)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.total')}:
                </span>
                <p className="text-gray-800 font-bold text-lg">{formatCurrency(data.opening.total_amount)}</p>
              </div>
            </div>
          </div>
          
          <DataTable 
            value={data.opening.details} 
            className="border rounded-lg overflow-hidden"
            stripedRows
            emptyMessage={t('cashRegister.noData')}
          >
            {billDetailColumns.map((col, index) => (
              <Column 
                key={index}
                field={col.field}
                header={col.header}
                body={col.body}
              />
            ))}
          </DataTable>
        </Card>
      )}

      {/* Closing Information */}
      {data.closing && (
        <Card>
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
              <i className="pi pi-stop-circle text-red-600 mr-2"></i>
              {t('cashRegister.closing')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 bg-green-50 p-4 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.cashier')}:
                </span>
                <p className="text-gray-800 font-medium">{data.closing.cashier.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.time')}:
                </span>
                <p className="text-gray-800 font-medium">{formatDateTime(data.closing.time)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.total')}:
                </span>
                <p className="text-gray-800 font-bold text-lg">{formatCurrency(data.closing.total_amount)}</p>
              </div>
            </div>
          </div>
          
          <DataTable 
            value={data.closing.details} 
            className="border rounded-lg overflow-hidden"
            stripedRows
            emptyMessage={t('cashRegister.noData')}
          >
            {billDetailColumns.map((col, index) => (
              <Column 
                key={index}
                field={col.field}
                header={col.header}
                body={col.body}
              />
            ))}
          </DataTable>
        </Card>
      )}

      {/* Additional Information */}
      <Card className="bg-gray-50">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">
          {t('cashRegister.additionalInfo')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">
              {t('cashRegister.recordId')}:
            </span>
            <span className="ml-2 text-gray-800">#{data.record_id}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">
              {t('cashRegister.currency')}:
            </span>
            <span className="ml-2 text-gray-800">{data.summary.currency}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">
              {t('cashRegister.openingCashier')}:
            </span>
            <span className="ml-2 text-gray-800">{data.status.opening_cashier.name}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">
              {t('cashRegister.closingCashier')}:
            </span>
            <span className="ml-2 text-gray-800">{data.status.closing_cashier.name}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RegisterDetailsPanel; 