import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { customLogger } from '../../../configs/logger';
import { LoadingInfo } from '../../../models/AppModels';
import { useBillTypesByCurrencyCode } from '../../../models/BillTypeAPI';
import { useChildren } from '../../../models/ChildrenAPI';
import { CashOnHandByDyAPI } from '../../../models/CashOnHandByDyAPI';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { CashAPI } from '../../../models/CashAPI';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';
import { exportToSummaryPDF } from '../utils/summaryPdf';
import { exportBoxesToPDF } from '../utils/boxesPdf';
import ErrorHandler from '../../../utils/errorHandler';

// Types
export interface Bill {
  id?: string;
  child_id?: number; // Add numeric child_id for backend
  names?: string;
  cash?: string | number;
  check?: string | number;
  total?: number;
  originalIndex?: number;
  classroom?: string;
}

// Backend data structure for API
interface BackendBill {
  id: number; // Numeric child_id for backend
  names?: string;
  cash: number;
  check: number;
  total: number;
}

interface BackendFormValues {
  date?: Date;
  bills: BackendBill[];
  billTypes: any[];
  cashOnHand: number;
}

export interface FormValues {
  bills: Bill[];
  billTypes: any[];
  date?: Date;
  program?: string;
  cashOnHand: number;
  closedMoneyData?: any; // Keep as any for now to match existing structure
  totalDeposit?: number;
  notes?: string;
}

interface Sums {
  cash_on_hand: number;
  cash: number;
  check: number;
  total: number;
  total_cash_on_hand: number;
}

const toNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value !== '') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Memoized calculation functions
const calculateBillSums = (
  bills: Bill[]
): { cash: number; check: number; total: number } => {
  return bills.reduce(
    (acc, bill) => {
      const cashValue = toNumber(bill.cash);
      const checkValue = toNumber(bill.check);
      const totalValue = cashValue + checkValue; // Calculate total from cash + check

      return {
        cash: acc.cash + cashValue,
        check: acc.check + checkValue,
        total: acc.total + totalValue,
      };
    },
    { cash: 0, check: 0, total: 0 } as {
      cash: number;
      check: number;
      total: number;
    }
  );
};

const createBillSums = (bills: Bill[], cashOnHand: number): Sums => {
  const basicSums = calculateBillSums(bills);
  return {
    ...basicSums,
    cash_on_hand: cashOnHand,
    total_cash_on_hand: basicSums.cash - cashOnHand,
  };
};

