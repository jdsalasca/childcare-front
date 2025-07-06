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

export interface BillDetail {
  id: number;
  daily_cash_record_id: number;
  bill_type_id: number;
  quantity: number;
  total_amount: string;
  is_opening: number;
  is_closing: number;
  cashier_id: number;
  created_at: string;
  updated_at: string;
  bill_label: string;
  bill_value: string;
  currency_code: string;
}

export interface RegisterDetailsResponse {
  success: boolean;
  data: {
    date: string;
    record_id: number;
    status: {
      date: string;
      status: CashRegisterStatus;
      is_opened: boolean;
      is_closed: boolean;
      opening_time: string;
      closing_time: string;
      opening_cashier: Cashier;
      closing_cashier: Cashier;
    };
    opening: {
      cashier: Cashier;
      time: string;
      total_amount: number;
      details: BillDetail[];
    };
    closing: {
      cashier: Cashier;
      time: string;
      total_amount: number;
      details: BillDetail[];
    };
    summary: {
      opening_total: number;
      closing_total: number;
      difference: number;
      currency: string;
    };
  };
}

export interface CashRegisterReportDay {
  date: string;
  status: CashRegisterStatus;
  opening: {
    time: string;
    amount: number;
    cashier: Cashier;
  };
  closing: {
    time: string | null;
    amount: number;
    cashier: Cashier | null;
  };
  difference: number;
  currency: string;
}

export interface CashRegisterReportResponse {
  success: boolean;
  data: {
    days: CashRegisterReportDay[];
    summary: {
      total_opening_amount: number;
      total_closing_amount: number;
      total_difference: number;
      total_days: number;
      currency: string;
    };
    filters_applied: {
      start_date: string | null;
      end_date: string | null;
      status: CashRegisterStatus | null;
    };
  };
  total_records: number;
  filters: {
    start_date: string | null;
    end_date: string | null;
    status: CashRegisterStatus | null;
  };
} 