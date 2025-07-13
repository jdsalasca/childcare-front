export interface PaymentMethodType {
  id: number;
  method: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  translationLabel: string;
}
