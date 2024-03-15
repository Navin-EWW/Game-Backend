import { Router } from "express";
import { PaymentController } from "../../../app/http/controllers/api/Website/Payment/PaymentController";
import { userVerifyToken } from "../../../app/http/middleware/Auth";
import { RequestValidator } from "../../../app/http/middleware/RequestValidator";
import { GamePackagePaymentRequest, GamePackageReceiptRequest } from "../../../app/http/requests/PaymentRequest";

const router = Router();

router.post(
  "/game-package",
  userVerifyToken,
  RequestValidator(GamePackagePaymentRequest),
  PaymentController.gamePackage
);


router.post(
  "/verify-receipt",
  userVerifyToken,
  RequestValidator(GamePackageReceiptRequest),
  PaymentController.gamePackageVerifyReceipt
);

export default router;
