import { useEffect, useState } from "react";
import { usePaymentMethodsCache } from "../../models/PaymentMethodAPI";

const usePaymentMethodsOptions = () => {
    const [paymentMethodsOptions, setPaymentMethodsOptions] = useState([]);
    const { data: paymentMethods, error, isLoading } = usePaymentMethodsCache();

    useEffect(() => {
        console.log("paymentMethods", paymentMethods)
        
        if (paymentMethods && !isLoading) {
            setPaymentMethodsOptions(paymentMethods?.response.map(paymentMethod => ({
                ...paymentMethod,
                label: paymentMethod.translationLabel, // Adjust according to your data structure
                value: paymentMethod.id      // Adjust according to your data structure
            })));
        }
    }, [paymentMethods, isLoading]);

    return { paymentMethodsOptions, error, isLoading };
};

export default usePaymentMethodsOptions;