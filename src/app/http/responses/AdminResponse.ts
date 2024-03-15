import { Admin } from "@prisma/client";
import { ImageUrlChange } from "../../../utils/utils";

export const AdminResponse = (data: Admin | Admin[]) => {
  if (Array.isArray(data)) {
    return data.map((d) => objectResponse(d));
  }

  return objectResponse(data);
};

const objectResponse = (user: Admin) => {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    fullName: user.firstName + " " + user.lastName,
    profilePic: ImageUrlChange(user.profilePic),
    createdAt: user.createdAt,
  };
};
