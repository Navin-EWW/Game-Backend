import dbConnection from "../providers/db";
import bcrypt from "bcryptjs";
import { Admin } from "@prisma/client";

export class LoginService {
  /**
   *
   * @param email
   * @param password
   * @returns user
   */
  public static async login(
    email: string,
    password: string
  ): Promise<Admin | null> {
    const user = await dbConnection.admin.findFirst({
      where: {
        email: email,
      },
    });

    if (user && user.password) {
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  /**
   *
   * @param id User id
   * @returns profile of a user
   */
  public static async profile(id: string): Promise<Admin | null> {
    return await dbConnection.admin.findFirst({
      where: {
        id: id,
      },
    });
  }
}
