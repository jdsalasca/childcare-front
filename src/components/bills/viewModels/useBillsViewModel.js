import { confirmDialog } from "primereact/confirmdialog"
import { useEffect, useRef, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { AppModels } from "../../../models/AppModels"
import { useBillTypesByCurrencyCode } from "../../../models/BillTypeAPI"
import { CashAPI } from "../../../models/CashAPI"
import { useChildren } from "../../../models/ChildrenAPI"
import { Functions } from "../../../utils/functions"
import { ToastInterpreterUtils } from "../../utils/ToastInterpreterUtils"
import { exportToPDF } from "../billsPdf"
import { BillsModel } from "../models/BillModel"
import { exportBoxesToPDF } from "../utils/boxesPdf"

export const useBillsViewModel = () => {
  const { t } = useTranslation() // Initialize translation hook
  
  const [exportableCount, setExportableCount] = useState(0)
  const { data: currenciesInformation } = useBillTypesByCurrencyCode('USD')
  const { data: children } = useChildren()
  const [loadingInfo, setLoadingInfo] = useState(AppModels.defaultLoadingInfo)
  const isFetching = useRef(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedProgram, SetSearchedProgram] = useState(null)
  const toast = useRef(null)
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch
  } = useForm({
    defaultValues: {
      bills: [].map((child, index) => ({
        originalIndex: index, // Add original index
        disabled: true,
        names: child.names,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD,
        classroom: child.classroom
      })),
      billTypes: [].map(billType => ({
        bill: billType.label,
        amount: 0,
        value: billType.value,
        total: 0
      })),
      date: null
    }
  })
  
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'bills'
  })

  const { fields: billTypeFields, update: updateBillType } = useFieldArray({
    control,
    name: 'billTypes'
  })
  const fetchChildren = async () => {
    try {
      const response = children.response
      //const response = await ChildrenAPI.getChildren();
      const students = response?.map(child => ({
        ...child,
        childName: child.first_name + ' ' + child.last_name
      }))
      return students
    } catch (err) {
    } finally {
    }
  }

  
  /**
   * @description : TODO method to handler amount changed to recalculated fields and also to add the new quantity of
   *  filled bills.
   * @param {*} index  :: which position have the child on the list of children
   * @param {*} bill  :: the data inserted by user on the row for that specific children
   * @param {*} data  ::  the defaultValues that saves the children and bills information
   */
  const onRecalculateAll = async (index = 0, bill = null) => {
    if (bill.id == null || bill.originalIndex == null || index == null) {
      console.error(
        "Error on onRecalculateAll usage. You're sending an empty data object "
      )
    }
    const data = getValues('bills')
    update(bill.originalIndex, {
      ...getValues(`bills[${bill.originalIndex}]`),
      total: (Number(bill.cash) + Number(bill.check)).toFixed(2)
    })

    recalculateFields(data)
  }

  

  const onDownloadBoxedPdf = () => {
    const data = getValues()
    if (data.date == null) {
      toast.current.show({
        severity: 'info',
        summary: t('bills.dateRequired'),
        detail: t('bills.dateRequiredDetails')
      })
      return
    }
    recalculateFields(data.bills)

    let dataFormatted = {
      ...data,
      date: Functions.formatDateToMMDDYY(data.date),
      bills: data.bills.filter(
        student =>
          (student.cash != null && student.cash > 0) ||
          (student.check != null && student.check > 0)
      )
    }
    exportBoxesToPDF(dataFormatted)
    console.log('printing boxes', dataFormatted)
  }

  useEffect(() => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('weAreLookingForChildrenInformation')
    })
    if (children != null && currenciesInformation != null) {
      onStartForm()
      setLoadingInfo(AppModels.defaultLoadingInfo)
    }
    return () => {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currenciesInformation, children])
  

  const onStartForm = async () => {
    const students = await fetchChildren()

    reset({
      bills: students?.map((child, index) => ({
        id: child.id,
        originalIndex: index,
        disabled: true,
        names: child.childName,
        cash: '',
        check: '',
        date: new Date().toISOString().split('T')[0], // Format date to YYYY-MM-DD,
        classroom: child.classroom
      })),
      billTypes: currenciesInformation?.response?.map(billType => ({
        bill: billType.label,
        amount: Number(0),
        value: billType.value,
        total: 0,
        id: billType.id,
        billTypeId: billType.id
      })),
      date: getValues('date')
    })
  }
  //#region method to calculate sums
  const calculateSums = () => {
    return fields.reduce(
      (acc, bill) => {
        acc.cash += Number(bill.cash) || 0
        acc.check += Number(bill.check) || 0
        acc.total += Number(bill.total) || 0
        return acc
      },
      { cash: 0, check: 0, total: 0 }
    )
  }
  //#endregion
  const sums = calculateSums()
  
  const billTypesController = watch('billTypes')
 
  const recalculateFields = (newFields = fields) => {
    const count = newFields.filter(
      bill => (bill.cash && bill.cash > 0) || (bill.check && bill.check > 0)
    ).length
    setExportableCount(count)
  }
  useEffect(() => {
    recalculateFields()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields])
  const saveInformation = async data => {
    setLoadingInfo({
      loading: true,
      loadingMessage: t('savingPaymentInfo') + ' ' + data.date
    })
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

  
  //#region  method to send information
  const onSubmit = async data => {
    data.bills.forEach((bill, index) => {
      update(index, { ...bill, total: Number(bill.cash) + Number(bill.check) })
    })
    if (data.date == null) {
      toast.current.show({
        severity: 'info',
        summary: t('bills.dateRequired'),
        detail: t('bills.dateRequiredDetails')
      })
      return
    }
    let dataFormatted = {
      ...data,
      date: Functions.formatDateToMMDDYY(data.date),
      bills: data.bills.filter(
        student =>
          (student.cash != null && student.cash > 0) ||
          (student.check != null && student.check > 0)
      )
    }
    //#endregion

    console.log('information', fields, dataFormatted)
    confirmDialog({
      message: t('bills.confirmExportPDF'),
      header: t('bills.confirmation'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('yes'),
      rejectLabel: t('no'),
      accept: () => {
        exportToPDF(fields)
        saveInformation(dataFormatted)
      },
      reject: () => saveInformation(dataFormatted)
    })
  }

  
  const onHandlerDateChanged = async date => {
    if (isFetching.current) return

    isFetching.current = true
    const formattedDate = Functions.formatDateToYYYYMMDD(date)
    const formattedDateUSA = Functions.formatDateToMMDDYY(date)
    try {
      setLoadingInfo({
        loading: true,
        loadingMessage: t('lookingForPaymentInfo', {
          date: Functions.formatDateToMMDDYY(getValues('date'))
        })
      })
      const dayInformation = await CashAPI.getDetailsByDate(formattedDate)

      if (dayInformation?.httpStatus === 200) {
        await onStartForm()
        ToastInterpreterUtils.toastInterpreter(
          t('informationFound'),
          t('dataAddedForPickedDay', { date: formattedDateUSA })
        )
        const { daily_cash_details, child_cash_records } =
          dayInformation.response
        const updatedChildren = getValues('bills').map(child => {
          const matchedChildRecord = child_cash_records.find(
            record => record.child_id === child.id
          )
          return {
            ...child,
            cash: matchedChildRecord?.cash || '',
            check: matchedChildRecord?.check || ''
          }
        })
        const updatedBillTypes = getValues('billTypes').map(billType => {
          const matchedBillDetail = daily_cash_details.find(
            detail => detail.bill_type_id === billType.billTypeId
          )
          return {
            ...billType,
            amount: matchedBillDetail?.amount || '',
            total: matchedBillDetail?.total || ''
          }
        })

        reset({
          bills: updatedChildren,
          billTypes: updatedBillTypes,
          date: date
        })
      } else {
        await onStartForm()
        ToastInterpreterUtils.toastInterpreter(toast, t('noInformationFound'), t('noDataForPickedDay', { date: formattedDateUSA }))
      }

      setLoadingInfo(AppModels.defaultLoadingInfo)
    } catch (error) {
      setLoadingInfo(AppModels.defaultLoadingInfo)
    } finally {
      isFetching.current = false // Reset the flag when done
    }
  }
  const filteredFields = fields.filter(
    field =>
      field.names.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchedProgram
        ? field.classroom?.toLowerCase().includes(searchedProgram.toLowerCase())
        : true)
  )


  const addNewBill = () => {
    append( BillsModel.newBill(fields))
  }


  /**
   * This method is used to handle the amount change of the bills
   * @param {*} index 
   * @param {*} value 
   */
  const handleAmountChange = (index, value) => {
    const amount = parseFloat(value) || 0
    const billValue = billTypeFields[index].value
    const total = amount * billValue

    updateBillType(index, { ...billTypeFields[index], amount, total })

  }
  return{
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    currenciesInformation,
    children,
    loadingInfo,
    setLoadingInfo,
    isFetching,
    searchTerm,
    setSearchTerm,
    SetSearchedProgram,
    searchedProgram,
    exportableCount,
    setExportableCount,
    toast,
    fields,
    billTypeFields,
    append,
    update,
    updateBillType,
    onDownloadBoxedPdf,
    addNewBill,
    onHandlerDateChanged,
    filteredFields,
    onRecalculateAll,
    remove,
    onSubmit,
    billTypesController,
    sums,
    handleAmountChange
  }




}