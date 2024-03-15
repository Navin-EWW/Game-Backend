import { User } from "@prisma/client";
import { env } from "../env";
import { generateOrderID, generateTransactionId } from "./orderIdGenerator";
import { PaymentProductType } from "./types";
import api from "api";

export const InitializePayment = (product: PaymentProductType, user: User) => {
  const sdk = api("@uint/v2.0#5nlui19lsvi4yfq");
  const orderId = generateOrderID(21);
  const system_transaction_id = generateTransactionId();

  return new Promise<{ data: { link: string }; system_transaction_id: string }>(
    (resolve, reject) => {
      sdk.auth(env.payment.payment_auth_token);
      sdk
        .addCharge({
          order: {
            id: orderId,
            description: product.discription,
            currency: env.payment.payment_currency,
            amount: Number(product.price),
          },
          paymentGateway: {
            src: env.payment.payment_getway_src,
          },
          language: env.payment.payment_language,
          reference: {
            id: orderId,
          },
          customer: {
            uniqueId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            mobile: `+${user.phoneCode}${user.phoneNumber}`,
          },
          returnUrl: env.payment.payment_return_url,
          cancelUrl: env.payment.payment_cancel_url,
          notificationUrl: `${env.payment.payment_webhook_url}/${env.payment.payment_redirection_game_package_module}/${system_transaction_id}`,
        })
        .then(({ data }: any) => {
          resolve({ data: data.data, system_transaction_id }); // Resolve the promise with the data
        })
        .catch((error: any) => {
          reject({ error }); // Reject the promise with the error
        });
    }
  );
};
