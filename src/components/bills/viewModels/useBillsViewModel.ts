import { confirmDialog } from "primereact/confirmdialog"
import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { customLogger } from "../../../configs/logger"
import { AppModels, LoadingInfo } from "../../../models/AppModels"
import { useBillTypesByCurrencyCode } from "../../../models/BillTypeAPI"
import { CashAPI } from "../../../models/CashAPI"
import { CashOnHandByDyAPI, CashOnHandByDyModel } from "../../../models/CashOnHandByDyAPI"
import { useChildren } from "../../../models/ChildrenAPI"
import { Functions } from "../../../utils/functions"
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils"
import { BillsModel } from "../models/BillModel"
import { exportToPDF } from "../utils/billsPdf"
import { exportBoxesToPDF } from "../utils/boxesPdf"

export interface Bill {
  id?: string // Ensure id is required
  originalIndex: number
  disabled: boolean
  names: string
  cash?: number // Should be a number, not string
  check?: number // Should be a number, not string
  total?: number // Should be a number, not string
  date: string
  classroom: string
}
interface BillType {
  bill: string;
  amount: number;
  value: number;
  check: number;
  cash: number;
  total: number;
  id?: string;
  billTypeId?: string;
}

export interface FormValues {
  bills: Bill[]
  billTypes: BillType[] // This is fine if BillType is different from Bill
  date?: string | Date
  cashOnHand: number,
  totalDeposit?: number,
  totalOverall?: number,
  notes?: string
  amount: number
  description: string
  program: number
}


// FIXME  improve the rerender of this module cuz I'm rerendering the bills component so many times
export const useBillsViewModel = () => {
  const { t } = useTranslation() // Initialize translation hook

  const [exportableCount, setExportableCount] = useState<number>(0)
  const { data: currenciesInformation } = useBillTypesByCurrencyCode('USD')
  const { data: children } = useChildren()
  const [loadingInfo, setLoadingInfo] = useState<LoadingInfo>(AppModels.defaultLoadingInfo)
  const isFetching = useRef<boolean>(false)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchedProgram, SetSearchedProgram] = useState<string | null>(null)
  const toast = useRef<any>(null)
  const [blockContent, setBlockContent] = useState<boolean>(true)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch
  } = useForm<FormValues>({
    defaultValues: {
      bills: [],
      billTypes: [],
      date: undefined,
      cashOnHand: 0.0
    }
  })

  const billModel = new BillsModel(getValues, toast, t)

  
  const { fields: billTypeFields, update: updateBillType } = useFieldArray<FormValues>({
    control,
    name: 'billTypes'
  })
  const { fields, append, remove, update } = useFieldArray<FormValues>({
    control,
    name: 'bills',
    keyName: 'id'
  });
  // Assert type for billsFields
