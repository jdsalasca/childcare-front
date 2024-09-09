import { get } from "react-hook-form";
import API, { BASE_URL } from "./API";
import { useQuery } from "@tanstack/react-query";

const PaymentMethodAPI = {

    getAllPaymentMethods: async () => {
        try {
            const response = await API.get(BASE_URL,'/payment-methods');
            return response;
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            throw error;
        }
    },

    getPaymentMethodById: async (id) => {
        try {
            const response = await API.get(BASE_URL,`/payment-methods/${id}`);
            return response;
        } catch (error) {
            console.error('Error fetching payment method by id:', error);
            throw error;
        }
    },
}

// Create a custom hook to use in your components
export const usePaymentMethodsCache = () => {
    return useQuery({
        queryKey: ['payment_methods'],  // Unique key for caching
        queryFn: () => PaymentMethodAPI.getAllPaymentMethods(),  // API function
        staleTime: 1000 * 60 * 20,  // Cache time in milliseconds (20 minutes)
        cacheTime: 1000 * 60 * 30, // Cache time in milliseconds (30 minutes)
    });
};




export {PaymentMethodAPI};
