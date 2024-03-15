import { Status } from "@prisma/client";
import { Request, Response } from "express";
import { InitializePayment } from "../../../../../../utils/handlePaymentGateway";
import dbConnection from "../../../../../providers/db";
import { generateTransactionId } from "../../../../../../utils/orderIdGenerator";
import { env } from "../../../../../../env";

export class PaymentController {
  public static async gamePackage(req: Request, res: Response) {
    const { id } = req.body.auth.user;
    const { packageId } = req.body.validatedData;
    const user = req.body.auth.user
    const packages = await dbConnection.gamePackages.findFirst({
      where: {
        id: packageId,
        status: Status.ACTIVE,
        deletedAt: null,
      },
    });


    if (!packages) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: `Game Packages` }),
      });
    }

    let paymentPayload = {
      redirectionModule: env.payment.payment_redirection_game_package_module,  //game-package
      discription: packages.discription || "",
      price: packages.price,
      title: packages.title,
    };

    const { data, system_transaction_id } = await InitializePayment(
      paymentPayload,
      user
    );

    await dbConnection.gamePackagePaymentHistory.create({
      data: {
        system_transaction_id,  // do not share to public access
        packageId: packages.id,
        userId: id,
        title: packages.title,
        discription: packages.discription,
        totalGame: packages.totalGame,
        discount: packages.discount,
        price: packages.price,
        image: packages.image,
      },
    });

    return res.send({
      status: true,
      data: data,
      message: req.t("crud.created", { model: "Payment Link" }),
    });
  }

  public static async gamePackageVerifyReceipt(req: Request, res: Response) {
    const { id } = req.body.auth.user;
    const {
      payment_id,
      result,
      track_id,
      order_id,
      requested_order_id,
      refund_order_id,
      payment_type,
      invoice_id,
      receipt_id } = req.body.validatedData;

    const userPackagehistory = await dbConnection.gamePackagePaymentHistory.findFirst({
      where: {
        userId: id,
        payment_id,
        result,
        track_id,
        order_id,
        requested_order_id,
        refund_order_id,
        payment_type,
        invoice_id,
        receipt_id,
      }
    })

    if (!userPackagehistory) {
      return res.status(400).json({
        status: false,
        data: false,
        message: req.t("package.not_verify", { model: `Game Packages` }),
      });
    }
    return res.status(200).json({
      status: true,
      data: true,
      message: req.t("package.verify", { model: `Game Packages` }),
    });

  }
}
