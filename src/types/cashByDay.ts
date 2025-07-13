export interface CashByDay {
  daily_cash_record_date: Date;
  daily_cash_details: DailyCashDetail[];
  child_cash_records: ChildCashRecord[];
}

export interface ChildCashRecord {
  id: number;
  child_id: number;
  daily_cash_record_id: number;
  contract_id: null;
  cash: string;
  check: string;
  created_at: Date;
  updated_at: Date;
}

export interface DailyCashDetail {
  id: number;
  daily_cash_record_id: number;
  bill_type_id: number;
  amount: number;
  total: string;
  bill_type: BillType;
}

export interface BillType {
  id: number;
  label: string;
  value: string;
  currency_id: number;
}
