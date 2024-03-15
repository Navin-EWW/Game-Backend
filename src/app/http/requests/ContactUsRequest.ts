import { object, string } from "yup";

export const ContactUsRequest = object({
  email: string().required().email(),
  name: string().required(),
  phoneNumber: string().required(),
  discription: string(),
});
export const ContactUsFilterRequest = object({
  search: string().optional(),
  toDate: string().trim().optional(),
  fromDate: string().trim().optional(),
});