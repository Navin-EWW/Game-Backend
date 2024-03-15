import { object, string } from "yup";

export const GameCategoryAddRequest = object({
    name: string().required(),
    description: string().required(),
    coverImage: string().required()
});
