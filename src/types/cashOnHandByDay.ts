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
