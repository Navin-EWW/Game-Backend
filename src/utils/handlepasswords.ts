import bcrypt from "bcryptjs";

export const encryptPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (
  password: string,
  encryptedPassword: string
) => {
  return bcrypt.compareSync(password, encryptedPassword);
};
