import { object, string } from "yup";

export const SpecialGameCategoryAddRequest = object({
  name: string().required(),
  description: string().required(),
  coverImage: string().required(),
  amount: string().required(),
});
