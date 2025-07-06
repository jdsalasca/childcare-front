import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { Toast } from 'primereact/toast';
import { Chip } from 'primereact/chip';
import { Tooltip } from 'primereact/tooltip';
import classNames from 'classnames';
import { programOptions } from '../contracts/utilsAndConstants';
import Loader from '../utils/Loader';
import { useBillsViewModel } from './viewModels/useBillsViewModel';
import { Bill } from './viewModels/useBillsViewModel';


const ITEMS_PER_PAGE = 10;

// Inline BillCard component - memoized to prevent unnecessary re-renders
const BillCard: React.FC<{
  bill: Bill;
  index: number;
  control: any;
  errors: any;
  blockContent: boolean;
  onRecalculateAll: (index: number, bill: Bill) => void;
  onRemove: (index: number) => void;
  isCompact?: boolean;
}> = React.memo(({ bill, index, control, errors, blockContent, onRecalculateAll, onRemove, isCompact = false }) => {
  const { t } = useTranslation();

  const cash = typeof bill.cash === 'number' ? bill.cash : 
               typeof bill.cash === 'string' && bill.cash !== '' ? parseFloat(bill.cash) : 0;
  const check = typeof bill.check === 'number' ? bill.check : 
                typeof bill.check === 'string' && bill.check !== '' ? parseFloat(bill.check) : 0;
  
  const displayTotal = (cash + check).toFixed(2);
  


  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(index);
  }, [index, onRemove]);

  const handleCashChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (value: any) => void, fieldType: 'cash' | 'check') => {
    const inputValue = e.target.value;
    
    // Store the input value as-is for the form
    onChange(inputValue);
    
    // Use requestAnimationFrame to defer the recalculation to avoid focus loss
    requestAnimationFrame(() => {
      const numericValue = inputValue === '' ? 0 : parseFloat(inputValue) || 0;
      const currentCash = fieldType === 'cash' ? numericValue : (parseFloat(bill.cash?.toString() || '0') || 0);
      const currentCheck = fieldType === 'check' ? numericValue : (parseFloat(bill.check?.toString() || '0') || 0);
      const newTotal = currentCash + currentCheck;
      
      const updatedBill = {
        ...bill,
        [fieldType]: inputValue, // Store the actual input value
        total: newTotal
      };
      onRecalculateAll(bill.originalIndex || index, updatedBill);
    });
  }, [bill, onRecalculateAll, index]);

  const getFormErrorMessage = useCallback((fieldName: string) => {
    const fieldError = errors.bills?.[index]?.[fieldName];
    return fieldError && (
      <small className="p-error">{fieldError.message}</small>
    );
  }, [errors.bills, index]);

  return (
    <div 
      id={`bill-card-${index}`}
      className={classNames(
        'bg-white rounded-xl shadow-sm border border-gray-100 mb-3 transition-all duration-300 hover:shadow-md',
        {
          'opacity-50 pointer-events-none': blockContent,
          'hover:border-blue-200': !blockContent
        }
      )}
    >
      {blockContent && (
        <Tooltip 
          target={`#bill-card-${index}`} 
          content={t('bills.blockContent')} 
          position="top" 
        />
      )}
      
      {/* Card Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
            <i className="pi pi-receipt text-blue-600 text-sm"></i>
          </div>
        </div>
        <Button
          icon="pi pi-trash"
          className="p-button-danger p-button-text p-button-sm hover:bg-red-50"
          onClick={handleRemove}
          tooltip={t('bills.removeThisBill')}
          tooltipOptions={{ position: 'left' }}
          disabled={blockContent}
        />
      </div>
      
      {/* Card Content */}
      <div className="p-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Names Field */}
          <div className="flex flex-col">
            <label htmlFor={`names-${index}`} className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              {t('bills.names')}
            </label>
            <Controller
              name={`bills[${index}].names`}
              control={control}
              render={({ field }) => (
                <InputText
                  id={`names-${index}`}
                  {...field}
                  disabled={blockContent}
                  className={classNames('w-full text-sm border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100', {
                    'p-invalid': errors.bills?.[index]?.names,
                  })}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={t('bills.enterNames', 'Enter names')}
                />
              )}
            />
            {getFormErrorMessage('names')}
          </div>

          {/* Cash Field */}
          <div className="flex flex-col">
            <label htmlFor={`cash-${index}`} className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              💵 {t('bills.cash')}
            </label>
            <Controller
              name={`bills[${index}].cash`}
              control={control}
              render={({ field }) => (
                <InputText
                  id={`cash-${index}`}
                  disabled={blockContent}
                  className={classNames('w-full text-sm border-gray-200 focus:border-green-400 focus:ring-1 focus:ring-green-100', {
                    'p-invalid': errors.bills?.[index]?.cash,
                  })}
                  keyfilter="num"
                  value={field.value !== undefined ? field.value : ''}
                  onChange={(e) => handleCashChange(e, field.onChange, 'cash')}
                  placeholder="0.00"
                />
              )}
            />
            {getFormErrorMessage('cash')}
          </div>

          {/* Check Field */}
          <div className="flex flex-col">
            <label htmlFor={`check-${index}`} className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              🏦 {t('bills.check')}
            </label>
            <Controller
              name={`bills[${index}].check`}
              control={control}
              render={({ field }) => (
                <InputText
                  id={`check-${index}`}
                  disabled={blockContent}
                  className={classNames('w-full text-sm border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-100', {
                    'p-invalid': errors.bills?.[index]?.check,
                  })}
                  keyfilter="num"
                  value={field.value !== undefined ? field.value : ''}
                  onChange={(e) => handleCashChange(e, field.onChange, 'check')}
                  placeholder="0.00"
                />
              )}
            />
            {getFormErrorMessage('check')}
          </div>

          {/* Total Field */}
          <div className="flex flex-col">
            <label htmlFor={`total-${index}`} className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
              💰 {t('bills.total')}
            </label>
            <Controller
              name={`bills[${index}].total`}
              control={control}
              defaultValue={0}
              render={() => (
                <InputText
                  id={`total-${index}`}
                  value={`$${displayTotal}`}
                  readOnly
                  className="w-full text-sm p-disabled bg-gradient-to-r from-green-50 to-blue-50 border-green-200 font-bold text-green-800"
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.bill.cash === nextProps.bill.cash &&
    prevProps.bill.check === nextProps.bill.check &&
    prevProps.bill.names === nextProps.bill.names &&
    prevProps.bill.total === nextProps.bill.total &&
    prevProps.index === nextProps.index &&
    prevProps.blockContent === nextProps.blockContent &&
    prevProps.isCompact === nextProps.isCompact
  );
});

