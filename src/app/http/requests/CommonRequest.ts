import { object, string } from "yup";
export const CountryProvinceCityRequest = object({
  name: string().optional().nullable(),
  ios2: string().optional().nullable(),
});
