import { object, string } from "yup";
import { PolicyPageTypes } from "@prisma/client";

export const IdQueryRequest = object({
    id: string().required(),
});
