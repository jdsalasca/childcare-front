import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { BillType } from "../types/billType";
import API, { ApiResponse, BASE_URL } from "./API";



interface IBillTypeAPI {
    getBillTypesByCurrencyCode: (currencyCode: string) => Promise<ApiResponse<BillType[]>>;
}

const billTypeAPI: IBillTypeAPI = {
    // Get Bill Types by Currency Code
    getBillTypesByCurrencyCode: async (currencyCode: string): Promise<ApiResponse<BillType[]>> => {
        try {
            const response = await API.get<BillType[]>(BASE_URL, '/bill_types/by_currency', { params: { currency_code: currencyCode } });
            return response;
        } catch (error) {
            console.error('Error fetching bill types by currency code:', error);
            throw error;
        }
    },
};
export const useBillTypesByCurrencyCode = (currencyCode: string): UseQueryResult<BillType[], Error> => {
    return useQuery<BillType[], Error>({
        queryKey: ['billTypes', currencyCode],
        queryFn: async (): Promise<BillType[]> => {
            const billTypesResponse = await billTypeAPI.getBillTypesByCurrencyCode(currencyCode);
            if (billTypesResponse.httpStatus === 200) {
                return billTypesResponse.response;
            }
            throw new Error('Failed to fetch bill types');
        }
    });
};


export { billTypeAPI };

