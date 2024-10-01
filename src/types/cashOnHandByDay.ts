export interface CashOnHandByDay {
    id:                        number;
    date_of_income:            Date;
    date_of_income_registered: Date;
    cash_received:             string;
    created_at:                Date;
    updated_at:                Date;
}


export interface CashOnHandByDayResponse {
    data:                Datum[];
    totalAmountUntilNow: number;
}

export interface Datum {
    date_of_income:    Date;
    latest_created_at: Date;
    id:                number;
    cash_received:     string;
}


export interface CashOnHandWithDetails {
    id:                 number;
    date:               Date;
    created_at:         Date;
    updated_at:         Date;
    total_cash:         number;
    total_check:        number;
    daily_cash_details: DailyCashDetail[];
    child_cash_records: ChildCashRecord[];
}

export interface ChildCashRecord {
    id:                   number;
    child_id:             number;
    daily_cash_record_id: number;
    contract_id:          null;
    cash:                 string;
    check:                string;
    created_at:           Date;
    updated_at:           Date;
}

export interface DailyCashDetail {
    id:                   number;
    daily_cash_record_id: number;
    bill_type_id:         number;
    amount:               number;
    total:                string;
    bill_type:            BillType;
}

export interface BillType {
    id:          number;
    label:       string;
    value:       string;
    currency_id: number;
}
