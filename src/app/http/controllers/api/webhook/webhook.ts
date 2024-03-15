import { Request, Response } from "express";
import dbConnection from "../../../../providers/db";

export class WebhookController {
  public static async gamePackageWebhook(req: Request, res: Response) {
    const { id } = req.body.validatedParamsData;
    console.log("webhook===================>", req.body);
    const {
      payment_id,
      result,
      post_date,
      tran_id,
      ref,
      track_id,
      auth,
      order_id,
      requested_order_id,
      refund_order_id,
      invoice_id,
      payment_type,
      transaction_date,
      receipt_id,
      trn_udf,
    } = req.body;

    const findPackage = await dbConnection.gamePackagePaymentHistory.findFirst({
      where: {
        system_transaction_id: id,
      },
    });
    if (!findPackage) {
      return res.status(400).json({
        status: false,
        message: req.t("crud.not_found", { model: "Package Transaction" }),
      });
    }

    const updateGamePackage =
      await dbConnection.gamePackagePaymentHistory.update({
        where: {
          system_transaction_id: id,
        },
        data: {
          payment_id,
          result,
          post_date,
          tran_id,
          ref,
          track_id,
          auth,
          order_id,
          refund_order_id,
          invoice_id,
          payment_type,
          requested_order_id,
          transaction_date: new Date(transaction_date),
          receipt_id,
          trn_udf,
        },
      });


    console.log("updated Game Package==========>", updateGamePackage);

    return res.send({
      status: true,
      message: "Webhook Triggered",
    });
  }
}