const billsFields = fields as Array<Bill>;
  const fetchChildren = async (): Promise<any[]> => {
    try {
      const response = children
      if (!response) {
        customLogger.warn('No response received when fetching children.')
        return []
      }

      return response?.map((child: any) => ({
        ...child,
        childName: `${child.first_name} ${child.last_name}`
      }))
    } catch (err) {
      customLogger.error('Error fetching children:', err)
      return []
    }
  }

  const recalculateFields = (newFields: any = billsFields) => {
    const count = newFields.filter(
      (bill: { cash: any; check: any }) => (bill.cash && Number(bill.cash) > 0) || (bill.check && Number(bill.check) > 0)
    ).length
    setExportableCount(count)
  }

  useEffect(() => {
    recalculateFields()
  }, [billsFields])

  const onRecalculateAll = async (index = 0, bill: Bill | null = null): Promise<void> => {
    if (!bill?.id || bill.originalIndex == null || index == null) {
      customLogger.error("Error on onRecalculateAll usage. You're sending an empty data object")
      return
    }
    const data = getValues('bills')
    update(bill.originalIndex, {
      ...getValues(`bills.${bill.originalIndex}`),
      total: Number((Number(bill.cash) + Number(bill.check)).toFixed(2))
    })

    recalculateFields(data)
  }

  const onDownloadBoxedPdf = (): void => {
    const data = getValues();

    // Check if the date is present
    if (data.date == null) {
      toast.current.show({
        severity: 'info',
        summary: t('bills.dateRequired'),
        detail: t('bills.dateRequiredDetails')
      });
      return;
    }

    // Recalculate fields based on bills
    recalculateFields(data.bills);

    // Format the data for PDF export
    const dataFormatted = {
      ...data,
      date: Functions.formatDateToMMDDYY(data.date),
      bills: data.bills
        .map(student => ({
          ...student,
          cash: student.cash, // Ensure cash is a number
          check: student.check, // Ensure check is a number
          total: student.total // Ensure total is a number
        }))
        .filter(student =>
          (student.cash! > 0) || (student.check! > 0)
        )
    };

    // Call the function to export the formatted data to PDF
    exportBoxesToPDF(dataFormatted);

    // Debugging output
    console.log('printing boxes', dataFormatted);
  };

  useEffect(() => {
    customLogger.debug("useEffect triggered", { children, currenciesInformation });
    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreLookingForChildrenInformation')
    });
    if (children && currenciesInformation) {
      onStartForm();
      setLoadingInfo(AppModels.defaultLoadingInfo);
    }

    return () => { }
  }, [currenciesInformation, children]);

  const onStartForm = async (): Promise<void> => {
    const students = await fetchChildren();

    reset({
      bills: students?.map((child, index) => ({
        id: child.id,
        originalIndex: index,
        disabled: true,
        names: child.childName,
        cash: undefined,
        check: undefined,
        date: new Date().toISOString().split('T')[0],
        classroom: child.classroom
      })),
      billTypes: currenciesInformation?.map((billType: any) => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0,
        id: billType.id,
        billTypeId: billType.id
      })),
      date: getValues('date'),
      cashOnHand: getValues('cashOnHand')
    });
  };

  const calculateSums = (): {
    cash_on_hand: number;
    cash: number;
    check: number;
    total: number;
    total_cash_on_hand: number;
  } => {
    const total = billsFields.reduce(
      (acc, bill) => {
        acc.cash_on_hand = Number(getValues("cashOnHand")) || 0
        acc.cash += Number(bill.cash) || 0
        acc.check += Number(bill.check) || 0
        acc.total += Number(bill.total) || 0
        acc.total_cash_on_hand = acc.cash - acc.cash_on_hand
        return acc
      },
      { cash_on_hand: 0, cash: 0, check: 0, total: 0, total_cash_on_hand: 0 }
    )
    customLogger.info('total', total)
    return total
  }

  const sums = calculateSums()


  const saveInformation = async (data: FormValues): Promise<void> => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('savingPaymentInfo') + ' ' + data.date
    })

    customLogger.info('data', data);
    const response = await CashAPI.processCashData(data)
    setLoadingInfo(AppModels.defaultLoadingInfo)

    if (response.httpStatus === 200) {
      ToastInterpreterUtils.toastInterpreter(
        toast,
        "success",
        t('bills.saved'),
        t('bills.savedDetail')
      )
    }
  }

  const onGetCashOnHandByBills = (listOfBills: Bill[]): number => {
    const totalOfCashOnBills = listOfBills.reduce((acc, bill) => acc + (Number(bill.cash) || 0), 0);
    customLogger.info('totalOfCashOnBills', totalOfCashOnBills);
    return totalOfCashOnBills;
  };
  const onSubmit = async (data: FormValues) => {
    if (data.date == null) {
      toast.current.show({
        severity: 'info',
        summary: t('bills.dateRequired'),
        detail: t('bills.dateRequiredDetails'),
      });
      return;
    }
  
    const totalCashOnBills = onGetCashOnHandByBills(data.bills);
    customLogger.info('totalCashOnBills', totalCashOnBills);
    billModel.onProcessCashData(new CashOnHandByDyModel(data.date, totalCashOnBills, new Date()));
  
    data?.bills?.forEach((bill, index) => {
      update(index, { ...bill, total: Number(bill.cash) + Number(bill.check) });
    });
  

    const dataFormatted = {
      ...data,
      date: Functions.formatDateToMMDDYY(data.date),
      bills: data.bills.filter(
        student =>
          (student.cash != null && student.cash > 0) ||
          (student.check != null && student.check > 0)
      ),
    };
    // Show the confirmation dialog and wait for the user's response
    const confirmed = await new Promise<boolean>((resolve) => {
      confirmDialog({
        message: t('bills.confirmExportPDF'),
        header: t('bills.confirmation'),
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: t('yes'),
        rejectLabel: t('no'),
        accept: () => resolve(true),  // User accepted
        reject: () => resolve(false),  // User rejected
      });
    });
  
    // After the user responds to the dialog
    if (confirmed) {
      exportToPDF(dataFormatted);  // Export PDF only if accepted
    }
    
    await saveInformation(dataFormatted);  // Save information after confirmation
  };
  

  // Confirmation dialog for resetting form
  const confirmResetForm = (): void => {
    confirmDialog({
      message: t('bills.confirmReset'),
      header: t('bills.resetForm'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        reset({
          bills: [],
          billTypes: billTypeFields.map(billType => ({
            ...billType,
            amount: 0,
            total: 0
          })),
          date: undefined,
          cashOnHand: 0.0
        })
      }
    })
  }


