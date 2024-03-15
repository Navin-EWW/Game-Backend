import { object, string } from "yup";


export const SpecialGameCategoryUpdateRequest = object({
  name: string().optional(),
  description: string().optional(),
  coverImage: string().optional(),
  amount: string().optional(),
});
