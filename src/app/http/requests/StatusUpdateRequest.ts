import { Status } from "@prisma/client";
import { mixed, object } from "yup";

export const StatusUpdateRequest = object({
    status: mixed<Status>().oneOf(Object.values(Status))
});