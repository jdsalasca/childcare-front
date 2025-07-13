// Utility functions for cash register operations

export const calculateBillTotal = (
  bills: Array<{ bill_type_id: number; quantity: number }>,
  billTypes: Array<{ id: number; value: number }> = []
): number => {
  if (!Array.isArray(bills)) {
    console.warn('calculateBillTotal: bills is not an array', bills);
    return 0;
  }

  return bills.reduce((total, bill) => {
    if (!bill || typeof bill !== 'object') {
      console.warn('calculateBillTotal: invalid bill object', bill);
      return total;
    }

    const billTypeId = Number(bill.bill_type_id);
    if (isNaN(billTypeId)) {
      console.warn(
        'calculateBillTotal: invalid bill_type_id',
        bill.bill_type_id
      );
      return total;
    }

    const quantity = Number(bill.quantity);
    if (isNaN(quantity)) {
      console.warn('calculateBillTotal: invalid quantity', bill.quantity);
      return total;
    }

    const billType = billTypes.find(bt => bt.id === billTypeId);
    const denomination = billType?.value || 0;

    const subtotal = quantity * denomination;
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

// Utility functions for better UX
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'not_started':
      return 'text-yellow-600 bg-yellow-100';
    case 'opened':
      return 'text-blue-600 bg-blue-100';
    case 'closed':
      return 'text-green-600 bg-green-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusIcon = (status: string): string => {
  switch (status) {
    case 'not_started':
      return 'pi-clock';
    case 'opened':
      return 'pi-unlock';
    case 'closed':
      return 'pi-check';
    default:
      return 'pi-info-circle';
  }
};
