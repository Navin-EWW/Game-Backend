import { User } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const UserResponse = (data: User | User[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }
  return objectResponse(data);
};

const objectResponse = (user: User) => {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    status: user.status,
    displayPhoneNumber: user.displayPhoneNumber,
    phoneNumber: user.phoneNumber,
    phoneCode: user.phoneCode,
    profilePic: user.profilePic ? ImageUrlChange(user.profilePic) : null,
    dateOfBirth: user.dateOfBirth,
    fullName: user.firstName + " " + user.lastName,
    createdAt: user.createdAt,
    deletedAt: user.deletedAt,
  };
};
