import { object, string } from "yup";

export const ProfileUpdateRequest = object({
    firstName: string().optional(),
    lastName: string().optional(),
    profilePic: string().optional(),
});
