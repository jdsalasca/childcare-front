import { useMemo } from 'react';
import { usePaymentMethodsCache } from '../../models/PaymentMethodAPI';
import { PaymentMethodType } from '../../types/paymentMethod';

const usePaymentMethodsOptions = () => {
  const { data: paymentMethods, error, isLoading } = usePaymentMethodsCache();

  // Use useMemo to transform payment method options and prevent unnecessary re-renders
  const paymentMethodOptions = useMemo(() => {
    if (!paymentMethods || isLoading) return [];

    // Filter payment methods where status is "Active"
    const activePaymentMethods = paymentMethods.response.filter(
      (paymentMethod: PaymentMethodType) => paymentMethod.status === 'Active'
    );

    return activePaymentMethods.map(paymentMethod => ({
      ...paymentMethod,
      label: paymentMethod.translationLabel, // Adjust according to your data structure
      value: paymentMethod.id, // Adjust according to your data structure
    }));
  }, [paymentMethods, isLoading]);

  return { paymentMethodOptions, error, isLoading };
};

export default usePaymentMethodsOptions;
