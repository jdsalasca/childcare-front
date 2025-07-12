import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { BillInput, BillDetail } from '../../../types/cashRegister';

interface Props {
  date: string;
  currentData: {
    cashier: { id: number; name: string; number: string };
    details: BillDetail[];
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const EditOpenRegisterForm: React.FC<Props> = ({ date, currentData, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  
  const [selectedCashier, setSelectedCashier] = useState<number>(currentData.cashier.id);
  const [bills, setBills] = useState<BillInput[]>([]);

  const { data: cashiers } = useQuery({
    queryKey: ['cashiers'],
    queryFn: CashRegisterAPI.getCashiers,
  });

  // Convert current details to editable bills format
  useEffect(() => {
    const convertedBills = currentData.details.map((detail) => ({
      bill_type_id: detail.bill_type_id,
      quantity: detail.quantity,
    }));
    setBills(convertedBills);
  }, [currentData.details]);

  const updateMutation = useMutation({
    mutationFn: ({ date, data }: { date: string; data: any }) => 
      CashRegisterAPI.updateOpenRegister(date, data),
    onSuccess: () => {
      toast.current?.show({
        severity: 'success',
        summary: t('cashRegister.success'),
        detail: t('cashRegister.openingUpdatedSuccessfully'),
        life: 3000,
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast.current?.show({
        severity: 'error',
        summary: t('cashRegister.error'),
        detail: error.message || t('cashRegister.updateError'),
        life: 5000,
      });
    },
  });

  const handleUpdateBill = (index: number, field: keyof BillInput, value: any) => {
    const newBills = [...bills];
    newBills[index] = { ...newBills[index], [field]: value };
    setBills(newBills);
  };

  const handleSubmit = async () => {
    const validBills = bills.filter(bill => bill.quantity > 0);
    
    if (validBills.length === 0) {
      toast.current?.show({
        severity: 'warn',
        summary: t('cashRegister.validation'),
        detail: t('cashRegister.pleaseEnterBills'),
        life: 3000,
      });
      return;
    }

    const requestData = {
      cashier_id: selectedCashier,
      bills: validBills,
    };

    updateMutation.mutate({ date, data: requestData });
  };

  const cashierOptions = cashiers?.data?.map((cashier: any) => ({
    label: `${cashier.name} (#${cashier.cashierNumber})`,
    value: cashier.id,
  })) || [];

  const quantityTemplate = (rowData: BillDetail, options: any) => {
    const billIndex = bills.findIndex(b => b.bill_type_id === rowData.bill_type_id);
    const currentBill = bills[billIndex];
    
    return (
      <InputNumber
        value={currentBill?.quantity || 0}
        onValueChange={(e) => handleUpdateBill(billIndex, 'quantity', e.value || 0)}
        min={0}
        className="w-full"
        showButtons
        buttonLayout="horizontal"
        decrementButtonClassName="p-button-secondary"
        incrementButtonClassName="p-button-secondary"
      />
    );
  };

  return (
    <div className="space-y-4">
      <Toast ref={toast} position="top-right" />
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <i className="pi pi-pencil text-yellow-600"></i>
          <h4 className="text-lg font-semibold text-yellow-800 m-0">
            {t('cashRegister.editOpening')}
          </h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="cashier" className="block text-sm font-medium text-gray-700 mb-2">
              {t('cashRegister.selectCashier')} *
            </label>
            <Dropdown
              id="cashier"
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.value)}
              options={cashierOptions}
              placeholder={t('cashRegister.selectCashier')}
              className="w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 mb-2">
            {t('cashRegister.bills')}
          </h5>
          <DataTable 
            value={currentData.details}
            className="border rounded-lg overflow-hidden"
            emptyMessage={t('cashRegister.noData')}
          >
            <Column 
              field="bill_label" 
              header={t('cashRegister.denomination')}
              body={(rowData) => <span className="font-medium">{rowData.bill_label}</span>}
            />
            <Column 
              field="quantity" 
              header={t('cashRegister.quantity')}
              body={quantityTemplate}
            />
            <Column 
              field="bill_value" 
              header={t('cashRegister.unitValue')}
              body={(rowData) => (
                <span className="text-blue-700 font-medium">
                  ${parseFloat(rowData.bill_value).toFixed(2)}
                </span>
              )}
            />
          </DataTable>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            label={t('cancel')}
            icon="pi pi-times"
            className="p-button-secondary p-button-sm"
            onClick={onCancel}
          />
          <Button
            label={t('save')}
            icon="pi pi-check"
            className="p-button-success p-button-sm"
            onClick={handleSubmit}
            loading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default EditOpenRegisterForm; 