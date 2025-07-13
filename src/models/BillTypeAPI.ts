import API, { BASE_URL } from './API';

export interface BillType {
  id: number;
  label: string;
  value: number;
  currency_id: number;
}

const BillTypeAPI = {
  getBillTypesByCurrencyCode: async (
    currencyCode: string
  ): Promise<BillType[]> => {
    const res = await API.get<BillType[]>(
      BASE_URL,
      `/bill_types/by_currency?currency_code=${currencyCode}`
    );
    return res.response;
  },
};

export default BillTypeAPI;
