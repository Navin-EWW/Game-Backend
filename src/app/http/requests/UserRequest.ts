import { Status } from "@prisma/client";
import { date, mixed, object, ref, string } from "yup";

export const UpdateUsersRequest = object({
  firstName: string().optional(),
  lastName: string().optional(),
  email: string().optional().email(),
  phoneNumber: string().optional().nullable(),
  profilePic: string().optional(),
  phoneCode: string().optional().nullable(),
});

export const UserStatusRequest = object({
  status: string().required(),
});

export const UserFilterRequest = object({
  search: string().optional(),
  toDate: string().trim().optional(),
  fromDate: string().trim().optional(),
  status: mixed<Status>().oneOf(Object.values(Status)).optional(),
});

// ---------------- WEBSITE ---------------------------------
export const RegisterUser = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().required().email(),
  phoneNumber: string().required(),
  phoneCode: string().required(),
  dateOfBirth: date().required(),
  countryId: string().required(),
  password: string().required(),
  confirm_password: string()
    .required()
    .oneOf([ref("password")], "confirm password and password must be same"),
});

export const completeProfileRequest = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().required().email(),
  phoneNumber: string().required(),
  profilePic: string().required(),
  phoneCode: string().required(),
});

export const updateProfileRequest = object({
  firstName: string().required(),
  lastName: string().required(),
  profilePic: string(),
  dateOfBirth: date().optional(),
});
export const changePasswordRequest = object({
  current_password: string().required(),
  password: string().required(),
  confirm_password: string()
    .required()
    .oneOf([ref("password")], "confirm password and password must be same"),
});
