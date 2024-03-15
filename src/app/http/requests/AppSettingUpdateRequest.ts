
import { boolean, object, string } from "yup";

export const AppSettingUpdateRequest = object({
    version: string().optional(),
    showLogin: boolean().optional()
});