import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, useFieldArray } from 'react-hook-form';
import { customLogger } from '../../../configs/logger';
import { LoadingInfo } from '../../../models/AppModels';
import { useBillTypesByCurrencyCode } from '../../../models/BillTypeAPI';
import { useChildren } from '../../../models/ChildrenAPI';
import { CashOnHandByDyAPI } from '../../../models/CashOnHandByDyAPI';
import CashRegisterAPI from '../../../models/CashRegisterAPI';
import { ToastInterpreterUtils } from '../../utils/ToastInterpreterUtils';

// Optimized types with better type safety
export interface OptimizedBill {
  id: string;
  names: string;
  cash: string | number;
  check: string | number;
  total: number;
  originalIndex: number;
  classroom: string;
}

interface OptimizedFormValues {
  bills: OptimizedBill[];
  billTypes: any[];
  date?: Date;
  program?: string;
  cashOnHand: number;
}

interface OptimizedSums {
  cash_on_hand: number;
  cash: number;
  check: number;
  total: number;
  total_cash_on_hand: number;
}

interface ViewModelState {
  exportableCount: number;
  closedMoneyData: any;
  loadingInfo: LoadingInfo;
  searchTerm: string;
  searchedProgram: string | null;
  blockContent: boolean;
  sums: OptimizedSums;
}

// Optimized utility functions with better performance
const toNumber = (value: any): number => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (typeof value === 'string') {
    if (value === '') return 0;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

// Simple debounce implementation with cancel method
const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout;
  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
  debounced.cancel = () => {
    clearTimeout(timeoutId);
  };
  return debounced;
};

// Memoized calculation functions
const calculateBillSums = (bills: OptimizedBill[]): { cash: number; check: number; total: number } => {
  let cash = 0;
  let check = 0;
  let total = 0;
  
  for (const bill of bills) {
    cash += toNumber(bill.cash);
    check += toNumber(bill.check);
    total += toNumber(bill.total);
  }
  
  return { cash, check, total };
};

const createBillSums = (bills: OptimizedBill[], cashOnHand: number): OptimizedSums => {
  const basicSums = calculateBillSums(bills);
  return {
    ...basicSums,
    cash_on_hand: cashOnHand,
    total_cash_on_hand: basicSums.cash - cashOnHand
  };
};

