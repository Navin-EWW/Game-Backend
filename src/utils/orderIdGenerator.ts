import { randomBytes } from "crypto";

export const generateOrderID = (length: number) => {
  let orderId = "";
  for (let i = 0; i < length; i++) {
    orderId += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
  }
  return orderId;
};

export const generateTransactionId = () => {
  const id = randomBytes(16).toString("hex");
  return id;
};

