import { object, string } from "yup";

export const GamePackagePaymentRequest = object({
  packageId: string().required(),
});


export const GamePackageReceiptRequest = object({
  // packageId: string().required(),
  payment_id: string().required(),
  result: string().required(),
  // post_date: string().required(),
  // tran_id: string().required(),
  // ref: string().required(),
  track_id: string().required(),
  // authValue: string().required(),
  order_id: string().required(),
  requested_order_id: string().required(),
  refund_order_id: string().required(),
  payment_type: string().required(),
  invoice_id: string().required(),
  // transaction_date: string().required(),
  receipt_id: string().required(),
});