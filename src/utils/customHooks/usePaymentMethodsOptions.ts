import { useEffect, useState, useMemo } from "react";
import { usePaymentMethodsCache } from "../../models/PaymentMethodAPI";
import { PaymentMethodType } from "../../types/paymentMethod";

// Define the structure of the payment method
interface PaymentMethod {
    id: string; // Adjust based on your API response
    translationLabel: string; // Adjust based on your API response
    // Add other relevant properties as needed
}

const usePaymentMethodsOptions = () => {
    const { data: paymentMethods, error, isLoading } = usePaymentMethodsCache();

    // Use useMemo to transform payment methods options and prevent unnecessary re-renders
    const paymentMethodsOptions = useMemo(() => {
        if (!paymentMethods || isLoading) return [];
        
        console.log("paymentMethods", paymentMethods);
        
        return paymentMethods.response.map((paymentMethod) => ({
            ...paymentMethod,
            label: paymentMethod.translationLabel, // Adjust according to your data structure
            value: paymentMethod.id, // Adjust according to your data structure
        }));
    }, [paymentMethods, isLoading]);

    return { paymentMethodsOptions, error, isLoading };
};

export default usePaymentMethodsOptions;
