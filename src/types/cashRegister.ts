// Tipos para Cash Register

export type CashRegisterStatus = 'not_started' | 'opened' | 'closed';

export interface CashRegisterStatusResponse {
  success: boolean;
  data: {
    date: string;
    status: CashRegisterStatus;
    is_opened: boolean;
    is_closed: boolean;
  };
}

export interface BillInput {
  bill_type_id: number;
  quantity: number;
}

export interface OpenRegisterRequest {
  date: string; // YYYY-MM-DD
  cashier_id: number;
  bills: BillInput[];
}

export interface CloseRegisterRequest {
  date: string; // YYYY-MM-DD
  cashier_id: number;
  bills: BillInput[];
}

export interface Cashier {
  id: number;
  name: string;
  number: string;
  status: string;
}

export interface GetCashiersResponse {
  success: boolean;
  data: Cashier[];
}

export interface RegisterDetailsResponse {
  success: boolean;
  data: {
    date: string;
    status: CashRegisterStatus;
    opening?: {
      cashier: Cashier;
      time: string;
      bills: BillInput[];
    };
    closing?: {
      cashier: Cashier;
      time: string;
      bills: BillInput[];
    };
    difference?: number;
    totals_by_denomination?: { bill_type_id: number; quantity: number; }[];
  };
} 