// Inline BillSummary component
const BillSummary: React.FC<{
  sums: {
    cash: number;
    check: number;
    total: number;
    total_cash_on_hand: number;
    cash_on_hand: number;
  };
  cashOnHand: number;
}> = ({ sums, cashOnHand }) => {
  const { t } = useTranslation();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const summaryItems = [
    {
      label: t('bills.totalCash'),
      value: sums.cash,
      icon: 'pi pi-dollar',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: t('bills.totalCheck'),
      value: sums.check,
      icon: 'pi pi-credit-card',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: t('bills.total'),
      value: sums.cash + sums.check,
      icon: 'pi pi-calculator',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: t('bills.total_not_cash_on_hand'),
      value: sums.total_cash_on_hand,
      icon: 'pi pi-wallet',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
          <i className="pi pi-chart-bar text-white text-lg"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-800 m-0">
          {t('bills.summary', 'Summary')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryItems.map((item, index) => (
          <div 
            key={index}
            className={`p-5 rounded-xl border border-gray-100 ${item.bgColor} hover:shadow-md transition-all duration-200 hover:scale-105`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <i className={`${item.icon} ${item.color} text-sm`}></i>
              </div>
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(item.value)}
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export const Bills: React.FC = () => {
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  
  // Pagination state
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(ITEMS_PER_PAGE);
  
  // View state
  const [isCompactView, setIsCompactView] = useState(false);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    loadingInfo,
    searchTerm,
    setSearchTerm,
    SetSearchedProgram,
    exportableCount,
    onDownloadBoxedPdf,
    onDownloadFirstPartPdf,
    onHandlerDateChanged,
    onRecalculateAll,
    safeRemove,
    onSubmit,
    sums,
    filteredBills,
    blockContent,
    addNewBill,
    getValues
  } = useBillsViewModel();



  // Paginated bills
  const paginatedBills = useMemo(() => {
    const startIndex = first;
    const endIndex = startIndex + rows;
    return filteredBills.slice(startIndex, endIndex);
  }, [filteredBills, first, rows]);

  // Pagination handlers
  const onPageChange = useCallback((event: any) => {
    setFirst(event.first);
    setRows(event.rows);
  }, []);

  // Header toolbar content
  const headerToolbar = useMemo(() => (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-white m-0">
          {t('bills.title', 'Bills Management')}
        </h1>
        <Chip 
          label={`${filteredBills.length} ${t('bills.total', 'total')}`}
          className="bg-white/20 text-white border-white/30"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          icon={isCompactView ? "pi pi-th-large" : "pi pi-list"}
          onClick={() => setIsCompactView(!isCompactView)}
          className="p-button-text text-white border-white/30 hover:bg-white/20"
          tooltip={isCompactView ? t('bills.gridView') : t('bills.listView')}
        />
        <Button
          icon="pi pi-plus"
          label={t('bills.addNew')}
          onClick={addNewBill}
          className="bg-green-500 hover:bg-green-600 border-green-500 text-white"
        />
        <Button
          icon="pi pi-file-pdf"
          label={t('bills.summaryReport')}
          onClick={onDownloadFirstPartPdf}
          className="bg-purple-500 hover:bg-purple-600 border-purple-500 text-white"
          disabled={exportableCount === 0}
        />
        <Button
          icon="pi pi-receipt"
          label={t('bills.fullReport')}
          onClick={onDownloadBoxedPdf}
          className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white"
          disabled={exportableCount === 0}
        />
      </div>
    </div>
  ), [t, filteredBills.length, exportableCount, isCompactView, addNewBill, onDownloadFirstPartPdf, onDownloadBoxedPdf]);

  // Filters panel
  const filtersPanel = useMemo(() => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <i className="pi pi-filter text-blue-600 text-sm"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800 m-0">
          {t('bills.filters', 'Filters')}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex flex-col">
          <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2">
            {t('bills.searchPlaceholder')}
          </label>
          <div className="relative">
            <i className="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <InputText
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('bills.searchPlaceholder')}
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Program Filter */}
        <div className="flex flex-col">
          <label htmlFor="program" className="text-sm font-medium text-gray-700 mb-2">
            {t('program')}
          </label>
          <Controller
            name="program"
            control={control}
            render={({ field }) => (
              <Dropdown
                id="program"
                {...field}
                showClear
                onChange={(e) => {
                  SetSearchedProgram(e.value);
                  field.onChange(e.value);
                }}
                options={programOptions}
                placeholder={t('select_program')}
                className="w-full"
              />
            )}
          />
          {errors.program && (
            <small className="p-error mt-1">{errors.program.message}</small>
          )}
        </div>

        {/* Date Filter */}
        <div className="flex flex-col">
          <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2">
            {t('date')}
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Calendar
                id="date"
                value={field.value ? new Date(field.value) : null}
                onChange={(e) => {
                  const dateValue = e.value ? new Date(e.value) : null;
                  field.onChange(dateValue);
                  onHandlerDateChanged(dateValue);
                }}
                showIcon
                dateFormat="mm/dd/yy"
                mask="99/99/9999"
                showOnFocus={false}
                hideOnDateTimeSelect={true}
                className="w-full"
              />
            )}
          />
        </div>
      </div>
    </div>
  ), [t, searchTerm, setSearchTerm, control, errors.program, SetSearchedProgram, onHandlerDateChanged]);

  // Bill item renderer - memoized to prevent unnecessary re-renders
  const renderBillItem = useCallback((bill: Bill, index: number) => {
    return (
      <BillCard
        key={bill.originalIndex || index}
        bill={bill}
        index={bill.originalIndex}
        control={control}
        errors={errors}
        blockContent={blockContent}
        onRecalculateAll={onRecalculateAll}
        onRemove={safeRemove}
        isCompact={isCompactView}
      />
    );
  }, [control, errors, blockContent, onRecalculateAll, safeRemove, isCompactView]);

  // Empty state - memoized to prevent unnecessary re-renders
  const emptyTemplate = useMemo(() => (
    <div className="text-center py-8">
      <i className="pi pi-receipt text-4xl text-gray-400 mb-4"></i>
      <h3 className="text-lg font-medium text-gray-600 mb-2">
        {filteredBills.length === 0 && searchTerm 
          ? t('bills.noResultsFound', 'No bills found matching your search')
          : t('bills.noBills', 'No bills available')
        }
      </h3>
      <p className="text-gray-500 mb-4">
        {blockContent 
          ? t('bills.selectDateFirst', 'Please select a date to start adding bills')
          : t('bills.addFirstBill', 'Add your first bill to get started')
        }
      </p>
      {!blockContent && (
        <Button
          icon="pi pi-plus"
          label={t('bills.addNew')}
          onClick={addNewBill}
          className="p-button-success"
        />
      )}
    </div>
  ), [filteredBills.length, searchTerm, blockContent, t, addNewBill]);

  if (loadingInfo.loading) {
    return <Loader message={loadingInfo.loadingMessage} />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <Toast ref={toast} />
      <ConfirmDialog />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg rounded-xl p-6 text-white">
        {headerToolbar}
      </div>

      {/* Content blocked overlay */}
      {blockContent && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <i className="pi pi-exclamation-triangle text-yellow-600 text-xl"></i>
            <div>
              <h4 className="text-yellow-800 font-medium m-0">
                {t('bills.blockContent')}
              </h4>
              <p className="text-yellow-700 text-sm m-0 mt-1">
                {t('bills.selectDateToContinue', 'Please select a date to continue managing bills')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {filtersPanel}

      {/* Bills Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Bills List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className={isCompactView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
            {paginatedBills.length > 0 ? (
              paginatedBills.map((bill, index) => renderBillItem(bill, index))
            ) : (
              emptyTemplate
            )}
          </div>
          
          {/* Pagination */}
          {filteredBills.length > ITEMS_PER_PAGE && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Paginator
                first={first}
                rows={rows}
                totalRecords={filteredBills.length}
                rowsPerPageOptions={[5, 10, 20, 50]}
                onPageChange={onPageChange}
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
                currentPageReportTemplate={t('bills.paginationTemplate', 'Showing {first} to {last} of {totalRecords} bills')}
              />
            </div>
          )}
        </div>

        {/* Summary */}
        <BillSummary
          sums={sums}
          cashOnHand={getValues('cashOnHand')}
        />

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              type="submit"
              label={t('bills.save')}
              icon="pi pi-save"
              className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white px-8 py-3 text-lg font-semibold"
              disabled={blockContent}
            />
            <Button
              type="button"
              label={t('bills.summaryReport')}
              icon="pi pi-file-pdf"
              className="bg-purple-500 hover:bg-purple-600 border-purple-500 text-white px-6 py-3"
              onClick={onDownloadFirstPartPdf}
              disabled={exportableCount === 0}
            />
            <Button
              type="button"
              label={t('bills.fullReport')}
              icon="pi pi-receipt"
              className="bg-orange-500 hover:bg-orange-600 border-orange-500 text-white px-6 py-3"
              onClick={onDownloadBoxedPdf}
              disabled={exportableCount === 0}
            />
          </div>
        </div>
      </form>
    </div>
  );
};


