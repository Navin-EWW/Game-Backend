import { env } from "../../env";
import transporter from "../../libs/mail/mail";

export const sendForgotPasswordEmail = async (data: any): Promise<void> => {
  const { subject, email, url } = data;
  console.log("forgot passwod-----------------", data);

  try {
    const options = {
      from: env.mail.from_address,
      to: email,
      subject: subject,
      template: "forgotPassword",
      context: {
        link: url,
      },
    };

    await transporter.sendMail(options);
    console.log("mail send---------------------");

    return Promise.resolve();
  } catch (error: any) {
    Promise.reject(error.message);
  }
};
