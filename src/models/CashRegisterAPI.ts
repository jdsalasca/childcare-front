import API, { BASE_URL } from './API';
import {
  CashRegisterStatusResponse,
  OpenRegisterRequest,
  CloseRegisterRequest,
  GetCashiersResponse,
  RegisterDetailsResponse,
  CashRegisterReportResponse,
} from '../types/cashRegister';

const CashRegisterAPI = {
  getCashiers: async (): Promise<GetCashiersResponse> => {
    const res = await API.get<GetCashiersResponse>(
      BASE_URL,
      '/cash-register/cashiers'
    );
    return res.response;
  },
  getStatus: async (date: string): Promise<CashRegisterStatusResponse> => {
    const res = await API.get<CashRegisterStatusResponse>(
      BASE_URL,
      `/cash-register/status/${date}`
    );
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
  updateOpenRegister: async (
    date: string,
    data: OpenRegisterRequest
  ): Promise<any> => {
    const res = await API.put<any>(
      BASE_URL,
      `/cash-register/open/${date}`,
      data
    );
    return res.response;
  },
  updateCloseRegister: async (
    date: string,
    data: CloseRegisterRequest
  ): Promise<any> => {
    const res = await API.put<any>(
      BASE_URL,
      `/cash-register/close/${date}`,
      data
    );
    return res.response;
  },
  getDetails: async (date: string): Promise<RegisterDetailsResponse> => {
    const res = await API.get<RegisterDetailsResponse>(
      BASE_URL,
      `/cash-register/details/${date}`
    );
    return res.response;
  },
  getClosedMoney: async (date: string): Promise<any> => {
    const res = await API.get<any>(
      BASE_URL,
      `/cash-register/closed-money/${date}`
    );
    return res.response;
  },
  getReport: async (params?: {
    start_date?: string;
    end_date?: string;
    status?: string;
  }): Promise<CashRegisterReportResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.status) queryParams.append('status', params.status);

    const url = `/cash-register/report${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const res = await API.get<CashRegisterReportResponse>(BASE_URL, url);
    return res.response;
  },
};

export default CashRegisterAPI;
