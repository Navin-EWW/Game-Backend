import dbConnection from "../providers/db";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export class SignUpService {
  public static async signUp(validatedData: any): Promise<User> {
    const { firstName, lastName, email, password } = validatedData;
    const user = await dbConnection.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: await bcrypt.hashSync(password),
      },
    });

    return user;
  }

  public static async checkIfUserExists(email: string): Promise<boolean> {
    const user = await dbConnection.user.findFirst({
      where: {
        email: email,
      },
    });

    return user ? true : false;
  }
}
