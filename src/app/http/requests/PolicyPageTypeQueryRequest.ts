import { object, string } from "yup";
import { PolicyPageTypes } from "@prisma/client";

export const PolicyPageTypeQueryRequest = object({
    type: string().oneOf(Object.values(PolicyPageTypes)).required(),
});
