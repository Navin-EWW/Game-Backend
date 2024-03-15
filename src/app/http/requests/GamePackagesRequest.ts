import { Status } from "@prisma/client";
import { mixed, object, string } from "yup";

export const GamePackagesRequest = object({
  title: string().required(),
  discription: string().required(),
  totalGame: string().required(),
  price: string().required(),
  discount: string(),
  image: string(),
  status: string(),
  discountedPrice: string()
});

export const GamePackagesUpdateRequest = object({
  title: string().optional(),
  discription: string().optional(),
  totalGame: string().optional(),
  price: string().optional(),
  discount: string().optional(),
  image: string().optional(),
  discountedPrice: string().optional()
});
export const GamePackagesFilterRequest = object({
  search: string().optional(),
  toDate: string().trim().optional(),
  fromDate: string().trim().optional(),
  status: mixed<Status>().oneOf(Object.values(Status)).optional(),
});
export const IdQueryRequest = object({
  id: string().required(),
});
export const GamePackagesStatusRequest = object({
  status: string().required(),
});