// Define the function
const onHandlerSetCashOnHand = async (date: Date): Promise<number> => {
  try {
    const totalCashOnMoney = await CashOnHandByDyAPI.getMoneyUntilDate(date);
    ToastInterpreterUtils.toastBackendInterpreter(
      toast, 
      totalCashOnMoney, 
      t('totalMoneyOnHand'), 
      t('noTotalMoneyOnHandMessage')
    );
    customLogger.info('totalCashOnMoney', totalCashOnMoney);
    customLogger.info('date information', date);

    const totalCashOnMoneyUnWrapped = (totalCashOnMoney.httpStatus !== 200)
      ? 0.0 
      : totalCashOnMoney.response?.totalAmountUntilNow ?? 0.0;

    setValue('cashOnHand', totalCashOnMoneyUnWrapped);
    return totalCashOnMoneyUnWrapped;
  } catch (error) {
    customLogger.error('Error fetching cash on hand:', error);
    return  0;
    // Handle error case as necessary
  }
};
const lastSelectedDateRef = useRef<Date | null>(null);

const onHandlerDateChanged = async (date: Date |null) => {
  customLogger.info('onHandlerDateChanged', date);
  if (isFetching.current || date == null) return;
  // Create a ref to store the last selected date
  // Check if the new date is the same as the last selected date
  customLogger.info('lastSelectedDateRef.current', lastSelectedDateRef.current, date);
  if (lastSelectedDateRef.current?.getTime() === date?.getTime()) {
    customLogger.info('The selected date is the same as the last date. No further action taken.');
    return;
}
  // Update the ref with the new date
  lastSelectedDateRef.current = date;

  isFetching.current = true;
  const formattedDate = Functions.formatDateToYYYYMMDD(date);
  const formattedDateUSA = Functions.formatDateToMMDDYY(date);

  try {
    setLoadingInfo(new LoadingInfo(true, t('lookingForPaymentInfo', { date: Functions.formatDateToMMDDYY(getValues('date')!) })));
    const dayInformation = await CashAPI.getDetailsByDate(formattedDate);
    
    setBlockContent(false);
    if (dayInformation?.httpStatus === 200) {
      await onStartForm();
      ToastInterpreterUtils.toastInterpreter(
        toast,
        "info",
        t('informationFound'),
        t('dataAddedForPickedDay', { date: formattedDateUSA })
      );

      const { daily_cash_details, child_cash_records } = dayInformation.response;

      const updatedChildren = getValues('bills').map((child: any) => {
        const matchedChildRecord = child_cash_records.find((record: any) => record.child_id === child.id);
        return {
          ...child,
          cash: matchedChildRecord?.cash || '',
          check: matchedChildRecord?.check || '',
        };
      });

      const updatedBillTypes = getValues('billTypes').map((billType: any) => {
        const matchedBillDetail = daily_cash_details.find((detail: any) => detail.bill_type_id === billType.billTypeId);
        return {
          ...billType,
          amount: matchedBillDetail?.amount || '',
          total: matchedBillDetail?.total || '',
        };
      });

      

      reset({
        bills: updatedChildren,
        billTypes: updatedBillTypes,
        date: date,
        cashOnHand: await onHandlerSetCashOnHand(date),
        
      });
    } else {
      onHandlerSetCashOnHand(date);
      
      customLogger.info('No information found for the day:', dayInformation);
      await onStartForm();
      ToastInterpreterUtils.toastInterpreter(toast, "info", t('noInformationFound'), t('noDataForPickedDay', { date: formattedDateUSA }));
    }

    setLoadingInfo(AppModels.defaultLoadingInfo);
  } catch (error) {
    customLogger.info('Error processing daily cash data:', error);
    setLoadingInfo(AppModels.defaultLoadingInfo);
  } finally {
    isFetching.current = false; // Reset the flag when done
  }
};

const filteredBills = billsFields.filter(bill =>
  bill.names?.toLowerCase().includes(searchTerm.toLowerCase()) &&
  (searchedProgram ? bill.classroom?.toLowerCase().includes(searchedProgram.toLowerCase()) : true)
);

const addNewBill = (): void => {
  append(
  {
    "originalIndex": 0, // Default value
    "disabled": false, // Default value
    "names": '', // Default value
    "cash": 0, // Default value
    "check": 0, // Default value
    "total": 0, // Default value
    "date": "",
    "classroom": '' // Default value
  })
};
  return {
    control,
    errors,
    exportableCount,
    sums,
    searchTerm,
    setSearchTerm,
    loadingInfo,
    toast,
    saveInformation,
    billsFields,
    billTypeFields,
    setValue,
    append,
    remove,
    update,
    handleSubmit,
    onSubmit,
    onDownloadBoxedPdf,
    onRecalculateAll,
    confirmResetForm,
    recalculateFields,
    SetSearchedProgram,
    searchedProgram,
    setExportableCount,
    blockContent,
    formState: { errors },
    onHandlerDateChanged,
    filteredBills,
    addNewBill
    
  }

}
