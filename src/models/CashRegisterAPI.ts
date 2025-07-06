import API, { BASE_URL } from './API';
import {
  CashRegisterStatusResponse,
  OpenRegisterRequest,
  CloseRegisterRequest,
  GetCashiersResponse,
  RegisterDetailsResponse,
} from '../types/cashRegister';

const CashRegisterAPI = {
  getCashiers: async (): Promise<GetCashiersResponse> => {
    const res = await API.get<GetCashiersResponse>(BASE_URL, '/cash-register/cashiers');
    return res.response;
  },
  getStatus: async (date: string): Promise<CashRegisterStatusResponse> => {
    const res = await API.get<CashRegisterStatusResponse>(BASE_URL, `/cash-register/status/${date}`);
    return res.response;
  },
  openRegister: async (data: OpenRegisterRequest): Promise<any> => {
    const res = await API.post<any>(BASE_URL, '/cash-register/open', data);
    return res.response;
  },
  closeRegister: async (data: CloseRegisterRequest): Promise<any> => {
    const res = await API.post<any>(BASE_URL, '/cash-register/close', data);
    return res.response;
  },
  getDetails: async (date: string): Promise<RegisterDetailsResponse> => {
    const res = await API.get<RegisterDetailsResponse>(BASE_URL, `/cash-register/details/${date}`);
    return res.response;
  },
};

export default CashRegisterAPI; 