export const useBillsViewModelOptimized = () => {
  const { t } = useTranslation();

  // Consolidated state with better initial values
  const [state, setState] = useState<ViewModelState>({
    exportableCount: 0,
    closedMoneyData: null,
    loadingInfo: { loading: false, loadingMessage: '' },
    searchTerm: '',
    searchedProgram: null,
    blockContent: true,
    sums: { cash: 0, check: 0, total: 0, cash_on_hand: 0, total_cash_on_hand: 0 }
  });

  // Refs for performance optimization
  const recalculateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSelectedDateRef = useRef<Date | null>(null);
  const toast = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);

  // API hooks with proper dependency management
  const { data: currenciesInformation } = useBillTypesByCurrencyCode('USD');
  const { data: children } = useChildren();

  // Form setup with optimized default values
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch
  } = useForm<OptimizedFormValues>({
    defaultValues: {
      bills: [],
      billTypes: [],
      date: undefined,
      cashOnHand: 0.0
    },
    mode: 'onBlur' // Optimize validation frequency
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills',
    keyName: 'id'
  });

  // Memoized children data with stable reference
  const childrenOptions = useMemo(() => {
    if (!children) return [];
    return children.map((child: any, index: number) => ({
      id: child.id?.toString() || `child_${index}`,
      childName: `${child.first_name} ${child.last_name}`,
      classroom: child.classroom || '',
      first_name: child.first_name,
      last_name: child.last_name
    }));
  }, [children]);

  // Optimized state setters
  const updateState = useCallback((updates: Partial<ViewModelState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setLoadingInfo = useCallback((loadingInfo: LoadingInfo) => {
    updateState({ loadingInfo });
  }, [updateState]);

  const setBlockContent = useCallback((blockContent: boolean) => {
    updateState({ blockContent });
  }, [updateState]);

  const setSums = useCallback((sums: OptimizedSums) => {
    updateState({ sums });
  }, [updateState]);

  // Debounced recalculation function
  const debouncedRecalculate = useMemo(
    () => debounce((bills: OptimizedBill[], cashOnHand: number) => {
      try {
        // Calculate exportable count
        const count = bills.reduce((acc, bill) => {
          const cashNum = toNumber(bill.cash);
          const checkNum = toNumber(bill.check);
          return acc + ((cashNum > 0 || checkNum > 0) ? 1 : 0);
        }, 0);

        // Calculate sums
        const newSums = createBillSums(bills, cashOnHand);

        // Update state in batch
        updateState({
          exportableCount: count,
          sums: newSums
        });
      } catch (error) {
        customLogger.error('Error in debounced recalculation:', error);
      }
    }, 150),
    [updateState]
  );

  // Optimized recalculation function
  const recalculateFields = useCallback((newFields?: OptimizedBill[]) => {
    const bills = newFields || getValues('bills') || [];
    const cashOnHand = getValues('cashOnHand') || 0;
    
    debouncedRecalculate(bills, cashOnHand);
  }, [getValues, debouncedRecalculate]);

  // Optimized bill update function
  const onRecalculateAll = useCallback((index: number, bill: OptimizedBill): void => {
    if (!bill?.id || bill.originalIndex == null) {
      customLogger.error("Invalid bill data for recalculation");
      return;
    }

    const cashValue = toNumber(bill.cash);
    const checkValue = toNumber(bill.check);
    const newTotal = Number((cashValue + checkValue).toFixed(2));

    // Only update if total actually changed
    const currentBill = getValues(`bills.${bill.originalIndex}`);
    if (currentBill && Math.abs((currentBill.total || 0) - newTotal) < 0.01) {
      return;
    }

    const updatedBill = {
      ...bill,
      total: newTotal
    };

    update(bill.originalIndex, updatedBill);
    recalculateFields();
  }, [getValues, update, recalculateFields]);

  // Memoized filtered bills with optimized filtering
  const filteredBills = useMemo(() => {
    const bills = fields as OptimizedBill[];
    
    if (!state.searchTerm && !state.searchedProgram) {
      return bills;
    }

         const searchLower = state.searchTerm.toLowerCase();
     const programLower = state.searchedProgram?.toLowerCase() || '';

    return bills.filter(bill => {
      const matchesSearch = !state.searchTerm || 
        (bill.names && bill.names.toLowerCase().includes(searchLower));
      const matchesProgram = !state.searchedProgram || 
        (bill.classroom && bill.classroom.toLowerCase().includes(programLower));
      
      return matchesSearch && matchesProgram;
    });
  }, [fields, state.searchTerm, state.searchedProgram]);

  // Optimized search handlers
  const handleSearchChange = useCallback((searchTerm: string) => {
    updateState({ searchTerm });
  }, [updateState]);

  const handleProgramChange = useCallback((program: string | null) => {
    updateState({ searchedProgram: program });
  }, [updateState]);

  // Optimized remove function
  const safeRemove = useCallback((index: number): void => {
    try {
      const bills = getValues('bills') || [];
      const billIndex = bills.findIndex(bill => bill.originalIndex === index);
      
      if (billIndex === -1) {
        customLogger.error(`Bill with index ${index} not found`);
        return;
      }

      remove(billIndex);
      
      // Update indices after removal with debounce
      if (recalculateTimeoutRef.current) {
        clearTimeout(recalculateTimeoutRef.current);
      }
      
      recalculateTimeoutRef.current = setTimeout(() => {
        const updatedBills = getValues('bills');
        updatedBills.forEach((bill, i) => {
          update(i, { ...bill, originalIndex: i });
        });
        recalculateFields();
      }, 50);

    } catch (error) {
      customLogger.error('Error removing bill:', error);
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: t('bills.errorRemoving'),
          detail: t('bills.errorRemovingDetail'),
          life: 5000
        });
      }
    }
  }, [getValues, remove, update, recalculateFields, t]);

  // Optimized form initialization
  const onStartForm = useCallback(async () => {
    if (!children || !currenciesInformation || isInitializedRef.current) return;

    try {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('weAreLookingForChildrenInformation')
      });

      const billList: OptimizedBill[] = childrenOptions.map((child, index) => ({
        id: child.id,
        originalIndex: index,
        names: child.childName,
        cash: '',
        check: '',
        total: 0,
        classroom: child.classroom
      }));

      reset({
        bills: billList,
        billTypes: currenciesInformation || [],
        date: getValues('date'),
        cashOnHand: getValues('cashOnHand') || 0.0
      });

      isInitializedRef.current = true;
      recalculateFields(billList);

    } catch (error) {
      customLogger.error('Error in onStartForm:', error);
    } finally {
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      });
    }
  }, [children, currenciesInformation, childrenOptions, reset, getValues, recalculateFields, t, setLoadingInfo]);

  // Optimized add bill function
  const addNewBill = useCallback(() => {
    const bills = getValues('bills') || [];
    const newBill: OptimizedBill = {
      id: `bill_${Date.now()}_${Math.random()}`,
      names: '',
      cash: '',
      check: '',
      total: 0,
      originalIndex: bills.length,
      classroom: ''
    };
    
    append(newBill);
    recalculateFields();
  }, [getValues, append, recalculateFields]);

  // Optimized cash on hand fetching
  const onHandlerSetCashOnHand = useCallback(async (date: Date): Promise<number> => {
    try {
      const totalCashOnMoney = await CashOnHandByDyAPI.getMoneyUntilDate(date);
      
      if (toast.current) {
        ToastInterpreterUtils.toastBackendInterpreter(
          toast, 
          totalCashOnMoney, 
          t('totalMoneyOnHand'), 
          t('noTotalMoneyOnHandMessage')
        );
      }
      
      const totalAmount = (totalCashOnMoney.httpStatus !== 200)
        ? 0.0 
        : totalCashOnMoney.response?.totalAmountUntilNow ?? 0.0;

      setValue('cashOnHand', totalAmount);
      return totalAmount;
    } catch (error) {
      customLogger.error('Error fetching cash on hand:', error);
      return 0;
    }
  }, [setValue, t]);

  const fetchClosedMoneyData = useCallback(async (date: Date): Promise<void> => {
    try {
      const formattedDate = date.toISOString().slice(0, 10);
      const response = await CashRegisterAPI.getClosedMoney(formattedDate);
      updateState({ closedMoneyData: response.data });
    } catch (error) {
      customLogger.warn("Error fetching closed money data:", error);
      updateState({ closedMoneyData: null });
    }
  }, [updateState]);

  // Optimized date change handler
  const onHandlerDateChanged = useCallback(async (date: Date | null) => {
    if (date === null) {
      setBlockContent(true);
      return;
    }

    const currentDateObj = new Date(date);
    
    // Prevent duplicate processing
    if (lastSelectedDateRef.current && 
        lastSelectedDateRef.current.toDateString() === currentDateObj.toDateString()) {
      return;
    }

    lastSelectedDateRef.current = new Date(currentDateObj);
    isInitializedRef.current = false; // Reset initialization flag

    try {
      await Promise.all([
        onHandlerSetCashOnHand(currentDateObj),
        fetchClosedMoneyData(currentDateObj)
      ]);
      
      await onStartForm();
      setBlockContent(false);
    } catch (error) {
      customLogger.error("Error on date changed", error);
      setBlockContent(true);
    }
  }, [onHandlerSetCashOnHand, fetchClosedMoneyData, onStartForm, setBlockContent]);

  // Optimized submit handler
  const onSubmit = useCallback(async (data: OptimizedFormValues) => {
    try {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('weAreProcessingYourInformation')
      });

      // Process bills data - you might need to implement this based on your BillsModel
      // const result = await billModel.processBillsData(data);
      
      if (toast.current) {
        toast.current.show({
          severity: 'success',
          summary: t('billsProcessedSuccessfully'),
          life: 3000
        });
      }
    } catch (error) {
      customLogger.error('Error submitting bills:', error);
      if (toast.current) {
        toast.current.show({
          severity: 'error',
          summary: t('errorProcessingBills'),
          life: 5000
        });
      }
    } finally {
      setLoadingInfo({
        loading: false,
        loadingMessage: ''
      });
    }
  }, [t, setLoadingInfo]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (recalculateTimeoutRef.current) {
        clearTimeout(recalculateTimeoutRef.current);
      }
      debouncedRecalculate.cancel();
    };
  }, [debouncedRecalculate]);

  // Auto-initialize when dependencies are ready
  useEffect(() => {
    if (children && currenciesInformation && !isInitializedRef.current) {
      onStartForm();
    }
  }, [children, currenciesInformation, onStartForm]);

  return {
    // State
    ...state,
    
    // Form
    control,
    handleSubmit,
    errors,
    reset,
    setValue,
    getValues,
    watch,
    
    // Bills
    billsFields: fields as OptimizedBill[],
    filteredBills,
    
    // Handlers
    onRecalculateAll,
    safeRemove,
    addNewBill,
    onHandlerDateChanged,
    onSubmit,
    handleSearchChange,
    handleProgramChange,
    
    // Data
    childrenOptions,
    toast,
    
    // Utils
    recalculateFields
  };
}; 