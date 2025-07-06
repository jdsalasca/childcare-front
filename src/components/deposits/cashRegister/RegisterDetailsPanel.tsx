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
import { RegisterDetailsResponse } from '../../../types/cashRegister';
import { BILL_TYPES, getBillTypeLabel, getBillTypeValue, calculateBillTotal } from './constants';

interface Props {
  date: string;
}

const RegisterDetailsPanel: React.FC<Props> = ({ date }) => {
  const { t } = useTranslation();

  const { data: detailsData, isLoading, isError } = useQuery({
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

  if (isError || !detailsData?.data) {
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const openingTotal = data.opening ? calculateBillTotal(data.opening.bills) : 0;
  const closingTotal = data.closing ? calculateBillTotal(data.closing.bills) : 0;
  const difference = closingTotal - openingTotal;

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
      </div>

      <Divider />

      {/* Daily Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              {t('cashRegister.openingAmount')}
            </h4>
            <p className="text-2xl font-bold text-blue-800">
              {formatCurrency(openingTotal)}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              {t('cashRegister.closingAmount')}
            </h4>
            <p className="text-2xl font-bold text-green-800">
              {formatCurrency(closingTotal)}
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              {t('cashRegister.dailyDifference')}
            </h4>
            <Tag 
              value={formatCurrency(difference)}
              severity={getDifferenceSeverity(difference)}
              className="text-lg font-bold"
            />
            <p className="text-sm text-gray-500 mt-1">
              {getDifferenceLabel(difference)}
            </p>
          </div>
        </div>
      </Card>

      {/* Opening Information */}
      {data.opening && (
        <Card>
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              {t('cashRegister.opening')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <p className="text-gray-800 font-medium">{formatTime(data.opening.time)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.total')}:
                </span>
                <p className="text-gray-800 font-medium">{formatCurrency(openingTotal)}</p>
              </div>
            </div>
          </div>
          
          <DataTable 
            value={data.opening.bills} 
            className="border rounded-lg overflow-hidden"
            stripedRows
          >
            <Column 
              field="bill_type_id" 
              header={t('cashRegister.denomination')} 
              body={(rowData) => (
                <span className="font-medium">{getBillTypeLabel(rowData.bill_type_id)}</span>
              )}
            />
            <Column 
              field="quantity" 
              header={t('cashRegister.quantity')}
              body={(rowData) => (
                <span className="text-center block">{rowData.quantity}</span>
              )}
            />
            <Column 
              header={t('cashRegister.subtotal')} 
              body={(rowData) => {
                const quantity = Number(rowData.quantity) || 0;
                const denomination = getBillTypeValue(rowData.bill_type_id);
                const subtotal = quantity * denomination;
                return (
                  <span className="font-medium text-green-700">
                    {formatCurrency(subtotal)}
                  </span>
                );
              }}
            />
          </DataTable>
        </Card>
      )}

      {/* Closing Information */}
      {data.closing && (
        <Card>
          <div className="mb-4">
            <h4 className="text-xl font-semibold text-gray-800 mb-3">
              {t('cashRegister.closing')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                <p className="text-gray-800 font-medium">{formatTime(data.closing.time)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  {t('cashRegister.total')}:
                </span>
                <p className="text-gray-800 font-medium">{formatCurrency(closingTotal)}</p>
              </div>
            </div>
          </div>
          
          <DataTable 
            value={data.closing.bills} 
            className="border rounded-lg overflow-hidden"
            stripedRows
          >
            <Column 
              field="bill_type_id" 
              header={t('cashRegister.denomination')} 
              body={(rowData) => (
                <span className="font-medium">{getBillTypeLabel(rowData.bill_type_id)}</span>
              )}
            />
            <Column 
              field="quantity" 
              header={t('cashRegister.quantity')}
              body={(rowData) => (
                <span className="text-center block">{rowData.quantity}</span>
              )}
            />
            <Column 
              header={t('cashRegister.subtotal')} 
              body={(rowData) => {
                const quantity = Number(rowData.quantity) || 0;
                const denomination = getBillTypeValue(rowData.bill_type_id);
                const subtotal = quantity * denomination;
                return (
                  <span className="font-medium text-green-700">
                    {formatCurrency(subtotal)}
                  </span>
                );
              }}
            />
          </DataTable>
        </Card>
      )}

      {/* Totals by Denomination */}
      {data.totals_by_denomination && data.totals_by_denomination.length > 0 && (
        <Card>
          <h4 className="text-xl font-semibold text-gray-800 mb-4">
            {t('cashRegister.totalsByDenomination')}
          </h4>
          <DataTable 
            value={data.totals_by_denomination} 
            className="border rounded-lg overflow-hidden"
            stripedRows
          >
            <Column 
              field="bill_type_id" 
              header={t('cashRegister.denomination')} 
              body={(rowData) => (
                <span className="font-medium">{getBillTypeLabel(rowData.bill_type_id)}</span>
              )}
            />
            <Column 
              field="quantity" 
              header={t('cashRegister.quantity')}
              body={(rowData) => (
                <span className="text-center block">{rowData.quantity}</span>
              )}
            />
            <Column 
              header={t('cashRegister.total')} 
              body={(rowData) => {
                const quantity = Number(rowData.quantity) || 0;
                const denomination = getBillTypeValue(rowData.bill_type_id);
                const subtotal = quantity * denomination;
                return (
                  <span className="font-medium text-blue-700">
                    {formatCurrency(subtotal)}
                  </span>
                );
              }}
            />
          </DataTable>
        </Card>
      )}
    </div>
  );
};

export default RegisterDetailsPanel; 