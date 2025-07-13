// Constantes compartidas para el módulo Cash Register

export const BILL_TYPES = [
  { id: 1, label: '$100', value: 100 },
  { id: 2, label: '$50', value: 50 },
  { id: 6, label: '$1', value: 1 },
  // Agrega más denominaciones si es necesario
];

export const getBillTypeLabel = (billTypeId: number): string => {
  return (
    BILL_TYPES.find(bt => bt.id === billTypeId)?.label || `Type ${billTypeId}`
  );
};

export const getBillTypeValue = (billTypeId: number): number => {
  return BILL_TYPES.find(bt => bt.id === billTypeId)?.value || 0;
};

export const calculateBillTotal = (
  bills: Array<{ bill_type_id: number; quantity: number }>
): number => {
  // Validación de entrada
  if (!Array.isArray(bills)) {
    console.warn('calculateBillTotal: bills is not an array', bills);
    return 0;
  }

  return bills.reduce((total, bill) => {
    // Validaciones robustas para cada bill
    if (!bill || typeof bill !== 'object') {
      console.warn('calculateBillTotal: invalid bill object', bill);
      return total;
    }

    // Validar bill_type_id
    const billTypeId = Number(bill.bill_type_id);
    if (isNaN(billTypeId)) {
      console.warn(
        'calculateBillTotal: invalid bill_type_id',
        bill.bill_type_id
      );
      return total;
    }

    // Validar quantity
    const quantity = Number(bill.quantity);
    if (isNaN(quantity)) {
      console.warn('calculateBillTotal: invalid quantity', bill.quantity);
      return total;
    }

    // Obtener denominación
    const denomination = getBillTypeValue(billTypeId);

    // Calcular subtotal
    const subtotal = quantity * denomination;

    // Validar que el subtotal sea un número válido
    if (isNaN(subtotal)) {
      console.warn('calculateBillTotal: subtotal is NaN', {
        quantity,
        denomination,
        subtotal,
      });
      return total;
    }

    return total + subtotal;
  }, 0);
};
