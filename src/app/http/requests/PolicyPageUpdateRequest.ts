import { object, string } from "yup";
import { PolicyPageTypes } from "@prisma/client";

export const PolicyPageUpdateRequest = object({
    title: string(),
    description: string(),
});
