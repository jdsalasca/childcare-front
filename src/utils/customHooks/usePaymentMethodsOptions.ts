import { useMemo } from 'react';
import { usePaymentMethodsCache } from '../../models/PaymentMethodAPI';

const usePaymentMethodsOptions = () => {
  const { data: paymentMethods, error, isLoading } = usePaymentMethodsCache();

  // Use useMemo to transform payment methods options and prevent unnecessary re-renders
  const paymentMethodsOptions = useMemo(() => {
    if (!paymentMethods || isLoading) return [];



    return paymentMethods.response.map(paymentMethod => ({
      ...paymentMethod,
      label: paymentMethod.translationLabel, // Adjust according to your data structure
      value: paymentMethod.id, // Adjust according to your data structure
    }));
  }, [paymentMethods, isLoading]);

  return { paymentMethodsOptions, error, isLoading };
};

export default usePaymentMethodsOptions;
