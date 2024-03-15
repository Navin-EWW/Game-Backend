
import { Devices } from "@prisma/client";
import { object, string } from "yup";

export const AppInitParamsRequest = object({
    deviceType: string().oneOf(Object.values(Devices)).required(),
    version: string().required(),
});