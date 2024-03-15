import { Status } from "@prisma/client";
import { mixed, object, string } from "yup";

export const PromoCodeRequest = object({
  promoCode: string().required(),
  discount: string().required(),
  validFrom: string().required(),
  validTill: string().required(),
  userId: string().optional(),
  discountType: string().required(),
});

export const UpdatePromoCodeRequest = object({
  promoCode: string().optional(),
  discount: string().optional(),
  validFrom: string().optional(),
  validTill: string().optional(),
  userId: string().optional(),
  discountType: string().optional(),
});

export const PromoCodeFilterRequest = object({
  search: string().optional(),
  toDate: string().trim().optional(),
  fromDate: string().trim().optional(),
  status: mixed<Status>().oneOf(Object.values(Status)).optional(),
});
