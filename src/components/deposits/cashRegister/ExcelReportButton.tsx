import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { CashRegisterReportResponse } from '../../../types/cashRegister';
import { generateCashRegisterExcel } from './utils/excelUtils';

interface Props {
  filters?: {
    start_date?: string;
    end_date?: string;
    status?: string;
  };
  className?: string;
}

const ExcelReportButton: React.FC<Props> = ({ filters, className = '' }) => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportMutation = useMutation({
    mutationFn: (params?: {
      start_date?: string;
      end_date?: string;
      status?: string;
    }) => CashRegisterAPI.getReport(params),
    onSuccess: (data: CashRegisterReportResponse) => {
      try {
        // Check if data is valid
        if (!data.success) {
          throw new Error('Invalid response from server');
        }

        if (!data.data?.days || data.data.days.length === 0) {
          toast.current?.show({
            severity: 'warn',
            summary: t('cashRegister.noData'),
            detail: t('cashRegister.noDataAvailable'),
            life: 5000,
          });
          return;
        }

        // Generate Excel file
        generateCashRegisterExcel(data);

        toast.current?.show({
          severity: 'success',
          summary: t('cashRegister.downloadSuccess'),
          detail: t('cashRegister.excelGeneratedSuccessfully'),
          life: 3000,
        });
      } catch (error) {
        console.error('Error generating Excel:', error);
        toast.current?.show({
          severity: 'error',
          summary: t('cashRegister.downloadError'),
          detail: t('cashRegister.errorGeneratingExcel'),
          life: 5000,
        });
      } finally {
        setIsGenerating(false);
      }
    },
    onError: (error: any) => {
      console.error('Error fetching report data:', error);

      // Handle specific error cases
      if (error?.response?.status === 404) {
        toast.current?.show({
          severity: 'warn',
          summary: t('cashRegister.noData'),
          detail: t('cashRegister.noDataAvailable'),
          life: 5000,
        });
      } else if (error?.response?.status >= 500) {
        toast.current?.show({
          severity: 'error',
          summary: t('cashRegister.serverError'),
          detail: t('cashRegister.serverErrorMessage'),
          life: 5000,
        });
      } else {
        toast.current?.show({
          severity: 'error',
          summary: t('cashRegister.downloadError'),
          detail: error?.message || t('cashRegister.unexpectedError'),
          life: 5000,
        });
      }

      setIsGenerating(false);
    },
  });

  const handleDownload = async () => {
    try {
      setIsGenerating(true);

      // Show loading toast
      toast.current?.show({
        severity: 'info',
        summary: t('cashRegister.generatingReport'),
        detail: t('cashRegister.pleaseWait'),
        life: 3000,
      });

      await reportMutation.mutateAsync(filters);
    } catch (error) {
      // Error handling is done in onError callback
      console.error('Download error:', error);
    }
  };

  return (
    <>
      <Toast ref={toast} position='top-right' />
      <Button
        icon='pi pi-download'
        label={t('cashRegister.downloadExcel')}
        onClick={handleDownload}
        loading={isGenerating || reportMutation.isPending}
        disabled={isGenerating || reportMutation.isPending}
        className={`p-button-success ${className}`}
        tooltip={t('cashRegister.downloadExcelTooltip')}
        tooltipOptions={{ position: 'bottom' }}
      />
    </>
  );
};

export default ExcelReportButton;
