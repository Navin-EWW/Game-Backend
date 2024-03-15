
import { Status } from "@prisma/client";
import { mixed, object, string } from "yup";

export const GameCategoryFilterRequest = object({
    search: string().optional(),
    toDate: string().trim().optional(),
    fromDate: string().trim().optional(),
    status: mixed<Status>().oneOf(Object.values(Status)).optional(),

});