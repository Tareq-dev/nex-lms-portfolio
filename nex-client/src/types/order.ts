export type OrderId = string;

export type OrderStatus =
  | "Pending"
  | "Approved"
  | "Cancelled";

export type PaymentMethod =
  | "Bkash"
  | "Nagad"
  | "Rocket"
  | "Card"
  | "Bank Transfer";

export interface Order {
  id: OrderId;
  studentName: string;
  studentEmail: string;
  courseName: string;
  amount: string;
  paymentMethod: PaymentMethod;
  trxId: string;
  date: string;
  status: OrderStatus;
}