import { useQuery } from '@tanstack/react-query';
import { PaymentMethodType } from '../types/paymentMethod';
import API, { ApiResponse, BASE_URL } from './API';

const PaymentMethodAPI = {
  // Fetch all payment methods
  getAllPaymentMethods: async (): Promise<ApiResponse<PaymentMethodType[]>> => {
    try {
      const response = await API.get<PaymentMethodType[]>(
        BASE_URL,
        '/payment-methods'
      );
      return response;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  },

  // Fetch a payment method by ID
  getPaymentMethodById: async (
    id: string
  ): Promise<ApiResponse<PaymentMethodType>> => {
    try {
      const response = await API.get<PaymentMethodType>(
        BASE_URL,
        `/payment-methods/${id}`
      );
      return response;
    } catch (error) {
      console.error('Error fetching payment method by id:', error);
      throw error;
    }
  },
};

// Create a custom hook to use in your components
export const usePaymentMethodsCache = () => {
  return useQuery({
    queryKey: ['payment_methods'], // Unique key for caching
    queryFn: () => PaymentMethodAPI.getAllPaymentMethods(), // API function
  });
};

export { PaymentMethodAPI };
