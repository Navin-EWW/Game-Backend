import { object, string } from "yup";

export const SponsorUpdateRequest = object({
    url: string().optional(),
    image: string().optional()
})
export const SponsorStatusRequest = object({
    status: string().optional(),
})


export const SponsorFilterRequest = object({
    search: string().optional(),
    toDate: string().trim().optional(),
    fromDate: string().trim().optional(),
});