import { object, string } from "yup";

export const GameCategoryUpdateRequest = object({
    name: string().optional(),
    description: string().optional(),
    coverImage: string().optional()
});