export const useBillsViewModel = () => {
  const { t } = useTranslation();

  // State
  const [exportableCount, setExportableCount] = useState<number>(0);
  const [closedMoneyData, setClosedMoneyData] = useState<any>(null);
  const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>({
    loading: false,
    loadingMessage: '',
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchedProgram, SetSearchedProgram] = useState<string | null>(null);
  const [blockContent, setBlockContent] = useState<boolean>(true);
  const [sums, setSums] = useState<Sums>({
    cash: 0,
    check: 0,
    total: 0,
    cash_on_hand: 0,
    total_cash_on_hand: 0,
  });

  // Refs for preventing excessive calculations
  const recalculateFieldsRef = useRef<boolean>(false);
  const lastSelectedDateRef = useRef<Date | null>(null);
  const toast = useRef<any>(null);
  const recalculateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const updateIndicesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API hooks
  const { data: currenciesInformation } = useBillTypesByCurrencyCode('USD');
  const { data: children } = useChildren();

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      bills: [],
      billTypes: [],
      date: undefined,
      cashOnHand: 0.0,
    },
  });

  const { fields, append, remove, update } = useFieldArray<FormValues>({
    control,
    name: 'bills',
    keyName: 'id',
  });

  // Memoized bills with proper type assertion
  const billsFields = useMemo(() => fields as Array<Bill>, [fields]);

  // Memoized children data - removed unused childrenOptions

  // Memoized sums calculation
  const calculateSums = useCallback(
    (bills: Bill[], cashOnHand: number): Sums => {
      return createBillSums(bills, cashOnHand);
    },
    []
  );

  // Watch for cashOnHand changes
  const cashOnHandValue = watch('cashOnHand');

  // Recalculate sums when cashOnHand changes (but not when bills change - that's handled elsewhere)
  useEffect(() => {
    if (billsFields.length > 0) {
      const timeoutId = setTimeout(() => {
        const newSums = calculateSums(billsFields, cashOnHandValue || 0);
        setSums(newSums);
      }, 100); // Debounce the calculation

      return () => clearTimeout(timeoutId);
    }
  }, [cashOnHandValue, billsFields, calculateSums]);

  // Optimized recalculation with debouncing
  const recalculateFields = useCallback(
    (newFields?: Bill[]) => {
      if (recalculateFieldsRef.current) return;

      recalculateFieldsRef.current = true;

      // Clear any existing timeout
      if (recalculateTimeoutRef.current) {
        clearTimeout(recalculateTimeoutRef.current);
      }

      // Use setTimeout to debounce the calculation
      recalculateTimeoutRef.current = setTimeout(() => {
        try {
          const fieldsToUse = newFields || getValues('bills') || [];

          // Improved exportable count calculation - count bills with any content
          const count = fieldsToUse.filter(bill => {
            const cashNum = toNumber(bill.cash);
            const checkNum = toNumber(bill.check);
            const hasNames = bill.names && bill.names.trim().length > 0;

            // A bill is exportable if it has names and at least some amount
            return hasNames && (cashNum > 0 || checkNum > 0);
          }).length;

          setExportableCount(count);

          // Update sums
          const newSums = calculateSums(
            fieldsToUse,
            getValues('cashOnHand') || 0
          );
          setSums(newSums);
        } finally {
          recalculateFieldsRef.current = false;
        }
      }, 100); // 100ms debounce
    },
    [calculateSums, getValues]
  );

  // Optimized recalculate all function
  const onRecalculateAll = useCallback(
    async (index: number = 0, bill: Bill | null = null): Promise<void> => {
      if (!bill?.id || bill.originalIndex == null || index == null) {
        customLogger.error(
          'Error on onRecalculateAll usage. Missing required data'
        );
        return;
      }

      const cashValue = toNumber(bill.cash);
      const checkValue = toNumber(bill.check);
      const newTotal = Number((cashValue + checkValue).toFixed(2));

      // Only update if the total actually changed
      const currentBill = getValues(`bills.${bill.originalIndex}`);
      if (currentBill && Math.abs((currentBill.total || 0) - newTotal) < 0.01) {
        return; // No significant change, skip update
      }

      // Update the individual bill
      update(bill.originalIndex, {
        ...currentBill,
        ...bill,
        total: newTotal,
      });

      // Immediately recalculate sums without triggering the recalculateFields function
      const allBills = getValues('bills') || [];
      const newSums = calculateSums(allBills, getValues('cashOnHand') || 0);
      setSums(newSums);

      // Update exportable count with improved logic
      const count = allBills.filter(b => {
        const cashNum = toNumber(b.cash);
        const checkNum = toNumber(b.check);
        const hasNames = b.names && b.names.trim().length > 0;

        // A bill is exportable if it has names and at least some amount
        return hasNames && (cashNum > 0 || checkNum > 0);
      }).length;
      setExportableCount(count);
    },
    [getValues, update, calculateSums]
  );

  // Optimized bills filtering
  const filteredBills = useMemo(() => {
    if (!searchTerm && !searchedProgram) return billsFields;

    return billsFields.filter(bill => {
      const matchesSearch =
        !searchTerm ||
        (bill.names?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      const matchesProgram =
        !searchedProgram ||
        (bill.classroom
          ?.toLowerCase()
          .includes(searchedProgram.toLowerCase()) ??
          false);

      return matchesSearch && matchesProgram;
    });
  }, [billsFields, searchTerm, searchedProgram]);

  // Optimized safe remove function
  const safeRemove = useCallback(
    (index: number): void => {
      try {
        const actualFieldIndex = billsFields.findIndex(
          bill => bill.originalIndex === index
        );

        if (actualFieldIndex === -1) {
          customLogger.error(
            `Could not find bill with originalIndex ${index} to remove`
          );
          return;
        }

        remove(actualFieldIndex);

        // Update indices and recalculate after removal
        if (updateIndicesTimeoutRef.current) {
          clearTimeout(updateIndicesTimeoutRef.current);
        }
        updateIndicesTimeoutRef.current = setTimeout(() => {
          const updatedBills = getValues('bills');
          updatedBills.forEach((bill, i) => {
            update(i, {
              ...bill,
              originalIndex: i,
            });
          });

          // Immediately recalculate sums without triggering the recalculateFields function
          const newSums = calculateSums(
            updatedBills,
            getValues('cashOnHand') || 0
          );
          setSums(newSums);

          // Update exportable count
          const count = updatedBills.filter(b => {
            const cashNum = toNumber(b.cash);
            const checkNum = toNumber(b.check);
            const hasNames = b.names && b.names.trim().length > 0;

            // A bill is exportable if it has names and at least some amount
            return hasNames && (cashNum > 0 || checkNum > 0);
          }).length;
          setExportableCount(count);
        }, 0);
      } catch (error) {
        customLogger.error('Error removing bill:', error);
        if (toast.current) {
          toast.current.show({
            severity: 'error',
            summary: t('bills.errorRemoving'),
            detail: t('bills.errorRemovingDetail'),
            life: 5000,
          });
        }
      }
    },
    [billsFields, getValues, remove, t, update, calculateSums]
  );

  // Optimized form initialization
  const onStartForm = useCallback(async () => {
    if (!children || !currenciesInformation) return;

    try {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('weAreLookingForChildrenInformation'),
      });

      // Create bills from children data directly to avoid dependency on childrenOptions
      const billList: Bill[] = children.map((child: any, index: number) => ({
        id: child.id?.toString() || `child_${index}`,
        originalIndex: index,
        names: child.childName || `${child.first_name} ${child.last_name}`,
        cash: '',
        check: '',
        total: 0,
        classroom: child.classroom || '',
        child_id: child.id, // Add child_id for backend
      }));

      reset({
        bills: billList,
        billTypes: currenciesInformation || [],
        date: getValues('date'),
        cashOnHand: getValues('cashOnHand') || 0.0,
      });

      // Set initial sums and exportable count
      setExportableCount(0);
      setSums({
        cash: 0,
        check: 0,
        total: 0,
        cash_on_hand: getValues('cashOnHand') || 0,
        total_cash_on_hand: 0,
      });
    } catch (error) {
      customLogger.error('Error in onStartForm:', error);
    } finally {
      setLoadingInfo({
        loading: false,
        loadingMessage: '',
      });
    }
  }, [children, currenciesInformation, reset, getValues, t]);

  // Add new bill function
  const addNewBill = useCallback(() => {
    const currentBills = getValues('bills') || [];
    const newBill: Bill = {
      id: `bill_${Date.now()}_${Math.random()}`,
      names: '',
      cash: '',
      check: '',
      total: 0,
      originalIndex: currentBills.length,
      classroom: '',
      child_id: 0, // Default to 0 for new bills
    };

    append(newBill);
  }, [append, getValues]);

  // Optimized date handling
  const onHandlerSetCashOnHand = useCallback(
    async (date: Date): Promise<number> => {
      try {
        const totalCashOnMoney =
          await CashOnHandByDyAPI.getMoneyUntilDate(date);

        if (toast.current) {
          ToastInterpreterUtils.toastBackendInterpreter(
            toast,
            totalCashOnMoney,
            t('totalMoneyOnHand'),
            t('noTotalMoneyOnHandMessage')
          );
        }

        const totalCashOnMoneyUnWrapped =
          totalCashOnMoney.httpStatus !== 200
            ? 0.0
            : (totalCashOnMoney.response?.totalAmountUntilNow ?? 0.0);

        setValue('cashOnHand', totalCashOnMoneyUnWrapped);
        return totalCashOnMoneyUnWrapped;
      } catch (error) {
        customLogger.error('Error fetching cash on hand:', error);
        return 0;
      }
    },
    [setValue, t]
  );

  const fetchClosedMoneyData = useCallback(
    async (date: Date): Promise<void> => {
      try {
        const formattedDate = date.toISOString().slice(0, 10);
        const response = await CashRegisterAPI.getClosedMoney(formattedDate);
        setClosedMoneyData(response.data);
      } catch (error) {
        customLogger.warn('Error fetching closed money data:', error);
        setClosedMoneyData(null);
      }
    },
    []
  );

  // Load existing bills for a specific date
  const loadBillsForDate = useCallback(
    async (date: Date): Promise<void> => {
      try {
        const formattedDate = date.toISOString().slice(0, 10);

        // Try to load existing bills for the date
        const existingBillsResponse =
          await CashAPI.getDetailsByDate(formattedDate);

        if (
          existingBillsResponse.httpStatus === 200 &&
          existingBillsResponse.response
        ) {
          // If we have existing bills, use them
          const existingBills = existingBillsResponse.response.bills || [];

          // Transform existing bills to match our Bill interface
          const transformedBills: Bill[] = existingBills.map(
            (bill: any, index: number) => ({
              id: bill.id?.toString() || `bill_${index}`,
              originalIndex: index,
              names: bill.names || '',
              cash: bill.cash || '',
              check: bill.check || '',
              total: bill.total || 0,
              classroom: bill.classroom || '',
              child_id: bill.child_id || 0,
            })
          );

          // Reset form with existing bills
          reset({
            bills: transformedBills,
            billTypes: getValues('billTypes') || [],
            date: date,
            cashOnHand: getValues('cashOnHand') || 0.0,
          });
        } else {
          // If no existing bills, initialize with children data
          await onStartForm();
        }
      } catch (error) {
        customLogger.warn('Error loading bills for date:', error);
        // Fallback to initializing with children data
        await onStartForm();
      }
    },
    [reset, getValues, onStartForm]
  );

  const onHandlerDateChanged = useCallback(
    async (date: Date | null) => {
      if (date === null) {
        setBlockContent(true);
        return;
      }

      try {
        const currentDateObj = new Date(date);

        // Prevent duplicate processing
        if (
          lastSelectedDateRef.current &&
          lastSelectedDateRef.current.toDateString() ===
            currentDateObj.toDateString()
        ) {
          return;
        }

        // Show loader while processing date change
        setLoadingInfo({
          loading: true,
          loadingMessage: t(
            'bills.loadingDateData',
            'Loading data for selected date...'
          ),
        });

        lastSelectedDateRef.current = new Date(currentDateObj);

        // Ensure the date value is properly set in the form before processing
        setValue('date', currentDateObj);

        await Promise.all([
          onHandlerSetCashOnHand(currentDateObj),
          fetchClosedMoneyData(currentDateObj),
        ]);

        // Load existing bills for the selected date
        await loadBillsForDate(currentDateObj);

        setBlockContent(false);

        setBlockContent(false);
      } catch (error) {
        customLogger.error('Error on date changed', error);
        setBlockContent(true);
      } finally {
        // Hide loader after processing
        setLoadingInfo({
          loading: false,
          loadingMessage: '',
        });
      }
    },
    [
      onHandlerSetCashOnHand,
      fetchClosedMoneyData,
      setLoadingInfo,
      setValue,
      t,
      loadBillsForDate,
    ]
  );

  // Submit handler
  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        setLoadingInfo({
          loading: true,
          loadingMessage: t('processingBills'),
        });

        // Transform data for backend
        const backendData: BackendFormValues = {
          date: data.date,
          bills: data.bills
            .map(bill => ({
              id: bill.child_id || 0, // Use numeric child_id, default to 0 if undefined
              names: bill.names,
              cash: toNumber(bill.cash),
              check: toNumber(bill.check),
              total: toNumber(bill.total),
            }))
            .filter(bill => bill.cash > 0 || bill.check > 0),
          billTypes: data.billTypes || [],
          cashOnHand: data.cashOnHand || 0,
        };

        // Call the backend API using the centralized CashAPI service
        const result = await CashAPI.processCashData(backendData);

        if (toast.current) {
          ToastInterpreterUtils.toastBackendInterpreter(
            toast,
            result,
            t('billsProcessedSuccessfully'),
            t('errorProcessingBills')
          );
        }
      } catch (error) {
        // Use standardized error handling
        ErrorHandler.handleApiError(error, 'Bills submission', {
          showToast: true,
          toastRef: toast,
          redirectOnAuthError: true,
          logError: true,
        });
      } finally {
        setLoadingInfo({
          loading: false,
          loadingMessage: '',
        });
      }
    },
    [t]
  );

  // PDF generation functions
  const onDownloadFirstPartPdf = useCallback(() => {
    try {
      customLogger.info('Generating summary PDF');
      const formData = getValues();

      // Add closedMoneyData to the form data
      const pdfData = {
        ...formData,
        closedMoneyData: closedMoneyData,
      };

      // Use static import to avoid component re-rendering
      exportToSummaryPDF(pdfData);

      if (toast.current) {
        toast.current.show({
          severity: 'success',
          summary: t('bills.summaryReport'),
          detail: t(
            'bills.summaryReportGenerated',
            'Summary report generated successfully'
          ),
          life: 3000,
        });
      }
    } catch (error) {
      // Use standardized error handling
      ErrorHandler.handleApiError(error, 'PDF generation', {
        showToast: true,
        toastRef: toast,
        redirectOnAuthError: false,
        logError: true,
      });
    }
  }, [getValues, t, closedMoneyData]);

  const onDownloadBoxedPdf = useCallback(() => {
    try {
      customLogger.info('Generating full PDF with receipts');
      const formData = getValues();

      // Add closedMoneyData to the form data
      const pdfData = {
        ...formData,
        closedMoneyData: closedMoneyData,
      };

      // Use static import to avoid component re-rendering
      exportBoxesToPDF(pdfData);

      if (toast.current) {
        toast.current.show({
          severity: 'success',
          summary: t('bills.fullReport'),
          detail: t(
            'bills.fullReportGenerated',
            'Full report with receipts generated successfully'
          ),
          life: 3000,
        });
      }
    } catch (error) {
      // Use standardized error handling
      ErrorHandler.handleApiError(error, 'PDF generation', {
        showToast: true,
        toastRef: toast,
        redirectOnAuthError: false,
        logError: true,
      });
    }
  }, [getValues, t, closedMoneyData]);

  // Effects
  useEffect(() => {
    if (!children && !currenciesInformation) {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('weAreLookingForChildrenInformation'),
      });
      return;
    }

    if (!children || !currenciesInformation) return;

    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreLookingForChildrenInformation'),
    });

    onStartForm();
  }, [currenciesInformation, children, t, onStartForm]); // Add onStartForm to dependencies

  useEffect(() => {
    if (children === undefined) {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('weAreLookingForChildrenInformation'),
      });
    } else if (children === null) {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('weAreLookingForChildrenInformation'),
      });
    } else if (children && children.length > 0) {
      setTimeout(() => {
        setLoadingInfo({
          loading: false,
          loadingMessage: '',
        });
      }, 500);
    }
  }, [children, t]);

  // Watch for changes in bills and trigger recalculation
  useEffect(() => {
    if (billsFields.length === 0) return;

    // Use a stable reference to prevent infinite loops
    const timeoutId = setTimeout(() => {
      recalculateFields();
    }, 50); // Small delay to batch updates

    return () => clearTimeout(timeoutId);
  }, [billsFields.length]); // Only depend on length, not the entire array

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      if (recalculateTimeoutRef.current) {
        clearTimeout(recalculateTimeoutRef.current);
      }
      if (updateIndicesTimeoutRef.current) {
        clearTimeout(updateIndicesTimeoutRef.current);
      }
    };
  }, []);

  return {
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
    getValues,
    closedMoneyData,
  };
};
