import { useEffect, useState } from "react";
import { usePaymentMethodsCache } from "../../models/PaymentMethodAPI";
import { PaymentMethodType } from "../../types/paymentMethod";

// Define the structure of the payment method
interface PaymentMethod {
    id: string; // Adjust based on your API response
    translationLabel: string; // Adjust based on your API response
    // Add other relevant properties as needed
}

const usePaymentMethodsOptions = () => {
    const [paymentMethodsOptions, setPaymentMethodsOptions] = useState<PaymentMethodType[]>([]);
    const { data: paymentMethods, error, isLoading } = usePaymentMethodsCache();

    useEffect(() => {
        console.log("paymentMethods", paymentMethods);
        
        if (paymentMethods && !isLoading) {
            const paymentMethodsOptions = paymentMethods.response.map((paymentMethod) => ({
                ...paymentMethod,
                label: paymentMethod.translationLabel, // Adjust according to your data structure
                value: paymentMethod.id, // Adjust according to your data structure
            }))
            setPaymentMethodsOptions(paymentMethodsOptions);
        }
    }, [paymentMethods, isLoading]);

    return { paymentMethodsOptions, error, isLoading };
};

export default usePaymentMethodsOptions;
